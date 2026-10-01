# AI Engineering Track — GS Battery SOP

You are on the **AI track** of the GS Battery SOP: Python microservices and model pipelines in
a **uv workspace monorepo**, with a React frontend. The phases in `../../SKILL.md`
(Requirements, Design, Database, TDD, Testing, Multi-Agent) and their gates still bind. This
file replaces the backend half of Phase 5 (Python, not Node) and adds the **monorepo layout**,
the **research phase**, and the **Python standard**. The frontend still follows the web track.

Treat every rule below as binding; work that ignores them gets rejected at review.

## Step 0 — branch first

Every new experiment, app, or package starts on its own branch off the latest `main`, before
the first file is written. Work merges back to `main` only through a reviewed PR.

```bash
git fetch origin && git switch -c <prefix>/<slug> origin/main
```

| Work | Branch |
|---|---|
| new research topic or experiment | `research/<topic>-<slug>` |
| new app (microservice) | `apps/<app-name>` |
| new shared package | `packages/<pkg-name>` |
| feature / fix on existing code | `feat/<slug>` · `fix/<slug>` |

## The three zones — pick one before writing a line

| Zone | What it is | Standard |
|---|---|---|
| `packages/<pkg>/` | the **central library**: domain logic and inference code every app calls | pure, typed, unit-tested |
| `apps/<app>/` | **isolated microservices**: each runs, tests, and deploys on its own | Clean Architecture, thin |
| `research/<topic>/` | one folder per **topic**, one sub-folder per **approach**: the sandbox | fast, but reproducible |

- **packages** grow out of apps: when a second app needs logic that lives in one app, move
  it into `packages/` and have both apps call it there. Never copy code between apps.
- **apps** never import each other; they talk over HTTP, MQTT, or the database. Each has its
  own `pyproject.toml`, `Dockerfile`, `README.md`, and tests, and starts alone.
- **research** topics hold competing approaches side by side, e.g. `research/ocr/` →
  `paddleocr/`, `glm-ocr/`; `research/apperances/` → `template-matching/`,
  `anomaly-detection/`, `object-detection/`, `linear-optimization/`, `agentic-pipeline/`.

Dependencies flow one way: `apps → packages` and `research → packages`. A package never
imports an app; nothing outside `research/` imports `research/`.

> Full tree, isolation checklist, extraction to packages, uv, Docker, DVC:
> `7.1_Monorepo_Structure.md`.

## The AI journey — the shared phases plus Branch and Research

```
0. Branch → 1. Requirements → R. Research → 2. Design → 3. Database → 4. TDD → 5. Write Code → 6. Testing
```

- **Phase 1** as in `../../SKILL.md`, plus a **model acceptance metric** for every AI story: the
  number that decides success (recall at a fixed false-positive rate, CER, P95 latency on the
  target GPU), measured on a named dataset version.
- **Phase R — Research** (new). Answer "which approach works?" inside `research/` before any
  app code. Gate: each approach's README holds a results table against the acceptance metric,
  and the user picks the approach.
- **Phases 2, 3, 4, 6** as in `../../SKILL.md`, with the Python tool swaps below.
- **Phase 5** follows this file: Clean Architecture app + the Python standard.

### Web-dev track → AI track equivalents

| Web-dev (Node/TS) | AI track (Python) |
|---|---|
| `npm` | `uv add --package <member> <dep>`; never edit dependency lists by hand |
| Controller → Service → Repository | `adaptor/http` → `use_cases` → `adaptor/db` |
| Zod validation | Pydantic v2 models in `entities/` |
| `AppError` + global handler | `entities/errors.DomainError` + `exception_handler` in `main.py` |
| `{ success, data }` envelope | same envelope, every path, errors included |
| Vitest / Supertest | `pytest` / `httpx.AsyncClient` + `testcontainers` |
| `camelCase` functions | `snake_case` functions, `PascalCase` classes (PEP 8) |
| no `any` | type hints on every signature |
| no `console.log` | `logging`, no stray `print()` |

## Phase 5 — Clean Architecture inside every Python app

Source code dependencies point **inwards**, toward the domain:

```
apps/<app>/src/<module>/
  main.py        composition root: app, lifespan, error envelope
  config.py      typed settings (pydantic-settings) from env / .env
  entities/      Pydantic models + domain errors; imports nothing above it
  interfaces/    ports (typing.Protocol) for systems we do not own or have not settled
  use_cases/     service classes; business logic; calls packages; no HTTP, no SQL
  adaptor/
    http/        routers (controllers) + deps.py, the one place adaptors are chosen
    db/          parameterized SQL
    <system>/    one folder per outside system: s3/, mqtt/, ocr/, another app's API
```

- A **controller** only parses the request, calls one use case, wraps the result.
- A **use case** is a class that receives its collaborators in `__init__`; it never imports
  `fastapi` or writes SQL. Reusable domain logic it needs lives in `packages/`.
- An **adaptor** is how this app connects to any other module, app, or system. A developer
  plugs a new one in by writing an adaptor, never by editing a use case.
- A **port** is earned: write a `Protocol` in `interfaces/` when the system is not ours, its
  access method is undecided, or a second implementation exists (a fake for tests).
  Otherwise the adaptor class itself is the contract.
- Boundaries are **enforced, not agreed**: a layering test or an import-linter `layers`
  contract fails the build when SQL leaves `adaptor/db` or an entity imports upward.

> Layout, a worked endpoint across all layers, the port rule, async rules, tests:
> `7.2_Clean_Architecture_Backend.md`.

## Python code standard (all zones)

```python
import psycopg

from app import entities
from app.adaptor.db import inspections
from app.interfaces import ocr



class InspectionService:
    """Judges a captured battery against its configured regions."""

    def __init__(
        self,
        connection: psycopg.AsyncConnection,
        reader: ocr.OcrReader,
        ) -> None:

        self._db = connection
        self._reader = reader



    async def judge(
        self,
        inspection_id: int,
        ) -> entities.Verdict:

        """
        Read and judge every region of one inspection.

        Args:
            inspection_id: `inspection.id` in our schema.

        Returns:
            The verdict, one entry per region.
        """
        capture = await inspections.select_capture(self._db, inspection_id)
        results = [await self._reader.read(capture.image, r) for r in capture.regions]
        return entities.Verdict.from_results(results)
```

The **house rules** — these win wherever a generic clean-code rule says otherwise:

- **OOP based.** Components (services, pipelines, adaptors, model wrappers) are classes that
  hold their collaborators, passed in through `__init__`, and talk by calling each other's
  methods. Stateless transforms and SQL query modules stay functions. A class that only
  forwards calls is banned.
- **Import the module, call through it.** The name after `import` is always a module:
  `import softpatch` then `softpatch.SoftPatches()`. Every call site shows where it lives.
- **Three blank lines** before every `def` and `class`, methods included; the first member
  of a class or module needs none. `ruff format` collapses this spacing, so keep house-style
  paths out of it; `ruff check` runs everywhere.
- **Signature, then docstring.** Parameters one per line (including `self`), `) -> Type:` on
  its own line, one blank line, then a one-line explanation with `Args:`, `Returns:`, and
  `Raises:` when it raises. Each entry gives meaning, units, or range, never the type again.

The **clean-code rules** — guard clauses (nesting ≤ 3, no `else` after `return`), lines
≤ 88 characters, intent-revealing names, no magic literals, library-first, Polars with
explicit schemas, lineage columns on emitted data, `logging` over `print`, and
`# ponytail: <why + upgrade path>` on deliberate shortcuts.

> Every rule with do/don't examples: `7.3_Python_Code_Standard.md`.

## Phase R — research topics

`research/` is the vibe zone: work fast with the agent, try models, throw ideas away. The
rules protect only reproducibility and the rest of the repo.

```
research/<topic>/                    ocr, apperances, synthetic ...
  README.md                          the topic's question + one results row per approach
  <approach>/                        paddleocr, glm-ocr, template-matching, anomaly-detection ...
    README.md                        question · data · how to run · results · decision
    exp<N>_<slug>/                   numbered attempts when an approach needs more than one
    <stage>/  __main__.py  Taskfile.yml  results/  tests/
    repos/                           upstream research code, cloned, never committed
```

- One approach, one folder. Approaches **copy** what they need from each other instead of
  importing it, so an edit to one cannot move another's numbers.
- Datasets and weights go through **DVC**; git holds only the `.dvc` pointers.
- Every number in a README comes from a Taskfile entry anyone can re-run.
- Research code never ships. When the user picks an approach, **promote** it: rewrite the
  chosen path into `packages/<pkg>/` to the full standard with tests, then call it from an
  app through a use case or adaptor.

> Topic and approach templates, the rules, working with the agent, the promotion checklist:
> `7.4_Research_Workspace.md`.

## Quality gate — Python Definition of Done

On top of `../../SKILL.md` DoD:

1. ✅ Work happened on its own branch off `main` and merges through a reviewed PR.
2. ✅ The change sits in the right zone; `apps → packages`, `research → packages` only; no
   app imports another app; no code copied between apps.
3. ✅ The app still starts and tests alone (`uv run --package <app> pytest`,
   `docker compose up <service>`).
4. ✅ App layers hold: thin controllers, logic in use cases, SQL only in `adaptor/db`,
   outside systems only through `adaptor/<system>`; the layering test passes.
5. ✅ Python standard applied: house rules and clean-code rules; `ruff check` clean.
6. ✅ `pytest` green for the touched member; failing tests were written first (Phase 4).
7. ✅ Dependencies via `uv add --package`; the Dockerfile builds with
   `uv sync --frozen --no-dev --no-editable --package <app>`.
8. ✅ New env vars in `.env.example`; member `README.md` updated; no secrets, datasets, or
   weights in git.
9. ✅ AI features: the acceptance metric is measured on the named dataset version and recorded.
