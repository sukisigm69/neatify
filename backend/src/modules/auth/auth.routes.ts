import { Router } from "express";
import { authController } from "./auth.controller";
import { validate } from "../../middleware/validate";
import { authenticate } from "../../middleware/auth";
import { registerSchema, loginSchema, registerOrganizerSchema, updateProfileSchema } from "./auth.schema";

const router = Router();

router.post("/register", validate(registerSchema), authController.register);
router.post("/login", validate(loginSchema), authController.login);
router.get("/me", authenticate, authController.me);
router.put("/profile", authenticate, validate(updateProfileSchema), authController.updateProfile);
router.post("/register-organizer", authenticate, validate(registerOrganizerSchema), authController.registerOrganizer);

export default router;
