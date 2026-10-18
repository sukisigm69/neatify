import { Request, Response, NextFunction } from "express";
import { ticketCategoryService } from "./ticket-category.service";
import { sendSuccess, sendCreated } from "../../utils/response";

export const ticketCategoryController = {
  async listByEvent(req: Request, res: Response, next: NextFunction) {
    try {
      const categories = await ticketCategoryService.listByEvent(req.params.eventId as string);
      sendSuccess(res, categories);
    } catch (err) { next(err); }
  },

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const cat = await ticketCategoryService.create(req.params.eventId as string, req.user!.userId, req.body);
      sendCreated(res, cat);
    } catch (err) { next(err); }
  },

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const cat = await ticketCategoryService.update(req.params.id as string, req.user!.userId, req.body);
      sendSuccess(res, cat);
    } catch (err) { next(err); }
  },

  async remove(req: Request, res: Response, next: NextFunction) {
    try {
      await ticketCategoryService.remove(req.params.id as string, req.user!.userId);
      sendSuccess(res, null, "Ticket category deleted");
    } catch (err) { next(err); }
  },
};
