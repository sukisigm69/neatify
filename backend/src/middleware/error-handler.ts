import { Request, Response, NextFunction } from "express";
import { ApiError } from "../utils/api-error";

export function errorHandler(err: Error, _req: Request, res: Response, _next: NextFunction) {
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      errors: err.errors,
    });
  }

  console.error("[ERROR]", err);
  return res.status(500).json({
    success: false,
    message: process.env.NODE_ENV === "development" ? err.message : "Internal server error",
  });
}
