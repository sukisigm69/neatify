import { Router } from "express";
import { eventController } from "./event.controller";
import { validate } from "../../middleware/validate";
import { authenticate, authorize } from "../../middleware/auth";
import { assignArtistsSchema, assignVenueSchema, createEventSchema, updateEventSchema, updateEventStatusSchema, uploadBannerSchema, uploadGallerySchema } from "./event.schema";

const router = Router();

// Static routes BEFORE parameterized routes
router.get("/manage/own", authenticate, authorize("ORGANIZER"), eventController.listOwn);
router.get("/admin/all", authenticate, authorize("ADMIN", "SUPER_ADMIN"), eventController.listAll);

// Public routes
router.get("/", eventController.listPublic);
router.get("/:slug", eventController.getBySlug);

// Organizer routes
router.post("/", authenticate, authorize("ORGANIZER"), validate(createEventSchema), eventController.create);
router.put("/:id", authenticate, authorize("ORGANIZER"), validate(updateEventSchema), eventController.update);
router.patch("/:id/banner", authenticate, authorize("ORGANIZER"), validate(uploadBannerSchema), eventController.uploadBanner);
router.patch("/:id/gallery", authenticate, authorize("ORGANIZER"), validate(uploadGallerySchema), eventController.uploadGallery);
router.patch("/:id/venue", authenticate, authorize("ORGANIZER"), validate(assignVenueSchema), eventController.assignVenue);
router.patch("/:id/artists", authenticate, authorize("ORGANIZER"), validate(assignArtistsSchema), eventController.assignArtists);
router.post("/:id/ticket-categories", authenticate, authorize("ORGANIZER"), eventController.createTicketCategories);
router.patch("/:id/submit", authenticate, authorize("ORGANIZER"), eventController.submit);
router.delete("/:id", authenticate, authorize("ORGANIZER"), eventController.remove);

// Admin routes
router.patch("/:id/approve", authenticate, authorize("ADMIN", "SUPER_ADMIN"), eventController.approve);
router.patch("/:id/reject", authenticate, authorize("ADMIN", "SUPER_ADMIN"), eventController.reject);
router.patch("/:id/status", authenticate, authorize("ADMIN", "SUPER_ADMIN"), validate(updateEventStatusSchema), eventController.updateStatus);

export default router;
