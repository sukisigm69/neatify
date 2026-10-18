import { Request, Response, NextFunction } from "express";
import { eventService } from "./event.service";
import { sendSuccess, sendCreated } from "../../utils/response";

export const eventController = {
  // Public
  async listPublic(req: Request, res: Response, next: NextFunction) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const search = req.query.search as string | undefined;
      const result = await eventService.listPublic(page, limit, search);
      sendSuccess(res, result);
    } catch (err) { next(err); }
  },

  async getBySlug(req: Request, res: Response, next: NextFunction) {
    try {
      const event = await eventService.getBySlug(req.params.slug as string);
      sendSuccess(res, event);
    } catch (err) { next(err); }
  },

  // Organizer
  async listOwn(req: Request, res: Response, next: NextFunction) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const result = await eventService.listByOrganizer(req.user!.userId, page, limit);
      sendSuccess(res, result);
    } catch (err) { next(err); }
  },

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const event = await eventService.create(req.user!.userId, req.body);
      sendCreated(res, event);
    } catch (err) { next(err); }
  },

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const event = await eventService.update(req.user!.userId, req.params.id as string, req.body);
      sendSuccess(res, event);
    } catch (err) { next(err); }
  },

  async submit(req: Request, res: Response, next: NextFunction) {
    try {
      const event = await eventService.submit(req.user!.userId, req.params.id as string);
      sendSuccess(res, event, "Event submitted for approval");
    } catch (err) { next(err); }
  },

  async uploadBanner(req: Request, res: Response, next: NextFunction) {
    try {
      const event = await eventService.uploadBanner(req.user!.userId, req.params.id as string, req.body.banner);
      sendSuccess(res, event, "Event banner updated");
    } catch (err) { next(err); }
  },

  async uploadGallery(req: Request, res: Response, next: NextFunction) {
    try {
      const event = await eventService.uploadGallery(req.user!.userId, req.params.id as string, req.body.images);
      sendSuccess(res, event, "Event gallery updated");
    } catch (err) { next(err); }
  },

  async assignVenue(req: Request, res: Response, next: NextFunction) {
    try {
      const event = await eventService.assignVenue(req.user!.userId, req.params.id as string, req.body.venueId);
      sendSuccess(res, event, "Event venue updated");
    } catch (err) { next(err); }
  },

  async assignArtists(req: Request, res: Response, next: NextFunction) {
    try {
      const event = await eventService.assignArtists(req.user!.userId, req.params.id as string, req.body.artistIds);
      sendSuccess(res, event, "Event artists updated");
    } catch (err) { next(err); }
  },

  async createTicketCategories(req: Request, res: Response, next: NextFunction) {
    try {
      const event = await eventService.createTicketCategories(req.user!.userId, req.params.id as string, req.body.ticketCategories);
      sendCreated(res, event, "Ticket categories created");
    } catch (err) { next(err); }
  },

  async remove(req: Request, res: Response, next: NextFunction) {
    try {
      await eventService.remove(req.user!.userId, req.params.id as string);
      sendSuccess(res, null, "Event deleted");
    } catch (err) { next(err); }
  },

  // Admin
  async listAll(req: Request, res: Response, next: NextFunction) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const status = req.query.status as string | undefined;
      const result = await eventService.listAll(page, limit, status as any);
      sendSuccess(res, result);
    } catch (err) { next(err); }
  },

  async approve(req: Request, res: Response, next: NextFunction) {
    try {
      const event = await eventService.approve(req.params.id as string);
      sendSuccess(res, event, "Event approved");
    } catch (err) { next(err); }
  },

  async reject(req: Request, res: Response, next: NextFunction) {
    try {
      const event = await eventService.reject(req.params.id as string);
      sendSuccess(res, event, "Event rejected");
    } catch (err) { next(err); }
  },

  async updateStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const event = await eventService.updateStatus(req.params.id as string, req.body.status);
      sendSuccess(res, event, "Event status updated");
    } catch (err) { next(err); }
  },
};
