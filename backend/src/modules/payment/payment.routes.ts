import { Router } from "express";
import { z } from "zod";
import { paymentController } from "./payment.controller";
import { authenticate } from "../../middleware/auth";
import { ApiError } from "../../utils/api-error";

const router = Router();

// Retrieve snap token for user checkout
router.post("/snap", authenticate, paymentController.getSnapToken);
router.post(
  "/:orderId/status",
  authenticate,
  (req, _res, next) => {
    const result = z.string().uuid().safeParse(req.params.orderId);
    if (!result.success) return next(ApiError.badRequest("Invalid order ID"));
    req.params.orderId = result.data;
    next();
  },
  paymentController.syncStatus,
);

// Webhook direct from Midtrans (public endpoint)
router.post("/webhook", paymentController.webhook);

export default router;
