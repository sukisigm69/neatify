"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ticketCategoryRepository = void 0;
const prisma_1 = __importDefault(require("../../lib/prisma"));
const uuid_1 = require("uuid");
exports.ticketCategoryRepository = {
    findByEvent(eventId) {
        return prisma_1.default.ticket_categories.findMany({
            where: { event_id: eventId, deleted_at: null },
            orderBy: { price: "asc" },
        });
    },
    findById(id) {
        return prisma_1.default.ticket_categories.findFirst({ where: { id, deleted_at: null } });
    },
    create(eventId, data) {
        return prisma_1.default.ticket_categories.create({
            data: {
                id: (0, uuid_1.v4)(),
                event_id: eventId,
                name: data.name,
                price: data.price,
                quota: data.quota,
                sale_start: new Date(), // ponytail: default sale dates if not supplied, fallback to event start/end later
                sale_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
            },
        });
    },
    update(id, data) {
        return prisma_1.default.ticket_categories.update({
            where: { id },
            data: {
                name: data.name,
                price: data.price,
                quota: data.quota,
            },
        });
    },
    softDelete(id) {
        return prisma_1.default.ticket_categories.update({ where: { id }, data: { deleted_at: new Date() } });
    },
};
//# sourceMappingURL=ticket-category.repository.js.map