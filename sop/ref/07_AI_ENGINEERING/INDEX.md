# AI Engineering Track

> มาตรฐานสำหรับ AI Project ที่เขียนด้วย Python ใน uv monorepo — ใช้ Phase ของ [SKILL.md](../../SKILL.md) ร่วมกัน แต่ Phase 5 ฝั่ง backend และ Phase R (Research) ทำตามหมวดนี้

## เอกสารในหมวดนี้

| ลำดับ | เอกสาร | อ่านเมื่อ |
|:-----:|:-------|:---------|
| ★ | [AI Track](AI_TRACK.md) | **อ่านก่อนเริ่มงาน AI Project ทุกครั้ง** — zone, branch, Clean Architecture, house rules, research, DoD |
| 7.1 | [Monorepo Structure](7.1_Monorepo_Structure.md) | สร้าง app / package ใหม่, ย้าย logic จาก app เข้า package, branch, dependency, Dockerfile, dataset |
| 7.2 | [Clean Architecture Backend](7.2_Clean_Architecture_Backend.md) | สร้างหรือแก้ endpoint, use case, adaptor, port ของ Python app |
| 7.3 | [Python Code Standard](7.3_Python_Code_Standard.md) | ก่อนเขียน Python ทุกครั้ง (ทุก zone) — house rules + clean-code rules |
| 7.4 | [Research Workspace](7.4_Research_Workspace.md) | เริ่มหัวข้อ / approach / รอบทดลองใหม่, train model, promote งานวิจัยเข้า package |

## Phase ไหนอ่านอะไร

| Phase | อ่าน |
|---|---|
| 1 · Requirements | `../01_REQUIREMENTS/` + เพิ่ม model acceptance metric (ดู AI_TRACK.md) |
| R · Research | `7.4_Research_Workspace.md` |
| 2 · Design | `../02_DESIGN/` |
| 3 · Database | `../03_DATABASE/` |
| 4 · TDD | `../06_TESTING/` + ส่วน Testing ของ `7.2_Clean_Architecture_Backend.md` |
| 5 · Write Code | `7.3_Python_Code_Standard.md` → `7.2_Clean_Architecture_Backend.md` → `7.1_Monorepo_Structure.md` |
| 6 · Testing | `../06_TESTING/` |

## แหล่งอ้างอิงหลัก

- Robert C. Martin, *The Clean Architecture* (2012) — Dependency Rule: <https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html>
- Alistair Cockburn, *Hexagonal Architecture* (2005) — Ports & Adapters: <https://alistair.cockburn.us/hexagonal-architecture/>
- Percival & Gregory, *Architecture Patterns with Python* ch.2 — port/adapter ด้วย Protocol และ trade-off: <https://www.cosmicpython.com/book/chapter_02_repository.html>
- PEP 544 — Protocols: <https://peps.python.org/pep-0544/>
- import-linter — layers contract: <https://import-linter.readthedocs.io/en/latest/contract_types.html>
- uv workspaces: <https://docs.astral.sh/uv/concepts/projects/workspaces/>
- John Ousterhout, *A Philosophy of Software Design* — deep modules vs shallow abstractions
- Sculley et al., *Hidden Technical Debt in Machine Learning Systems* (NeurIPS 2015): <https://papers.neurips.cc/paper/5656-hidden-technical-debt-in-machine-learning-systems.pdf>

---

[กลับไปหน้าหลัก](../../SKILL.md)
