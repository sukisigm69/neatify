"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dashboardService = void 0;
const dashboard_repository_1 = require("./dashboard.repository");
exports.dashboardService = {
    getStatistics() {
        return dashboard_repository_1.dashboardRepository.getStatistics();
    },
    getMonthlySales(year) {
        return dashboard_repository_1.dashboardRepository.getMonthlySales(year);
    },
    getPopularEvents(limit) {
        return dashboard_repository_1.dashboardRepository.getPopularEvents(limit);
    },
};
//# sourceMappingURL=dashboard.service.js.map