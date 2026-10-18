import { Router } from "express";
import { dashboardController } from "./dashboard.controller";
import { authenticate, authorize } from "../../middleware/auth";

const router = Router();

router.use(authenticate, authorize("ADMIN", "SUPER_ADMIN"));

router.get("/statistics", dashboardController.getStatistics);
router.get("/monthly-sales", dashboardController.getMonthlySales);
router.get("/popular-events", dashboardController.getPopularEvents);

export default router;
