import { query } from "../../db.js";
import type { ListMovementQuery } from "./movements.schema.js";

export interface MovementRow {
  id: number; item_id: number; type: string; change: number;
  note: string | null; created_by: number | null; created_at: string;
}

export async function currentQuantity(itemId: number): Promise<number | null> {
  const rows = await query<{ quantity: number }>(
    "SELECT quantity FROM item_stock WHERE id = $1",
    [itemId]
  );
  return rows[0] ? Number(rows[0].quantity) : null;
}

export async function insert(
  itemId: number, type: string, change: number, note: string | null, userId: number | null
): Promise<MovementRow> {
  const rows = await query<MovementRow>(
    `INSERT INTO stock_movements (item_id, type, change, note, created_by)
     VALUES ($1,$2,$3,$4,$5) RETURNING *`,
    [itemId, type, change, note, userId]
  );
  return rows[0];
}

export async function list(q: ListMovementQuery): Promise<{ rows: MovementRow[]; total: number }> {
  const where = q.item_id ? "WHERE item_id = $1" : "";
  const params: unknown[] = q.item_id ? [q.item_id] : [];
  const offset = (q.page - 1) * q.pageSize;
  const rows = await query<MovementRow>(
    `SELECT * FROM stock_movements ${where} ORDER BY created_at DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`,
    [...params, q.pageSize, offset]
  );
  const countRows = await query<{ count: string }>(
    `SELECT COUNT(*)::int AS count FROM stock_movements ${where}`,
    params
  );
  return { rows, total: Number(countRows[0]?.count ?? 0) };
}
