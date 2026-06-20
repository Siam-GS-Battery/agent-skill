# Database Schema — Inventory Tracker (Phase 3)

Status: **Approved** (delegated). PostgreSQL. snake_case.

## Design decision: quantity is derived, not stored

Each item's current quantity = `SUM(stock_movements.change)`. Movements store a
**signed delta** (`in` = +, `out` = −, `adjust` = ±). Single source of truth, no
denormalized counter to drift out of sync.

<!-- ponytail: derived quantity via SUM, not a stored counter. Add a cached
     materialized column only if SUM measurably slows the list query. -->

## Tables

### users
| column | type | notes |
|---|---|---|
| id | SERIAL PK | |
| email | VARCHAR(255) UNIQUE NOT NULL | natural key |
| password_hash | VARCHAR(255) NOT NULL | bcrypt |
| name | VARCHAR(120) NOT NULL | |
| role | VARCHAR(20) NOT NULL DEFAULT 'staff' | CHECK in ('admin','staff') |
| is_active | BOOLEAN NOT NULL DEFAULT true | |
| created_at, updated_at | TIMESTAMP | trigger on updated_at |

### items
| column | type | notes |
|---|---|---|
| id | SERIAL PK | |
| sku | VARCHAR(60) UNIQUE NOT NULL | natural key |
| name | VARCHAR(160) NOT NULL | |
| unit | VARCHAR(20) NOT NULL DEFAULT 'pcs' | |
| reorder_level | INTEGER NOT NULL DEFAULT 0 | CHECK >= 0 |
| created_at, updated_at | TIMESTAMP | trigger |

Index: `idx_items_name` for search/sort.

### stock_movements
| column | type | notes |
|---|---|---|
| id | SERIAL PK | |
| item_id | INTEGER NOT NULL → items(id) ON DELETE CASCADE | |
| type | VARCHAR(10) NOT NULL | CHECK in ('in','out','adjust') |
| change | INTEGER NOT NULL | signed; CHECK <> 0 |
| note | TEXT | optional |
| created_by | INTEGER → users(id) ON DELETE SET NULL | |
| created_at | TIMESTAMP | (no updates → no updated_at) |

Indexes: `idx_movements_item_id` (FK, hot for SUM), `idx_movements_created_at`.

## View
`item_stock` = items LEFT JOIN movements, exposing `quantity` so list/dashboard
queries read one place.

## ON DELETE summary
- movements.item_id → CASCADE (movements die with their item).
- movements.created_by → SET NULL (keep history if a user is removed).

## Phase 3 gate
✅ PK + created_at/updated_at + trigger · ✅ FKs declare ON DELETE · ✅ indexes on FK + hot columns · ✅ unique + check constraints · ✅ data dictionary (above) · ✅ migration has UP/DOWN, idempotent · ✅ parameterized queries enforced in code.
