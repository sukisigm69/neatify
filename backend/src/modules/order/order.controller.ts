import { Request, Response, NextFunction } from "express";
import { orderService } from "./order.service";
import { sendSuccess, sendCreated } from "../../utils/response";

export const orderController = {
  async checkout(req: Request, res: Response, next: NextFunction) {
    try {
      const order = await orderService.checkout(req.user!.userId, req.body);
      sendCreated(res, order, "Order created successfully");
    } catch (err) { next(err); }
  },

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = (req.params.orderId || req.params.id) as string;
      const order = await orderService.getById(id, req.user!.userId, req.user!.role);
      sendSuccess(res, order);
    } catch (err) { next(err); }
  },

  async getOrderDetail(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.orderId as string;
      const order = await orderService.getOrderDetail(id, req.user!.userId, req.user!.role);
      sendSuccess(res, order);
    } catch (err) { next(err); }
  },

  async listMy(req: Request, res: Response, next: NextFunction) {
    try {
      const { page = 1, limit = 10, sortBy, search, status } = res.locals.orderQuery;
      
      const result = await orderService.listMyOrders(req.user!.userId, {
        page,
        limit,
        sortBy,
        search,
        status,
      });
      sendSuccess(res, result);
    } catch (err) { next(err); }
  },

  async list(req: Request, res: Response, next: NextFunction) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const result = await orderService.list(req.user!.userId, req.user!.role, page, limit);
      sendSuccess(res, result);
    } catch (err) { next(err); }
  },

  async cancel(req: Request, res: Response, next: NextFunction) {
    try {
      const order = await orderService.cancelOrder(req.params.id as string, req.user!.userId, req.user!.role);
      sendSuccess(res, order, "Order cancelled successfully");
    } catch (err) { next(err); }
  },
};
