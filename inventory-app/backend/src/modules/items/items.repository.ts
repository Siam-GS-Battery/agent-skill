import { query } from "../../db.js";
import type { CreateItemInput, UpdateItemInput, ListQuery } from "./items.schema.js";

export interface ItemRow {
  id: number; sku: string; name: string; unit: string;
  reorder_level: number; quantity: number;
}

export async function list(q: ListQuery): Promise<{ rows: ItemRow[]; total: number }> {
  const where = q.search ? "WHERE name ILIKE $1 OR sku ILIKE $1" : "";
  const params: unknown[] = q.search ? [`%${q.search}%`] : [];
  const offset = (q.page - 1) * q.pageSize;
  const rows = await query<ItemRow>(
    `SELECT * FROM item_stock ${where} ORDER BY name ASC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`,
    [...params, q.pageSize, offset]
  );
  const countRows = await query<{ count: string }>(
    `SELECT COUNT(*)::int AS count FROM items ${where}`,
    params
  );
  return { rows, total: Number(countRows[0]?.count ?? 0) };
}

export async function findById(id: number): Promise<ItemRow | null> {
  const rows = await query<ItemRow>("SELECT * FROM item_stock WHERE id = $1", [id]);
  return rows[0] ?? null;
}

export async function findBySku(sku: string): Promise<{ id: number } | null> {
  const rows = await query<{ id: number }>("SELECT id FROM items WHERE sku = $1", [sku]);
  return rows[0] ?? null;
}

export async function create(input: Required<CreateItemInput>): Promise<ItemRow> {
  const rows = await query<ItemRow>(
    `INSERT INTO items (sku, name, unit, reorder_level) VALUES ($1,$2,$3,$4)
     RETURNING *, 0 AS quantity`,
    [input.sku, input.name, input.unit, input.reorder_level]
  );
  return rows[0];
}

export async function update(id: number, input: UpdateItemInput): Promise<void> {
  const fields = Object.keys(input);
  if (fields.length === 0) return;
  const set = fields.map((f, i) => `${f} = $${i + 2}`).join(", ");
  await query(`UPDATE items SET ${set} WHERE id = $1`, [id, ...Object.values(input)]);
}

export async function remove(id: number): Promise<void> {
  await query("DELETE FROM items WHERE id = $1", [id]);
}
