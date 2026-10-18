"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ticketRepository = void 0;
const prisma_1 = __importDefault(require("../../lib/prisma"));
const client_1 = require("@prisma/client");
const uuid_1 = require("uuid");
const crypto_1 = __importDefault(require("crypto"));
const qrcode_1 = __importDefault(require("qrcode"));
const ticketInclude = {
    order_items: {
        include: {
            orders: {
                include: {
                    users: { select: { name: true, email: true, phone: true } }
                }
            },
            ticket_categories: {
                include: {
                    events: {
                        include: {
                            venues: true,
                            organizers: true
                        }
                    }
                }
            }
        }
    },
    ticket_scans: true,
};
exports.ticketRepository = {
    findById(id) {
        return prisma_1.default.tickets.findUnique({
            where: { id, deleted_at: null },
            include: ticketInclude,
        });
    },
    findTicketDetail(id) {
        return prisma_1.default.tickets.findUnique({
            where: { id, deleted_at: null },
            include: {
                order_items: {
                    include: {
                        orders: {
                            select: {
                                invoice_number: true,
                                created_at: true,
                                user_id: true,
                            },
                        },
                        ticket_categories: {
                            include: {
                                events: {
                                    include: {
                                        venues: true,
                                        event_artists: {
                                            include: {
                                                artists: true,
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
        });
    },
    findByQrCode(qrCode) {
        return prisma_1.default.tickets.findUnique({
            where: { qr_code: qrCode, deleted_at: null },
            include: ticketInclude,
        });
    },
    listByUser(userId, page = 1, limit = 10) {
        const skip = (page - 1) * limit;
        return Promise.all([
            prisma_1.default.tickets.findMany({
                where: { order_items: { orders: { user_id: userId } }, deleted_at: null },
                skip,
                take: limit,
                orderBy: { created_at: "desc" },
                include: ticketInclude,
            }),
            prisma_1.default.tickets.count({
                where: { order_items: { orders: { user_id: userId } }, deleted_at: null },
            }),
        ]);
    },
    findTicketsByUser(userId, page = 1, limit = 10) {
        const skip = (page - 1) * limit;
        return Promise.all([
            prisma_1.default.tickets.findMany({
                where: { order_items: { orders: { user_id: userId } }, deleted_at: null },
                skip,
                take: limit,
                orderBy: { created_at: "desc" },
                include: {
                    order_items: {
                        include: {
                            orders: {
                                select: {
                                    invoice_number: true,
                                    created_at: true,
                                },
                            },
                            ticket_categories: {
                                include: {
                                    events: {
                                        include: {
                                            venues: true,
                                            event_artists: {
                                                include: {
                                                    artists: true,
                                                },
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            }),
            prisma_1.default.tickets.count({
                where: { order_items: { orders: { user_id: userId } }, deleted_at: null },
            }),
        ]);
    },
    listByOrder(orderId, page = 1, limit = 10) {
        const skip = (page - 1) * limit;
        return Promise.all([
            prisma_1.default.tickets.findMany({
                where: { order_items: { order_id: orderId }, deleted_at: null },
                skip,
                take: limit,
                orderBy: { created_at: "desc" },
                include: ticketInclude,
            }),
            prisma_1.default.tickets.count({
                where: { order_items: { order_id: orderId }, deleted_at: null },
            }),
        ]);
    },
    listByEvent(eventId, page = 1, limit = 10) {
        const skip = (page - 1) * limit;
        return Promise.all([
            prisma_1.default.tickets.findMany({
                where: {
                    order_items: {
                        ticket_categories: { event_id: eventId }
                    },
                    deleted_at: null
                },
                skip,
                take: limit,
                include: ticketInclude,
            }),
            prisma_1.default.tickets.count({
                where: {
                    order_items: {
                        ticket_categories: { event_id: eventId }
                    },
                    deleted_at: null
                }
            })
        ]);
    },
    findByOrderItemId(orderItemId) {
        return prisma_1.default.tickets.findFirst({ where: { order_item_id: orderItemId, deleted_at: null } });
    },
    async createForOrder(orderId) {
        const order = await prisma_1.default.orders.findUnique({
            where: { id: orderId },
            include: { users: true, order_items: true },
        });
        if (!order)
            return [];
        const created = [];
        for (const item of order.order_items) {
            const existing = await prisma_1.default.tickets.findFirst({
                where: { order_item_id: item.id, deleted_at: null }
            });
            if (existing)
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
                created.push(await prisma_1.default.tickets.create({
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
                }));
            }
        }
        return created;
    },
    markUsed(id, scannerUserId, location) {
        return prisma_1.default.$transaction(async (tx) => {
            const current = await tx.tickets.findUnique({ where: { id } });
            if (!current || current.status !== client_1.tickets_status.ACTIVE)
                return null;
            const ticket = await tx.tickets.update({
                where: { id },
                data: { status: client_1.tickets_status.USED },
            });
            await tx.ticket_scans.create({
                data: {
                    id: (0, uuid_1.v4)(),
                    ticket_id: id,
                    scanner_user_id: scannerUserId,
                    location: location || "Main Gate",
                }
            });
            return ticket;
        });
    }
};
//# sourceMappingURL=ticket.repository.js.map