"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.favoritesRepository = void 0;
const prisma_1 = __importDefault(require("../../lib/prisma"));
const eventInclude = {
    venues: true,
    organizers: { include: { users: { select: { name: true, email: true } } } },
    event_artists: { include: { artists: true } },
    ticket_categories: { where: { deleted_at: null } },
};
exports.favoritesRepository = {
    findByUser(userId) {
        return prisma_1.default.favorites.findMany({
            where: { user_id: userId, events: { deleted_at: null } },
            include: { events: { include: eventInclude } },
            orderBy: { created_at: "desc" },
        });
    },
    findOne(userId, eventId) {
        return prisma_1.default.favorites.findUnique({
            where: { user_id_event_id: { user_id: userId, event_id: eventId } },
        });
    },
    create(userId, eventId) {
        return prisma_1.default.favorites.create({
            data: { user_id: userId, event_id: eventId },
        });
    },
    remove(userId, eventId) {
        return prisma_1.default.favorites.delete({
            where: { user_id_event_id: { user_id: userId, event_id: eventId } },
        });
    },
};
//# sourceMappingURL=favorites.repository.js.map