import { Request, Response, NextFunction } from "express";
import { dashboardService } from "./dashboard.service";
import { sendSuccess } from "../../utils/response";

export const dashboardController = {
  async getStatistics(_req: Request, res: Response, next: NextFunction) {
    try {
      const data = await dashboardService.getStatistics();
      sendSuccess(res, data);
    } catch (err) { next(err); }
  },

  async getMonthlySales(req: Request, res: Response, next: NextFunction) {
    try {
      const year = parseInt(req.query.year as string) || new Date().getFullYear();
      const data = await dashboardService.getMonthlySales(year);
      sendSuccess(res, data);
    } catch (err) { next(err); }
  },

  async getPopularEvents(req: Request, res: Response, next: NextFunction) {
    try {
      const limit = parseInt(req.query.limit as string) || 5;
      const data = await dashboardService.getPopularEvents(limit);
      sendSuccess(res, data);
    } catch (err) { next(err); }
  },
};
