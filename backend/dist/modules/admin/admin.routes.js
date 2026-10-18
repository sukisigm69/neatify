"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const admin_controller_1 = require("./admin.controller");
const auth_1 = require("../../middleware/auth");
const router = (0, express_1.Router)();
router.use(auth_1.authenticate, (0, auth_1.authorize)("ADMIN", "SUPER_ADMIN"));
router.get("/dashboard", admin_controller_1.adminController.dashboard);
exports.default = router;
//# sourceMappingURL=admin.routes.js.map