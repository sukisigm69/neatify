"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.eventRepository = void 0;
const prisma_1 = __importDefault(require("../../lib/prisma"));
const uuid_1 = require("uuid");
const eventInclude = {
    venues: true,
    organizers: { include: { users: { select: { name: true, email: true } } } },
    event_artists: { include: { artists: true } },
    ticket_categories: { where: { deleted_at: null } },
};
exports.eventRepository = {
    findAll(where, page = 1, limit = 10) {
        const skip = (page - 1) * limit;
        return Promise.all([
            prisma_1.default.events.findMany({ where, skip, take: limit, orderBy: { start_date: "asc" }, include: eventInclude }),
            prisma_1.default.events.count({ where }),
        ]);
    },
    findById(id) {
        return prisma_1.default.events.findFirst({ where: { id, deleted_at: null }, include: eventInclude });
    },
    findBySlug(slug) {
        return prisma_1.default.events.findFirst({ where: { slug, deleted_at: null }, include: eventInclude });
    },
    create(data) {
        return prisma_1.default.events.create({
            data: {
                id: data.id || (0, uuid_1.v4)(),
                organizer_id: data.organizerId,
                venue_id: data.venueId,
                title: data.title,
                slug: data.slug,
                description: data.description,
                banner: data.banner,
                start_date: data.startDate,
                end_date: data.endDate,
            },
            include: eventInclude
        });
    },
    update(id, data) {
        return prisma_1.default.events.update({
            where: { id },
            data: {
                venue_id: data.venueId,
                title: data.title,
                slug: data.slug,
                description: data.description,
                banner: data.banner,
                start_date: data.startDate,
                end_date: data.endDate,
                status: data.status,
            },
            include: eventInclude
        });
    },
    updateStatus(id, status) {
        return prisma_1.default.events.update({ where: { id }, data: { status }, include: eventInclude });
    },
    updateBanner(id, banner) {
        return prisma_1.default.events.update({ where: { id }, data: { banner }, include: eventInclude });
    },
    replaceGallery(eventId, images) {
        return prisma_1.default.$transaction(async (tx) => {
            await tx.event_images.deleteMany({ where: { event_id: eventId } });
            await tx.event_images.createMany({
                data: images.map((imageUrl, index) => ({
                    id: (0, uuid_1.v4)(),
                    event_id: eventId,
                    image_url: imageUrl,
                    sort_order: index,
                })),
            });
        });
    },
    createTicketCategories(eventId, categories) {
        return prisma_1.default.ticket_categories.createMany({
            data: categories.map((category) => ({
                id: (0, uuid_1.v4)(),
                event_id: eventId,
                name: category.name,
                price: category.price,
                quota: category.quota,
                sale_start: category.saleStart ? new Date(category.saleStart) : new Date(),
                sale_end: category.saleEnd ? new Date(category.saleEnd) : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
            })),
        });
    },
    softDelete(id) {
        return prisma_1.default.events.update({ where: { id }, data: { deleted_at: new Date() } });
    },
    setArtists(eventId, artistIds) {
        return prisma_1.default.$transaction(async (tx) => {
            await tx.event_artists.deleteMany({ where: { event_id: eventId } });
            if (artistIds.length > 0) {
                await tx.event_artists.createMany({
                    data: artistIds.map((artistId) => ({ event_id: eventId, artist_id: artistId })),
                });
            }
        });
    },
};
//# sourceMappingURL=event.repository.js.map