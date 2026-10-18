import { Request, Response, NextFunction } from "express";
import { roles_name } from "@prisma/client";
export interface AuthUser {
    userId: string;
    role: roles_name;
}
declare global {
    namespace Express {
        interface Request {
            user?: AuthUser;
        }
    }
}
export declare function requireAuth(): (req: Request, _res: Response, next: NextFunction) => void;
export declare function allowRoles(...roles: roles_name[]): (req: Request, _res: Response, next: NextFunction) => void;
export declare const authMiddleware: typeof requireAuth;
export declare const roleMiddleware: typeof allowRoles;
export declare const authenticate: (req: Request, _res: Response, next: NextFunction) => void;
export declare const authorize: typeof allowRoles;
export type JwtPayload = AuthUser;
//# sourceMappingURL=auth.d.ts.map