import pg from "pg";
import { ENV } from "./env.js";

// Single shared pool. Parameterized queries only — never string-interpolate SQL.
export const pool = new pg.Pool({ connectionString: ENV.DATABASE_URL });

export async function query<T extends pg.QueryResultRow = pg.QueryResultRow>(
  text: string,
  params: unknown[] = []
): Promise<T[]> {
  const res = await pool.query<T>(text, params as never[]);
  return res.rows;
}
