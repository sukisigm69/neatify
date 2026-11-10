import { Request, Response, NextFunction } from "express";
import { paymentService } from "./payment.service";
import { sendSuccess } from "../../utils/response";

export const paymentController = {
  async syncStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await paymentService.syncStatus(req.params.orderId as string, req.user!.userId);
      sendSuccess(res, result, "Payment status synchronized");
    } catch (err) { next(err); }
  },

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
