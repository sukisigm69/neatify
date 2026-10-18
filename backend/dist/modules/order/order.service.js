"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.orderService = void 0;
const order_repository_1 = require("./order.repository");
const api_error_1 = require("../../utils/api-error");
const prisma_1 = __importDefault(require("../../lib/prisma"));
const client_1 = require("@prisma/client");
exports.orderService = {
    async checkout(userId, input) {
        // Validate categories exist and have enough quota
        const itemsToCreate = [];
        let totalAmount = 0;
        for (const item of input.items) {
            const cat = await prisma_1.default.ticket_categories.findUnique({
                where: { id: item.ticketCategoryId, deleted_at: null },
                include: { events: true },
            });
            if (!cat)
                throw api_error_1.ApiError.notFound(`Ticket category ${item.ticketCategoryId} not found`);
            if (cat.event_id !== input.eventId)
                throw api_error_1.ApiError.badRequest(`Ticket category ${cat.name} does not belong to selected event`);
            if (cat.events.status !== "PUBLISHED") {
                throw api_error_1.ApiError.badRequest(`Event for category ${cat.name} is not active`);
            }
            const now = new Date();
            if (now < cat.sale_start || now > cat.sale_end) {
                throw api_error_1.ApiError.badRequest(`Ticket category ${cat.name} is outside sale period`);
            }
            const available = cat.quota - cat.sold;
            if (available < item.quantity) {
                throw api_error_1.ApiError.badRequest(`Category ${cat.name} only has ${available} tickets left`);
            }
            const price = Number(cat.price);
            const subtotal = price * item.quantity;
            totalAmount += subtotal;
            itemsToCreate.push({
                ticketCategoryId: item.ticketCategoryId,
                quantity: item.quantity,
                unitPrice: price,
                subtotal: subtotal,
            });
        }
        // Generate unique order number (e.g. KNS-YYYYMMDD-123456)
        const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, "");
        const rand = Math.floor(100000 + Math.random() * 900000);
        const orderNumber = `KNS-${dateStr}-${rand}`;
        // Expires in 15 minutes
        const expiresAt = new Date(Date.now() + 15 * 60 * 1000);
        try {
            const order = await order_repository_1.orderRepository.createOrder({
                userId,
                orderNumber,
                totalAmount,
                expiresAt,
                items: itemsToCreate,
            });
            return order;
        }
        catch (err) {
            throw api_error_1.ApiError.badRequest(err.message || "Checkout failed");
        }
    },
    async getById(id, userId, role) {
        const order = await order_repository_1.orderRepository.findById(id);
        if (!order)
            throw api_error_1.ApiError.notFound("Order not found");
        if (role === "USER" && order.user_id !== userId) {
            throw api_error_1.ApiError.forbidden("Not your order");
        }
        return order;
    },
    async list(userId, role, page, limit) {
        if (role === "USER") {
            const [orders, total] = await order_repository_1.orderRepository.listByUser(userId, page, limit);
            return { orders, total, page, limit, totalPages: Math.ceil(total / limit) };
        }
        else {
            const [orders, total] = await order_repository_1.orderRepository.listAll(page, limit);
            return { orders, total, page, limit, totalPages: Math.ceil(total / limit) };
        }
    },
    async listMyOrders(userId, options) {
        const [orders, total] = await order_repository_1.orderRepository.findOrdersByUser(userId, options);
        const formattedOrders = orders.map((o) => {
            const payment = o.payments[0] || null;
            let totalTicket = 0;
            const eventSummaryList = [];
            o.order_items.forEach((item) => {
                totalTicket += item.quantity;
                const eventTitle = item.ticket_categories?.events?.title;
                if (eventTitle && !eventSummaryList.includes(eventTitle)) {
                    eventSummaryList.push(eventTitle);
                }
            });
            return {
                invoiceNumber: o.invoice_number,
                orderStatus: o.status,
                paymentStatus: payment?.status || "PENDING",
                paymentMethod: payment?.method || null,
                purchaseDate: o.created_at,
                grandTotal: Number(o.total_amount),
                totalTicket,
                eventSummary: eventSummaryList.join(", "),
            };
        });
        return {
            orders: formattedOrders,
            total,
            page: options.page || 1,
            limit: options.limit || 10,
            totalPages: Math.ceil(total / (options.limit || 10)),
        };
    },
    async getOrderDetail(id, userId, role) {
        const order = await order_repository_1.orderRepository.findOrderDetail(id);
        if (!order)
            throw api_error_1.ApiError.notFound("Order not found");
        if (role === "USER" && order.user_id !== userId) {
            throw api_error_1.ApiError.forbidden("Access denied: Not your order");
        }
        // Format complete information
        const items = order.order_items.map((item) => {
            const category = item.ticket_categories;
            const event = category?.events;
            const venue = event?.venues;
            const organizer = event?.organizers;
            const artists = event?.event_artists?.map((ea) => ({
                id: ea.artists.id,
                name: ea.artists.name,
                genre: ea.artists.genre,
                bio: ea.artists.bio,
                image: ea.artists.image,
            })) || [];
            return {
                id: item.id,
                quantity: item.quantity,
                unitPrice: Number(item.unit_price),
                subtotal: Number(item.subtotal),
                ticketCategory: {
                    id: category?.id,
                    name: category?.name,
                    price: Number(category?.price),
                },
                event: event ? {
                    id: event.id,
                    title: event.title,
                    description: event.description,
                    banner: event.banner,
                    startDate: event.start_date,
                    endDate: event.end_date,
                    venue: venue ? {
                        id: venue.id,
                        name: venue.name,
                        address: venue.address,
                        city: venue.city,
                        province: venue.province,
                    } : null,
                    organizer: organizer ? {
                        id: organizer.id,
                        orgName: organizer.org_name,
                        logo: organizer.logo,
                    } : null,
                    artists,
                } : null,
                tickets: item.tickets.map((t) => ({
                    id: t.id,
                    qrCode: t.qr_code,
                    qrImage: t.qr_image,
                    attendeeName: t.attendee_name,
                    attendeeEmail: t.attendee_email,
                    attendeePhone: t.attendee_phone,
                    status: t.status,
                })),
            };
        });
        return {
            order: {
                id: order.id,
                invoiceNumber: order.invoice_number,
                totalAmount: Number(order.total_amount),
                status: order.status,
                expiresAt: order.expires_at,
                createdAt: order.created_at,
                updatedAt: order.updated_at,
            },
            payment: order.payments[0] || null,
            orderItems: items,
        };
    },
    async cancelOrder(id, userId, role) {
        const order = await this.getById(id, userId, role);
        if (order.status !== client_1.orders_status.PENDING) {
            throw api_error_1.ApiError.badRequest(`Cannot cancel order in status ${order.status}`);
        }
        await order_repository_1.orderRepository.rollbackQuotas(id);
        return order_repository_1.orderRepository.updateStatus(id, client_1.orders_status.CANCELLED);
    }
};
//# sourceMappingURL=order.service.js.map