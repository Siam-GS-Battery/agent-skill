import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { ENV } from "../env.js";
import { UnauthorizedError, ForbiddenError } from "../errors.js";

export interface AuthUser { id: number; role: "admin" | "staff"; }
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express { interface Request { user?: AuthUser; } }
}

export function authenticate(req: Request, _res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) throw new UnauthorizedError("Missing token");
  try {
    req.user = jwt.verify(header.slice(7), ENV.JWT_SECRET) as AuthUser;
    next();
  } catch {
    throw new UnauthorizedError("Invalid token");
  }
}

export function authorize(...roles: AuthUser["role"][]) {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) throw new ForbiddenError();
    next();
  };
}
