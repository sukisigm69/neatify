"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const dashboard_controller_1 = require("./dashboard.controller");
const auth_1 = require("../../middleware/auth");
const router = (0, express_1.Router)();
router.use(auth_1.authenticate, (0, auth_1.authorize)("ADMIN", "SUPER_ADMIN"));
router.get("/statistics", dashboard_controller_1.dashboardController.getStatistics);
router.get("/monthly-sales", dashboard_controller_1.dashboardController.getMonthlySales);
router.get("/popular-events", dashboard_controller_1.dashboardController.getPopularEvents);
exports.default = router;
//# sourceMappingURL=dashboard.routes.js.map