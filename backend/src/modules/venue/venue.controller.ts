import { Request, Response, NextFunction } from "express";
import { venueService } from "./venue.service";
import { sendSuccess, sendCreated } from "../../utils/response";

export const venueController = {
  async list(req: Request, res: Response, next: NextFunction) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const result = await venueService.list(page, limit);
      sendSuccess(res, result);
    } catch (err) { next(err); }
  },

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const venue = await venueService.getById(req.params.id as string);
      sendSuccess(res, venue);
    } catch (err) { next(err); }
  },

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const venue = await venueService.create(req.body);
      sendCreated(res, venue);
    } catch (err) { next(err); }
  },

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const venue = await venueService.update(req.params.id as string, req.body);
      sendSuccess(res, venue);
    } catch (err) { next(err); }
  },

  async remove(req: Request, res: Response, next: NextFunction) {
    try {
      await venueService.remove(req.params.id as string);
      sendSuccess(res, null, "Venue deleted");
    } catch (err) { next(err); }
  },
};
