-- 20260620_init.sql — Inventory Tracker initial schema
-- Idempotent / re-runnable. DOWN is commented (destructive — run manually with approval).

-- ===== UP =====

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TABLE IF NOT EXISTS users (
    id            SERIAL PRIMARY KEY,
    email         VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name          VARCHAR(120) NOT NULL,
    role          VARCHAR(20)  NOT NULL DEFAULT 'staff' CHECK (role IN ('admin','staff')),
    is_active     BOOLEAN      NOT NULL DEFAULT true,
    created_at    TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
    updated_at    TIMESTAMP    DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS items (
    id            SERIAL PRIMARY KEY,
    sku           VARCHAR(60)  UNIQUE NOT NULL,
    name          VARCHAR(160) NOT NULL,
    unit          VARCHAR(20)  NOT NULL DEFAULT 'pcs',
    reorder_level INTEGER      NOT NULL DEFAULT 0 CHECK (reorder_level >= 0),
    created_at    TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
    updated_at    TIMESTAMP    DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_items_name ON items (name);

CREATE TABLE IF NOT EXISTS stock_movements (
    id         SERIAL PRIMARY KEY,
    item_id    INTEGER NOT NULL REFERENCES items(id) ON DELETE CASCADE,
    type       VARCHAR(10) NOT NULL CHECK (type IN ('in','out','adjust')),
    change     INTEGER NOT NULL CHECK (change <> 0),
    note       TEXT,
    created_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_movements_item_id    ON stock_movements (item_id);
CREATE INDEX IF NOT EXISTS idx_movements_created_at ON stock_movements (created_at DESC);

-- triggers (drop-if-exists keeps this re-runnable without erroring)
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_items_updated_at ON items;
CREATE TRIGGER update_items_updated_at BEFORE UPDATE ON items
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- derived current quantity
CREATE OR REPLACE VIEW item_stock AS
SELECT i.*, COALESCE(SUM(m.change), 0)::int AS quantity
FROM items i
LEFT JOIN stock_movements m ON m.item_id = i.id
GROUP BY i.id;

-- ===== DOWN (manual, destructive) =====
-- DROP VIEW IF EXISTS item_stock;
-- DROP TABLE IF EXISTS stock_movements;
-- DROP TABLE IF EXISTS items;
-- DROP TABLE IF EXISTS users;
-- DROP FUNCTION IF EXISTS update_updated_at_column();
