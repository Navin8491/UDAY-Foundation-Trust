import { supabase } from "../config/db.js";
import { getPaymentGateway } from "./paymentGateway.js";
import { generateReceiptPdf } from "../utils/pdfGenerator.js";
import { sendMail } from "../utils/emailService.js";
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
    console.error(`[SagaEngine] Failed to transition event ${eventId} to ${targetState}:`, error.message);
    throw error;
  }

  console.log(`🔄 [Saga State Transition] Event ${eventId}: -> ${targetState}`);
  
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
  
  const formattedAmount = Number(event.amount).toLocaleString("en-IN");
  const dateStr = new Date().toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const emailBody = `
    <h1 style="color:#7A9D1C; font-family:sans-serif; text-align:center;">Donation Receipt Confirmation</h1>
    <p>Dear ${event.donor_name},</p>
    <p>Thank you for your generous contribution of <strong>₹${formattedAmount}</strong> to <strong>Uday Foundation Trust</strong>.</p>
    <p>Your support is highly appreciated and will be utilized to run our education, healthcare, and environmental protection initiatives in rural Gujarat.</p>
    
    <div style="background-color:#F4F7EB; border-left:4px solid #7A9D1C; padding:15px; margin:20px 0; font-family:sans-serif; font-size:13px;">
      <strong>Transaction Reference Details:</strong><br/>
      • Receipt Number: ${donation.receiptNumber}<br/>
      • Transaction ID: ${event.gateway_transaction_id || event.id}<br/>
      • Amount Paid: ₹${formattedAmount}<br/>
      • Date: ${dateStr}<br/>
      • PAN Card: ${event.pan_number || "N/A"}<br/>
    </div>

    <p>We have attached your official 80G tax-exemption donation receipt (PDF) to this email for your tax records.</p>
    <p>Warm regards,<br/>Uday Foundation Trust Team</p>
  `;

  const mailOptions = {
    to: event.email,
    subject: `Official Donation Receipt - Uday Foundation Trust (${donation.receiptNumber})`,
    html: emailBody,
    attachments: [
      {
        filename: `Donation_Receipt_${donation.receiptNumber.replace(/\//g, "_")}.pdf`,
        content: pdfBuffer,
        contentType: "application/pdf",
      },
    ],
  };

  // We reuse SMTP transporter from emailService.js
  await sendMail(mailOptions.to, mailOptions.subject, mailOptions.html, mailOptions.attachments);
}

/**
 * Sends a payment failure email to the donor.
 */
async function sendFailureEmail(event) {
  const emailBody = `
    <h1 style="color:#DC2626; font-family:sans-serif;">Payment Attempt Failed</h1>
    <p>Dear ${event.donor_name},</p>
    <p>We noticed that your donation attempt of <strong>₹${Number(event.amount).toLocaleString("en-IN")}</strong> to <strong>Uday Foundation Trust</strong> could not be completed successfully.</p>
    <p>No funds were charged. If your account was debited, the amount will be automatically refunded by your bank/payment provider within 3-5 business days.</p>
    <p>Please try again or contact us if you need assistance.</p>
    <p>Regards,<br/>Uday Foundation Trust Team</p>
  `;
  await sendMail(event.email, "Donation Payment Failed", emailBody);
}

/**
 * Sends a refund email to the donor.
 */
async function sendRefundEmail(event, refundId) {
  const emailBody = `
    <h1 style="color:#DC2626; font-family:sans-serif;">Refund Processed Successfully</h1>
    <p>Dear ${event.donor_name},</p>
    <p>A refund of <strong>₹${Number(event.amount).toLocaleString("en-IN")}</strong> has been initiated and successfully processed for your donation attempt.</p>
    <p><strong>Refund Details:</strong><br/>
    • Refund Reference: ${refundId}<br/>
    • Transaction ID: ${event.gateway_transaction_id}<br/>
    • Refunded Amount: ₹${Number(event.amount).toLocaleString("en-IN")}<br/>
    </p>
    <p>The refunded amount should reflect in your source bank account within 5-7 business days.</p>
    <p>If you have any questions, please contact our support desk.</p>
    <p>Warm regards,<br/>Uday Foundation Trust Team</p>
  `;
  await sendMail(event.email, "Refund Confirmation - Uday Foundation Trust", emailBody);
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
      try {
        console.log("[SagaEngine] Attempting to save donation record to database...");
        const donation = await saveDonationRecord(event);
        currentState = "DONATION_SAVED";
        await transitionToState(eventId, currentState);
        await publishEvent(EVENTS.DONATION_CREATED, { event, donation });
      } catch (dbErr) {
        console.error("[SagaEngine] Downstream Save Donation failed. Triggering SAGA COMPENSATION (Refund)...");
        await transitionToState(eventId, "REFUND_INITIATED", `Save donation database error: ${dbErr.message}`);
        await runCompensation(eventId);
        return;
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
        console.error("[SagaEngine] Email delivery failed, will retry during crash recovery scan:", emailErr.message);
        // Note: Do NOT rollback donation or refund if payment succeeded and donation saved.
        // Simply log the error and allow crash recovery scheduler to retry email transmission.
        await transitionToState(eventId, "DONATION_SAVED", `Email transmission failed: ${emailErr.message}`);
        throw emailErr;
      }
    }

    // 4. ADMIN NOTIFICATION STEP
    if (currentState === "EMAIL_SENT" && currentDonation) {
      try {
        console.log("[SagaEngine] Triggering admin system notifications...");
        await createNotification(
          "donation",
          "New Donation Received",
          `₹${Number(event.amount).toLocaleString("en-IN")} donated by ${event.donor_name} (80G Tax Receipt: ${currentDonation.receiptNumber}).`,
          currentDonation.id
        );
        currentState = "ADMIN_NOTIFIED";
        await transitionToState(eventId, currentState);
        await publishEvent(EVENTS.NOTIFICATION_SENT, event);
      } catch (notifErr) {
        console.error("[SagaEngine] Admin notification creation failed, will retry:", notifErr.message);
        await transitionToState(eventId, "EMAIL_SENT", `Notification creation failed: ${notifErr.message}`);
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
    console.error(`[SagaEngine] Cannot refund event ${eventId}: gateway_transaction_id is missing.`);
    await transitionToState(eventId, "FAILED", "Refund skipped: transaction ID missing.");
    return;
  }

  try {
    console.log(`[SagaEngine] Call payment gateway refund for transaction: ${txId}...`);
    const refundResult = await gateway.refundPayment(txId, event.amount);

    if (refundResult.success) {
      // 1. Update status
      await supabase
        .from("payment_events")
        .update({
          current_state: "REFUNDED",
          refund_id: refundResult.refundId,
          updated_at: new Date().toISOString(),
        })
        .eq("id", eventId);

      console.log(`✅ [SagaEngine] Automated Refund completed successfully: Refund ID ${refundResult.refundId}`);

      // 2. Notify Donor
      await sendRefundEmail(event, refundResult.refundId).catch((mailErr) => 
        console.error("[SagaEngine] Failed to email refund notification to donor:", mailErr.message)
      );

      // 3. Notify Admin
      await createNotification(
        "donation",
        "Automated Donation Refund Issued",
        `Refund of ₹${Number(event.amount).toLocaleString("en-IN")} issued for ${event.donor_name}. Cause: Downstream database save error. Refund ID: ${refundResult.refundId}.`,
        eventId
      ).catch((notifErr) =>
        console.error("[SagaEngine] Failed to create admin refund notification:", notifErr.message)
      );

      await publishEvent(EVENTS.REFUND_CREATED, event);
      triggerUpdate("payment_events");
    } else {
      throw new Error("Gateway refund returned success=false");
    }
  } catch (refundErr) {
    console.error(`❌ [SagaEngine] Automated refund failed for transaction ${txId}:`, refundErr.message);
    await transitionToState(eventId, "FAILED", `Automatic refund failed: ${refundErr.message}`);
    
    // Critical Alert Notification for Admin
    await createNotification(
      "donation",
      "CRITICAL: Automated Refund Failed!",
      `Refund of ₹${Number(event.amount).toLocaleString("en-IN")} failed for ${event.donor_name} (Tx: ${txId}). Manual intervention required immediately. Error: ${refundErr.message}`,
      eventId
    ).catch((notifErr) =>
      console.error("[SagaEngine] Failed to create admin critical refund alert:", notifErr.message)
    );
  }
}
