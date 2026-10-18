import { Request, Response, NextFunction } from "express";
export declare const eventController: {
    listPublic(req: Request, res: Response, next: NextFunction): Promise<void>;
    getBySlug(req: Request, res: Response, next: NextFunction): Promise<void>;
    listOwn(req: Request, res: Response, next: NextFunction): Promise<void>;
    create(req: Request, res: Response, next: NextFunction): Promise<void>;
    update(req: Request, res: Response, next: NextFunction): Promise<void>;
    submit(req: Request, res: Response, next: NextFunction): Promise<void>;
    uploadBanner(req: Request, res: Response, next: NextFunction): Promise<void>;
    uploadGallery(req: Request, res: Response, next: NextFunction): Promise<void>;
    assignVenue(req: Request, res: Response, next: NextFunction): Promise<void>;
    assignArtists(req: Request, res: Response, next: NextFunction): Promise<void>;
    createTicketCategories(req: Request, res: Response, next: NextFunction): Promise<void>;
    remove(req: Request, res: Response, next: NextFunction): Promise<void>;
    listAll(req: Request, res: Response, next: NextFunction): Promise<void>;
    approve(req: Request, res: Response, next: NextFunction): Promise<void>;
    reject(req: Request, res: Response, next: NextFunction): Promise<void>;
    updateStatus(req: Request, res: Response, next: NextFunction): Promise<void>;
};
//# sourceMappingURL=event.controller.d.ts.map