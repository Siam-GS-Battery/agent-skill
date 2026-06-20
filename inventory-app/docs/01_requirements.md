# GS Battery Inventory Tracker — Requirements (Phase 1)

Status: **Approved** (delegated by product owner — "anything, full app").
Date: 2026-06-20.

## Product

Internal tool for warehouse staff to track battery/parts stock: catalogue items,
record stock movements (in/out/adjust), and see current quantities at a glance.

## MoSCoW

| Priority | Requirement |
|---|---|
| **Must** | User login (JWT). Items CRUD. Record stock movements (in/out/adjust). Current quantity derived from movements. Dashboard: total items, low-stock list. Zod-validated API, standard response shape. |
| **Should** | Search/filter items by name/SKU. Pagination on lists. Role gate (admin vs staff) on delete. |
| **Could** | CSV export. Per-item movement history view. |
| **Won't (now)** | Multi-warehouse, supplier management, purchase orders, barcode scanning. |

## User stories + Acceptance Criteria

**Auth**
- *As a staff member, I want to log in, so that only authorised people change stock.*
  - AC1: Valid email+password → 200 with a JWT and user object (no password hash).
  - AC2: Wrong password → 401, generic message.
  - AC3: Protected endpoints without a valid token → 401.

**Items**
- *As staff, I want to add/edit/list/delete items, so that the catalogue stays current.*
  - AC1: Create with name, sku, unit, reorder_level → 201, item returned, `quantity` starts 0.
  - AC2: Duplicate sku → 409.
  - AC3: List returns items with current quantity + pagination metadata.
  - AC4: Missing/invalid fields → 400 with `errors[]`.
  - AC5: Delete is admin-only → 403 for staff.

**Movements**
- *As staff, I want to record stock in/out/adjust, so that quantities stay accurate.*
  - AC1: Movement `in` with qty 10 raises that item's quantity by 10 → 201.
  - AC2: Movement `out` that would drop quantity below 0 → 400.
  - AC3: Movement references a non-existent item → 404.

**Dashboard**
- *As staff, I want a dashboard, so that I see stock health fast.*
  - AC1: Returns total item count and items where `quantity <= reorder_level`.
  - AC2: Empty catalogue → totals are 0 and an empty low-stock list (not an error).

## Non-functional requirements

- **Auth model:** JWT bearer, 8h expiry; bcrypt (saltRounds 10) password hashing.
- **Validation:** every body/query/params via Zod; one standard response shape.
- **Performance:** P95 < 2s on list/dashboard (indexes on FK + hot columns).
- **Security:** parameterized SQL only; secrets in env; no secrets committed.
- **Coverage:** BE unit ≥ 80% on service logic; every endpoint has ≥ happy-path integration test.

## DoR / DoD

**DoR:** each story above has a description, ≥1 AC, fits 1–3 days, estimated, unblocked. UI stories carry the brand tokens (Phase 2); API stories carry the schema (Phase 3). ✓

**DoD:** AC met · unit tests for new logic · lint+typecheck+tests+build green · no console.log/hardcoded values · standard response shape · docs updated. ✓

## Phase 1 gate

✅ MoSCoW · ✅ every story has AC · ✅ NFRs stated · ✅ DoR/DoD agreed · ✅ roadmap (this doc) linked.
