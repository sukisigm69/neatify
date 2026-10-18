import { Request, Response, NextFunction } from "express";
import { artistService } from "./artist.service";
import { sendSuccess, sendCreated } from "../../utils/response";

export const artistController = {
  async list(req: Request, res: Response, next: NextFunction) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const result = req.user!.role === "ORGANIZER"
        ? await artistService.listOwn(req.user!.userId, page, limit)
        : await artistService.listAll(page, limit);
      sendSuccess(res, result);
    } catch (err) { next(err); }
  },

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const artist = await artistService.getById(req.params.id as string);
      sendSuccess(res, artist);
    } catch (err) { next(err); }
  },

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const artist = await artistService.create(req.user!.userId, req.body);
      sendCreated(res, artist);
    } catch (err) { next(err); }
  },

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const artist = await artistService.update(req.user!.userId, req.params.id as string, req.body);
      sendSuccess(res, artist);
    } catch (err) { next(err); }
  },

  async uploadImage(req: Request, res: Response, next: NextFunction) {
    try {
      const artist = await artistService.uploadImage(req.user!.userId, req.params.id as string, req.body.image);
      sendSuccess(res, artist, "Artist image updated");
    } catch (err) { next(err); }
  },

  async remove(req: Request, res: Response, next: NextFunction) {
    try {
      await artistService.remove(req.user!.userId, req.params.id as string);
      sendSuccess(res, null, "Artist deleted");
    } catch (err) { next(err); }
  },
};
