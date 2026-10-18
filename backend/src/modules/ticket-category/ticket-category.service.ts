import { ticketCategoryRepository } from "./ticket-category.repository";
import { CreateTicketCategoryInput, UpdateTicketCategoryInput } from "./ticket-category.schema";
import { ApiError } from "../../utils/api-error";
import prisma from "../../lib/prisma";

async function verifyEventOwnership(eventId: string, userId: string) {
  const event = await prisma.events.findUnique({
    where: { id: eventId, deleted_at: null },
    include: { organizers: true },
  });
  if (!event) throw ApiError.notFound("Event not found");
  if (event.organizers.user_id !== userId) throw ApiError.forbidden("Not your event");
  return event;
}

export const ticketCategoryService = {
  async listByEvent(eventId: string) {
    return ticketCategoryRepository.findByEvent(eventId);
  },

  async create(eventId: string, userId: string, data: CreateTicketCategoryInput) {
    await verifyEventOwnership(eventId, userId);
    return ticketCategoryRepository.create(eventId, data);
  },

  async update(id: string, userId: string, data: UpdateTicketCategoryInput) {
    const cat = await ticketCategoryRepository.findById(id);
    if (!cat) throw ApiError.notFound("Ticket category not found");
    await verifyEventOwnership(cat.event_id, userId);
    return ticketCategoryRepository.update(id, data);
  },

  async remove(id: string, userId: string) {
    const cat = await ticketCategoryRepository.findById(id);
    if (!cat) throw ApiError.notFound("Ticket category not found");
    await verifyEventOwnership(cat.event_id, userId);
    return ticketCategoryRepository.softDelete(id);
  },
};
