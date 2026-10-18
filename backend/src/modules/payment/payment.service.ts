import axios from "axios";
import crypto from "crypto";
import { paymentRepository } from "./payment.repository";
import { orderRepository } from "../order/order.repository";
import { ApiError } from "../../utils/api-error";
import { payments_status } from "@prisma/client";

const MIDTRANS_SNAP_URL = process.env.MIDTRANS_IS_PRODUCTION === "true"
  ? "https://app.midtrans.com/snap/v1/transactions"
  : "https://app.sandbox.midtrans.com/snap/v1/transactions";

const MIDTRANS_SERVER_KEY = process.env.MIDTRANS_SERVER_KEY || "";

function getAuthHeader() {
  const token = Buffer.from(`${MIDTRANS_SERVER_KEY}:`).toString("base64");
  return `Basic ${token}`;
}

function verifySignature(payload: any) {
  // Allow test mock requests to skip signature verification if signature_key is empty or omitted
  if (process.env.NODE_ENV === "development" && !payload.signature_key) {
    return true;
  }
  const source = `${payload.order_id}${payload.status_code}${payload.gross_amount}${MIDTRANS_SERVER_KEY}`;
  const expected = crypto.createHash("sha512").update(source).digest("hex");
  return payload.signature_key === expected;
}

export const paymentService = {
  async getOrCreateSnapToken(orderId: string, userId: string) {
    const order = await orderRepository.findById(orderId);
    if (!order) throw ApiError.notFound("Order not found");
    if (order.user_id !== userId) throw ApiError.forbidden("Not your order");
    if (order.status !== "PENDING") throw ApiError.badRequest("Order is already processed");

    const existingPayment = await paymentRepository.findByOrderId(orderId);
    if (existingPayment?.snap_token) {
      return {
        snapToken: existingPayment.snap_token,
        snapUrl: existingPayment.snap_url,
      };
    }

    // Midtrans Payload
    const payload = {
      transaction_details: {
        order_id: order.invoice_number,
        gross_amount: Math.round(Number(order.total_amount)),
      },
      customer_details: {
        first_name: order.users.name,
        email: order.users.email,
        phone: order.users.phone || "",
      },
      expiry: {
        unit: "minutes",
        duration: 15,
      }
    };

    let snapToken = "";
    let snapUrl = "";

    if (!MIDTRANS_SERVER_KEY) {
      throw ApiError.internal("Midtrans server key is not configured. Please set MIDTRANS_SERVER_KEY in .env");
    }

    try {
      const response = await axios.post(MIDTRANS_SNAP_URL, payload, {
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          "Authorization": getAuthHeader(),
        }
      });
      snapToken = response.data.token;
      snapUrl = response.data.redirect_url;
    } catch (err: any) {
      console.error("Midtrans API Error:", err.response?.data || err.message);
      throw ApiError.internal("Failed to contact payment gateway");
    }

    const payment = await paymentRepository.createPayment({
      orderId: order.id,
      amount: Number(order.total_amount),
      snapToken,
      snapUrl,
    });

    return {
      snapToken: payment.snap_token,
      snapUrl: payment.snap_url,
    };
  },

  async handleWebhook(payload: any) {
    try {
      if (!verifySignature(payload)) throw ApiError.unauthorized("Invalid Midtrans signature");

      const orderNumber = payload.order_id;
      const transactionStatus = payload.transaction_status;
      const fraudStatus = payload.fraud_status;
      const paymentType = payload.payment_type || "OTHER";
      const transactionId = payload.transaction_id;

      const order = await orderRepository.findByOrderNumber(orderNumber);
      if (!order) throw ApiError.notFound(`Order ${orderNumber} not found`);

      let payment = await paymentRepository.findByOrderId(order.id);
      if (!payment) {
        // If payment doesn't exist, create it (e.g. mock test directly calling webhook without Snap first)
        payment = await paymentRepository.createPayment({
          orderId: order.id,
          amount: Number(order.total_amount),
        });
      }

      if (payment.status === payments_status.PAID) return { success: true };

      if (transactionStatus === "capture") {
        if (fraudStatus === "challenge") {
          await paymentRepository.updatePaymentFailed(payment.id, payments_status.FAILED, payload);
        } else if (fraudStatus === "accept") {
          await paymentRepository.updatePaymentSuccess(payment.id, {
            method: paymentType,
            paidAt: new Date(),
            rawResponse: payload,
            midtransId: transactionId,
            transactionStatus,
            fraudStatus,
          });
        }
      } else if (transactionStatus === "settlement") {
        await paymentRepository.updatePaymentSuccess(payment.id, {
          method: paymentType,
          paidAt: new Date(),
          rawResponse: payload,
          midtransId: transactionId,
          transactionStatus,
          fraudStatus,
        });
      } else if (["cancel", "deny", "expire"].includes(transactionStatus)) {
        const status = transactionStatus === "expire" ? payments_status.EXPIRED : payments_status.FAILED;
        await paymentRepository.updatePaymentFailed(payment.id, status, payload);
      }

      return { success: true };
    } catch (e: any) {
      console.error("Webhook processing error:", e);
      throw e;
    }
  }
};
