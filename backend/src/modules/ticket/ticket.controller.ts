import { Request, Response, NextFunction } from "express";
import { ticketService } from "./ticket.service";
import { sendSuccess } from "../../utils/response";

export const ticketController = {
  async list(req: Request, res: Response, next: NextFunction) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const result = await ticketService.list(req.user!.userId, req.user!.role, page, limit);
      sendSuccess(res, result);
    } catch (err) { next(err); }
  },

  async listMy(req: Request, res: Response, next: NextFunction) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const result = await ticketService.listMyTickets(req.user!.userId, page, limit);
      sendSuccess(res, result);
    } catch (err) { next(err); }
  },

  async listByOrder(req: Request, res: Response, next: NextFunction) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const result = await ticketService.listByOrder(req.params.orderId as string, req.user!.userId, req.user!.role, page, limit);
      sendSuccess(res, result);
    } catch (err) { next(err); }
  },

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = (req.params.ticketId || req.params.id) as string;
      const ticket = await ticketService.getById(id, req.user!.userId, req.user!.role);
      sendSuccess(res, ticket);
    } catch (err) { next(err); }
  },

  async download(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await ticketService.downloadTicket(req.params.ticketId as string, req.user!.userId, req.user!.role);
      sendSuccess(res, data);
    } catch (err) { next(err); }
  },

  async scan(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await ticketService.scanTicket(req.body.qrCode, req.user!.userId, req.body.location);
      sendSuccess(res, result, "Scan successful");
    } catch (err) { next(err); }
  },
};
