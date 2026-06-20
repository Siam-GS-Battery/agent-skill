import type { Request, Response, NextFunction, RequestHandler } from "express";
// ponytail: one wrapper kills try/catch boilerplate in every controller.
export const asyncHandler =
  (fn: (req: Request, res: Response, next: NextFunction) => Promise<unknown>): RequestHandler =>
  (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
