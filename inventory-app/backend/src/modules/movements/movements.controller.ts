import type { Request, Response } from "express";
import { ok, okList } from "../../response.js";
import * as service from "./movements.service.js";

export async function create(req: Request, res: Response) {
  const movement = await service.create(req.body, req.user?.id ?? null);
  return ok(res, movement, 201);
}
export async function list(req: Request, res: Response) {
  const q = req.query as unknown as import("./movements.schema.js").ListMovementQuery;
  const { rows, total } = await service.list(q);
  return okList(res, rows, { page: q.page, pageSize: q.pageSize, total });
}
