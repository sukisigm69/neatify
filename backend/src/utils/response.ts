import { Response } from "express";

export function sendSuccess(res: Response, data: any = null, message = "Success", statusCode = 200) {
  return res.status(statusCode).json({ success: true, message, data });
}

export function sendCreated(res: Response, data: any = null, message = "Created") {
  return sendSuccess(res, data, message, 201);
}
