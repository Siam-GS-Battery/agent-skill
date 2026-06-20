import type { Request, Response } from "express";
import { ok } from "../../response.js";
import * as service from "./auth.service.js";

export async function login(req: Request, res: Response) {
  const result = await service.login(req.body);
  return ok(res, result);
}
