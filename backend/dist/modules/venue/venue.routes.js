"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const venue_controller_1 = require("./venue.controller");
const validate_1 = require("../../middleware/validate");
const auth_1 = require("../../middleware/auth");
const venue_schema_1 = require("./venue.schema");
const router = (0, express_1.Router)();
router.get("/", auth_1.authenticate, (0, auth_1.authorize)("ORGANIZER", "ADMIN", "SUPER_ADMIN"), venue_controller_1.venueController.list);
router.get("/:id", auth_1.authenticate, (0, auth_1.authorize)("ORGANIZER", "ADMIN", "SUPER_ADMIN"), venue_controller_1.venueController.getById);
router.post("/", auth_1.authenticate, (0, auth_1.authorize)("ADMIN", "SUPER_ADMIN"), (0, validate_1.validate)(venue_schema_1.createVenueSchema), venue_controller_1.venueController.create);
router.put("/:id", auth_1.authenticate, (0, auth_1.authorize)("ADMIN", "SUPER_ADMIN"), (0, validate_1.validate)(venue_schema_1.updateVenueSchema), venue_controller_1.venueController.update);
router.delete("/:id", auth_1.authenticate, (0, auth_1.authorize)("ADMIN", "SUPER_ADMIN"), venue_controller_1.venueController.remove);
exports.default = router;
//# sourceMappingURL=venue.routes.js.map