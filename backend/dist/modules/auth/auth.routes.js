"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = require("./auth.controller");
const validate_1 = require("../../middleware/validate");
const auth_1 = require("../../middleware/auth");
const auth_schema_1 = require("./auth.schema");
const router = (0, express_1.Router)();
router.post("/register", (0, validate_1.validate)(auth_schema_1.registerSchema), auth_controller_1.authController.register);
router.post("/login", (0, validate_1.validate)(auth_schema_1.loginSchema), auth_controller_1.authController.login);
router.get("/me", auth_1.authenticate, auth_controller_1.authController.me);
router.post("/register-organizer", auth_1.authenticate, (0, validate_1.validate)(auth_schema_1.registerOrganizerSchema), auth_controller_1.authController.registerOrganizer);
exports.default = router;
//# sourceMappingURL=auth.routes.js.map