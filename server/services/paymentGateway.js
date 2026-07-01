import Stripe from "stripe";
import Razorpay from "razorpay";
import crypto from "crypto";

/**
 * PaymentGateway abstraction interface.
 * Any new payment provider must implement these methods.
 */
class PaymentGateway {
  /**
   * Creates a checkout session/order for the donor.
   * @param {Object} params - parameters
   * @param {number} params.amount - amount to charge
   * @param {string} params.currency - currency code
   * @param {string} params.idempotencyKey - unique key to prevent duplicate charges
   * @param {string} params.donorName - donor's full name
   * @param {string} params.email - donor's email
   * @param {string} params.phone - donor's phone
   * @param {string} params.description - item/purpose description
   * @returns {Promise<{ sessionId: string, url: string, gatewayTransactionId: string }>}
   */
  async createCheckoutSession(params) {
    throw new Error("createCheckoutSession not implemented");
  }

  /**
   * Verifies the webhook signature or callback payload.
   * @param {Object|string} payload - raw body or callback parameters
   * @param {string} signature - gateway signature
   * @returns {Promise<{ success: boolean, gatewayTransactionId: string, amount: number, currency: string, eventType: string }>}
   */
  async verifyWebhook(payload, signature) {
    throw new Error("verifyWebhook not implemented");
  }

  /**
   * Issues a refund for a successful transaction.
   * @param {string} transactionId - gateway transaction ID (charge or payment ID)
   * @param {number} amount - amount to refund
   * @returns {Promise<{ success: boolean, refundId: string }>}
   */
  async refundPayment(transactionId, amount) {
    throw new Error("refundPayment not implemented");
  }
}

/**
 * Stripe Gateway Implementation
 */
class StripeGateway extends PaymentGateway {
  constructor() {
    super();
    const apiKey = process.env.STRIPE_SECRET_KEY || "mock_key";
    this.stripe = new Stripe(apiKey, {
      apiVersion: "2023-10-16",
    });
    this.webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || "";
  }

  async createCheckoutSession(params) {
    const successUrl = `${process.env.FRONTEND_URL?.split(",")[0] || "http://localhost:5173"}/donate?status=success&idempotency_key=${params.idempotencyKey}`;
    const cancelUrl = `${process.env.FRONTEND_URL?.split(",")[0] || "http://localhost:5173"}/donate?status=cancel&idempotency_key=${params.idempotencyKey}`;

    const session = await this.stripe.checkout.sessions.create(
      {
        payment_method_types: ["card"],
        line_items: [
          {
            price_data: {
              currency: params.currency.toLowerCase(),
              product_data: {
                name: "NGO Donation - Uday Foundation Trust",
                description: params.description,
              },
              unit_amount: Math.round(params.amount * 100), // Stripe expects cents/paise
            },
            quantity: 1,
          },
        ],
        mode: "payment",
        customer_email: params.email,
        success_url: successUrl,
        cancel_url: cancelUrl,
        metadata: {
          idempotencyKey: params.idempotencyKey,
          donorName: params.donorName,
          phone: params.phone,
        },
      },
      {
        idempotencyKey: params.idempotencyKey, // Native Stripe Idempotency Key!
      }
    );

    return {
      sessionId: session.id,
      url: session.url,
      gatewayTransactionId: session.payment_intent || session.id,
    };
  }

  async verifyWebhook(payload, signature) {
    try {
      const event = this.stripe.webhooks.constructEvent(payload, signature, this.webhookSecret);
      if (event.type === "checkout.session.completed") {
        const session = event.data.object;
        return {
          success: true,
          gatewayTransactionId: session.payment_intent || session.id,
          amount: session.amount_total / 100,
          currency: session.currency.toUpperCase(),
          eventType: "checkout.session.completed",
          idempotencyKey: session.metadata?.idempotencyKey,
        };
      }
      return { success: false, eventType: event.type };
    } catch (err) {
      console.error("[StripeGateway] Webhook verification failed:", err.message);
      return { success: false, error: err.message };
    }
  }

  async refundPayment(transactionId, amount) {
    try {
      const refund = await this.stripe.refunds.create({
        charge: transactionId,
        amount: Math.round(amount * 100),
      });
      return {
        success: true,
        refundId: refund.id,
      };
    } catch (err) {
      // If transactionId is actually a payment intent, refund by payment_intent
      try {
        const refund = await this.stripe.refunds.create({
          payment_intent: transactionId,
          amount: Math.round(amount * 100),
        });
        return {
          success: true,
          refundId: refund.id,
        };
      } catch (innerErr) {
        console.error("[StripeGateway] Refund failed:", innerErr.message);
        throw innerErr;
      }
    }
  }
}

/**
 * Razorpay Gateway Implementation
 */
class RazorpayGateway extends PaymentGateway {
  constructor() {
    super();
    this.keyId = process.env.RAZORPAY_KEY_ID || "mock_key";
    this.keySecret = process.env.RAZORPAY_KEY_SECRET || "mock_secret";
    this.webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET || "";
    
    this.razorpay = new Razorpay({
      key_id: this.keyId,
      key_secret: this.keySecret,
    });
  }

  async createCheckoutSession(params) {
    const successUrl = `${process.env.FRONTEND_URL?.split(",")[0] || "http://localhost:5173"}/donate?status=success&idempotency_key=${params.idempotencyKey}`;

    // Create a hosted Razorpay Payment Link
    const paymentLink = await this.razorpay.paymentLink.create({
      amount: Math.round(params.amount * 100), // Razorpay expects paise
      currency: params.currency.toUpperCase(),
      accept_partial: false,
      description: params.description,
      customer: {
        name: params.donorName,
        email: params.email,
        contact: params.phone,
      },
      notify: {
        sms: false,
        email: false
      },
      reminder_enable: false,
      notes: {
        idempotencyKey: params.idempotencyKey,
        donorName: params.donorName,
        phone: params.phone,
      },
      callback_url: successUrl,
      callback_method: "get"
    });

    return {
      sessionId: paymentLink.id,
      url: paymentLink.short_url,
      gatewayTransactionId: paymentLink.id,
    };
  }

  async verifyWebhook(payload, signature) {
    try {
      const shasum = crypto.createHmac("sha256", this.webhookSecret);
      shasum.update(typeof payload === "string" ? payload : JSON.stringify(payload));
      const digest = shasum.digest("hex");

      if (digest !== signature) {
        console.error("[RazorpayGateway] Webhook signature verification mismatch.");
        return { success: false, error: "Signature mismatch" };
      }

      const body = typeof payload === "string" ? JSON.parse(payload) : payload;
      const event = body.event;

      if (event === "payment.captured" || event === "order.paid") {
        const payment = body.payload.payment.entity;
        return {
          success: true,
          gatewayTransactionId: payment.id,
          amount: payment.amount / 100,
          currency: payment.currency.toUpperCase(),
          eventType: event,
          idempotencyKey: payment.notes?.idempotencyKey || body.payload.order?.entity?.notes?.idempotencyKey || body.payload.order?.entity?.receipt,
        };
      }

      if (event === "payment_link.paid") {
        const paymentLink = body.payload.payment_link.entity;
        const payment = body.payload.payment?.entity || {};
        return {
          success: true,
          gatewayTransactionId: payment.id || paymentLink.id,
          amount: paymentLink.amount_paid / 100,
          currency: paymentLink.currency.toUpperCase(),
          eventType: event,
          idempotencyKey: paymentLink.notes?.idempotencyKey,
        };
      }

      return { success: false, eventType: event };
    } catch (err) {
      console.error("[RazorpayGateway] Webhook verification exception:", err.message);
      return { success: false, error: err.message };
    }
  }

  async refundPayment(transactionId, amount) {
    try {
      const refund = await this.razorpay.payments.refund(transactionId, {
        amount: Math.round(amount * 100),
      });
      return {
        success: true,
        refundId: refund.id,
      };
    } catch (err) {
      console.error("[RazorpayGateway] Refund failed:", err.message);
      throw err;
    }
  }
}

// Factory export
export function getPaymentGateway() {
  const provider = (process.env.PAYMENT_PROVIDER || "stripe").toLowerCase();
  switch (provider) {
    case "stripe":
      return new StripeGateway();
    case "razorpay":
      return new RazorpayGateway();
    default:
      throw new Error(`Unsupported live payment provider: "${provider}". Only "stripe" or "razorpay" are allowed in production.`);
  }
}
