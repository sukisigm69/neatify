"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.paymentRepository = void 0;
const prisma_1 = __importDefault(require("../../lib/prisma"));
const client_1 = require("@prisma/client");
const uuid_1 = require("uuid");
const crypto_1 = __importDefault(require("crypto"));
const qrcode_1 = __importDefault(require("qrcode"));
exports.paymentRepository = {
    findByOrderId(orderId) {
        return prisma_1.default.payments.findFirst({ where: { order_id: orderId } });
    },
    findByMidtransId(midtransId) {
        return prisma_1.default.payments.findUnique({ where: { midtrans_id: midtransId } });
    },
    createPayment(data) {
        return prisma_1.default.payments.create({
            data: {
                id: (0, uuid_1.v4)(),
                order_id: data.orderId,
                amount: data.amount,
                snap_token: data.snapToken,
                snap_url: data.snapUrl,
                status: client_1.payments_status.PENDING,
            }
        });
    },
    updatePaymentSuccess(id, data) {
        return prisma_1.default.$transaction(async (tx) => {
            const payment = await tx.payments.update({
                where: { id },
                data: {
                    status: client_1.payments_status.PAID,
                    method: data.method,
                    payment_type: data.method,
                    paid_at: data.paidAt,
                    raw_response: JSON.stringify(data.rawResponse),
                    midtrans_id: data.midtransId,
                    transaction_id: data.midtransId,
                    transaction_status: data.transactionStatus,
                    fraud_status: data.fraudStatus,
                },
            });
            const order = await tx.orders.update({
                where: { id: payment.order_id },
                data: { status: client_1.orders_status.CONFIRMED },
                include: { users: true, order_items: { include: { tickets: true } } },
            });
            for (const item of order.order_items) {
                if (item.tickets.length > 0)
                    continue;
                for (let i = 0; i < item.quantity; i++) {
                    const ticketId = (0, uuid_1.v4)();
                    const secureRandomString = crypto_1.default.randomBytes(32).toString("hex");
                    const qrCodeString = `${ticketId}:${secureRandomString}`;
                    let qrImageBase64 = "";
                    try {
                        qrImageBase64 = await qrcode_1.default.toDataURL(qrCodeString);
                    }
                    catch (qrErr) {
                        console.error("Failed to generate QR Code image:", qrErr);
                    }
                    await tx.tickets.create({
                        data: {
                            id: ticketId,
                            order_item_id: item.id,
                            qr_code: qrCodeString,
                            qr_image: qrImageBase64,
                            attendee_name: order.users.name,
                            attendee_email: order.users.email,
                            attendee_phone: order.users.phone || "-",
                            status: client_1.tickets_status.ACTIVE,
                        },
                    });
                }
            }
            return payment;
        });
    },
    updatePaymentFailed(id, status, rawResponse) {
        return prisma_1.default.$transaction(async (tx) => {
            const payment = await tx.payments.update({
                where: { id },
                data: {
                    status,
                    raw_response: JSON.stringify(rawResponse),
                    transaction_status: rawResponse.transaction_status,
                    fraud_status: rawResponse.fraud_status,
                    transaction_id: rawResponse.transaction_id,
                    midtrans_id: rawResponse.transaction_id,
                    payment_type: rawResponse.payment_type,
                    method: rawResponse.payment_type,
                }
            });
            // Update order to cancelled/expired
            const orderStatus = status === client_1.payments_status.EXPIRED ? client_1.orders_status.EXPIRED : client_1.orders_status.CANCELLED;
            await tx.orders.update({
                where: { id: payment.order_id },
                data: { status: orderStatus }
            });
            // Rollback ticket category quotas
            const order = await tx.orders.findUnique({
                where: { id: payment.order_id },
                include: { order_items: true },
            });
            if (order) {
                for (const item of order.order_items) {
                    await tx.ticket_categories.update({
                        where: { id: item.ticket_category_id },
                        data: { sold: { decrement: item.quantity } }
                    });
                }
            }
            return payment;
        });
    }
};
//# sourceMappingURL=payment.repository.js.map