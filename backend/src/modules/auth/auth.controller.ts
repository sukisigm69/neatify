import { Request, Response, NextFunction } from "express";
import { authService } from "./auth.service";
import { sendSuccess, sendCreated } from "../../utils/response";

export const authController = {
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await authService.register(req.body);
      sendCreated(res, result, "Registration successful");
    } catch (err) {
      next(err);
    }
  },

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await authService.login(req.body);
      sendSuccess(res, result, "Login successful");
    } catch (err) {
      next(err);
    }
  },

  async me(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await authService.me(req.user!.userId);
      sendSuccess(res, user);
    } catch (err) {
      next(err);
    }
  },

  async registerOrganizer(req: Request, res: Response, next: NextFunction) {
    try {
      const organizer = await authService.registerOrganizer(req.user!.userId, req.body);
      sendCreated(res, organizer, "Organizer registration submitted");
    } catch (err) {
      next(err);
    }
  },
};
