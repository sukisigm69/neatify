import { eventRepository } from "./event.repository";
import { CreateEventInput, UpdateEventInput } from "./event.schema";
import { ApiError } from "../../utils/api-error";
import { events_status, Prisma } from "@prisma/client";
import prisma from "../../lib/prisma";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

async function generateUniqueSlug(title: string): Promise<string> {
  const base = slugify(title);
  const existing = await eventRepository.findBySlug(base);
  if (!existing) return base;
  return `${base}-${Date.now().toString(36)}`;
}

async function getOrganizerId(userId: string): Promise<string> {
  const org = await prisma.organizers.findFirst({ where: { user_id: userId, deleted_at: null } });
  if (!org) throw ApiError.forbidden("Not an approved organizer");
  return org.id;
}

export const eventService = {
  // Public: browse published events
  async listPublic(page: number, limit: number, search?: string) {
    const where: any = { deleted_at: null, status: "PUBLISHED" as events_status };
    if (search) {
      where.OR = [
        { title: { contains: search } },
        { description: { contains: search } },
      ];
    }
    const [events, total] = await eventRepository.findAll(where, page, limit);
    return { events, total, page, limit, totalPages: Math.ceil(total / limit) };
  },

  // Public: get by slug
  async getBySlug(slug: string) {
    const event = await eventRepository.findBySlug(slug);
    if (!event || event.status !== "PUBLISHED") throw ApiError.notFound("Event not found");
    return event;
  },

  // Organizer: list own events
  async listByOrganizer(userId: string, page: number, limit: number) {
    const organizerId = await getOrganizerId(userId);
    const where = { deleted_at: null, organizer_id: organizerId };
    const [events, total] = await eventRepository.findAll(where, page, limit);
    return { events, total, page, limit, totalPages: Math.ceil(total / limit) };
  },

  // Organizer: create
  async create(userId: string, data: CreateEventInput) {
    try {
      const organizerId = await getOrganizerId(userId);
      const slug = await generateUniqueSlug(data.title);
      const { artistIds, ticketCategories, ...eventData } = data;

      const event = await eventRepository.create({
        ...eventData,
        organizerId,
        slug,
        startDate: new Date(data.startDate),
        endDate: new Date(data.endDate),
      });

      if (artistIds?.length) {
        await eventRepository.setArtists(event.id, artistIds);
      }

      if (ticketCategories?.length) {
        await eventRepository.createTicketCategories(event.id, ticketCategories);
      }

      return eventRepository.findById(event.id);
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError) {
        if (err.code === "P2003") throw ApiError.badRequest("Venue atau artis tidak valid.");
        if (err.code === "P2002") throw ApiError.conflict("Slug event sudah digunakan.");
      }
      throw err;
    }
  },

  // Organizer: update own event
  async update(userId: string, id: string, data: UpdateEventInput) {
    const organizerId = await getOrganizerId(userId);
    const event = await eventRepository.findById(id);
    if (!event) throw ApiError.notFound("Event not found");
    if (event.organizer_id !== organizerId) throw ApiError.forbidden("Not your event");

    const { artistIds, startDate, endDate, ...rest } = data;
    const updateData: any = { ...rest };
    if (startDate) updateData.startDate = new Date(startDate);
    if (endDate) updateData.endDate = new Date(endDate);

    await eventRepository.update(id, updateData);
    if (artistIds) await eventRepository.setArtists(id, artistIds);

    return eventRepository.findById(id);
  },

  // Organizer: submit for approval
  async submit(userId: string, id: string) {
    const organizerId = await getOrganizerId(userId);
    const event = await eventRepository.findById(id);
    if (!event) throw ApiError.notFound("Event not found");
    if (event.organizer_id !== organizerId) throw ApiError.forbidden("Not your event");
    if (event.status !== "DRAFT") throw ApiError.badRequest("Only draft events can be submitted");
    return eventRepository.updateStatus(id, "PENDING_APPROVAL");
  },

  async uploadBanner(userId: string, id: string, banner: string) {
    const organizerId = await getOrganizerId(userId);
    const event = await eventRepository.findById(id);
    if (!event) throw ApiError.notFound("Event not found");
    if (event.organizer_id !== organizerId) throw ApiError.forbidden("Not your event");
    return eventRepository.updateBanner(id, banner);
  },

  async uploadGallery(userId: string, id: string, images: string[]) {
    const organizerId = await getOrganizerId(userId);
    const event = await eventRepository.findById(id);
    if (!event) throw ApiError.notFound("Event not found");
    if (event.organizer_id !== organizerId) throw ApiError.forbidden("Not your event");
    await eventRepository.replaceGallery(id, images);
    return eventRepository.findById(id);
  },

  async assignVenue(userId: string, id: string, venueId: string) {
    const organizerId = await getOrganizerId(userId);
    const event = await eventRepository.findById(id);
    if (!event) throw ApiError.notFound("Event not found");
    if (event.organizer_id !== organizerId) throw ApiError.forbidden("Not your event");
    return eventRepository.update(id, { venueId });
  },

  async assignArtists(userId: string, id: string, artistIds: string[]) {
    const organizerId = await getOrganizerId(userId);
    const event = await eventRepository.findById(id);
    if (!event) throw ApiError.notFound("Event not found");
    if (event.organizer_id !== organizerId) throw ApiError.forbidden("Not your event");
    await eventRepository.setArtists(id, artistIds);
    return eventRepository.findById(id);
  },

  async createTicketCategories(userId: string, id: string, categories: any[]) {
    const organizerId = await getOrganizerId(userId);
    const event = await eventRepository.findById(id);
    if (!event) throw ApiError.notFound("Event not found");
    if (event.organizer_id !== organizerId) throw ApiError.forbidden("Not your event");
    await eventRepository.createTicketCategories(id, categories);
    return eventRepository.findById(id);
  },

  async approve(id: string) {
    const event = await eventRepository.findById(id);
    if (!event) throw ApiError.notFound("Event not found");
    return eventRepository.updateStatus(id, "PUBLISHED");
  },

  async reject(id: string) {
    const event = await eventRepository.findById(id);
    if (!event) throw ApiError.notFound("Event not found");
    return eventRepository.updateStatus(id, "CANCELLED");
  },

  // Admin: approve/reject
  async updateStatus(id: string, status: events_status) {
    const event = await eventRepository.findById(id);
    if (!event) throw ApiError.notFound("Event not found");
    return eventRepository.updateStatus(id, status);
  },

  // Admin: list all events (any status)
  async listAll(page: number, limit: number, status?: events_status) {
    const where: any = { deleted_at: null };
    if (status) where.status = status;
    const [events, total] = await eventRepository.findAll(where, page, limit);
    return { events, total, page, limit, totalPages: Math.ceil(total / limit) };
  },

  // Organizer: delete own event
  async remove(userId: string, id: string) {
    const organizerId = await getOrganizerId(userId);
    const event = await eventRepository.findById(id);
    if (!event) throw ApiError.notFound("Event not found");
    if (event.organizer_id !== organizerId) throw ApiError.forbidden("Not your event");
    return eventRepository.softDelete(id);
  },
};
