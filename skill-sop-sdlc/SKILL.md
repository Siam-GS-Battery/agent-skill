---
name: sopify-sdlc
description: "GS Battery end-to-end SDLC SOP — one self-contained playbook for the whole lifecycle, derived directly from the team's SOP-SDLC documentation. Covers requirements (MoSCoW, user stories, acceptance criteria, DoR/DoD), design (Figma Make brand guideline: colors, IBM Plex Sans typography, spacing, responsive), database (PostgreSQL schema, naming, constraints, indexes, triggers, migrations, RLS), development (Code Standard SOP-DEV-001: TypeScript strict, MVC layering, Zod validation, standard API response shape, security), testing (Vitest/Supertest/k6, coverage targets, quality gates), git workflow (branching, Conventional Commits, PR + code review), and deploy (Railway + AWS: EC2/RDS/S3/CloudFront/WAF, secrets, go-live). The full SOP with every template, worked example, and step-by-step guide lives in the bundled ref/ folder — consult it when working a phase. Apply at every phase. Treat every rule below as binding — work was rejected for skipping validation, tests, or pushing straight to main."
metadata:
  version: 1.1.0
  hermes:
    tags: [gs-battery, sopify-vibe, sdlc, requirements, design, database, backend, testing, git, deploy, aws, supabase, react, typescript, postgresql]
---

# sopify-sdlc — GS Battery End-to-End SDLC SOP

You are building a GS Battery internal product across the **full software development life cycle**. This skill is the single source of truth and is derived directly from the team's SOP-SDLC documentation — it stands on its own and does not depend on any other skill. The stack is fixed: **React + TypeScript + Tailwind CSS** on the frontend, **Node.js + Express + TypeScript** on the backend, **PostgreSQL** (via Supabase / RDS) for data, deployed on **Railway** (managed) or **AWS** (EC2 + RDS + S3 + CloudFront + WAF). Treat every rule below as binding — work that ignores them gets rejected at review.

## Operating Model — how Sopify runs in Claude Cowork

Sopify is a **Working Procedure**, not an app. A Non-Dev User runs it inside Claude Cowork to build a Web App to this SOP, then ships it to Github and Railway.

### One-time setup
- **IT** connects the **Supabase MCP Server** to Cowork.
- The **User creates their own Github account**, then connects the **Github Connection** in Cowork — the user logs in themselves (credentials are never entered on their behalf). Repo: `https://github.com/SiamGS-Sopify`.

### Entry point — `/sop`
The user types **`/sop`** to start. This skill is a **single hub** that links every phase. It is **non-linear**: the user may enter any phase first and jump back and forth freely; the skill keeps each phase's state and artifacts. Free navigation does **not** waive the gates — a phase's output is only "final" once its quality gate passes, and Push is blocked until every phase is complete.

### Phase order (non-linear, revisit allowed)
Brainstorm → Design (Frontend) → Backend (API) → Database → Test Cases → Push to Github. The order in between is flexible; the **Gate is the single completeness check** before pushing.

### Connections used per phase
- **Database phase → Supabase:** when the user reaches Database, they ask IT to create a Supabase project; IT returns the **Token** (URL + anon key + service key) via a secure channel; the user connects it via the **Supabase MCP** in Cowork, then runs schema/migrations. Never commit the token — keep it in env.
- **Push phase → Github:** push code to `SiamGS-Sopify` through the **Github Connection** (no zip handoff).

### Deploy loop — Railway
- **First time:** IT links the Github repo to **Railway** (service, env, build/start, `GET /api/health`).
- **After that:** the user edits via Cowork → **auto push to `main`** → **Railway auto-deploys**. This is the continuous maintenance / development loop.

The phase details below define *how* to do each phase to standard; the operating model above defines *how the user moves through them and ships*.

## The SDLC journey (do not skip phases)

```
0. Onboarding → 1. Requirements → 2. Design → 3. Database → 4. Development → 5. Deploy → 6. Testing
                                                     ↑___________ 7. Git Workflow runs across ALL phases ___________↑
```

Each phase has a **gate** that must pass before the next begins. Do not start a downstream phase on an unapproved upstream artifact: API shape derives from the schema, the schema derives from requirements, and the UI derives from acceptance criteria. Churn upstream means wasted work downstream.

> Numbering note: the SOP labels Deploy as Phase 5 and Testing as Phase 6, but you always **test before you deploy**. This skill keeps the SOP labels for traceability while presenting Testing (Phase 6) before Deploy (Phase 5) in the order you actually work.

## Reference library — the full SOP lives in `ref/`

This SKILL.md is the operating summary: enough to work to standard on the common path. The team's complete SOP — every template, worked example, full schema, code-standard guide, step-by-step deploy, and the AWS build-out — lives in the `ref/` folder beside this file. The summary tells you *what* the rule is; the reference tells you *exactly how* to satisfy it, with examples.

Pull the matching reference into context when you're actually doing that phase's work, when a gate item is unclear, or when you need a template/example rather than a rule. Don't preload everything — read the one file you need, when you need it. Each folder has an `INDEX.md` listing its documents; the descriptions are in Thai but the documents themselves are bilingual (Thai prose, English code and terms).

| Phase | When to read | Key reference files |
|---|---|---|
| 0 · Onboarding | new env / access / audit setup | `ref/00_ONBOARDING/` — Welcome, Development_Setup, Access_Request, Audit_Checklist |
| 1 · Requirements | writing stories, AC, DoR/DoD | `ref/01_REQUIREMENTS/` — 1.1 MoSCoW, 1.2 User_Story, 1.3 Acceptance_Criteria, 1.5 Definition_of_Ready_Done |
| 2 · Design | wireframes / UI to brand | `ref/02_DESIGN/` — 2.1 Wireframe_with_Figma_Make, 2.2 UI_Design_with_Figma_Make |
| 3 · Database | schema doc + migrations | `ref/03_DATABASE/` — 3.1 ERD, 3.2 Database_Schema_Document, 3.3 Migration_from_Figma_DataContext |
| 4 · Development | any backend/frontend code | `ref/04_DEVELOPMENT/Code_Standard_Guide.md` (⭐ SOP-DEV-001, read first), 4.1 Project_Init, 4.1.1 Dependencies, 4.2 Import_Wireframes, 4.3 Database_Design, 4.4 Backend_Project, 4.5 Frontend_Integration |
| 6 · Testing | writing tests / pre-release | `ref/06_TESTING/` — 6.1 Strategy, 6.2 Unit, 6.3 Integration, 6.4 Performance, 6.5 Security, UAT_Scenario_Template |
| 7 · Git Workflow | branching, commits, PRs | `ref/07_GIT_WORKFLOW/` — 7.1 Branching, 7.2 Commit, 7.3 Pull_Request, 7.4 Code_Review, 7.5 GitHub_Actions_CI |
| 5 · Deploy (Railway) | shipping to Railway | `ref/05_DEPLOY/` — 5.2 Pre_Deploy_Checklist, 5.3 Environment_Variables, 5.4 Deploy_Steps, 5.5 Post_Deploy_Verification, 5.6 Troubleshooting |
| 5 · Deploy (AWS) | EC2/RDS/S3/CloudFront/WAF build | `ref/08_AWS/` — 8.0 Overview → 8.7 CICD, 8.8 Go_Live_Checklist |

If a request maps cleanly to one phase (e.g. "write the migration", "set up the CI workflow"), open that phase's reference first so you reproduce the team's exact format rather than a generic one.

---

## Phase 1 — Requirements

Produce a requirements set before any design or code. It must contain:

- **MoSCoW prioritisation** — every requirement tagged Must / Should / Could / Won't.
- **User stories** — `As a <role>, I want <goal>, so that <benefit>`, grouped by role and feature.
- **Acceptance criteria (AC)** — at least one testable criterion per story; AC become the UAT scenarios and the test cases.
- **Roadmap / timeline** — linked (e.g. Asana), with non-functional requirements (auth model, rate limits, integrations, performance targets).

### Definition of Ready (DoR) — before a task may be started

A task may NOT be picked up until ALL of these are true:

1. Has a **Task Description** (what to do).
2. Has at least **one Acceptance Criterion**.
3. Sized to finish in **1–3 days** (bigger → break it down).
4. Has a **story-point / time estimate** agreed by senior + junior.
5. Has **no unresolved blocker**.

UI tasks also need a Figma/wireframe link + stated responsive targets. API tasks also need an API spec (endpoint, method, request/response) + relevant DB schema. Bug tasks also need steps to reproduce + expected vs actual behaviour.

### Definition of Done (DoD) — before a PR may be merged

ALL of these must be true:

1. Code meets **every** acceptance criterion.
2. **Unit tests** written for new logic.
3. **CI passes** — lint, type-check, tests, build, all green.
4. No `console.log` / debug code / hardcoded values left.
5. **Senior review passed** — no open MUST comments.
6. **Asana task linked** in the PR description.
7. **Docs updated** if API/flow changed.

### Quality gate (Phase 1)

✅ MoSCoW done · ✅ every story has AC · ✅ NFRs stated · ✅ DoR/DoD agreed by the team · ✅ roadmap/timeline linked.

> Deep reference: `ref/01_REQUIREMENTS/` — read 1.3 for how to phrase testable AC and 1.5 for the DoR/DoD templates and worked examples before writing your own.

---

## Phase 2 — Design

Designs are produced with Figma Make (AI) and must always state the brand guideline in the prompt. Reuse these tokens — never invent new ones.

### Brand colors

| Role | Hex | Tailwind |
|---|---|---|
| Primary | `#2563EB` | blue-600 — buttons, links |
| Primary Hover | `#1D4ED8` | blue-700 — hover states |
| Primary Active | `#1E40AF` | blue-800 — active states |
| Success | `#10B981` | emerald-500 |
| Warning | `#F59E0B` | amber-500 |
| Error | `#EF4444` | red-500 |
| Info | `#3B82F6` | blue-500 |
| Background | `#F8FAFC` | gray-50 — page canvas |
| Card | `#FFFFFF` | white — cards, panels |
| Text Primary | `#111827` | gray-900 — body, headings |
| Text Secondary | `#6B7280` | gray-500 — captions, metadata |
| Text Muted | `#9CA3AF` | gray-400 |
| Border | `#E5E7EB` | gray-200 — dividers, inputs |

### Typography — IBM Plex Sans / IBM Plex Sans Thai

| Level | Size / Weight |
|---|---|
| Page title (H1) | 24px Bold (700) |
| Section title (H2) | 18–20px SemiBold (600) |
| Card title (H3) | 16px SemiBold (600) |
| Body | 14px Regular (400) |
| Labels | 12px Medium (500) |
| Button text | 14px SemiBold (600) |
| Caption / helper | 11px Medium, text-secondary |

### Spacing, radius & layout

- **Card padding:** small/filters `p-4` (16px), main cards `p-6` (24px), hero `p-8` (32px).
- **Gaps:** icon+text `gap-2` (8px), elements in card `gap-3` (12px), grid/form `gap-4` (16px), between sections `space-y-6` (24px).
- **Border radius:** cards/buttons `rounded-lg` (8px), large cards `rounded-xl` (12px), modals `rounded-2xl` (16px).
- **Top navigation:** height 64px, white background with shadow, sticky.
- **Content:** max width 1280px; padding Desktop 32px / Tablet 24px / Mobile 16px.

### Responsive breakpoints

Desktop 1440px+ (full layout, 32px padding) · Tablet 768–1024px (24px padding) · Mobile <768px (single column, hamburger menu, 16px). Design **mobile-first**.

### Component & accessibility rules

- Use **Tailwind utility classes** — never inline `style={{}}` (exception: dynamic values not expressible as classes).
- Convert reusable elements to components (`Button/Primary`, `Input/Default`).
- Semantic HTML first (`<button>`/`<a>`/`<form>`); Tab-reachable + Enter/Space-activatable; visible focus rings; colour never the sole signal.
- Every async surface needs **loading + empty + error** states.
- Export screens PNG @2x, icons/logos SVG; commit to the repo and keep a design README with the Figma link.

### Quality gate (Phase 2)

✅ colors/typography/spacing match the guideline · ✅ Tab + Enter/Space works · ✅ 375px layout doesn't break · ✅ loading/empty/error states present · ✅ no inline styles for class-expressible values · ✅ Figma exports + README committed.

> Deep reference: `ref/02_DESIGN/2.1_Wireframe_with_Figma_Make.md` (wireframe prompts) and `2.2_UI_Design_with_Figma_Make.md` (full brand prompt + export-to-GitHub steps).

---

## Phase 3 — Database

Workflow: read requirements → draft the schema document in markdown FIRST → **get user approval** → write migrations. Never write SQL before the schema doc is approved — rework after data lands is far more expensive than rework on the doc.

### Naming (snake_case)

Tables and columns use `snake_case`. Every table has a primary key `id`. Foreign keys reference as `<table>_id`. Booleans read `is_*` (`is_active`). Timestamps end `_at` (`created_at`).

### Required columns on every table

```sql
id          SERIAL PRIMARY KEY,
-- ... domain columns ...
created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
updated_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
```

Add the shared `updated_at` trigger to every table that has `updated_at`:

```sql
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_<table>_updated_at
    BEFORE UPDATE ON <table>
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
```

### Types & constraints

- IDs: `SERIAL PRIMARY KEY`. Text: `VARCHAR(n)` for bounded, `TEXT` for free-form. Money/decimals: `DECIMAL(10,2)`. Timestamps: `TIMESTAMP` (use `TIMESTAMPTZ` where timezone matters). Booleans: `BOOLEAN`. JSON: `JSONB` (binary, indexable) over `JSON`. Fixed sets: `VARCHAR` + `CHECK (col IN (...))` or a Postgres `ENUM` type.
- **Foreign keys** must declare `ON DELETE` behaviour — `CASCADE` (child dies with parent), `SET NULL` (optional FK), or `RESTRICT` (block delete, e.g. order_items → products).
- **Unique** on natural keys (`email`, `slug`, `sku`, `order_number`); composite unique where needed (`UNIQUE(user_id, product_id)`).
- **Check** constraints for bounds (`price >= 0`, `rating BETWEEN 1 AND 5`, `quantity > 0`).
- **Default** values for timestamps, booleans, and counters.

### Indexes

Index every foreign-key column, every unique natural key, columns frequently used in `WHERE`/`ORDER BY` (`status`, `created_at DESC`), composite pairs for common multi-column filters, and `gin(to_tsvector(...))` for full-text search. Do not index tiny tables or columns "just in case".

### Migrations

Name files `[timestamp]_[description].sql` (e.g. `20250115_create_users_table.sql`), include an **UP** section and a commented **DOWN** (rollback) section, one logical change per migration, test against an empty DB and test the rollback before applying to production. Keep a schema changelog (version, date, description, file).

### Row-Level Security & DB security

Enable RLS on multi-tenant tables and write policies (e.g. users see only `is_active` rows; vendors update only their own). Use **parameterized queries only** (`$1, $2` — never string interpolation), hash passwords with **bcrypt** (saltRounds 10), keep credentials in environment variables, and grant the app DB user only the permissions it needs (revoke `CREATE` on schema public).

### Quality gate (Phase 3)

✅ every table has PK + created_at/updated_at + trigger · ✅ FKs declare ON DELETE · ✅ indexes on FK + hot columns · ✅ unique + check constraints set · ✅ data dictionary written · ✅ migrations have UP/DOWN and were tested · ✅ backup/restore documented.

> Deep reference: `ref/03_DATABASE/3.2_Database_Schema_Document.md` is the full schema-doc structure to reproduce; `3.3_Database_Migration_from_Figma_DataContext.md` walks the DataContext → Supabase migration end to end; `3.1_ERD_Diagram.md` for the relationship map.

---

## Phase 4 — Development (Code Standard SOP-DEV-001, enforced)

### Naming conventions

| Kind | Style | Example |
|---|---|---|
| Variables & functions | `camelCase` | `userName`, `calculateTotal()` |
| Constants | `UPPER_SNAKE_CASE` | `MAX_LOGIN_ATTEMPTS` |
| Classes & interfaces | `PascalCase` | `UserService` |
| React components | `PascalCase` file | `LoginForm.tsx` |
| Hooks | `use` prefix | `useAuth.ts` |
| Folders | `kebab-case` | `user-management/` |
| DB tables/columns | `snake_case` | `first_name` |

Always use meaningful English names — no Thai in code, no abbreviations (`x`, `tp`, `arr`).

### TypeScript — strict, no `any`

Enable `strict`, `noImplicitAny`, `strictNullChecks`, `noUnusedLocals`, `noUnusedParameters`. Use specific types or `unknown` (never `any`), union types for fixed value sets, and optional chaining + `??` (not `||`, which mis-handles `0` / `''`).

### React best practices

Functional components + hooks only (no class components). Order inside a component: Props interface → hooks → effects → handlers → early returns → JSX. Extract reusable logic into custom hooks. Use a unique `id` for `key`, not the index. Memoize (`React.memo` / `useMemo` / `useCallback`) only where it matters. Style with Tailwind utilities (use `clsx` for conditional classes); mobile-first responsive.

### Backend layering — MVC, logic out of controllers

`Request → Controller → Service → Repository → Database`. Controllers only receive the request and send the response. **All business logic lives in services.** Repositories only run SQL queries. Auth uses `authenticate` (verify token) + `authorize(...roles)` middleware. A global error handler maps custom error classes to status codes:

```ts
export class AppError extends Error {
  constructor(public statusCode: number, public message: string) { super(message); }
}
export class ValidationError extends AppError { constructor(m: string){ super(400, m); } }
export class NotFoundError extends AppError { constructor(r: string){ super(404, `${r} not found`); } }
```

Throw these in the service layer; the handler returns `{ success: false, message }` and logs unexpected errors as a generic 500 — never echo internal `err.message` for unhandled errors.

### Request validation — Zod, always

Every request body / query / params is validated through Zod middleware. Invalid input → `400` with the structured `errors` array. No exceptions.

### API response format — one shape, always

```jsonc
// success (single)            // success (list)                       // error
{ "success": true,             { "success": true,                     { "success": false,
  "data": { ... } }              "data": [ ... ],                       "message": "Product not found" }
                                 "pagination": { page, pageSize,       // validation error
                                   total, totalPages } }                { "success": false, "message": "Validation failed",
                                                                          "errors": [{ "field": "email", "message": "..." }] }
```

HTTP codes: 200 OK · 201 created · 400 bad request · 401 unauthenticated · 403 forbidden · 404 not found · 409 conflict · 500 server error.

### Security (strictly enforced)

Validate input with Zod · hash passwords with bcrypt · **parameterized queries only** (never string-interpolate SQL) · secrets in env vars, never hardcoded · never commit `.env` (use `.env.example`) · no inline styles, no class components, no push straight to `main`.

### Quality gate (Phase 4, per endpoint/feature)

✅ Zod covers body/query/params · ✅ auth applied (or comment justifying public) · ✅ standard response shape, custom error classes, global handler · ✅ service is unit-testable (no `req`/`res`) · ✅ no `any`, no `console.log`, no hardcoded secrets · ✅ logic in service not controller.

> Deep reference: open `ref/04_DEVELOPMENT/Code_Standard_Guide.md` (SOP-DEV-001) **before writing code** — it has the full naming tables, do/don't pairs, and code examples behind every rule above. Then 4.1 Project_Initialization, 4.1.1 Dependencies_Checklist, 4.4 Backend_Project, and 4.5 Frontend_Integration for the build steps.

---

## Phase 6 — Testing

### Testing pyramid + coverage targets

| Level | Share | Tool | Target |
|---|---|---|---|
| Unit | 70% | Vitest (+ React Testing Library) | FE ≥ 70%, BE ≥ 80% |
| Integration | 20% | Supertest | 100% of endpoints (≥ happy path each) |
| E2E / UAT | 10% | manual + UAT scenarios | critical paths (login, core, payment) |

Performance: **k6** (load / stress / spike), P95 < 2s on critical paths. Security: **OWASP Top 10** scan (e.g. OWASP ZAP), 0 critical findings.

### Practices

Write tests **alongside** code, not after · Arrange-Act-Assert · name tests by expected behaviour · mock only external dependencies (API, DB) · tests must be independent · test behaviour, not implementation details · never ignore a failing test (fix or delete) · no hardcoded volatile data (e.g. current date). Co-locate unit tests beside the file (`Button.test.tsx`); put integration tests under `__tests__/`.

### Two quality gates

**Gate 1 — every PR (CI-enforced):** lint + type-check 0 errors · all unit tests pass · new-code coverage ≥ 70% · no `console.log` / debug code. If Gate 1 fails → do not request review.

**Gate 2 — before release:** all integration tests pass · performance P95 < 2s (senior verifies) · security scan 0 critical (senior verifies) · UAT sign-off by PM / stakeholder. If Gate 2 fails → do not deploy to production.

> Deep reference: `ref/06_TESTING/` — 6.2 Unit (Vitest + RTL setup and examples), 6.3 Integration (Supertest), 6.4 Performance (k6 scripts), 6.5 Security (OWASP checks), and `UAT_Scenario_Template.md` for sign-off scenarios.

---

## Phase 7 — Git Workflow (runs across all phases)

### Branches

`main` (production, protected) and `develop` (integration, protected) are never committed to directly. Supporting branches merge into `develop` (or `main` for hotfix/release):

`feature/` · `fix/` · `refactor/` · `chore/` → `develop` | `hotfix/` · `release/` → `main` then `develop`.

Naming: `<type>/<asana-task-id>-<short-description>`, lowercase, hyphens, 2–5 words, no Thai, no special chars — e.g. `feature/1234567890-add-login`. Always put the Asana task link in the PR description.

Daily flow: `git pull origin develop` each morning → `checkout -b feature/xxx` → commit every 1–2h → push + open PR with the template. Rebase onto `develop` to update; delete the branch after merge.

### Commits — Conventional Commits

`<type>(<scope>): <subject>` — types: `feat fix docs style refactor test chore perf ci build revert`; common scopes: `auth api ui db config deps`. Subject: imperative, lowercase, no trailing period, ≤ 50 chars. One logical change per commit. Breaking changes use `!` + a `BREAKING CHANGE:` footer. Never commit secrets or unrelated files.

### Pull requests + code review

Author self-reviews, ensures tests pass, fills the PR template, links the Asana task, and removes debug code before requesting review. Reviewer responds within 24h (hotfix < 2h) and labels each comment by severity:

- **MUST** — bug / security / wrong logic → must fix before merge.
- **SHOULD** — ought to fix, but a justified explanation is acceptable.
- **NIT** — minor naming / style → optional.
- **LEARN** — knowledge sharing → no change required.

Senior always reviews: logic + edge cases, security (SQL injection, exposed secrets), readability, test coverage, standards conformance. Critique the code, not the person, and always pair feedback with a way forward ("If user is null this line crashes" — not "this is wrong"). Branch protection requires a PR + passing CI + 1 approval on `develop` (1–2 on `main`); no force-push or deletion of protected branches.

> Deep reference: `ref/07_GIT_WORKFLOW/` — 7.1 Branching, 7.2 Commit_Message_Convention, 7.3 Pull_Request_Process (PR template), 7.4 Code_Review_Guidelines, and 7.5 GitHub_Actions_CI_Template (ready-to-use CI + approval gate).

---

## Phase 5 — Deploy

### Pre-deploy checklist (Railway path)

Build must pass **locally** first (`npm run build` for both apps — if it fails locally it fails on Railway). No TypeScript errors (`tsc --noEmit`). `typescript` must be in `dependencies` (not `devDependencies`) so the platform can build. Backend exposes `GET /api/health` returning `{ status: "ok" }`. Config files present: `railway.toml`, `nixpacks.toml`, correct `package.json` scripts (`build`, `start`). Credentials ready: Supabase URL + anon key + service key, and a freshly generated production JWT secret (`openssl rand -base64 32` — never reuse the dev value). Latest code pushed to GitHub. Never commit `.env`. After deploy: run smoke tests + post-deploy verification.

### AWS path (EC2 + RDS + S3 + CloudFront + WAF)

Architecture: `User → WAF → CloudFront (CDN + SSL) → EC2 (Node + Nginx + PM2, public subnet) → RDS (PostgreSQL, private subnet)`, with S3 for file storage. Name every resource `p-<project>-<resource-type>` (e.g. `p-siamgs-kaizen-ec2`).

Security baseline:

- **Secrets Manager** for DB credentials / API keys — never hardcode.
- **KMS** to encrypt S3 + RDS; grant only the IAM roles that need it.
- **ACM** for free SSL/TLS — request the CloudFront certificate in **us-east-1** specifically.
- **RDS** in a private subnet, encrypted, not publicly reachable.
- **WAF** rules for OWASP categories + rate limiting.
- **CloudWatch** dashboards + alarms (EC2 CPU/memory, RDS connections), **CloudTrail** for audit logging, **Cost Explorer** budget alerts.
- CI/CD via GitHub Actions + SSM, blue-green deployment.

### Go-live gate (Phase 5)

✅ build green locally + CI · ✅ health check responds · ✅ prod secrets set, none committed · ✅ HTTPS/SSL active · ✅ DB private + encrypted + backed up · ✅ WAF + rate limiting on · ✅ monitoring/alarms + budget alerts on · ✅ smoke + post-deploy verification passed · ✅ Release Gate 2 (Phase 6) passed.

> Deep reference: Railway path → `ref/05_DEPLOY/` (5.2 Pre_Deploy_Checklist, 5.3 Environment_Variables, 5.4 Deploy_Steps, 5.5 Post_Deploy_Verification, 5.6 Troubleshooting). AWS path → `ref/08_AWS/` (8.0 → 8.7 step-by-step, 8.8 Go_Live_Checklist).

---

## DO

- Move phase by phase; pass each gate before the next; get user approval on the requirements and schema documents before downstream work.
- Enforce DoR before starting a task and DoD before merging.
- Validate every request with Zod; return the one standard response shape.
- Give every table a PK + `created_at`/`updated_at` + trigger; index foreign keys; declare ON DELETE on every FK.
- Write tests alongside code; meet coverage targets; keep CI green.
- Branch off `develop`, commit with Conventional Commits, open a PR linked to Asana, and get a senior approval.
- Build locally before deploying; keep secrets in env / Secrets Manager; verify after deploy.

## DO NOT

- **Skip a phase gate** or build on an unapproved upstream artifact.
- **Use `any`**, inline styles, or class components.
- **Echo internal `err.message`** in unhandled 5xx responses, or put business logic in controllers.
- **Interpolate strings into SQL** — parameterize. **Hardcode or commit secrets** — ever.
- **Push straight to `main`/`develop`**, force-push protected branches, or merge with open MUST comments / failing CI.
- **Ignore a failing test** or deploy before Release Gate 2 passes.
- **Reuse dev JWT secrets in production** or expose the Supabase `service_role` key / RDS publicly.

## Overall quality gate before declaring the project "done"

1. ✅ Requirements approved with MoSCoW + AC + NFRs; DoR/DoD honoured.
2. ✅ UI matches the brand guideline (colors, IBM Plex Sans, spacing), is accessible and responsive, with full async states.
3. ✅ Schema document approved; migrations applied with UP/DOWN; constraints, indexes, and triggers in place.
4. ✅ Code passes the per-endpoint gate; strict TS, MVC-layered, validated, standard response shape.
5. ✅ Testing Gate 1 (every PR) and Gate 2 (pre-release) both passed; coverage targets met.
6. ✅ Every change shipped via a reviewed, Asana-linked PR with Conventional Commits.
7. ✅ Deploy go-live gate passed; secrets, SSL, WAF, backups, and monitoring all in place.
