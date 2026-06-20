import type { Request, Response } from "express";
import { ok, okList } from "../../response.js";
import * as service from "./items.service.js";

export async function list(req: Request, res: Response) {
  const q = req.query as unknown as import("./items.schema.js").ListQuery;
  const { rows, total } = await service.list(q);
  return okList(res, rows, { page: q.page, pageSize: q.pageSize, total });
}
export async function getById(req: Request, res: Response) {
  return ok(res, await service.getById(Number(req.params.id)));
}
export async function create(req: Request, res: Response) {
  return ok(res, await service.create(req.body), 201);
}
export async function update(req: Request, res: Response) {
  return ok(res, await service.update(Number(req.params.id), req.body));
}
export async function remove(req: Request, res: Response) {
  await service.remove(Number(req.params.id));
  return ok(res, { deleted: true });
}
