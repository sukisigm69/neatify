"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.venueController = void 0;
const venue_service_1 = require("./venue.service");
const response_1 = require("../../utils/response");
exports.venueController = {
    async list(req, res, next) {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const result = await venue_service_1.venueService.list(page, limit);
            (0, response_1.sendSuccess)(res, result);
        }
        catch (err) {
            next(err);
        }
    },
    async getById(req, res, next) {
        try {
            const venue = await venue_service_1.venueService.getById(req.params.id);
            (0, response_1.sendSuccess)(res, venue);
        }
        catch (err) {
            next(err);
        }
    },
    async create(req, res, next) {
        try {
            const venue = await venue_service_1.venueService.create(req.body);
            (0, response_1.sendCreated)(res, venue);
        }
        catch (err) {
            next(err);
        }
    },
    async update(req, res, next) {
        try {
            const venue = await venue_service_1.venueService.update(req.params.id, req.body);
            (0, response_1.sendSuccess)(res, venue);
        }
        catch (err) {
            next(err);
        }
    },
    async remove(req, res, next) {
        try {
            await venue_service_1.venueService.remove(req.params.id);
            (0, response_1.sendSuccess)(res, null, "Venue deleted");
        }
        catch (err) {
            next(err);
        }
    },
};
//# sourceMappingURL=venue.controller.js.map