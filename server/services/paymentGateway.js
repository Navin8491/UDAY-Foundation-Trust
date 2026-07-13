import Stripe from "stripe";
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
   * @param {Object} [headers] - request headers for timestamp/metadata verification
   * @returns {Promise<{ success: boolean, gatewayTransactionId: string, amount: number, currency: string, eventType: string }>}
   */
  async verifyWebhook(payload, signature, headers) {
    throw new Error("verifyWebhook not implemented");
  }

  /**
   * Verifies an order payment by checking directly with the gateway.
   * @param {string} orderId - the gateway order ID or session ID
   * @returns {Promise<{ success: boolean, status: string, gatewayTransactionId: string, amount: number, currency: string }>}
   */
  async verifyOrderPayment(orderId) {
    throw new Error("verifyOrderPayment not implemented");
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
      },
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
          eventType: event.type,
          idempotencyKey: session.metadata?.idempotencyKey,
        };
      }
      return { success: false, eventType: event.type };
    } catch (err) {
      console.error("[StripeGateway] Webhook verification failed:", err.message);
      return { success: false, error: err.message };
    }
  }

  async verifyOrderPayment(orderId) {
    try {
      const session = await this.stripe.checkout.sessions.retrieve(orderId);
      if (session.payment_status === "paid") {
        return {
          success: true,
          status: "PAID",
          gatewayTransactionId: session.payment_intent || session.id,
          amount: session.amount_total / 100,
          currency: session.currency.toUpperCase()
        };
      }
      return { success: false, status: session.payment_status };
    } catch (err) {
      console.error("[StripeGateway] verifyOrderPayment failed:", err.message);
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
 * Cashfree Gateway Implementation
 */
class CashfreeGateway extends PaymentGateway {
  constructor() {
    super();
    this.appId = process.env.CASHFREE_APP_ID || "mock_app_id";
    this.secretKey = process.env.CASHFREE_SECRET_KEY || "mock_secret_key";
    this.webhookSecret = process.env.CASHFREE_WEBHOOK_SECRET || this.secretKey;
    this.env = (process.env.CASHFREE_ENVIRONMENT || process.env.CASHFREE_ENV || "sandbox").toLowerCase();
    this.baseUrl = this.env === "production"
      ? "https://api.cashfree.com/pg"
      : "https://sandbox.cashfree.com/pg";
  }

  async createCheckoutSession(params) {
    let successUrl;
    if (this.env === "production") {
      // Cashfree Production requires an HTTPS return URL.
      // We look for the first HTTPS origin listed in FRONTEND_URL, or fall back to the live site.
      const httpsOrigin = (process.env.FRONTEND_URL || "")
        .split(",")
        .map((origin) => origin.trim())
        .find((origin) => origin.startsWith("https://")) || "https://www.udayfoundationstrust.org";
      
      successUrl = `${httpsOrigin}/donation/payment-status?order_id=${params.idempotencyKey}`;
    } else {
      successUrl = `${process.env.FRONTEND_URL?.split(",")[0] || "http://localhost:5173"}/donation/payment-status?order_id=${params.idempotencyKey}`;
    }

    const headers = {
      "x-client-id": this.appId,
      "x-client-secret": this.secretKey,
      "x-api-version": "2023-08-01",
      "Content-Type": "application/json"
    };

    // Customer ID must be alphanumeric and under 50 characters
    const customerId = params.email.replace(/[^a-zA-Z0-9]/g, "_").substring(0, 50);

    const body = {
      order_amount: params.amount,
      order_currency: params.currency.toUpperCase(),
      order_id: params.idempotencyKey,
      customer_details: {
        customer_id: customerId,
        customer_name: params.donorName || "Donor",
        customer_email: params.email,
        customer_phone: params.phone.replace(/[^0-9]/g, "").substring(0, 10) || "9999999999"
      },
      order_meta: {
        return_url: successUrl
      }
    };

    console.log(`[CashfreeGateway] Creating order for ID: ${params.idempotencyKey}, URL: ${this.baseUrl}/orders`);

    const res = await fetch(`${this.baseUrl}/orders`, {
      method: "POST",
      headers,
      body: JSON.stringify(body)
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error("[CashfreeGateway] Create Order Error:", errorText);
      throw new Error(`Cashfree order creation failed: ${errorText}`);
    }

    const order = await res.json();

    return {
      sessionId: order.payment_session_id,
      url: `https://${this.env === "production" ? "payments" : "payments-test"}.cashfree.com/order/#token=${order.payment_session_id}`,
      orderId: order.order_id,
      amount: order.order_amount,
      currency: order.order_currency,
      idempotencyKey: params.idempotencyKey,
      donorName: params.donorName,
      email: params.email,
      phone: params.phone
    };
  }

  async verifyWebhook(payload, signature, headers) {
    try {
      const ts = headers ? (headers["x-webhook-timestamp"] || "") : "";
      let rawBody;
      if (typeof payload === "string") {
        rawBody = payload;
      } else if (Buffer.isBuffer(payload)) {
        rawBody = payload.toString("utf8");
      } else {
        rawBody = JSON.stringify(payload);
      }

      const signStr = ts + rawBody;
      const generatedSignature = crypto
        .createHmac("sha256", this.webhookSecret)
        .update(signStr)
        .digest("base64");

      if (generatedSignature !== signature) {
        console.error("[CashfreeGateway] Webhook signature verification mismatch.");
        return { success: false, error: "Signature mismatch" };
      }

      const body = JSON.parse(rawBody);
      const eventType = body.type;

      if (eventType === "PAYMENT_SUCCESS") {
        const payment = body.data.payment;
        const order = body.data.order;
        return {
          success: true,
          status: "SUCCESS",
          gatewayTransactionId: payment.cf_payment_id,
          amount: payment.payment_amount,
          currency: payment.payment_currency.toUpperCase(),
          eventType,
          idempotencyKey: order.order_id,
          paymentMethod: payment.payment_group || (payment.payment_method ? Object.keys(payment.payment_method)[0] : null),
          gatewayResponse: body
        };
      } else if (eventType === "PAYMENT_FAILED" || eventType === "PAYMENT_USER_DROPPED") {
        const payment = body.data.payment;
        const order = body.data.order;
        return {
          success: true,
          status: "FAILED",
          gatewayTransactionId: payment?.cf_payment_id || null,
          amount: payment?.payment_amount || order.order_amount,
          currency: order.order_currency.toUpperCase(),
          eventType,
          idempotencyKey: order.order_id,
          error: payment?.payment_message || "Payment failed or abandoned",
          gatewayResponse: body
        };
      } else if (eventType === "REFUND_STATUS_WEBHOOK") {
        const refund = body.data.refund;
        const order = body.data.order;
        return {
          success: true,
          status: "REFUNDED",
          refundId: refund?.cf_refund_id || refund?.refund_id,
          amount: refund?.refund_amount,
          eventType,
          idempotencyKey: order.order_id,
          gatewayResponse: body
        };
      }

      return { success: true, status: "OTHER", eventType, idempotencyKey: body.data?.order?.order_id, gatewayResponse: body };
    } catch (err) {
      console.error("[CashfreeGateway] Webhook verification exception:", err.message);
      return { success: false, error: err.message };
    }
  }

  async verifyOrderPayment(orderId) {
    try {
      const headers = {
        "x-client-id": this.appId,
        "x-client-secret": this.secretKey,
        "x-api-version": "2023-08-01",
        "Content-Type": "application/json"
      };

      const res = await fetch(`${this.baseUrl}/orders/${orderId}`, {
        headers
      });

      if (!res.ok) {
        const errorText = await res.text();
        console.error("[CashfreeGateway] Fetch Order Error:", errorText);
        return { success: false, status: "ERROR" };
      }

      const order = await res.json();
      if (order.order_status === "PAID") {
        // Fetch payments associated with the order to get captured transaction ID
        const paymentsRes = await fetch(`${this.baseUrl}/orders/${orderId}/payments`, {
          headers
        });
        let transactionId = orderId;
        let paymentMethod = null;
        let rawPaymentResponse = null;
        if (paymentsRes.ok) {
          const payments = await paymentsRes.json();
          // Find first successful payment
          const successPayment = payments.find(p => p.payment_status === "SUCCESS");
          if (successPayment) {
            transactionId = successPayment.cf_payment_id;
            paymentMethod = successPayment.payment_group || (successPayment.payment_method ? Object.keys(successPayment.payment_method)[0] : null);
            rawPaymentResponse = successPayment;
          }
        }
        return {
          success: true,
          status: "PAID",
          gatewayTransactionId: transactionId,
          amount: order.order_amount,
          currency: order.order_currency,
          paymentMethod,
          gatewayResponse: rawPaymentResponse || order
        };
      }

      return {
        success: false,
        status: order.order_status,
        error: order.order_status === "ACTIVE" ? "Payment pending/active" : `Payment state: ${order.order_status}`
      };
    } catch (err) {
      console.error("[CashfreeGateway] verifyOrderPayment failed:", err.message);
      return { success: false, error: err.message };
    }
  }

  async refundPayment(transactionId, amount) {
    try {
      // Find the order_id from database if transactionId is the payment ID
      let orderId = transactionId;
      const { supabase } = await import("../config/db.js");
      const { data: event } = await supabase
        .from("payment_events")
        .select("idempotency_key")
        .or(`gateway_transaction_id.eq.${transactionId},idempotency_key.eq.${transactionId}`)
        .maybeSingle();

      if (event) {
        orderId = event.idempotency_key;
      }

      const headers = {
        "x-client-id": this.appId,
        "x-client-secret": this.secretKey,
        "x-api-version": "2023-08-01",
        "Content-Type": "application/json"
      };

      const body = {
        refund_amount: amount,
        refund_id: `ref_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
        refund_note: "Manually initiated NGO refund",
        refund_speed: "STANDARD"
      };

      const res = await fetch(`${this.baseUrl}/orders/${orderId}/refunds`, {
        method: "POST",
        headers,
        body: JSON.stringify(body)
      });

      if (!res.ok) {
        const errorText = await res.text();
        console.error("[CashfreeGateway] Refund failed:", errorText);
        throw new Error(errorText);
      }

      const refund = await res.json();
      return {
        success: true,
        refundId: refund.cf_refund_id || refund.refund_id
      };
    } catch (err) {
      console.error("[CashfreeGateway] Refund execution failed:", err.message);
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
    case "cashfree":
      return new CashfreeGateway();
    default:
      throw new Error(
        `Unsupported live payment provider: "${provider}". Only "stripe" or "cashfree" are allowed in production.`,
      );
  }
}
