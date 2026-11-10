import { orderRepository } from "./order.repository";
import { CheckoutInput } from "./order.schema";
import { ApiError } from "../../utils/api-error";
import prisma from "../../lib/prisma";
import { orders_status } from "@prisma/client";

export const orderService = {
  async checkout(userId: string, input: CheckoutInput) {
    // Validate categories exist and have enough quota
    const itemsToCreate = [];
    let totalAmount = 0;

    for (const item of input.items) {
      const cat = await prisma.ticket_categories.findUnique({
        where: { id: item.ticketCategoryId, deleted_at: null },
        include: { events: true },
      });

      if (!cat) throw ApiError.notFound(`Ticket category ${item.ticketCategoryId} not found`);
      if (cat.event_id !== input.eventId) throw ApiError.badRequest(`Ticket category ${cat.name} does not belong to selected event`);
      if (cat.events.status !== "PUBLISHED") {
        throw ApiError.badRequest(`Event for category ${cat.name} is not active`);
      }

      const now = new Date();
      if (now < cat.sale_start || now > cat.sale_end) {
        throw ApiError.badRequest(`Ticket category ${cat.name} is outside sale period`);
      }
      
      const available = cat.quota - cat.sold;
      if (available < item.quantity) {
        throw ApiError.badRequest(`Category ${cat.name} only has ${available} tickets left`);
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
      const order = await orderRepository.createOrder({
        userId,
        orderNumber,
        totalAmount,
        expiresAt,
        items: itemsToCreate,
      });
      return order;
    } catch (err: any) {
      throw ApiError.badRequest(err.message || "Checkout failed");
    }
  },

  async getById(id: string, userId: string, role: string) {
    const order = await orderRepository.findById(id);
    if (!order) throw ApiError.notFound("Order not found");
    if (role === "USER" && order.user_id !== userId) {
      throw ApiError.forbidden("Not your order");
    }
    return order;
  },

  async list(userId: string, role: string, page: number, limit: number) {
    if (role === "USER") {
      const [orders, total] = await orderRepository.listByUser(userId, page, limit);
      return { orders, total, page, limit, totalPages: Math.ceil(total / limit) };
    } else {
      const [orders, total] = await orderRepository.listAll(page, limit);
      return { orders, total, page, limit, totalPages: Math.ceil(total / limit) };
    }
  },

  async listMyOrders(userId: string, options: any) {
    const [orders, total] = await orderRepository.findOrdersByUser(userId, options);
    
    const formattedOrders = orders.map((o: any) => {
      const payment = o.payments[0] || null;
      
      let totalTicket = 0;
      const eventSummaryList: string[] = [];
      
      o.order_items.forEach((item: any) => {
        totalTicket += item.quantity;
        const eventTitle = item.ticket_categories?.events?.title;
        if (eventTitle && !eventSummaryList.includes(eventTitle)) {
          eventSummaryList.push(eventTitle);
        }
      });

      return {
        id: o.id,
        invoiceNumber: o.invoice_number,
        orderStatus: o.status,
        paymentStatus: payment?.status || "PENDING",
        paymentMethod: payment?.method || null,
        hasPaymentSession: Boolean(payment?.snap_token),
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

  async getOrderDetail(id: string, userId: string, role: string) {
    const order = await orderRepository.findOrderDetail(id);
    if (!order) throw ApiError.notFound("Order not found");

    if (role === "USER" && order.user_id !== userId) {
      throw ApiError.forbidden("Access denied: Not your order");
    }

    // Format complete information
    const items = order.order_items.map((item: any) => {
      const category = item.ticket_categories;
      const event = category?.events;
      const venue = event?.venues;
      const organizer = event?.organizers;
      const artists = event?.event_artists?.map((ea: any) => ({
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
        tickets: item.tickets.map((t: any) => ({
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

  async cancelOrder(id: string, userId: string, role: string) {
    const order = await this.getById(id, userId, role);
    if (order.status !== orders_status.PENDING) {
      throw ApiError.badRequest(`Cannot cancel order in status ${order.status}`);
    }
    await orderRepository.rollbackQuotas(id);
    return orderRepository.updateStatus(id, orders_status.CANCELLED);
  }
};
