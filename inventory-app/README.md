# GS Battery Inventory Tracker

Internal stock tracker built to the SOP-SDLC standard: React + TS + Tailwind
front end, Node + Express + TS back end, PostgreSQL. Auth + items + stock
movements (in/out/adjust) + dashboard. Item quantity is **derived** from the sum
of movements — one source of truth, no counter to drift.

## SDLC artifacts (phase gates)

- `docs/01_requirements.md` — MoSCoW, user stories, AC, NFRs, DoR/DoD (Phase 1 ✅)
- `docs/03_schema.md` — schema document, approved before SQL (Phase 3 ✅)
- `migrations/20260620_init.sql` — idempotent UP + commented DOWN

## Run it with Docker (one command)

Prereq: Docker Desktop.

```bash
docker compose up --build
```

Then open **http://localhost:8080** (login `admin@gsbattery.co.th` / `admin123`).
Compose brings up three services: PostgreSQL (schema auto-applied from
`migrations/` on first boot), the Express API on `:4000` (runs the idempotent
seed, then starts), and the React build served by nginx on `:8080` with `/api`
proxied to the backend. `docker compose down -v` resets the database.

## Run it locally (without Docker)

Prereqs: Node 20+, PostgreSQL.

```bash
# 1. Database
createdb inventory
psql inventory -f migrations/20260620_init.sql

# 2. Backend
cd backend
cp .env.example .env          # set DATABASE_URL + JWT_SECRET
npm install
npm run seed                  # admin@gsbattery.co.th/admin123, staff@.../staff123
npm run dev                   # http://localhost:4000  (health: /api/health)

# 3. Frontend (new terminal)
cd frontend
npm install
npm run dev                   # http://localhost:5173  (proxies /api -> :4000)
```

## Quality gates (verified)

- Backend: `npm run typecheck` (0 errors) · `npm test` → **10/10 pass**, movements
  service 100% covered.
- Frontend: `npm run build` → tsc + vite build clean.

## What's deliberately scoped out (ultra/YAGNI)

- Single migration file, not a runner/CLI — `psql -f` is enough until there's a 2nd migration.
- Quantity via `SUM(change)` view, not a cached column — add the column only if the list query measurably slows.
- No multi-warehouse / suppliers / PO / barcode (MoSCoW "Won't, now").
- Sandbox live preview (Phase 4.5) wasn't run here — no Postgres in this build
  environment. Follow "Run it" above to bring it up locally; the dev servers and
  `/api/health` are wired and ready.
