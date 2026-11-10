import axios from "axios";
import crypto from "crypto";
import { paymentRepository } from "./payment.repository";
import { orderRepository } from "../order/order.repository";
import { ApiError } from "../../utils/api-error";
import { payments_status } from "@prisma/client";

const MIDTRANS_SNAP_URL = process.env.MIDTRANS_IS_PRODUCTION === "true"
  ? "https://app.midtrans.com/snap/v1/transactions"
  : "https://app.sandbox.midtrans.com/snap/v1/transactions";
const MIDTRANS_STATUS_URL = process.env.MIDTRANS_IS_PRODUCTION === "true"
  ? "https://api.midtrans.com/v2"
  : "https://api.sandbox.midtrans.com/v2";

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

async function applyTransactionStatus(payload: any) {
  const order = await orderRepository.findByOrderNumber(payload.order_id);
  if (!order) throw ApiError.notFound(`Order ${payload.order_id} not found`);

  let payment = await paymentRepository.findByOrderId(order.id);
  if (!payment) {
    payment = await paymentRepository.createPayment({
      orderId: order.id,
      amount: Number(order.total_amount),
    });
  }

  const transactionStatus = payload.transaction_status;
  const fraudStatus = payload.fraud_status;
  const paymentType = payload.payment_type || "OTHER";
  const transactionId = payload.transaction_id || "";

  if (transactionStatus === "capture" && fraudStatus === "challenge") {
    await paymentRepository.updatePaymentFailed(payment.id, payments_status.FAILED, payload);
  } else if (transactionStatus === "settlement" || (transactionStatus === "capture" && fraudStatus === "accept")) {
    await paymentRepository.updatePaymentSuccess(payment.id, {
      method: paymentType,
      paidAt: payload.transaction_time ? new Date(payload.transaction_time) : new Date(),
      rawResponse: payload,
      midtransId: transactionId,
      transactionStatus,
      fraudStatus,
    });
  } else if (["cancel", "deny", "expire"].includes(transactionStatus)) {
    const status = transactionStatus === "expire" ? payments_status.EXPIRED : payments_status.FAILED;
    await paymentRepository.updatePaymentFailed(payment.id, status, payload);
  }

  const [updatedPayment, updatedOrder] = await Promise.all([
    paymentRepository.findByOrderId(order.id),
    orderRepository.findById(order.id),
  ]);

  return {
    paymentStatus: updatedPayment?.status ?? payment.status,
    orderStatus: updatedOrder?.status ?? order.status,
  };
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

  async syncStatus(orderId: string, userId: string) {
    const order = await orderRepository.findById(orderId);
    if (!order) throw ApiError.notFound("Order not found");
    if (order.user_id !== userId) throw ApiError.forbidden("Not your order");

    const payment = await paymentRepository.findByOrderId(order.id);
    if (!payment) throw ApiError.notFound("Payment not found for this order");
    if (payment.status === payments_status.PAID) {
      return { paymentStatus: payment.status, orderStatus: order.status };
    }
    if (!MIDTRANS_SERVER_KEY) {
      throw ApiError.internal("Midtrans server key is not configured. Please set MIDTRANS_SERVER_KEY in .env");
    }

    let statusPayload: any;
    try {
      const response = await axios.get(
        `${MIDTRANS_STATUS_URL}/${encodeURIComponent(order.invoice_number)}/status`,
        { headers: { Authorization: getAuthHeader(), Accept: "application/json" } },
      );
      statusPayload = response.data;
    } catch (err: any) {
      console.error("Midtrans status check error:", err.response?.data || err.message);
      throw ApiError.internal("Failed to verify payment status with payment gateway");
    }

    if (statusPayload.order_id !== order.invoice_number) {
      throw ApiError.internal("Payment gateway returned a status for a different order");
    }
    return applyTransactionStatus(statusPayload);
  },

  async handleWebhook(payload: any) {
    try {
      if (!verifySignature(payload)) throw ApiError.unauthorized("Invalid Midtrans signature");
      return await applyTransactionStatus(payload);
    } catch (e: any) {
      console.error("Webhook processing error:", e);
      throw e;
    }
  }
};
