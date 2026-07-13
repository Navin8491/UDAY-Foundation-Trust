import { supabase } from "../config/db.js";
import { runSaga, runCompensation, transitionToState } from "./sagaEngine.js";
import { getPaymentGateway } from "./paymentGateway.js";

let scanInterval = null;

/**
 * Resumes stuck or interrupted transactions based on their last logged state.
 */
async function recoverTransaction(event) {
  const eventId = event.id;
  const state = event.current_state;

  console.log(`[CrashRecovery] Attempting to recover transaction ${eventId} in state: ${state}`);

  try {
    // 1. Transaction stuck in initial checkout creation phases
    if (state === "INITIATED" || state === "CHECKOUT_CREATED" || state === "PAYMENT_PENDING") {
      const now = new Date();
      const createdAt = new Date(event.created_at);
      const diffMins = Math.floor((now - createdAt) / 60000);

      // Check with payment gateway if payment was completed
      if (event.payment_id) {
        const gateway = getPaymentGateway();

        try {
          let isPaid = false;
          let transactionId = null;

          // Gateway-specific status checks
          const provider = (process.env.PAYMENT_PROVIDER || "mock").toLowerCase();

          if (["stripe", "cashfree"].includes(provider)) {
            let lookupId = event.payment_id;
            if (provider === "cashfree" && lookupId && lookupId.startsWith("session_")) {
              lookupId = event.idempotency_key;
            }
            const verification = await gateway.verifyOrderPayment(lookupId);
            if (verification.success && verification.status === "PAID") {
              isPaid = true;
              transactionId = verification.gatewayTransactionId;
            }
          } else if (provider === "mock") {
            isPaid = false;
          }

          if (isPaid) {
            console.log(
              `[CrashRecovery] Detected payment was actually completed for ${eventId}. Resuming Saga...`,
            );

            await supabase
              .from("payment_events")
              .update({
                gateway_transaction_id: transactionId || event.payment_id,
                current_state: "CHARGED",
                updated_at: new Date().toISOString(),
              })
              .eq("id", eventId);

            await runSaga(eventId);
            return;
          }
        } catch (gatewayErr) {
          console.error(
            `[CrashRecovery] Failed to query gateway status for ${eventId}:`,
            gatewayErr.message,
          );
        }
      }

      // If unpaid and older than 30 minutes, fail the event
      if (diffMins >= 30) {
        console.log(
          `[CrashRecovery] Session ${eventId} expired (older than 30 mins). Marking FAILED.`,
        );
        await transitionToState(eventId, "FAILED", "Payment session expired or unpaid.");
      }
      return;
    }

    // 2. Stuck in refund phases
    if (state === "REFUND_INITIATED") {
      await runCompensation(eventId);
      return;
    }

    // 3. Paid but downstream steps got interrupted (Crash recovery)
    if (
      ["CHARGED", "PAYMENT_VERIFIED", "DONATION_SAVED", "EMAIL_SENT", "ADMIN_NOTIFIED"].includes(
        state,
      )
    ) {
      console.log(`[CrashRecovery] Resuming forward transaction flow for event: ${eventId}`);
      await runSaga(eventId);
      return;
    }
  } catch (err) {
    console.error(`[CrashRecovery] Error recovering transaction ${eventId}:`, err.message);

    // Update event retry count
    await supabase.rpc("increment_retry_count", { event_id: eventId }).catch(() => {
      // Fallback update in case RPC not available
      supabase
        .from("payment_events")
        .update({ retry_count: (event.retry_count || 0) + 1 })
        .eq("id", eventId)
        .catch(() => {});
    });
  }
}

/**
 * Scans the database for stuck or interrupted payment transactions.
 */
export async function runRecoveryScanner() {
  console.log("🔍 [CrashRecovery] Running background transaction recovery scan...");

  try {
    const { data: stuckEvents, error } = await supabase
      .from("payment_events")
      .select("*")
      .not("current_state", "in", '("COMPLETED","FAILED","REFUNDED")')
      // Don't scan events created in the last 2 minutes to prevent race conditions with active webhooks
      .lt("created_at", new Date(Date.now() - 120000).toISOString())
      .limit(20);

    if (error) {
      console.error("[CrashRecovery] Failed to query stuck payment events:", error.message);
      return;
    }

    if (!stuckEvents || stuckEvents.length === 0) {
      console.log("[CrashRecovery] No stuck transactions found. All clear.");
      return;
    }

    console.log(
      `[CrashRecovery] Found ${stuckEvents.length} stuck transactions. Initiating recovery...`,
    );

    for (const event of stuckEvents) {
      await recoverTransaction(event);
    }
  } catch (err) {
    console.error("[CrashRecovery] Scan error:", err.message);
  }
}

/**
 * Starts the crash recovery background process.
 * Runs once immediately, and then every 5 minutes.
 */
export function startCrashRecovery() {
  if (scanInterval) return;

  console.log("⏱️ Starting Crash Recovery background loop...");

  // Run once immediately after startup (with 10-second delay to allow app boot/DB pool setup)
  setTimeout(() => {
    runRecoveryScanner();
  }, 10000);

  // Repeat every 5 minutes
  scanInterval = setInterval(() => {
    runRecoveryScanner();
  }, 300000);
}

/**
 * Stops the crash recovery background process.
 */
export function stopCrashRecovery() {
  if (scanInterval) {
    clearInterval(scanInterval);
    scanInterval = null;
    console.log("🛑 Stopped Crash Recovery background loop.");
  }
}
