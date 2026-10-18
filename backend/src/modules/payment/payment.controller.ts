import { Request, Response, NextFunction } from "express";
import { paymentService } from "./payment.service";
import { sendSuccess } from "../../utils/response";

export const paymentController = {
  async getSnapToken(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await paymentService.getOrCreateSnapToken(req.body.orderId, req.user!.userId);
      sendSuccess(res, result, "Payment token retrieved");
    } catch (err) { next(err); }
  },

  async webhook(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await paymentService.handleWebhook(req.body);
      sendSuccess(res, result, "Webhook processed");
    } catch (err) { next(err); }
  },
};
