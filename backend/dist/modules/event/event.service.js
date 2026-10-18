"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.eventService = void 0;
const event_repository_1 = require("./event.repository");
const api_error_1 = require("../../utils/api-error");
const prisma_1 = __importDefault(require("../../lib/prisma"));
function slugify(text) {
    return text
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");
}
async function generateUniqueSlug(title) {
    const base = slugify(title);
    const existing = await event_repository_1.eventRepository.findBySlug(base);
    if (!existing)
        return base;
    return `${base}-${Date.now().toString(36)}`;
}
async function getOrganizerId(userId) {
    const org = await prisma_1.default.organizers.findFirst({ where: { user_id: userId, deleted_at: null } });
    if (!org)
        throw api_error_1.ApiError.forbidden("Not an approved organizer");
    return org.id;
}
exports.eventService = {
    // Public: browse published events
    async listPublic(page, limit, search) {
        const where = { deleted_at: null, status: "PUBLISHED" };
        if (search) {
            where.OR = [
                { title: { contains: search } },
                { description: { contains: search } },
            ];
        }
        const [events, total] = await event_repository_1.eventRepository.findAll(where, page, limit);
        return { events, total, page, limit, totalPages: Math.ceil(total / limit) };
    },
    // Public: get by slug
    async getBySlug(slug) {
        const event = await event_repository_1.eventRepository.findBySlug(slug);
        if (!event || event.status !== "PUBLISHED")
            throw api_error_1.ApiError.notFound("Event not found");
        return event;
    },
    // Organizer: list own events
    async listByOrganizer(userId, page, limit) {
        const organizerId = await getOrganizerId(userId);
        const where = { deleted_at: null, organizer_id: organizerId };
        const [events, total] = await event_repository_1.eventRepository.findAll(where, page, limit);
        return { events, total, page, limit, totalPages: Math.ceil(total / limit) };
    },
    // Organizer: create
    async create(userId, data) {
        const organizerId = await getOrganizerId(userId);
        const slug = await generateUniqueSlug(data.title);
        const { artistIds, ticketCategories, ...eventData } = data;
        const event = await event_repository_1.eventRepository.create({
            ...eventData,
            organizerId,
            slug,
            startDate: new Date(data.startDate),
            endDate: new Date(data.endDate),
        });
        if (artistIds?.length) {
            await event_repository_1.eventRepository.setArtists(event.id, artistIds);
        }
        if (ticketCategories?.length) {
            await event_repository_1.eventRepository.createTicketCategories(event.id, ticketCategories);
        }
        return event_repository_1.eventRepository.findById(event.id);
    },
    // Organizer: update own event
    async update(userId, id, data) {
        const organizerId = await getOrganizerId(userId);
        const event = await event_repository_1.eventRepository.findById(id);
        if (!event)
            throw api_error_1.ApiError.notFound("Event not found");
        if (event.organizer_id !== organizerId)
            throw api_error_1.ApiError.forbidden("Not your event");
        const { artistIds, startDate, endDate, ...rest } = data;
        const updateData = { ...rest };
        if (startDate)
            updateData.startDate = new Date(startDate);
        if (endDate)
            updateData.endDate = new Date(endDate);
        await event_repository_1.eventRepository.update(id, updateData);
        if (artistIds)
            await event_repository_1.eventRepository.setArtists(id, artistIds);
        return event_repository_1.eventRepository.findById(id);
    },
    // Organizer: submit for approval
    async submit(userId, id) {
        const organizerId = await getOrganizerId(userId);
        const event = await event_repository_1.eventRepository.findById(id);
        if (!event)
            throw api_error_1.ApiError.notFound("Event not found");
        if (event.organizer_id !== organizerId)
            throw api_error_1.ApiError.forbidden("Not your event");
        if (event.status !== "DRAFT")
            throw api_error_1.ApiError.badRequest("Only draft events can be submitted");
        return event_repository_1.eventRepository.updateStatus(id, "PENDING_APPROVAL");
    },
    async uploadBanner(userId, id, banner) {
        const organizerId = await getOrganizerId(userId);
        const event = await event_repository_1.eventRepository.findById(id);
        if (!event)
            throw api_error_1.ApiError.notFound("Event not found");
        if (event.organizer_id !== organizerId)
            throw api_error_1.ApiError.forbidden("Not your event");
        return event_repository_1.eventRepository.updateBanner(id, banner);
    },
    async uploadGallery(userId, id, images) {
        const organizerId = await getOrganizerId(userId);
        const event = await event_repository_1.eventRepository.findById(id);
        if (!event)
            throw api_error_1.ApiError.notFound("Event not found");
        if (event.organizer_id !== organizerId)
            throw api_error_1.ApiError.forbidden("Not your event");
        await event_repository_1.eventRepository.replaceGallery(id, images);
        return event_repository_1.eventRepository.findById(id);
    },
    async assignVenue(userId, id, venueId) {
        const organizerId = await getOrganizerId(userId);
        const event = await event_repository_1.eventRepository.findById(id);
        if (!event)
            throw api_error_1.ApiError.notFound("Event not found");
        if (event.organizer_id !== organizerId)
            throw api_error_1.ApiError.forbidden("Not your event");
        return event_repository_1.eventRepository.update(id, { venueId });
    },
    async assignArtists(userId, id, artistIds) {
        const organizerId = await getOrganizerId(userId);
        const event = await event_repository_1.eventRepository.findById(id);
        if (!event)
            throw api_error_1.ApiError.notFound("Event not found");
        if (event.organizer_id !== organizerId)
            throw api_error_1.ApiError.forbidden("Not your event");
        await event_repository_1.eventRepository.setArtists(id, artistIds);
        return event_repository_1.eventRepository.findById(id);
    },
    async createTicketCategories(userId, id, categories) {
        const organizerId = await getOrganizerId(userId);
        const event = await event_repository_1.eventRepository.findById(id);
        if (!event)
            throw api_error_1.ApiError.notFound("Event not found");
        if (event.organizer_id !== organizerId)
            throw api_error_1.ApiError.forbidden("Not your event");
        await event_repository_1.eventRepository.createTicketCategories(id, categories);
        return event_repository_1.eventRepository.findById(id);
    },
    async approve(id) {
        const event = await event_repository_1.eventRepository.findById(id);
        if (!event)
            throw api_error_1.ApiError.notFound("Event not found");
        return event_repository_1.eventRepository.updateStatus(id, "PUBLISHED");
    },
    async reject(id) {
        const event = await event_repository_1.eventRepository.findById(id);
        if (!event)
            throw api_error_1.ApiError.notFound("Event not found");
        return event_repository_1.eventRepository.updateStatus(id, "CANCELLED");
    },
    // Admin: approve/reject
    async updateStatus(id, status) {
        const event = await event_repository_1.eventRepository.findById(id);
        if (!event)
            throw api_error_1.ApiError.notFound("Event not found");
        return event_repository_1.eventRepository.updateStatus(id, status);
    },
    // Admin: list all events (any status)
    async listAll(page, limit, status) {
        const where = { deleted_at: null };
        if (status)
            where.status = status;
        const [events, total] = await event_repository_1.eventRepository.findAll(where, page, limit);
        return { events, total, page, limit, totalPages: Math.ceil(total / limit) };
    },
    // Organizer: delete own event
    async remove(userId, id) {
        const organizerId = await getOrganizerId(userId);
        const event = await event_repository_1.eventRepository.findById(id);
        if (!event)
            throw api_error_1.ApiError.notFound("Event not found");
        if (event.organizer_id !== organizerId)
            throw api_error_1.ApiError.forbidden("Not your event");
        return event_repository_1.eventRepository.softDelete(id);
    },
};
//# sourceMappingURL=event.service.js.map