import prisma from "../../lib/prisma";
import { CreateTicketCategoryInput, UpdateTicketCategoryInput } from "./ticket-category.schema";
import { v4 as uuidv4 } from "uuid";

export const ticketCategoryRepository: any = {
  findByEvent(eventId: string) {
    return prisma.ticket_categories.findMany({
      where: { event_id: eventId, deleted_at: null },
      orderBy: { price: "asc" },
    });
  },

  findById(id: string) {
    return prisma.ticket_categories.findFirst({ where: { id, deleted_at: null } });
  },

  create(eventId: string, data: CreateTicketCategoryInput) {
    return prisma.ticket_categories.create({
      data: {
        id: uuidv4(),
        event_id: eventId,
        name: data.name,
        price: data.price,
        quota: data.quota,
        sale_start: new Date(), // ponytail: default sale dates if not supplied, fallback to event start/end later
        sale_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      },
    });
  },

  update(id: string, data: UpdateTicketCategoryInput) {
    return prisma.ticket_categories.update({
      where: { id },
      data: {
        name: data.name,
        price: data.price,
        quota: data.quota,
      },
    });
  },

  softDelete(id: string) {
    return prisma.ticket_categories.update({ where: { id }, data: { deleted_at: new Date() } });
  },
};
