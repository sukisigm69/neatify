import { Request, Response, NextFunction } from "express";
import { adminService } from "./admin.service";
import { sendSuccess } from "../../utils/response";

export const adminController = {
  async dashboard(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await adminService.getDashboard();
      sendSuccess(res, data);
    } catch (err) { next(err); }
  }
};
