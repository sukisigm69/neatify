import { Router } from "express";
import { artistController } from "./artist.controller";
import { validate } from "../../middleware/validate";
import { authenticate, authorize } from "../../middleware/auth";
import { createArtistSchema, updateArtistSchema, uploadArtistImageSchema } from "./artist.schema";

const router = Router();

router.get("/", authenticate, authorize("ORGANIZER", "ADMIN", "SUPER_ADMIN"), artistController.list);
router.get("/:id", authenticate, authorize("ORGANIZER", "ADMIN", "SUPER_ADMIN"), artistController.getById);
router.post("/", authenticate, authorize("ORGANIZER"), validate(createArtistSchema), artistController.create);
router.put("/:id", authenticate, authorize("ORGANIZER"), validate(updateArtistSchema), artistController.update);
router.patch("/:id/image", authenticate, authorize("ORGANIZER"), validate(uploadArtistImageSchema), artistController.uploadImage);
router.delete("/:id", authenticate, authorize("ORGANIZER"), artistController.remove);

export default router;
