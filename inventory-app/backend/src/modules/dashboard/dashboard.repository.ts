import { query } from "../../db.js";
import type { ItemRow } from "../items/items.repository.js";

export async function totalItems(): Promise<number> {
  const rows = await query<{ count: string }>("SELECT COUNT(*)::int AS count FROM items");
  return Number(rows[0]?.count ?? 0);
}
export async function lowStock(): Promise<ItemRow[]> {
  return query<ItemRow>(
    "SELECT * FROM item_stock WHERE quantity <= reorder_level ORDER BY quantity ASC"
  );
}
