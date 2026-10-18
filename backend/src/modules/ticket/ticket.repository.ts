import prisma from "../../lib/prisma";
import { tickets_status } from "@prisma/client";
import { v4 as uuidv4 } from "uuid";
import crypto from "crypto";
import QRCode from "qrcode";

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

export const ticketRepository: any = {
  findById(id: string) {
    return prisma.tickets.findUnique({
      where: { id, deleted_at: null },
      include: ticketInclude,
    });
  },

  findTicketDetail(id: string) {
    return prisma.tickets.findUnique({
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

  findByQrCode(qrCode: string) {
    return prisma.tickets.findUnique({
      where: { qr_code: qrCode, deleted_at: null },
      include: ticketInclude,
    });
  },

  listByUser(userId: string, page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    return Promise.all([
      prisma.tickets.findMany({
        where: { order_items: { orders: { user_id: userId } }, deleted_at: null },
        skip,
        take: limit,
        orderBy: { created_at: "desc" },
        include: ticketInclude,
      }),
      prisma.tickets.count({
        where: { order_items: { orders: { user_id: userId } }, deleted_at: null },
      }),
    ]);
  },

  findTicketsByUser(userId: string, page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    return Promise.all([
      prisma.tickets.findMany({
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
      prisma.tickets.count({
        where: { order_items: { orders: { user_id: userId } }, deleted_at: null },
      }),
    ]);
  },

  listByOrder(orderId: string, page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    return Promise.all([
      prisma.tickets.findMany({
        where: { order_items: { order_id: orderId }, deleted_at: null },
        skip,
        take: limit,
        orderBy: { created_at: "desc" },
        include: ticketInclude,
      }),
      prisma.tickets.count({
        where: { order_items: { order_id: orderId }, deleted_at: null },
      }),
    ]);
  },

  listByEvent(eventId: string, page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    return Promise.all([
      prisma.tickets.findMany({
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
      prisma.tickets.count({
        where: {
          order_items: {
            ticket_categories: { event_id: eventId }
          },
          deleted_at: null
        }
      })
    ]);
  },

  findByOrderItemId(orderItemId: string) {
    return prisma.tickets.findFirst({ where: { order_item_id: orderItemId, deleted_at: null } });
  },

  async createForOrder(orderId: string) {
    const order = await prisma.orders.findUnique({
      where: { id: orderId },
      include: { users: true, order_items: true },
    });
    if (!order) return [];

    const created = [];
    for (const item of order.order_items) {
      const existing = await prisma.tickets.findFirst({
        where: { order_item_id: item.id, deleted_at: null }
      });
      if (existing) continue;

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

        created.push(await prisma.tickets.create({
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
        }));
      }
    }
    return created;
  },

  markUsed(id: string, scannerUserId: string, location?: string) {
    return prisma.$transaction(async (tx) => {
      const current = await tx.tickets.findUnique({ where: { id } });
      if (!current || current.status !== tickets_status.ACTIVE) return null;

      const ticket = await tx.tickets.update({
        where: { id },
        data: { status: tickets_status.USED },
      });

      await tx.ticket_scans.create({
        data: {
          id: uuidv4(),
          ticket_id: id,
          scanner_user_id: scannerUserId,
          location: location || "Main Gate",
        }
      });

      return ticket;
    });
  }
};
