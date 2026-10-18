"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ticketController = void 0;
const ticket_service_1 = require("./ticket.service");
const response_1 = require("../../utils/response");
exports.ticketController = {
    async list(req, res, next) {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const result = await ticket_service_1.ticketService.list(req.user.userId, req.user.role, page, limit);
            (0, response_1.sendSuccess)(res, result);
        }
        catch (err) {
            next(err);
        }
    },
    async listMy(req, res, next) {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const result = await ticket_service_1.ticketService.listMyTickets(req.user.userId, page, limit);
            (0, response_1.sendSuccess)(res, result);
        }
        catch (err) {
            next(err);
        }
    },
    async listByOrder(req, res, next) {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const result = await ticket_service_1.ticketService.listByOrder(req.params.orderId, req.user.userId, req.user.role, page, limit);
            (0, response_1.sendSuccess)(res, result);
        }
        catch (err) {
            next(err);
        }
    },
    async getById(req, res, next) {
        try {
            const id = (req.params.ticketId || req.params.id);
            const ticket = await ticket_service_1.ticketService.getById(id, req.user.userId, req.user.role);
            (0, response_1.sendSuccess)(res, ticket);
        }
        catch (err) {
            next(err);
        }
    },
    async download(req, res, next) {
        try {
            const data = await ticket_service_1.ticketService.downloadTicket(req.params.ticketId, req.user.userId, req.user.role);
            (0, response_1.sendSuccess)(res, data);
        }
        catch (err) {
            next(err);
        }
    },
    async scan(req, res, next) {
        try {
            const result = await ticket_service_1.ticketService.scanTicket(req.body.qrCode, req.user.userId, req.body.location);
            (0, response_1.sendSuccess)(res, result, "Scan successful");
        }
        catch (err) {
            next(err);
        }
    },
};
//# sourceMappingURL=ticket.controller.js.map