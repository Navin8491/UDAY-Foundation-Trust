import { supabase } from "../config/db.js";
import { getPaymentGateway } from "../services/paymentGateway.js";
import { runSaga, transitionToState } from "../services/sagaEngine.js";
import { generateReceiptPdf } from "../utils/pdfGenerator.js";
import { z } from "zod";
import crypto from "crypto";

async function markWebhookProcessed(webhookLogId, processed = true, errorMsg = null) {
  if (!webhookLogId) return;
  try {
    await supabase
      .from("webhook_logs")
      .update({ processed, error: errorMsg })
      .eq("id", webhookLogId);
  } catch (err) {
    console.error("[PaymentController] Failed to update webhook log:", err.message);
  }
}

// Schema for payment initiation (extends donationSchema with idempotencyKey)
const paymentInitiationSchema = z.object({
  donorName: z.string().min(2, "Donor name must be at least 2 characters"),
  email: z.string().email("Must be a valid email address"),
  phone: z.string().regex(/^\+?[0-9\s-]{8,25}$/, "Must be a valid phone number"),
  address: z.string().min(5, "Address must be at least 5 characters"),
  panNumber: z.string().min(10, "PAN number must be 10 characters").max(10),
  amount: z.number().min(1, "Donation amount must be at least 1"),
  purpose: z.string().min(2, "Purpose must be specified"),
  idempotencyKey: z.string().uuid("Idempotency key must be a valid UUID"),
});

/**
 * Initiates a payment session.
 * Enforces idempotency to prevent duplicate checkouts/payments.
 */
export async function createCheckoutSession(req, res, next) {
  const startTime = Date.now();
  try {
    const validated = paymentInitiationSchema.parse(req.body);
    const { idempotencyKey, amount, donorName, email, phone, address, panNumber, purpose } =
      validated;

    console.log(
      `[${new Date().toISOString()}] [CheckoutSession] Initiating checkout for ${donorName}, Amount: ₹${amount}, Key: ${idempotencyKey}`,
    );

    // 1. Check if an event already exists with this idempotency key
    const { data: existingEvent, error: findError } = await supabase
      .from("payment_events")
      .select("*")
      .eq("idempotency_key", idempotencyKey)
      .maybeSingle();

    if (findError) {
      throw findError;
    }

    if (existingEvent) {
      console.log(
        `[PaymentController] Duplicate checkout attempt detected for idempotency key: ${idempotencyKey}`,
      );

      // If the transaction completed successfully, return the success info
      if (
        [
          "COMPLETED",
          "CHARGED",
          "PAYMENT_VERIFIED",
          "DONATION_SAVED",
          "EMAIL_SENT",
          "ADMIN_NOTIFIED",
        ].includes(existingEvent.current_state)
      ) {
        return res.status(200).json({
          status: "already_completed",
          message: "This donation has already been completed successfully.",
          eventId: existingEvent.id,
        });
      }

      // If the checkout session is already created and not expired/failed, recover it
      if (existingEvent.current_state === "CHECKOUT_CREATED" && existingEvent.payment_id) {
        const gateway = getPaymentGateway();

        if (process.env.PAYMENT_PROVIDER?.toLowerCase() === "stripe") {
          try {
            const session = await gateway.stripe.checkout.sessions.retrieve(
              existingEvent.payment_id,
            );
            return res.status(200).json({
              status: "session_recovered",
              sessionId: existingEvent.payment_id,
              url: session.url,
              idempotencyKey,
              eventId: existingEvent.id,
            });
          } catch (e) {
            console.warn(
              "[PaymentController] Failed to retrieve Stripe session, creating a new one:",
              e.message,
            );
          }
        } else if (process.env.PAYMENT_PROVIDER?.toLowerCase() === "cashfree") {
          try {
            const sessionResult = await gateway.createCheckoutSession({
              amount: existingEvent.amount,
              currency: existingEvent.currency,
              idempotencyKey: existingEvent.idempotency_key,
              donorName: existingEvent.donor_name,
              email: existingEvent.email,
              phone: existingEvent.phone,
              description: existingEvent.purpose,
            });
            return res.status(200).json({
              status: "session_recovered",
              sessionId: sessionResult.sessionId,
              url: sessionResult.url,
              orderId: sessionResult.orderId,
              amount: sessionResult.amount,
              currency: sessionResult.currency,
              idempotencyKey,
              eventId: existingEvent.id,
              donorName: sessionResult.donorName,
              email: sessionResult.email,
              phone: sessionResult.phone,
            });
          } catch (e) {
            console.warn(
              "[PaymentController] Failed to retrieve/recreate Cashfree order:",
              e.message,
            );
          }
        }
      }

      // If it failed previously, we can transition it back to INITIATED and try again
      if (existingEvent.current_state === "FAILED") {
        const newRetryCount = (existingEvent.retry_count || 0) + 1;
        await supabase
          .from("payment_events")
          .update({ retry_count: newRetryCount })
          .eq("id", existingEvent.id);

        await supabase
          .from("payment_retries")
          .insert([{
            payment_event_id: existingEvent.id,
            retry_count: newRetryCount,
            previous_state: "FAILED",
            reason: "Retrying failed transaction attempt."
          }]);

        await transitionToState(
          existingEvent.id,
          "INITIATED",
          "Retrying failed transaction attempt.",
        );
      }
    }

    // 2. Insert new transaction record into payment_events (State: INITIATED)
    let eventRecord = null;

    if (existingEvent && existingEvent.current_state === "FAILED") {
      eventRecord = existingEvent;
    } else {
      const payload = {
        idempotency_key: idempotencyKey,
        current_state: "INITIATED",
        amount,
        currency: "INR",
        donor_name: donorName,
        email,
        phone,
        address,
        pan_number: panNumber,
        purpose,
      };

      const { data: newRecord, error: insertError } = await supabase
        .from("payment_events")
        .insert([payload])
        .select()
        .single();

      if (insertError) {
        // Fallback check in case of concurrent insert race condition
        if (insertError.code === "23505") {
          // postgres unique violation
          const { data: dupRecord } = await supabase
            .from("payment_events")
            .select("*")
            .eq("idempotency_key", idempotencyKey)
            .single();
          return res.status(200).json({
            status: "already_completed",
            sessionId: dupRecord.payment_id,
            idempotencyKey,
          });
        }
        throw insertError;
      }
      eventRecord = newRecord;
    }

    // 3. Call active payment gateway provider to create a session
    const gateway = getPaymentGateway();

    try {
      const sessionResult = await gateway.createCheckoutSession({
        amount: eventRecord.amount,
        currency: eventRecord.currency,
        idempotencyKey: eventRecord.idempotency_key,
        donorName: eventRecord.donor_name,
        email: eventRecord.email,
        phone: eventRecord.phone,
        description: eventRecord.purpose,
      });
      
      console.log("[PaymentController] sessionResult:", sessionResult);

      // 4. Update event record: State: CHECKOUT_CREATED, payment_id: gateway session id or order id
      const { data: updatedRecord, error: updateError } = await supabase
        .from("payment_events")
        .update({
          payment_id: sessionResult.orderId || sessionResult.sessionId,
          current_state: "CHECKOUT_CREATED",
          updated_at: new Date().toISOString(),
        })
        .eq("id", eventRecord.id)
        .select()
        .single();

      if (updateError) throw updateError;

      console.log(
        `[${new Date().toISOString()}] [CheckoutSession] Created secure session for ${idempotencyKey} in ${Date.now() - startTime}ms`,
      );

      res.status(201).json({
        status: "created",
        keyId: process.env.RAZORPAY_KEY_ID || null,
        sessionId: sessionResult.sessionId || null,
        url: sessionResult.url || null,
        orderId: sessionResult.orderId || null,
        amount: sessionResult.amount || null,
        currency: sessionResult.currency || null,
        idempotencyKey,
        eventId: updatedRecord.id,
        donorName: sessionResult.donorName || null,
        email: sessionResult.email || null,
        phone: sessionResult.phone || null,
        environment: sessionResult.environment || null,
      });
    } catch (gatewayErr) {
      const errorMsg =
        gatewayErr.description ||
        gatewayErr.error?.description ||
        gatewayErr.message ||
        (typeof gatewayErr === "string" ? gatewayErr : JSON.stringify(gatewayErr));
      console.error("[PaymentController] Payment Gateway Checkout Creation failed:", gatewayErr);
      
      try {
        await supabase
          .from("failed_payments")
          .insert([{
            payment_event_id: eventRecord.id,
            order_id: eventRecord.payment_id || null,
            error_code: gatewayErr.code || gatewayErr.error?.code || "GATEWAY_ERROR",
            error_description: errorMsg,
            amount: eventRecord.amount
          }]);
      } catch (err) {
        console.error("[PaymentController] Failed to log checkout failure:", err.message);
      }

      await transitionToState(
        eventRecord.id,
        "FAILED",
        `Gateway checkout creation failed: ${errorMsg}`,
      );
      res.status(502);
      throw new Error(`Failed to initialize payment with gateway: ${errorMsg}`);
    }
  } catch (err) {
    next(err);
  }
}

/**
 * Handles payment gateway webhooks.
 * Direct callbacks from Stripe or Razorpay.
 */
export async function handleWebhook(req, res, next) {
  const timestamp = new Date().toISOString();
  const signature = req.headers["stripe-signature"] || req.headers["x-razorpay-signature"] || req.headers["x-webhook-signature"] || "";
  const provider = (process.env.PAYMENT_PROVIDER || "mock").toLowerCase();

  console.log(`[${timestamp}] [Webhook] Received from provider: ${provider}`);
  console.log(`[${timestamp}] [Webhook] Headers:`, JSON.stringify(req.headers));
  console.log(`[${timestamp}] [Webhook] Signature: ${signature}`);

  let webhookLog = null;

  try {
    const gateway = getPaymentGateway();

    // Stripe webhooks require the raw request body to verify signatures correctly
    const rawBody = req.rawBody || req.body;
    
    let logPayload = rawBody;
    if (Buffer.isBuffer(rawBody)) {
      logPayload = rawBody.toString("utf8");
    }
    console.log(`[${timestamp}] [Webhook] Raw Payload:`, typeof logPayload === "string" ? logPayload : JSON.stringify(logPayload));

    const verification = await gateway.verifyWebhook(rawBody, signature, req.headers);

    if (!verification.success) {
      console.error(`[${timestamp}] [Webhook] Signature verification failed. Error: ${verification.error || "unknown"}`);
      res.status(400);
      return next(
        new Error(
          `Webhook verification signature validation failed. Detail: ${verification.error || "unknown"}`,
        ),
      );
    }

    console.log(
      `[${timestamp}] [Webhook] Signature verified. Transaction ID: ${verification.gatewayTransactionId}, Event Type: ${verification.eventType}`,
    );

    const payloadObject = typeof logPayload === "string" ? JSON.parse(logPayload) : logPayload;
    const webhookEventId = payloadObject?.event_id || payloadObject?.data?.event_id || `wh_${verification.gatewayTransactionId || crypto.randomUUID()}_${Date.now()}`;

    // 1. Log webhook receipt and prevent duplicates
    const { data: logRecord, error: logError } = await supabase
      .from("webhook_logs")
      .insert([{
        event_id: webhookEventId,
        event_type: verification.eventType || "UNKNOWN",
        raw_payload: payloadObject,
        processed: false
      }])
      .select()
      .maybeSingle();

    if (logError && logError.code === "23505") {
      console.log(`[PaymentController] Duplicate webhook ignored: ${webhookEventId}`);
      return res.status(200).json({ received: true, status: "duplicate_webhook" });
    }
    webhookLog = logRecord;

    // If it's a success payment event, find the record and trigger the Saga state machine
    if (verification.idempotencyKey) {
      const { data: event, error } = await supabase
        .from("payment_events")
        .select("*")
        .eq("idempotency_key", verification.idempotencyKey)
        .maybeSingle();

      if (error) throw error;

      if (!event) {
        console.warn(
          `[PaymentController] Webhook received for unknown idempotency key: ${verification.idempotencyKey}`,
        );
        await markWebhookProcessed(webhookLog?.id, true);
        return res.status(200).json({ received: true, warning: "unknown idempotency key" });
      }

      // If already processed, ignore webhook retry
      if (
        [
          "CHARGED",
          "PAYMENT_VERIFIED",
          "DONATION_SAVED",
          "EMAIL_SENT",
          "ADMIN_NOTIFIED",
          "COMPLETED",
        ].includes(event.current_state)
      ) {
        console.log(
          `[PaymentController] Transaction ${event.id} already completed or processing. Webhook ignored.`,
        );
        await markWebhookProcessed(webhookLog?.id, true);
        return res.status(200).json({ received: true, status: "already_processed" });
      }

      // Update state to CHARGED/FAILED and transaction ID only if it is in a pending checkout state
      const { data: updatedEvent, error: updateError } = await supabase
        .from("payment_events")
        .update({
          gateway_transaction_id: verification.gatewayTransactionId,
          current_state: verification.status === "FAILED" ? "FAILED" : "CHARGED",
          payment_method: verification.paymentMethod || null,
          gateway_response: verification.gatewayResponse || null,
          last_error: verification.status === "FAILED" ? (verification.error || "Payment failed webhook") : null,
          updated_at: new Date().toISOString(),
        })
        .eq("id", event.id)
        .in("current_state", ["INITIATED", "CHECKOUT_CREATED", "PAYMENT_PENDING"])
        .select()
        .maybeSingle();

      if (updateError) throw updateError;

      if (!updatedEvent) {
        console.log(
          `[PaymentController] Webhook: State has already transitioned. Skipping duplicate Saga execution.`,
        );
        await markWebhookProcessed(webhookLog?.id, true);
        return res.status(200).json({ received: true, status: "already_processed" });
      }

      if (updatedEvent.current_state === "FAILED") {
        try {
          await supabase
            .from("failed_payments")
            .insert([{
              payment_event_id: updatedEvent.id,
              order_id: updatedEvent.payment_id || null,
              error_code: verification.errorCode || "WEBHOOK_PAYMENT_FAILED",
              error_description: verification.error || "Payment failed webhook event",
              amount: updatedEvent.amount
            }]);
        } catch (err) {
          console.error("[PaymentController] Failed to log failed webhook payment:", err.message);
        }

        const { sendDonationFailed } = await import("../utils/emailService.js");
        sendDonationFailed(updatedEvent.email, updatedEvent.donor_name, updatedEvent.amount)
          .catch(err => console.error("[PaymentController] Failed to send payment failure email:", err.message));
        
        await markWebhookProcessed(webhookLog?.id, true);
        return res.status(200).json({ received: true, status: "payment_failed" });
      }

      // Run Saga orchestrator asynchronously in the background so the webhook response returns immediately
      setImmediate(async () => {
        try {
          await runSaga(updatedEvent.id);
        } catch (sagaErr) {
          console.error(
            `[PaymentController] Background Saga execution failed for ${updatedEvent.id}:`,
            sagaErr.message,
          );
        }
      });
    }

    await markWebhookProcessed(webhookLog?.id, true);
    res.status(200).json({ received: true });
  } catch (err) {
    await markWebhookProcessed(webhookLog?.id, false, err.message);
    next(err);
  }
}

/**
 * Downloads the PDF receipt for a completed donation.
 */
export async function downloadReceipt(req, res, next) {
  try {
    const donationId = req.params.id;

    // Fetch donation record
    const { data: donation, error } = await supabase
      .from("donations")
      .select("*")
      .eq("id", donationId)
      .single();

    if (error || !donation) {
      res.status(404);
      return next(new Error("Donation receipt not found"));
    }

    // Generate PDF stream
    const pdfBuffer = await generateReceiptPdf(donation);

    const receiptNo =
      donation.receiptNumber || `UFT-REC-${donation.id.substring(0, 8).toUpperCase()}`;
    const safeReceiptNo = receiptNo.replace(/\//g, "_");

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="Donation_Receipt_${safeReceiptNo}.pdf"`,
    );
    res.send(pdfBuffer);
  } catch (err) {
    next(err);
  }
}

/**
 * Admin: Initiates a payment refund.
 */
export async function refundDonation(req, res, next) {
  try {
    const eventId = req.params.id;

    const { data: event, error } = await supabase
      .from("payment_events")
      .select("*")
      .eq("id", eventId)
      .single();

    if (error || !event) {
      res.status(404);
      return next(new Error("Payment event record not found"));
    }

    if (event.current_state === "REFUNDED") {
      return res.status(400).json({ message: "This donation has already been refunded." });
    }

    // Update state to REFUND_INITIATED
    const updated = await transitionToState(
      eventId,
      "REFUND_INITIATED",
      "Refund initiated manually by administrator.",
    );

    // Run compensation asynchronously
    setImmediate(() => {
      runCompensation(eventId).catch((err) =>
        console.error("[PaymentController] Admin refund failed:", err.message),
      );
    });

    res.json({ message: "Refund process initiated successfully.", event: updated });
  } catch (err) {
    next(err);
  }
}

/**
 * Admin: Retrieves all payment logs timeline history for a transaction.
 */
export async function getPaymentTimeline(req, res, next) {
  try {
    const eventId = req.params.id;
    const { data: event, error } = await supabase
      .from("payment_events")
      .select(
        "id, idempotency_key, current_state, gateway_transaction_id, last_error, retry_count, created_at, updated_at",
      )
      .eq("id", eventId)
      .single();

    if (error || !event) {
      res.status(404);
      return next(new Error("Payment record not found"));
    }

    // Construct timeline array from status updates
    res.json(event);
  } catch (err) {
    next(err);
  }
}

/**
 * Admin: Retrieves all payment events.
 */
export async function getPaymentEvents(req, res, next) {
  try {
    const { data: events, error: eventsError } = await supabase
      .from("payment_events")
      .select("*")
      .order("created_at", { ascending: false });

    if (eventsError) throw eventsError;

    const { data: donations, error: donationsError } = await supabase
      .from("donations")
      .select("*")
      .order("created_at", { ascending: false });

    if (donationsError) throw donationsError;

    // Union legacy donation records that were created before the payment_events system
    const eventIds = new Set((events || []).map((e) => e.id));
    const legacyEvents = (donations || [])
      .filter((d) => !eventIds.has(d.id))
      .map((d) => ({
        id: d.id,
        idempotency_key: `legacy_${d.id}`,
        payment_id: d.receiptNumber || `legacy_${d.id}`,
        donor_name: d.donorName,
        email: d.email,
        phone: d.phone,
        pan_number: d.panNumber,
        amount: d.amount,
        purpose: d.purpose,
        current_state: "COMPLETED",
        created_at: d.created_at,
        updated_at: d.updated_at || d.created_at,
        last_error: null,
        retry_count: 0,
      }));

    const combined = [...(events || []), ...legacyEvents].sort((a, b) => {
      return new Date(b.created_at) - new Date(a.created_at);
    });

    res.json(combined);
  } catch (err) {
    next(err);
  }
}

/**
 * Retrieves payment status and receipt details for client-side polling.
 */
export async function getPaymentStatus(req, res, next) {
  try {
    const { idempotencyKey } = req.params;
    const { data: event, error } = await supabase
      .from("payment_events")
      .select("*")
      .eq("idempotency_key", idempotencyKey)
      .maybeSingle();

    if (error) throw error;
    if (!event) {
      res.status(404);
      return next(new Error("Payment record not found"));
    }

    let currentState = event.current_state;

    // Check directly with payment gateway if pending to prevent delays
    if (["INITIATED", "CHECKOUT_CREATED", "PAYMENT_PENDING"].includes(currentState)) {
      try {
        let lookupId = event.payment_id || event.idempotency_key;
        if (process.env.PAYMENT_PROVIDER === "cashfree" && lookupId && lookupId.startsWith("session_")) {
          lookupId = event.idempotency_key;
        }
        console.log(`[${new Date().toISOString()}] [StatusQuery] Querying status for idempotencyKey: ${idempotencyKey}, lookupId: ${lookupId}`);
        const gateway = getPaymentGateway();
        const verification = await gateway.verifyOrderPayment(lookupId);
        console.log(`[${new Date().toISOString()}] [StatusQuery] Gateway response:`, JSON.stringify(verification));
        if (verification.success && verification.status === "PAID") {
          const { data: updatedEvent, error: updateError } = await supabase
            .from("payment_events")
            .update({
              gateway_transaction_id: verification.gatewayTransactionId,
              current_state: "CHARGED",
              payment_method: verification.paymentMethod || null,
              gateway_response: verification.gatewayResponse || null,
              updated_at: new Date().toISOString(),
            })
            .eq("id", event.id)
            .select()
            .maybeSingle();

          if (!updateError && updatedEvent) {
            currentState = "CHARGED";
            // Run Saga in background
            setImmediate(async () => {
              try {
                await runSaga(updatedEvent.id);
              } catch (sagaErr) {
                console.error(`[PaymentController] Background Saga failed for ${updatedEvent.id}:`, sagaErr.message);
              }
            });
          }
        } else if (verification.status && ["FAILED", "USER_DROPPED", "CANCELLED", "TERMINATED"].includes(verification.status)) {
          const { data: updatedEvent } = await supabase
            .from("payment_events")
            .update({
              current_state: "FAILED",
              last_error: verification.error || `Payment gateway returned status: ${verification.status}`,
              updated_at: new Date().toISOString(),
            })
            .eq("id", event.id)
            .select()
            .maybeSingle();
          if (updatedEvent) {
            currentState = "FAILED";
            const { sendDonationFailed } = await import("../utils/emailService.js");
            sendDonationFailed(updatedEvent.email, updatedEvent.donor_name, updatedEvent.amount)
              .catch(err => console.error("[PaymentController] Failed to send payment failure email:", err.message));
          }
        }
      } catch (gatewayErr) {
        console.warn("[PaymentController] Direct polling gateway status check failed:", gatewayErr.message);
      }
    }

    // Try to find the donation record if it was saved
    let donation = null;
    const { data: donationData } = await supabase
      .from("donations")
      .select("*")
      .eq("id", event.id)
      .maybeSingle();
    donation = donationData;

    res.json({
      id: event.id,
      idempotencyKey: event.idempotency_key,
      currentState: currentState,
      amount: event.amount,
      donorName: event.donor_name,
      email: event.email,
      phone: event.phone,
      receiptNumber: donation?.receiptNumber || null,
      donationId: donation?.id || null,
      lastError: event.last_error,
      paymentMethod: event.payment_method || null,
      gatewayTransactionId: event.gateway_transaction_id || null,
    });
  } catch (err) {
    next(err);
  }
}

/**
 * Verifies standard checkout Razorpay signatures.
 */
/**
 * Verifies standard checkout Cashfree payment status.
 */
export async function verifyCashfreePaymentStatus(req, res, next) {
  try {
    const { idempotencyKey } = req.body;

    if (!idempotencyKey) {
      res.status(400);
      return next(new Error("Missing idempotencyKey in request body"));
    }

    const gateway = getPaymentGateway();
    const verification = await gateway.verifyOrderPayment(idempotencyKey);

    if (verification.success && verification.status === "PAID") {
      // Fetch the payment event
      const { data: event, error: fetchError } = await supabase
        .from("payment_events")
        .select("*")
        .eq("idempotency_key", idempotencyKey)
        .maybeSingle();

      if (fetchError || !event) {
        res.status(404);
        return next(new Error("Payment session transaction record not found"));
      }

      // If already fully completed, just return details
      if (
        ["COMPLETED", "DONATION_SAVED", "EMAIL_SENT", "ADMIN_NOTIFIED"].includes(event.current_state)
      ) {
        return res.json({
          success: true,
          eventId: event.id,
          donationId: event.id,
        });
      }

      // Update state to CHARGED with the verified transaction ID only if it is still pending
      const { data: updatedEvent, error: updateError } = await supabase
        .from("payment_events")
        .update({
          gateway_transaction_id: verification.gatewayTransactionId,
          current_state: "CHARGED",
          payment_method: verification.paymentMethod || null,
          gateway_response: verification.gatewayResponse || null,
          updated_at: new Date().toISOString(),
        })
        .eq("id", event.id)
        .in("current_state", ["INITIATED", "CHECKOUT_CREATED", "PAYMENT_PENDING"])
        .select()
        .maybeSingle();

      if (updateError) throw updateError;

      if (!updatedEvent) {
        console.log(
          `[PaymentController] verifyCashfreePaymentStatus: State has already transitioned. Skipping duplicate Saga execution.`,
        );
        return res.json({
          success: true,
          eventId: event.id,
          donationId: event.id,
        });
      }

      // Asynchronously trigger Saga Engine execution
      await runSaga(updatedEvent.id);

      res.json({
        success: true,
        eventId: event.id,
        donationId: event.id,
      });
    } else {
      res.status(400);
      return next(new Error(`Cashfree payment verification unsuccessful. Status: ${verification.status || "UNPAID"}`));
    }
  } catch (err) {
    next(err);
  }
}

/**
 * Admin: Resends a donation receipt to the donor.
 */
export async function resendReceipt(req, res, next) {
  try {
    const donationId = req.params.id;

    // 1. Fetch donation record
    const { data: donation, error: donationError } = await supabase
      .from("donations")
      .select("*")
      .eq("id", donationId)
      .single();

    if (donationError || !donation) {
      res.status(404);
      return next(new Error("Donation record not found"));
    }

    // 2. Fetch payment event to get gateway transaction ID
    const { data: event, error: eventError } = await supabase
      .from("payment_events")
      .select("*")
      .eq("id", donation.id)
      .single();

    if (eventError || !event) {
      res.status(404);
      return next(new Error("Related payment transaction record not found"));
    }

    // 3. Generate receipt PDF buffer
    const pdfBuffer = await generateReceiptPdf(donation);

    // 4. Send email receipt to donor
    const { sendDonationReceived } = await import("../utils/emailService.js");
    await sendDonationReceived(
      donation.email,
      donation.donorName,
      donation.amount,
      event.gateway_transaction_id || event.id,
      donation.panNumber,
      donation.receiptNumber || `UFT/REC-${donation.id.substring(0, 8).toUpperCase()}`,
      pdfBuffer
    );

    console.log(`[PaymentController] Manually re-sent donation receipt to ${donation.email} for donation ${donationId}`);

    res.json({ success: true, message: `Receipt successfully sent to ${donation.email}.` });
  } catch (err) {
    next(err);
  }
}
