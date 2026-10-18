"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.favoritesController = void 0;
const favorites_service_1 = require("./favorites.service");
const response_1 = require("../../utils/response");
exports.favoritesController = {
    async list(req, res, next) {
        try {
            const data = await favorites_service_1.favoritesService.list(req.user.userId);
            (0, response_1.sendSuccess)(res, data);
        }
        catch (err) {
            next(err);
        }
    },
    async create(req, res, next) {
        try {
            const data = await favorites_service_1.favoritesService.create(req.user.userId, req.body.eventId);
            (0, response_1.sendCreated)(res, data, "Added to favorites");
        }
        catch (err) {
            next(err);
        }
    },
    async remove(req, res, next) {
        try {
            await favorites_service_1.favoritesService.remove(req.user.userId, req.params.eventId);
            (0, response_1.sendSuccess)(res, null, "Removed from favorites");
        }
        catch (err) {
            next(err);
        }
    },
};
//# sourceMappingURL=favorites.controller.js.map