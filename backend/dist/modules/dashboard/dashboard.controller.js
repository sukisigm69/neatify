"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dashboardController = void 0;
const dashboard_service_1 = require("./dashboard.service");
const response_1 = require("../../utils/response");
exports.dashboardController = {
    async getStatistics(_req, res, next) {
        try {
            const data = await dashboard_service_1.dashboardService.getStatistics();
            (0, response_1.sendSuccess)(res, data);
        }
        catch (err) {
            next(err);
        }
    },
    async getMonthlySales(req, res, next) {
        try {
            const year = parseInt(req.query.year) || new Date().getFullYear();
            const data = await dashboard_service_1.dashboardService.getMonthlySales(year);
            (0, response_1.sendSuccess)(res, data);
        }
        catch (err) {
            next(err);
        }
    },
    async getPopularEvents(req, res, next) {
        try {
            const limit = parseInt(req.query.limit) || 5;
            const data = await dashboard_service_1.dashboardService.getPopularEvents(limit);
            (0, response_1.sendSuccess)(res, data);
        }
        catch (err) {
            next(err);
        }
    },
};
//# sourceMappingURL=dashboard.controller.js.map