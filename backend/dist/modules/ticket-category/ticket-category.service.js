"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ticketCategoryService = void 0;
const ticket_category_repository_1 = require("./ticket-category.repository");
const api_error_1 = require("../../utils/api-error");
const prisma_1 = __importDefault(require("../../lib/prisma"));
async function verifyEventOwnership(eventId, userId) {
    const event = await prisma_1.default.events.findUnique({
        where: { id: eventId, deleted_at: null },
        include: { organizers: true },
    });
    if (!event)
        throw api_error_1.ApiError.notFound("Event not found");
    if (event.organizers.user_id !== userId)
        throw api_error_1.ApiError.forbidden("Not your event");
    return event;
}
exports.ticketCategoryService = {
    async listByEvent(eventId) {
        return ticket_category_repository_1.ticketCategoryRepository.findByEvent(eventId);
    },
    async create(eventId, userId, data) {
        await verifyEventOwnership(eventId, userId);
        return ticket_category_repository_1.ticketCategoryRepository.create(eventId, data);
    },
    async update(id, userId, data) {
        const cat = await ticket_category_repository_1.ticketCategoryRepository.findById(id);
        if (!cat)
            throw api_error_1.ApiError.notFound("Ticket category not found");
        await verifyEventOwnership(cat.event_id, userId);
        return ticket_category_repository_1.ticketCategoryRepository.update(id, data);
    },
    async remove(id, userId) {
        const cat = await ticket_category_repository_1.ticketCategoryRepository.findById(id);
        if (!cat)
            throw api_error_1.ApiError.notFound("Ticket category not found");
        await verifyEventOwnership(cat.event_id, userId);
        return ticket_category_repository_1.ticketCategoryRepository.softDelete(id);
    },
};
//# sourceMappingURL=ticket-category.service.js.map