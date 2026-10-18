import { Request, Response, NextFunction } from "express";
import { sendCreated, sendSuccess } from "../../utils/response";
import { organizerService } from "./organizer.service";

export const organizerController = {
  async becomeOrganizer(req: Request, res: Response, next: NextFunction) {
    try {
      const organizer = await organizerService.becomeOrganizer(req.user!.userId, req.body);
      sendCreated(res, organizer, "Organizer registration submitted");
    } catch (err) { next(err); }
  },

  async profile(req: Request, res: Response, next: NextFunction) {
    try {
      const organizer = await organizerService.getProfile(req.user!.userId);
      sendSuccess(res, organizer);
    } catch (err) { next(err); }
  },

  async updateProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const organizer = await organizerService.updateProfile(req.user!.userId, req.body);
      sendSuccess(res, organizer, "Organizer profile updated");
    } catch (err) { next(err); }
  },

  async uploadLogo(req: Request, res: Response, next: NextFunction) {
    try {
      const organizer = await organizerService.uploadLogo(req.user!.userId, req.body.logo);
      sendSuccess(res, organizer, "Organizer logo updated");
    } catch (err) { next(err); }
  },

  async approve(req: Request, res: Response, next: NextFunction) {
    try {
      const organizer = await organizerService.approve(req.params.id as string, req.body.isApproved);
      sendSuccess(res, organizer, req.body.isApproved ? "Organizer approved" : "Organizer approval revoked");
    } catch (err) { next(err); }
  },

  async listPending(req: Request, res: Response, next: NextFunction) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const result = await organizerService.listPending(page, limit);
      sendSuccess(res, result);
    } catch (err) { next(err); }
  },

  async dashboardSummary(req: Request, res: Response, next: NextFunction) {
    try {
      const summary = await organizerService.dashboardSummary(req.user!.userId);
      sendSuccess(res, summary);
    } catch (err) { next(err); }
  },
};
