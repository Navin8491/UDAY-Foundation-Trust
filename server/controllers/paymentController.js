import { supabase } from "../config/db.js";
import { getPaymentGateway } from "../services/paymentGateway.js";
import { runSaga, transitionToState } from "../services/sagaEngine.js";
import { generateReceiptPdf } from "../utils/pdfGenerator.js";
import { z } from "zod";
import crypto from "crypto";

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
  try {
    const validated = paymentInitiationSchema.parse(req.body);
    const { idempotencyKey, amount, donorName, email, phone, address, panNumber, purpose } = validated;

    console.log(`[PaymentController] Initiating checkout for ${donorName}, Amount: ₹${amount}, Key: ${idempotencyKey}`);

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
      console.log(`[PaymentController] Duplicate checkout attempt detected for idempotency key: ${idempotencyKey}`);
      
      // If the transaction completed successfully, return the success info
      if (["COMPLETED", "CHARGED", "PAYMENT_VERIFIED", "DONATION_SAVED", "EMAIL_SENT", "ADMIN_NOTIFIED"].includes(existingEvent.current_state)) {
        return res.status(200).json({
          status: "already_completed",
          message: "This donation has already been completed successfully.",
          eventId: existingEvent.id,
        });
      }

      // If the checkout session is already created and not expired/failed, return the existing URL
      if (existingEvent.current_state === "CHECKOUT_CREATED" && existingEvent.payment_id) {
        // Retrieve the redirect URL from the gateway session or return stored info
        const gateway = getPaymentGateway();
        let url = "";

        if (process.env.PAYMENT_PROVIDER?.toLowerCase() === "stripe") {
          try {
            const session = await gateway.stripe.checkout.sessions.retrieve(existingEvent.payment_id);
            url = session.url;
          } catch (e) {
            console.warn("[PaymentController] Failed to retrieve Stripe session, creating a new one:", e.message);
          }
        } else {
          // Razorpay/Mock URLs are deterministically constructable or stored
          // Re-generate the URL for the mock/razorpay provider
          const tempUrl = await gateway.createCheckoutSession({
            amount: existingEvent.amount,
            currency: existingEvent.currency,
            idempotencyKey: existingEvent.idempotency_key,
            donorName: existingEvent.donor_name,
            email: existingEvent.email,
            phone: existingEvent.phone,
            description: existingEvent.purpose,
          });
          url = tempUrl.url;
        }

        if (url) {
          return res.status(200).json({
            status: "session_recovered",
            sessionId: existingEvent.payment_id,
            url,
            idempotencyKey,
          });
        }
      }

      // If it failed previously, we can transition it back to INITIATED and try again
      if (existingEvent.current_state === "FAILED") {
        await transitionToState(existingEvent.id, "INITIATED", "Retrying failed transaction attempt.");
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
        if (insertError.code === "23505") { // postgres unique violation
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

      // 4. Update event record: State: CHECKOUT_CREATED, payment_id: gateway session id
      const { data: updatedRecord, error: updateError } = await supabase
        .from("payment_events")
        .update({
          payment_id: sessionResult.sessionId,
          current_state: "CHECKOUT_CREATED",
          updated_at: new Date().toISOString(),
        })
        .eq("id", eventRecord.id)
        .select()
        .single();

      if (updateError) throw updateError;

      res.status(201).json({
        status: "created",
        sessionId: sessionResult.sessionId,
        url: sessionResult.url,
        idempotencyKey,
        eventId: updatedRecord.id,
      });

    } catch (gatewayErr) {
      console.error("[PaymentController] Payment Gateway Checkout Creation failed:", gatewayErr.message);
      await transitionToState(eventRecord.id, "FAILED", `Gateway checkout creation failed: ${gatewayErr.message}`);
      res.status(502);
      throw new Error(`Failed to initialize payment with gateway: ${gatewayErr.message}`);
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
  const signature = req.headers["stripe-signature"] || req.headers["x-razorpay-signature"] || "";
  const provider = (process.env.PAYMENT_PROVIDER || "mock").toLowerCase();
  
  console.log(`[PaymentController] Webhook received for provider: ${provider}`);

  try {
    const gateway = getPaymentGateway();
    
    // Stripe webhooks require the raw request body to verify signatures correctly
    const rawBody = req.rawBody || req.body;
    
    const verification = await gateway.verifyWebhook(rawBody, signature);

    if (!verification.success) {
      res.status(400);
      return next(new Error(`Webhook verification signature validation failed. Detail: ${verification.error || "unknown"}`));
    }

    console.log(`[PaymentController] Webhook signature verified. Transaction ID: ${verification.gatewayTransactionId}, Event Type: ${verification.eventType}`);

    // If it's a success payment event, find the record and trigger the Saga state machine
    if (verification.idempotencyKey) {
      const { data: event, error } = await supabase
        .from("payment_events")
        .select("*")
        .eq("idempotency_key", verification.idempotencyKey)
        .maybeSingle();

      if (error) throw error;

      if (!event) {
        console.warn(`[PaymentController] Webhook received for unknown idempotency key: ${verification.idempotencyKey}`);
        return res.status(200).json({ received: true, warning: "unknown idempotency key" });
      }

      // If already processed, ignore webhook retry
      if (["CHARGED", "PAYMENT_VERIFIED", "DONATION_SAVED", "EMAIL_SENT", "ADMIN_NOTIFIED", "COMPLETED"].includes(event.current_state)) {
        console.log(`[PaymentController] Transaction ${event.id} already completed or processing. Webhook ignored.`);
        return res.status(200).json({ received: true, status: "already_processed" });
      }

      // Update state to CHARGED and transaction ID
      await supabase
        .from("payment_events")
        .update({
          gateway_transaction_id: verification.gatewayTransactionId,
          current_state: "CHARGED",
          updated_at: new Date().toISOString(),
        })
        .eq("id", event.id);

      // Run Saga orchestrator asynchronously in the background so the webhook response returns immediately
      setImmediate(async () => {
        try {
          await runSaga(event.id);
        } catch (sagaErr) {
          console.error(`[PaymentController] Background Saga execution failed for ${event.id}:`, sagaErr.message);
        }
      });
    }

    res.status(200).json({ received: true });

  } catch (err) {
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
    
    const receiptNo = donation.receiptNumber || `UFT-REC-${donation.id.substring(0, 8).toUpperCase()}`;
    const safeReceiptNo = receiptNo.replace(/\//g, "_");

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename="Donation_Receipt_${safeReceiptNo}.pdf"`);
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
    const updated = await transitionToState(eventId, "REFUND_INITIATED", "Refund initiated manually by administrator.");

    // Run compensation asynchronously
    setImmediate(() => {
      runCompensation(eventId).catch((err) => console.error("[PaymentController] Admin refund failed:", err.message));
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
      .select("id, idempotency_key, current_state, gateway_transaction_id, last_error, retry_count, created_at, updated_at")
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
    const eventIds = new Set((events || []).map(e => e.id));
    const legacyEvents = (donations || [])
      .filter(d => !eventIds.has(d.id))
      .map(d => ({
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
        retry_count: 0
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

    // Try to find the donation record if it was saved
    let donation = null;
    if (["DONATION_SAVED", "EMAIL_SENT", "ADMIN_NOTIFIED", "COMPLETED"].includes(event.current_state)) {
      const { data } = await supabase
        .from("donations")
        .select("*")
        .eq("id", event.id)
        .maybeSingle();
      donation = data;
    }

    res.json({
      id: event.id,
      idempotencyKey: event.idempotency_key,
      currentState: event.current_state,
      amount: event.amount,
      donorName: event.donor_name,
      email: event.email,
      phone: event.phone,
      receiptNumber: donation?.receiptNumber || null,
      donationId: donation?.id || null,
      lastError: event.last_error,
    });
  } catch (err) {
    next(err);
  }
}
