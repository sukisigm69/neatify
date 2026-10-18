import { Request, Response, NextFunction } from "express";
export declare const orderController: {
    checkout(req: Request, res: Response, next: NextFunction): Promise<void>;
    getById(req: Request, res: Response, next: NextFunction): Promise<void>;
    getOrderDetail(req: Request, res: Response, next: NextFunction): Promise<void>;
    listMy(req: Request, res: Response, next: NextFunction): Promise<void>;
    list(req: Request, res: Response, next: NextFunction): Promise<void>;
    cancel(req: Request, res: Response, next: NextFunction): Promise<void>;
};
//# sourceMappingURL=order.controller.d.ts.map