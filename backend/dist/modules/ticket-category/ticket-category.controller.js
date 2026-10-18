"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ticketCategoryController = void 0;
const ticket_category_service_1 = require("./ticket-category.service");
const response_1 = require("../../utils/response");
exports.ticketCategoryController = {
    async listByEvent(req, res, next) {
        try {
            const categories = await ticket_category_service_1.ticketCategoryService.listByEvent(req.params.eventId);
            (0, response_1.sendSuccess)(res, categories);
        }
        catch (err) {
            next(err);
        }
    },
    async create(req, res, next) {
        try {
            const cat = await ticket_category_service_1.ticketCategoryService.create(req.params.eventId, req.user.userId, req.body);
            (0, response_1.sendCreated)(res, cat);
        }
        catch (err) {
            next(err);
        }
    },
    async update(req, res, next) {
        try {
            const cat = await ticket_category_service_1.ticketCategoryService.update(req.params.id, req.user.userId, req.body);
            (0, response_1.sendSuccess)(res, cat);
        }
        catch (err) {
            next(err);
        }
    },
    async remove(req, res, next) {
        try {
            await ticket_category_service_1.ticketCategoryService.remove(req.params.id, req.user.userId);
            (0, response_1.sendSuccess)(res, null, "Ticket category deleted");
        }
        catch (err) {
            next(err);
        }
    },
};
//# sourceMappingURL=ticket-category.controller.js.map