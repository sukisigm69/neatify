import { Router } from "express";
import { ticketCategoryController } from "./ticket-category.controller";
import { validate } from "../../middleware/validate";
import { authenticate, authorize } from "../../middleware/auth";
import { createTicketCategorySchema, updateTicketCategorySchema } from "./ticket-category.schema";

const router = Router();

// Public: list categories for an event
router.get("/event/:eventId", ticketCategoryController.listByEvent);

// Organizer: manage categories
router.post("/event/:eventId", authenticate, authorize("ORGANIZER"), validate(createTicketCategorySchema), ticketCategoryController.create);
router.put("/:id", authenticate, authorize("ORGANIZER"), validate(updateTicketCategorySchema), ticketCategoryController.update);
router.delete("/:id", authenticate, authorize("ORGANIZER"), ticketCategoryController.remove);

export default router;
