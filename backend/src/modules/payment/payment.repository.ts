import prisma from "../../lib/prisma";
import { payments_status, orders_status, tickets_status } from "@prisma/client";
import { v4 as uuidv4 } from "uuid";
import crypto from "crypto";
import QRCode from "qrcode";

export const paymentRepository: any = {
  findByOrderId(orderId: string) {
    return prisma.payments.findFirst({ where: { order_id: orderId } });
  },

  findByMidtransId(midtransId: string) {
    return prisma.payments.findUnique({ where: { midtrans_id: midtransId } });
  },

  createPayment(data: {
    orderId: string;
    amount: number;
    snapToken?: string;
    snapUrl?: string;
  }) {
    return prisma.payments.create({
      data: {
        id: uuidv4(),
        order_id: data.orderId,
        amount: data.amount,
        snap_token: data.snapToken,
        snap_url: data.snapUrl,
        status: payments_status.PENDING,
      }
    });
  },

  updatePaymentSuccess(id: string, data: {
    method: string;
    paidAt: Date;
    rawResponse: any;
    midtransId: string;
    transactionStatus?: string;
    fraudStatus?: string;
  }) {
    return prisma.$transaction(async (tx) => {
      const payment = await tx.payments.update({
        where: { id },
        data: {
          status: payments_status.PAID,
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
        data: { status: orders_status.CONFIRMED },
        include: { users: true, order_items: { include: { tickets: true } } },
      });

      for (const item of order.order_items) {
        if (item.tickets.length > 0) continue;
        for (let i = 0; i < item.quantity; i++) {
          const ticketId = uuidv4();
          const secureRandomString = crypto.randomBytes(32).toString("hex");
          const qrCodeString = `${ticketId}:${secureRandomString}`;
          
          let qrImageBase64 = "";
          try {
            qrImageBase64 = await QRCode.toDataURL(qrCodeString);
          } catch (qrErr) {
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
              status: tickets_status.ACTIVE,
            },
          });
        }
      }

      return payment;
    });
  },

  updatePaymentFailed(id: string, status: payments_status, rawResponse: any) {
    return prisma.$transaction(async (tx) => {
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
      const orderStatus = status === payments_status.EXPIRED ? orders_status.EXPIRED : orders_status.CANCELLED;
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
