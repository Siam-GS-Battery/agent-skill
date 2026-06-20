import type { Request, Response, NextFunction } from "express";
import { AppError } from "../errors.js";

// Global handler: custom errors -> their status; anything else -> generic 500.
// Never echo internal err.message for unhandled errors.
export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction) {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({ success: false, message: err.message });
  }
  console.error("Unhandled error:", err);
  return res.status(500).json({ success: false, message: "Internal server error" });
}
