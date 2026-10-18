"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const ticket_category_controller_1 = require("./ticket-category.controller");
const validate_1 = require("../../middleware/validate");
const auth_1 = require("../../middleware/auth");
const ticket_category_schema_1 = require("./ticket-category.schema");
const router = (0, express_1.Router)();
// Public: list categories for an event
router.get("/event/:eventId", ticket_category_controller_1.ticketCategoryController.listByEvent);
// Organizer: manage categories
router.post("/event/:eventId", auth_1.authenticate, (0, auth_1.authorize)("ORGANIZER"), (0, validate_1.validate)(ticket_category_schema_1.createTicketCategorySchema), ticket_category_controller_1.ticketCategoryController.create);
router.put("/:id", auth_1.authenticate, (0, auth_1.authorize)("ORGANIZER"), (0, validate_1.validate)(ticket_category_schema_1.updateTicketCategorySchema), ticket_category_controller_1.ticketCategoryController.update);
router.delete("/:id", auth_1.authenticate, (0, auth_1.authorize)("ORGANIZER"), ticket_category_controller_1.ticketCategoryController.remove);
exports.default = router;
//# sourceMappingURL=ticket-category.routes.js.map