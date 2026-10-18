"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.favoritesService = void 0;
const favorites_repository_1 = require("./favorites.repository");
const api_error_1 = require("../../utils/api-error");
const prisma_1 = __importDefault(require("../../lib/prisma"));
exports.favoritesService = {
    async list(userId) {
        return favorites_repository_1.favoritesRepository.findByUser(userId);
    },
    async create(userId, eventId) {
        const event = await prisma_1.default.events.findFirst({ where: { id: eventId, deleted_at: null } });
        if (!event)
            throw api_error_1.ApiError.notFound("Event not found");
        const existing = await favorites_repository_1.favoritesRepository.findOne(userId, eventId);
        if (existing)
            return existing;
        return favorites_repository_1.favoritesRepository.create(userId, eventId);
    },
    async remove(userId, eventId) {
        const existing = await favorites_repository_1.favoritesRepository.findOne(userId, eventId);
        if (!existing)
            throw api_error_1.ApiError.notFound("Favorite not found");
        await favorites_repository_1.favoritesRepository.remove(userId, eventId);
    },
};
//# sourceMappingURL=favorites.service.js.map