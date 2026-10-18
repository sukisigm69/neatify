"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.eventController = void 0;
const event_service_1 = require("./event.service");
const response_1 = require("../../utils/response");
exports.eventController = {
    // Public
    async listPublic(req, res, next) {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const search = req.query.search;
            const result = await event_service_1.eventService.listPublic(page, limit, search);
            (0, response_1.sendSuccess)(res, result);
        }
        catch (err) {
            next(err);
        }
    },
    async getBySlug(req, res, next) {
        try {
            const event = await event_service_1.eventService.getBySlug(req.params.slug);
            (0, response_1.sendSuccess)(res, event);
        }
        catch (err) {
            next(err);
        }
    },
    // Organizer
    async listOwn(req, res, next) {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const result = await event_service_1.eventService.listByOrganizer(req.user.userId, page, limit);
            (0, response_1.sendSuccess)(res, result);
        }
        catch (err) {
            next(err);
        }
    },
    async create(req, res, next) {
        try {
            const event = await event_service_1.eventService.create(req.user.userId, req.body);
            (0, response_1.sendCreated)(res, event);
        }
        catch (err) {
            next(err);
        }
    },
    async update(req, res, next) {
        try {
            const event = await event_service_1.eventService.update(req.user.userId, req.params.id, req.body);
            (0, response_1.sendSuccess)(res, event);
        }
        catch (err) {
            next(err);
        }
    },
    async submit(req, res, next) {
        try {
            const event = await event_service_1.eventService.submit(req.user.userId, req.params.id);
            (0, response_1.sendSuccess)(res, event, "Event submitted for approval");
        }
        catch (err) {
            next(err);
        }
    },
    async uploadBanner(req, res, next) {
        try {
            const event = await event_service_1.eventService.uploadBanner(req.user.userId, req.params.id, req.body.banner);
            (0, response_1.sendSuccess)(res, event, "Event banner updated");
        }
        catch (err) {
            next(err);
        }
    },
    async uploadGallery(req, res, next) {
        try {
            const event = await event_service_1.eventService.uploadGallery(req.user.userId, req.params.id, req.body.images);
            (0, response_1.sendSuccess)(res, event, "Event gallery updated");
        }
        catch (err) {
            next(err);
        }
    },
    async assignVenue(req, res, next) {
        try {
            const event = await event_service_1.eventService.assignVenue(req.user.userId, req.params.id, req.body.venueId);
            (0, response_1.sendSuccess)(res, event, "Event venue updated");
        }
        catch (err) {
            next(err);
        }
    },
    async assignArtists(req, res, next) {
        try {
            const event = await event_service_1.eventService.assignArtists(req.user.userId, req.params.id, req.body.artistIds);
            (0, response_1.sendSuccess)(res, event, "Event artists updated");
        }
        catch (err) {
            next(err);
        }
    },
    async createTicketCategories(req, res, next) {
        try {
            const event = await event_service_1.eventService.createTicketCategories(req.user.userId, req.params.id, req.body.ticketCategories);
            (0, response_1.sendCreated)(res, event, "Ticket categories created");
        }
        catch (err) {
            next(err);
        }
    },
    async remove(req, res, next) {
        try {
            await event_service_1.eventService.remove(req.user.userId, req.params.id);
            (0, response_1.sendSuccess)(res, null, "Event deleted");
        }
        catch (err) {
            next(err);
        }
    },
    // Admin
    async listAll(req, res, next) {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const status = req.query.status;
            const result = await event_service_1.eventService.listAll(page, limit, status);
            (0, response_1.sendSuccess)(res, result);
        }
        catch (err) {
            next(err);
        }
    },
    async approve(req, res, next) {
        try {
            const event = await event_service_1.eventService.approve(req.params.id);
            (0, response_1.sendSuccess)(res, event, "Event approved");
        }
        catch (err) {
            next(err);
        }
    },
    async reject(req, res, next) {
        try {
            const event = await event_service_1.eventService.reject(req.params.id);
            (0, response_1.sendSuccess)(res, event, "Event rejected");
        }
        catch (err) {
            next(err);
        }
    },
    async updateStatus(req, res, next) {
        try {
            const event = await event_service_1.eventService.updateStatus(req.params.id, req.body.status);
            (0, response_1.sendSuccess)(res, event, "Event status updated");
        }
        catch (err) {
            next(err);
        }
    },
};
//# sourceMappingURL=event.controller.js.map