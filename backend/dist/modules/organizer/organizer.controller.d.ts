import { Request, Response, NextFunction } from "express";
export declare const organizerController: {
    becomeOrganizer(req: Request, res: Response, next: NextFunction): Promise<void>;
    profile(req: Request, res: Response, next: NextFunction): Promise<void>;
    updateProfile(req: Request, res: Response, next: NextFunction): Promise<void>;
    uploadLogo(req: Request, res: Response, next: NextFunction): Promise<void>;
    approve(req: Request, res: Response, next: NextFunction): Promise<void>;
    listPending(req: Request, res: Response, next: NextFunction): Promise<void>;
    dashboardSummary(req: Request, res: Response, next: NextFunction): Promise<void>;
};
//# sourceMappingURL=organizer.controller.d.ts.map