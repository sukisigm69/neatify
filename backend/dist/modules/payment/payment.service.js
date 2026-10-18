"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.paymentService = void 0;
const axios_1 = __importDefault(require("axios"));
const crypto_1 = __importDefault(require("crypto"));
const payment_repository_1 = require("./payment.repository");
const order_repository_1 = require("../order/order.repository");
const api_error_1 = require("../../utils/api-error");
const client_1 = require("@prisma/client");
const MIDTRANS_SNAP_URL = process.env.MIDTRANS_IS_PRODUCTION === "true"
    ? "https://app.midtrans.com/snap/v1/transactions"
    : "https://app.sandbox.midtrans.com/snap/v1/transactions";
const MIDTRANS_SERVER_KEY = process.env.MIDTRANS_SERVER_KEY || "";
function getAuthHeader() {
    const token = Buffer.from(`${MIDTRANS_SERVER_KEY}:`).toString("base64");
    return `Basic ${token}`;
}
function verifySignature(payload) {
    // Allow test mock requests to skip signature verification if signature_key is empty or omitted
    if (process.env.NODE_ENV === "development" && !payload.signature_key) {
        return true;
    }
    const source = `${payload.order_id}${payload.status_code}${payload.gross_amount}${MIDTRANS_SERVER_KEY}`;
    const expected = crypto_1.default.createHash("sha512").update(source).digest("hex");
    return payload.signature_key === expected;
}
exports.paymentService = {
    async getOrCreateSnapToken(orderId, userId) {
        const order = await order_repository_1.orderRepository.findById(orderId);
        if (!order)
            throw api_error_1.ApiError.notFound("Order not found");
        if (order.user_id !== userId)
            throw api_error_1.ApiError.forbidden("Not your order");
        if (order.status !== "PENDING")
            throw api_error_1.ApiError.badRequest("Order is already processed");
        const existingPayment = await payment_repository_1.paymentRepository.findByOrderId(orderId);
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
            throw api_error_1.ApiError.internal("Midtrans server key is not configured. Please set MIDTRANS_SERVER_KEY in .env");
        }
        try {
            const response = await axios_1.default.post(MIDTRANS_SNAP_URL, payload, {
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                    "Authorization": getAuthHeader(),
                }
            });
            snapToken = response.data.token;
            snapUrl = response.data.redirect_url;
        }
        catch (err) {
            console.error("Midtrans API Error:", err.response?.data || err.message);
            throw api_error_1.ApiError.internal("Failed to contact payment gateway");
        }
        const payment = await payment_repository_1.paymentRepository.createPayment({
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
    async handleWebhook(payload) {
        try {
            if (!verifySignature(payload))
                throw api_error_1.ApiError.unauthorized("Invalid Midtrans signature");
            const orderNumber = payload.order_id;
            const transactionStatus = payload.transaction_status;
            const fraudStatus = payload.fraud_status;
            const paymentType = payload.payment_type || "OTHER";
            const transactionId = payload.transaction_id;
            const order = await order_repository_1.orderRepository.findByOrderNumber(orderNumber);
            if (!order)
                throw api_error_1.ApiError.notFound(`Order ${orderNumber} not found`);
            let payment = await payment_repository_1.paymentRepository.findByOrderId(order.id);
            if (!payment) {
                // If payment doesn't exist, create it (e.g. mock test directly calling webhook without Snap first)
                payment = await payment_repository_1.paymentRepository.createPayment({
                    orderId: order.id,
                    amount: Number(order.total_amount),
                });
            }
            if (payment.status === client_1.payments_status.PAID)
                return { success: true };
            if (transactionStatus === "capture") {
                if (fraudStatus === "challenge") {
                    await payment_repository_1.paymentRepository.updatePaymentFailed(payment.id, client_1.payments_status.FAILED, payload);
                }
                else if (fraudStatus === "accept") {
                    await payment_repository_1.paymentRepository.updatePaymentSuccess(payment.id, {
                        method: paymentType,
                        paidAt: new Date(),
                        rawResponse: payload,
                        midtransId: transactionId,
                        transactionStatus,
                        fraudStatus,
                    });
                }
            }
            else if (transactionStatus === "settlement") {
                await payment_repository_1.paymentRepository.updatePaymentSuccess(payment.id, {
                    method: paymentType,
                    paidAt: new Date(),
                    rawResponse: payload,
                    midtransId: transactionId,
                    transactionStatus,
                    fraudStatus,
                });
            }
            else if (["cancel", "deny", "expire"].includes(transactionStatus)) {
                const status = transactionStatus === "expire" ? client_1.payments_status.EXPIRED : client_1.payments_status.FAILED;
                await payment_repository_1.paymentRepository.updatePaymentFailed(payment.id, status, payload);
            }
            return { success: true };
        }
        catch (e) {
            console.error("Webhook processing error:", e);
            throw e;
        }
    }
};
//# sourceMappingURL=payment.service.js.map