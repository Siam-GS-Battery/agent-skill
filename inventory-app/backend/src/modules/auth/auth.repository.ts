import { query } from "../../db.js";

export interface UserRow {
  id: number; email: string; password_hash: string;
  name: string; role: "admin" | "staff"; is_active: boolean;
}

export async function findByEmail(email: string): Promise<UserRow | null> {
  const rows = await query<UserRow>(
    "SELECT * FROM users WHERE email = $1 AND is_active = true",
    [email]
  );
  return rows[0] ?? null;
}
