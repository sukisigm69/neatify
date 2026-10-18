"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.orderController = void 0;
const order_service_1 = require("./order.service");
const response_1 = require("../../utils/response");
exports.orderController = {
    async checkout(req, res, next) {
        try {
            const order = await order_service_1.orderService.checkout(req.user.userId, req.body);
            (0, response_1.sendCreated)(res, order, "Order created successfully");
        }
        catch (err) {
            next(err);
        }
    },
    async getById(req, res, next) {
        try {
            const id = (req.params.orderId || req.params.id);
            const order = await order_service_1.orderService.getById(id, req.user.userId, req.user.role);
            (0, response_1.sendSuccess)(res, order);
        }
        catch (err) {
            next(err);
        }
    },
    async getOrderDetail(req, res, next) {
        try {
            const id = req.params.orderId;
            const order = await order_service_1.orderService.getOrderDetail(id, req.user.userId, req.user.role);
            (0, response_1.sendSuccess)(res, order);
        }
        catch (err) {
            next(err);
        }
    },
    async listMy(req, res, next) {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const sortBy = req.query.sortBy;
            const search = req.query.search;
            const status = req.query.status;
            const result = await order_service_1.orderService.listMyOrders(req.user.userId, {
                page,
                limit,
                sortBy,
                search,
                status,
            });
            (0, response_1.sendSuccess)(res, result);
        }
        catch (err) {
            next(err);
        }
    },
    async list(req, res, next) {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const result = await order_service_1.orderService.list(req.user.userId, req.user.role, page, limit);
            (0, response_1.sendSuccess)(res, result);
        }
        catch (err) {
            next(err);
        }
    },
    async cancel(req, res, next) {
        try {
            const order = await order_service_1.orderService.cancelOrder(req.params.id, req.user.userId, req.user.role);
            (0, response_1.sendSuccess)(res, order, "Order cancelled successfully");
        }
        catch (err) {
            next(err);
        }
    },
};
//# sourceMappingURL=order.controller.js.map