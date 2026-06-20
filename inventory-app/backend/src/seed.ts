import bcrypt from "bcryptjs";
import { query, pool } from "./db.js";

// Idempotent seed: one admin, one staff, a couple of items.
async function main() {
  const adminHash = await bcrypt.hash("admin123", 10);
  const staffHash = await bcrypt.hash("staff123", 10);
  await query(
    `INSERT INTO users (email, password_hash, name, role) VALUES
       ('admin@gsbattery.co.th', $1, 'Admin', 'admin'),
       ('staff@gsbattery.co.th', $2, 'Staff', 'staff')
     ON CONFLICT (email) DO NOTHING`,
    [adminHash, staffHash]
  );
  await query(
    `INSERT INTO items (sku, name, unit, reorder_level) VALUES
       ('BAT-12V-60', '12V 60Ah Battery', 'pcs', 5),
       ('BAT-12V-100', '12V 100Ah Battery', 'pcs', 3)
     ON CONFLICT (sku) DO NOTHING`
  );
  console.log("Seed complete. Logins: admin@gsbattery.co.th/admin123, staff@gsbattery.co.th/staff123");
  await pool.end();
}
main().catch((e) => { console.error(e); process.exit(1); });
