"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const event_controller_1 = require("./event.controller");
const validate_1 = require("../../middleware/validate");
const auth_1 = require("../../middleware/auth");
const event_schema_1 = require("./event.schema");
const router = (0, express_1.Router)();
// Static routes BEFORE parameterized routes
router.get("/manage/own", auth_1.authenticate, (0, auth_1.authorize)("ORGANIZER"), event_controller_1.eventController.listOwn);
router.get("/admin/all", auth_1.authenticate, (0, auth_1.authorize)("ADMIN", "SUPER_ADMIN"), event_controller_1.eventController.listAll);
// Public routes
router.get("/", event_controller_1.eventController.listPublic);
router.get("/:slug", event_controller_1.eventController.getBySlug);
// Organizer routes
router.post("/", auth_1.authenticate, (0, auth_1.authorize)("ORGANIZER"), (0, validate_1.validate)(event_schema_1.createEventSchema), event_controller_1.eventController.create);
router.put("/:id", auth_1.authenticate, (0, auth_1.authorize)("ORGANIZER"), (0, validate_1.validate)(event_schema_1.updateEventSchema), event_controller_1.eventController.update);
router.patch("/:id/banner", auth_1.authenticate, (0, auth_1.authorize)("ORGANIZER"), (0, validate_1.validate)(event_schema_1.uploadBannerSchema), event_controller_1.eventController.uploadBanner);
router.patch("/:id/gallery", auth_1.authenticate, (0, auth_1.authorize)("ORGANIZER"), (0, validate_1.validate)(event_schema_1.uploadGallerySchema), event_controller_1.eventController.uploadGallery);
router.patch("/:id/venue", auth_1.authenticate, (0, auth_1.authorize)("ORGANIZER"), (0, validate_1.validate)(event_schema_1.assignVenueSchema), event_controller_1.eventController.assignVenue);
router.patch("/:id/artists", auth_1.authenticate, (0, auth_1.authorize)("ORGANIZER"), (0, validate_1.validate)(event_schema_1.assignArtistsSchema), event_controller_1.eventController.assignArtists);
router.post("/:id/ticket-categories", auth_1.authenticate, (0, auth_1.authorize)("ORGANIZER"), event_controller_1.eventController.createTicketCategories);
router.patch("/:id/submit", auth_1.authenticate, (0, auth_1.authorize)("ORGANIZER"), event_controller_1.eventController.submit);
router.delete("/:id", auth_1.authenticate, (0, auth_1.authorize)("ORGANIZER"), event_controller_1.eventController.remove);
// Admin routes
router.patch("/:id/approve", auth_1.authenticate, (0, auth_1.authorize)("ADMIN", "SUPER_ADMIN"), event_controller_1.eventController.approve);
router.patch("/:id/reject", auth_1.authenticate, (0, auth_1.authorize)("ADMIN", "SUPER_ADMIN"), event_controller_1.eventController.reject);
router.patch("/:id/status", auth_1.authenticate, (0, auth_1.authorize)("ADMIN", "SUPER_ADMIN"), (0, validate_1.validate)(event_schema_1.updateEventStatusSchema), event_controller_1.eventController.updateStatus);
exports.default = router;
//# sourceMappingURL=event.routes.js.map