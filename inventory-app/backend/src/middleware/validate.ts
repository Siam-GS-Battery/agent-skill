import type { Request, Response, NextFunction } from "express";
import { ZodError, type ZodTypeAny } from "zod";

type Schemas = { body?: ZodTypeAny; query?: ZodTypeAny; params?: ZodTypeAny };

// Validate body/query/params. Invalid -> 400 with structured errors[].
export function validate(schemas: Schemas) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      if (schemas.body) req.body = schemas.body.parse(req.body);
      if (schemas.query) req.query = schemas.query.parse(req.query) as never;
      if (schemas.params) req.params = schemas.params.parse(req.params) as never;
      next();
    } catch (err) {
      if (err instanceof ZodError) {
        return res.status(400).json({
          success: false,
          message: "Validation failed",
          errors: err.errors.map((e) => ({ field: e.path.join("."), message: e.message })),
        });
      }
      next(err);
    }
  };
}
