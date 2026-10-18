"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.orderRepository = void 0;
const prisma_1 = __importDefault(require("../../lib/prisma"));
const client_1 = require("@prisma/client");
const uuid_1 = require("uuid");
const orderInclude = {
    users: { select: { name: true, email: true, phone: true } },
    order_items: {
        include: {
            ticket_categories: {
                include: {
                    events: {
                        include: {
                            venues: true
                        }
                    }
                }
            },
            tickets: true
        }
    },
    payments: true,
};
exports.orderRepository = {
    findById(id) {
        return prisma_1.default.orders.findUnique({
            where: { id, deleted_at: null },
            include: orderInclude,
        });
    },
    findByOrderNumber(orderNumber) {
        if (!orderNumber)
            return null;
        return prisma_1.default.orders.findUnique({
            where: { invoice_number: orderNumber, deleted_at: null },
            include: orderInclude,
        });
    },
    listByUser(userId, page = 1, limit = 10) {
        const skip = (page - 1) * limit;
        return Promise.all([
            prisma_1.default.orders.findMany({
                where: { user_id: userId, deleted_at: null },
                skip,
                take: limit,
                orderBy: { created_at: "desc" },
                include: orderInclude,
            }),
            prisma_1.default.orders.count({
                where: { user_id: userId, deleted_at: null },
            }),
        ]);
    },
    findOrdersByUser(userId, options) {
        const page = options.page || 1;
        const limit = options.limit || 10;
        const skip = (page - 1) * limit;
        const orderBy = options.sortBy === "oldest" ? { created_at: "asc" } : { created_at: "desc" };
        const where = {
            user_id: userId,
            deleted_at: null,
        };
        if (options.status) {
            where.status = options.status;
        }
        if (options.search) {
            where.OR = [
                { invoice_number: { contains: options.search } },
                {
                    order_items: {
                        some: {
                            ticket_categories: {
                                events: {
                                    title: { contains: options.search },
                                },
                            },
                        },
                    },
                },
            ];
        }
        return Promise.all([
            prisma_1.default.orders.findMany({
                where,
                skip,
                take: limit,
                orderBy,
                include: {
                    payments: {
                        select: {
                            status: true,
                            method: true,
                        },
                    },
                    order_items: {
                        include: {
                            ticket_categories: {
                                include: {
                                    events: {
                                        select: {
                                            title: true,
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            }),
            prisma_1.default.orders.count({ where }),
        ]);
    },
    findOrderDetail(id) {
        return prisma_1.default.orders.findUnique({
            where: { id, deleted_at: null },
            include: {
                users: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        phone: true,
                    },
                },
                payments: true,
                order_items: {
                    include: {
                        tickets: true,
                        ticket_categories: {
                            include: {
                                events: {
                                    include: {
                                        venues: true,
                                        organizers: true,
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
    listAll(page = 1, limit = 10) {
        const skip = (page - 1) * limit;
        return Promise.all([
            prisma_1.default.orders.findMany({
                where: { deleted_at: null },
                skip,
                take: limit,
                orderBy: { created_at: "desc" },
                include: orderInclude,
            }),
            prisma_1.default.orders.count({
                where: { deleted_at: null },
            }),
        ]);
    },
    createOrder(data) {
        return prisma_1.default.$transaction(async (tx) => {
            // 1. Create order
            const orderId = (0, uuid_1.v4)();
            await tx.orders.create({
                data: {
                    id: orderId,
                    user_id: data.userId,
                    invoice_number: data.orderNumber,
                    total_amount: data.totalAmount,
                    expires_at: data.expiresAt,
                    status: client_1.orders_status.PENDING,
                },
            });
            await tx.order_items.createMany({
                data: data.items.map(item => ({
                    id: (0, uuid_1.v4)(),
                    order_id: orderId,
                    ticket_category_id: item.ticketCategoryId,
                    quantity: item.quantity,
                    unit_price: item.unitPrice,
                    subtotal: item.subtotal,
                })),
            });
            // 2. Decrement quota and increment sold
            for (const item of data.items) {
                const cat = await tx.ticket_categories.findUnique({ where: { id: item.ticketCategoryId } });
                if (!cat || cat.deleted_at)
                    throw new Error("Ticket category not found");
                if (cat.quota - cat.sold < item.quantity) {
                    throw new Error(`Insufficient quota for category ${cat.name}`);
                }
                await tx.ticket_categories.update({
                    where: { id: item.ticketCategoryId },
                    data: {
                        sold: { increment: item.quantity }
                    }
                });
            }
            return tx.orders.findUnique({
                where: { id: orderId },
                include: orderInclude,
            });
        });
    },
    updateStatus(id, status) {
        return prisma_1.default.orders.update({
            where: { id },
            data: { status },
            include: orderInclude,
        });
    },
    // Rollback quotas on order cancellation/expiration
    rollbackQuotas(orderId) {
        return prisma_1.default.$transaction(async (tx) => {
            const order = await tx.orders.findUnique({
                where: { id: orderId },
                include: { order_items: true },
            });
            if (!order)
                return;
            for (const item of order.order_items) {
                await tx.ticket_categories.update({
                    where: { id: item.ticket_category_id },
                    data: {
                        sold: { decrement: item.quantity }
                    }
                });
            }
        });
    }
};
//# sourceMappingURL=order.repository.js.map