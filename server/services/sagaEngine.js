import { supabase } from "../config/db.js";
import { getPaymentGateway } from "./paymentGateway.js";
import { generateReceiptPdf } from "../utils/pdfGenerator.js";
import { 
  sendDonationReceived, 
  sendDonationFailed, 
  sendAdminAlert, 
  sendAdminDonationAlert,
  sendPersonalDonationNotification,
  queueEmail,
  getHtmlTemplate,
  renderInfoRow,
  renderInfoCard,
  renderBadge
} from "../utils/emailService.js";
import { createNotification } from "../utils/notificationService.js";
import { triggerUpdate } from "../utils/realtime.js";
import { publishEvent, EVENTS } from "../utils/eventQueue.js";

/**
 * Transitions a payment event to a new state in the database.
 * @param {string} eventId - UUID of the payment event
 * @param {string} targetState - new state (e.g. CHARGED, COMPLETED, FAILED)
 * @param {string} [errorMsg] - optional error message to attach
 * @returns {Promise<Object>} updated payment event record
 */
export async function transitionToState(eventId, targetState, errorMsg = null) {
  // Get previous state first
  const { data: previousRecord } = await supabase
    .from("payment_events")
    .select("current_state")
    .eq("id", eventId)
    .maybeSingle();

  const fromState = previousRecord ? previousRecord.current_state : null;

  const updateData = {
    current_state: targetState,
    updated_at: new Date().toISOString(),
  };

  if (errorMsg) {
    updateData.last_error = errorMsg;
  }

  const { data, error } = await supabase
    .from("payment_events")
    .update(updateData)
    .eq("id", eventId)
    .select()
    .single();

  if (error) {
    console.error(
      `[SagaEngine] Failed to transition event ${eventId} to ${targetState}:`,
      error.message,
    );
    throw error;
  }

  // Log transition history
  try {
    await supabase
      .from("payment_status_history")
      .insert([{
        payment_event_id: eventId,
        from_state: fromState,
        to_state: targetState,
        description: errorMsg || `State transitioned from ${fromState} to ${targetState}`
      }]);
  } catch (histErr) {
    console.error("[SagaEngine] Failed to log state transition to history:", histErr.message);
  }

  console.log(`🔄 [Saga State Transition] Event ${eventId}: ${fromState} -> ${targetState}`);

  // Notify admin clients of real-time state change
  triggerUpdate("payment_events");

  return data;
}

/**
 * Executes a donation save step.
 * Inserts the donation details into the donations table.
 */
async function saveDonationRecord(event) {
  // Generate a receipt number
  const serial = Math.floor(1000 + Math.random() * 9000);
  const receiptNumber = `UFT/2026-27/${serial}`;

  const donationPayload = {
    donorName: event.donor_name,
    email: event.email,
    phone: event.phone,
    address: event.address,
    panNumber: event.pan_number,
    amount: event.amount,
    purpose: event.purpose,
    receiptNumber: receiptNumber,
    status: "completed",
    // Link to payment event ID
    id: event.id,
  };

  const { data, error } = await supabase
    .from("donations")
    .insert([donationPayload])
    .select()
    .single();

  if (error) {
    if (
      error.code === "23505" ||
      (error.message &&
        (error.message.includes("duplicate key") || error.message.includes("unique constraint")))
    ) {
      console.log(
        `[SagaEngine] Donation record ${event.id} already exists. Retrieving existing record.`,
      );
      const { data: existing, error: fetchErr } = await supabase
        .from("donations")
        .select("*")
        .eq("id", event.id)
        .maybeSingle();

      if (!fetchErr && existing) {
        return existing;
      }
    }
    console.error("[SagaEngine] Database save to donations table failed:", error.message);
    throw error;
  }

  return data;
}

/**
 * Generates and emails the PDF receipt to the donor.
 */
async function sendPdfReceiptEmail(event, donation) {
  const pdfBuffer = await generateReceiptPdf(donation);

  // Send branded thank you receipt email to donor
  await sendDonationReceived(
    event.email,
    event.donor_name,
    event.amount,
    event.gateway_transaction_id || event.id,
    event.pan_number,
    donation.receiptNumber || `UFT/REC-${donation.id.substring(0, 8).toUpperCase()}`,
    pdfBuffer
  );

  // Send detailed email notification alert to admin with receipt attachment
  await sendAdminDonationAlert(donation, event, pdfBuffer)
    .catch((err) => console.error("[SagaEngine] Failed to send admin alert:", err.message));

  // Send personal notification alert to custom personal email
  await sendPersonalDonationNotification(donation, event, pdfBuffer)
    .catch((err) => console.error("[SagaEngine] Failed to send personal donation notification:", err.message));
}

/**
 * Sends a payment failure email to the donor.
 */
async function sendFailureEmail(event) {
  await sendDonationFailed(event.email, event.donor_name, event.amount);
}

/**
 * Sends a refund email to the donor.
 */
export async function sendRefundEmail(event, refundId) {
  const rows = 
    renderInfoRow("Donor Name", event.donor_name) +
    renderInfoRow("Refunded Amount", `₹${Number(event.amount).toLocaleString("en-IN")}`) +
    renderInfoRow("Refund Reference", refundId) +
    renderInfoRow("Transaction ID", event.gateway_transaction_id) +
    renderInfoRow("Status", renderBadge("Refunded"));

  const body = `
    <p style="font-size: 15px; color: #334155; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-weight: 600; margin-top: 0;">Hello ${event.donor_name},</p>
    <p style="font-size: 14px; color: #475569; line-height: 1.6; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">A refund has been initiated and successfully processed for your donation attempt.</p>
    
    ${renderInfoCard(rows)}
    
    <p style="font-size: 14px; color: #475569; line-height: 1.6; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">The refunded amount should reflect in your source bank account within 5-7 business days. If you have any questions or require further assistance, please contact our support desk.</p>
    <p style="font-size: 14px; color: #475569; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin-bottom: 0; padding-top: 12px; border-top: 1px solid #f1f5f9; margin-top: 24px;">Warm regards,<br/><strong>Uday Foundation Trust Team</strong></p>
  `;
  const subject = "Refund Confirmation - Uday Foundation Trust";
  const html = getHtmlTemplate(subject, "Refund Processed Successfully", body, "🧾", "Refund Processed", "#ef4444");
  await queueEmail(
    event.email,
    subject,
    html,
    "donation_refund"
  );
}

/**
 * Core SAGA Coordinator.
 * Runs the transaction forward or initiates compensation on downstream failure.
 * @param {string} eventId - UUID of the transaction event
 */
export async function runSaga(eventId) {
  console.log(`[SagaEngine] Starting Saga Coordinator for transaction event: ${eventId}`);

  // Fetch event record
  const { data: event, error: fetchError } = await supabase
    .from("payment_events")
    .select("*")
    .eq("id", eventId)
    .single();

  if (fetchError || !event) {
    console.error(`[SagaEngine] Transaction not found during Saga invocation: ${eventId}`);
    return;
  }

  let currentState = event.current_state;

  try {
    // 1. PAYMENT VERIFICATION STEP
    if (currentState === "CHARGED") {
      currentState = "PAYMENT_VERIFIED";
      await transitionToState(eventId, currentState);
      await publishEvent(EVENTS.PAYMENT_SUCCESS, event);
    }

    // 2. DATABASE SAVE DONATION STEP
    if (currentState === "PAYMENT_VERIFIED") {
      let donation = null;
      let retryAttempts = 3;
      for (let i = 0; i < retryAttempts; i++) {
        try {
          console.log(`[SagaEngine] Attempting to save donation record (Attempt ${i + 1}/${retryAttempts})...`);
          donation = await saveDonationRecord(event);
          break;
        } catch (dbErr) {
          console.error(`[SagaEngine] Donation save attempt ${i + 1} failed:`, dbErr.message);
          if (i === retryAttempts - 1) {
            console.error("[SagaEngine] Critical: Donation record could not be saved after retries. Marking transaction as COMPLETED to prevent refund.");
            currentState = "COMPLETED";
            await transitionToState(eventId, currentState, `Donation save failed: ${dbErr.message}`);
            break;
          }
          await new Promise((resolve) => setTimeout(resolve, 1000));
        }
      }
      if (donation) {
        currentState = "DONATION_SAVED";
        await transitionToState(eventId, currentState);
        await publishEvent(EVENTS.DONATION_CREATED, { event, donation });
      }
    }

    // Fetch updated event (contains potential donation serials)
    const { data: currentDonation } = await supabase
      .from("donations")
      .select("*")
      .eq("id", eventId)
      .single();

    // 3. SEND EMAIL RECEIPT STEP
    if (currentState === "DONATION_SAVED" && currentDonation) {
      try {
        console.log("[SagaEngine] Sending receipt email with PDF attachment...");
        await sendPdfReceiptEmail(event, currentDonation);
        currentState = "EMAIL_SENT";
        await transitionToState(eventId, currentState);
        await publishEvent(EVENTS.EMAIL_SENT, event);
      } catch (emailErr) {
        console.error(
          "[SagaEngine] Email delivery failed, will retry during crash recovery scan:",
          emailErr.message,
        );
        // Note: Do NOT rollback donation or refund if payment succeeded and donation saved.
        // Simply log the error and allow crash recovery scheduler to retry email transmission.
        await transitionToState(
          eventId,
          "DONATION_SAVED",
          `Email transmission failed: ${emailErr.message}`,
        );
        throw emailErr;
      }
    }

    // 4. ADMIN NOTIFICATION STEP
    if (currentState === "EMAIL_SENT" && currentDonation) {
      try {
        console.log("[SagaEngine] Triggering admin system notifications...");
        const dateStr = event.updated_at 
          ? new Date(event.updated_at).toLocaleString("en-IN", {
              day: "numeric",
              month: "short",
              year: "numeric",
              hour: "numeric",
              minute: "numeric",
              hour12: true
            })
          : new Date().toLocaleString("en-IN", {
              day: "numeric",
              month: "short",
              year: "numeric",
              hour: "numeric",
              minute: "numeric",
              hour12: true
            });

        const notifMessage = `Donor:\n${event.donor_name}\n\nAmount:\n₹${Number(event.amount).toLocaleString("en-IN")}\n\nPayment:\nSUCCESS\n\nTime:\n${dateStr}`;

        await createNotification(
          "donation",
          "🎉 New Donation Received",
          notifMessage,
          currentDonation.id,
        );
        currentState = "ADMIN_NOTIFIED";
        await transitionToState(eventId, currentState);
        await publishEvent(EVENTS.NOTIFICATION_SENT, event);
      } catch (notifErr) {
        console.error(
          "[SagaEngine] Admin notification creation failed, will retry:",
          notifErr.message,
        );
        await transitionToState(
          eventId,
          "EMAIL_SENT",
          `Notification creation failed: ${notifErr.message}`,
        );
        throw notifErr;
      }
    }

    // 5. FINAL COMPLETION
    if (currentState === "ADMIN_NOTIFIED") {
      await transitionToState(eventId, "COMPLETED");
      console.log(`✅ [SagaEngine] Transaction Saga Completed successfully for event: ${eventId}`);
    }
  } catch (err) {
    console.error(`[SagaEngine] Saga run failed for event ${eventId}:`, err.message);
  }
}

/**
 * Saga Compensation Runner.
 * Executed if the payment charged successfully but the donation cannot be saved to the database.
 * Automatically refunds the customer, logs the refund, and alerts both donor & admins.
 */
export async function runCompensation(eventId) {
  console.log(`⚠️ [SagaEngine] Initiating automated refund compensation for event: ${eventId}`);

  const { data: event, error: fetchErr } = await supabase
    .from("payment_events")
    .select("*")
    .eq("id", eventId)
    .single();

  if (fetchErr || !event) {
    console.error(`[SagaEngine] Transaction not found during refund compensation: ${eventId}`);
    return;
  }

  // Double check state
  if (event.current_state !== "REFUND_INITIATED") {
    await transitionToState(eventId, "REFUND_INITIATED");
  }

  const gateway = getPaymentGateway();
  const txId = event.gateway_transaction_id;

  if (!txId) {
    console.error(
      `[SagaEngine] Cannot refund event ${eventId}: gateway_transaction_id is missing.`,
    );
    await transitionToState(eventId, "FAILED", "Refund skipped: transaction ID missing.");
    return;
  }

  try {
    console.log(`[SagaEngine] Call payment gateway refund for transaction: ${txId}...`);
    const refundResult = await gateway.refundPayment(txId, event.amount);

    if (refundResult.success) {
      // 1. Update status in payment_events
      await supabase
        .from("payment_events")
        .update({
          current_state: "REFUNDED",
          refund_id: refundResult.refundId,
          updated_at: new Date().toISOString(),
        })
        .eq("id", eventId);

      // Update status in donations
      await supabase
        .from("donations")
        .update({
          status: "REFUNDED",
          updated_at: new Date().toISOString(),
        })
        .eq("id", eventId);

      // Log to refunds table
      try {
        await supabase
          .from("refunds")
          .insert([{
            payment_event_id: eventId,
            refund_id: refundResult.refundId || null,
            gateway_transaction_id: txId || null,
            amount: event.amount,
            status: "SUCCESS",
            reason: "Admin Initiated Refund",
            created_at: new Date().toISOString()
          }]);
      } catch (refundInsertErr) {
        console.error("[SagaEngine] Failed to log refund in database:", refundInsertErr.message);
      }

      console.log(
        `✅ [SagaEngine] Automated Refund completed successfully: Refund ID ${refundResult.refundId}`,
      );

      // 2. Notify Donor
      await sendRefundEmail(event, refundResult.refundId).catch((mailErr) =>
        console.error(
          "[SagaEngine] Failed to email refund notification to donor:",
          mailErr.message,
        ),
      );

      // 3. Notify Admin
      await createNotification(
        "donation",
        "Automated Donation Refund Issued",
        `Refund of ₹${Number(event.amount).toLocaleString("en-IN")} issued for ${event.donor_name}. Cause: Downstream database save error. Refund ID: ${refundResult.refundId}.`,
        eventId,
      ).catch((notifErr) =>
        console.error("[SagaEngine] Failed to create admin refund notification:", notifErr.message),
      );

      await publishEvent(EVENTS.REFUND_CREATED, event);
      triggerUpdate("payment_events");
    } else {
      throw new Error("Gateway refund returned success=false");
    }
  } catch (refundErr) {
    console.error(
      `❌ [SagaEngine] Automated refund failed for transaction ${txId}:`,
      refundErr.message,
    );
    await transitionToState(eventId, "FAILED", `Automatic refund failed: ${refundErr.message}`);

    // Critical Alert Notification for Admin
    await createNotification(
      "donation",
      "CRITICAL: Automated Refund Failed!",
      `Refund of ₹${Number(event.amount).toLocaleString("en-IN")} failed for ${event.donor_name} (Tx: ${txId}). Manual intervention required immediately. Error: ${refundErr.message}`,
      eventId,
    ).catch((notifErr) =>
      console.error("[SagaEngine] Failed to create admin critical refund alert:", notifErr.message),
    );
  }
}
