import { Request, Response, NextFunction } from "express";
export declare const ticketController: {
    list(req: Request, res: Response, next: NextFunction): Promise<void>;
    listMy(req: Request, res: Response, next: NextFunction): Promise<void>;
    listByOrder(req: Request, res: Response, next: NextFunction): Promise<void>;
    getById(req: Request, res: Response, next: NextFunction): Promise<void>;
    download(req: Request, res: Response, next: NextFunction): Promise<void>;
    scan(req: Request, res: Response, next: NextFunction): Promise<void>;
};
//# sourceMappingURL=ticket.controller.d.ts.map