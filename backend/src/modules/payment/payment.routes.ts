import { Router } from "express";
import { paymentController } from "./payment.controller";
import { authenticate } from "../../middleware/auth";

const router = Router();

// Retrieve snap token for user checkout
router.post("/snap", authenticate, paymentController.getSnapToken);

// Webhook direct from Midtrans (public endpoint)
router.post("/webhook", paymentController.webhook);

export default router;
