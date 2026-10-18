import { Router } from "express";
import { adminController } from "./admin.controller";
import { authenticate, authorize } from "../../middleware/auth";

const router = Router();

router.use(authenticate, authorize("ADMIN", "SUPER_ADMIN"));

router.get("/dashboard", adminController.dashboard);

export default router;