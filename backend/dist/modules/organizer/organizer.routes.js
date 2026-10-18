"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const organizer_controller_1 = require("./organizer.controller");
const validate_1 = require("../../middleware/validate");
const auth_1 = require("../../middleware/auth");
const organizer_schema_1 = require("./organizer.schema");
const router = (0, express_1.Router)();
router.post("/become", (0, auth_1.requireAuth)(), (0, auth_1.allowRoles)("USER"), (0, validate_1.validate)(organizer_schema_1.becomeOrganizerSchema), organizer_controller_1.organizerController.becomeOrganizer);
router.get("/profile", (0, auth_1.requireAuth)(), (0, auth_1.allowRoles)("ORGANIZER"), organizer_controller_1.organizerController.profile);
router.put("/profile", (0, auth_1.requireAuth)(), (0, auth_1.allowRoles)("ORGANIZER"), (0, validate_1.validate)(organizer_schema_1.updateOrganizerSchema), organizer_controller_1.organizerController.updateProfile);
router.patch("/logo", (0, auth_1.requireAuth)(), (0, auth_1.allowRoles)("ORGANIZER"), (0, validate_1.validate)(organizer_schema_1.uploadLogoSchema), organizer_controller_1.organizerController.uploadLogo);
router.get("/dashboard/summary", (0, auth_1.requireAuth)(), (0, auth_1.allowRoles)("ORGANIZER"), organizer_controller_1.organizerController.dashboardSummary);
router.get("/admin/pending", (0, auth_1.requireAuth)(), (0, auth_1.allowRoles)("ADMIN", "SUPER_ADMIN"), organizer_controller_1.organizerController.listPending);
router.patch("/admin/:id/approval", (0, auth_1.requireAuth)(), (0, auth_1.allowRoles)("ADMIN", "SUPER_ADMIN"), (0, validate_1.validate)(organizer_schema_1.approvalSchema), organizer_controller_1.organizerController.approve);
exports.default = router;
//# sourceMappingURL=organizer.routes.js.map