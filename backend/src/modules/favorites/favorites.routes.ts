import { Router } from "express";
import { favoritesController } from "./favorites.controller";
import { validate } from "../../middleware/validate";
import { authenticate } from "../../middleware/auth";
import { createFavoriteSchema } from "./favorites.schema";

const router = Router();

router.use(authenticate);
router.get("/", favoritesController.list);
router.post("/", validate(createFavoriteSchema), favoritesController.create);
router.delete("/:eventId", favoritesController.remove);

export default router;
