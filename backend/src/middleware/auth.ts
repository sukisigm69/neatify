import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { ApiError } from "../utils/api-error";
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

export function requireAuth() {
  return (req: Request, _res: Response, next: NextFunction) => {
    const header = req.headers.authorization;
    if (!header?.startsWith("Bearer ")) {
      return next(ApiError.unauthorized("Missing token"));
    }

    const token = header.slice(7).trim();
    if (!token) return next(ApiError.unauthorized("Missing token"));

    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET!) as AuthUser;
      if (!payload.userId || !payload.role) return next(ApiError.unauthorized("Invalid token"));
      req.user = payload;
      next();
    } catch {
      next(ApiError.unauthorized("Invalid token"));
    }
  };
}

export function allowRoles(...roles: roles_name[]) {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) return next(ApiError.unauthorized());
    if (!roles.includes(req.user.role)) return next(ApiError.forbidden());
    next();
  };
}

export const authMiddleware = requireAuth;
export const roleMiddleware = allowRoles;
export const authenticate = requireAuth();
export const authorize = allowRoles;
export type JwtPayload = AuthUser;
