import { Request, Response, NextFunction } from "express";
import { favoritesService } from "./favorites.service";
import { sendSuccess, sendCreated } from "../../utils/response";

export const favoritesController = {
  async list(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await favoritesService.list(req.user!.userId);
      sendSuccess(res, data);
    } catch (err) {
      next(err);
    }
  },

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await favoritesService.create(req.user!.userId, req.body.eventId);
      sendCreated(res, data, "Added to favorites");
    } catch (err) {
      next(err);
    }
  },

  async remove(req: Request, res: Response, next: NextFunction) {
    try {
      await favoritesService.remove(req.user!.userId, req.params.eventId as string);
      sendSuccess(res, null, "Removed from favorites");
    } catch (err) {
      next(err);
    }
  },
};
