import { Router } from "express";
import { venueController } from "./venue.controller";
import { validate } from "../../middleware/validate";
import { authenticate, authorize } from "../../middleware/auth";
import { createVenueSchema, updateVenueSchema } from "./venue.schema";

const router = Router();

router.get("/", authenticate, authorize("ORGANIZER", "ADMIN", "SUPER_ADMIN"), venueController.list);
router.get("/:id", authenticate, authorize("ORGANIZER", "ADMIN", "SUPER_ADMIN"), venueController.getById);
router.post("/", authenticate, authorize("ADMIN", "SUPER_ADMIN"), validate(createVenueSchema), venueController.create);
router.put("/:id", authenticate, authorize("ADMIN", "SUPER_ADMIN"), validate(updateVenueSchema), venueController.update);
router.delete("/:id", authenticate, authorize("ADMIN", "SUPER_ADMIN"), venueController.remove);

export default router;
