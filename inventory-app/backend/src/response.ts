import type { Response } from "express";

export function ok(res: Response, data: unknown, status = 200) {
  return res.status(status).json({ success: true, data });
}
export function okList(
  res: Response,
  data: unknown[],
  pagination: { page: number; pageSize: number; total: number }
) {
  const totalPages = Math.max(1, Math.ceil(pagination.total / pagination.pageSize));
  return res.json({ success: true, data, pagination: { ...pagination, totalPages } });
}
