# การบริหารความเสี่ยง — Sopify AI-Assisted SDLC

| | |
|---|---|
| **Document ID** | RISK-SDLC-001 |
| **Version** | 1.2.0 |
| **วันที่** | 2026-06-12 |
| **สถานะ** | Final |
| **Asana** | [Docs : Risking](https://app.asana.com/1/1201761273978832/project/1214825140218161/task/1215605704341632) |
| **ขอบเขตการใช้** | ทุกโปรเจกต์ที่ดำเนินการภายใต้ skill `sopify-sdlc` (SOP-SDLC, Code Standard SOP-DEV-001) |
| **Rendered PDF** | `docs/RISK_MANAGEMENT.pdf` (เนื้อหาเดียวกัน จัดรูปแบบตาม brand) |

---

## 1. วัตถุประสงค์และขอบเขต

เอกสารนี้กำหนดวิธีการระบุ ประเมิน ควบคุม และยกระดับ (escalate) ความเสี่ยงตลอดวงจรการพัฒนาซอฟต์แวร์แบบใช้ AI ช่วย (Sopify AI-assisted SDLC) ซึ่งผู้ใช้ที่ไม่ใช่นักพัฒนา (non-developer) สร้างและส่งมอบเว็บแอปพลิเคชันภายในของ GS Battery ผ่าน Claude Cowork, GitHub, Supabase และ Railway

ครอบคลุมทุกเฟสของ SOP-SDLC — Requirements, Design, Database, Development, Testing, Deploy และ Git Workflow ที่พาดผ่านทุกเฟส — รวมถึงรูปแบบการทำงานแบบ multi-agent (PM, UXUI Design, Frontend Engineer, Backend Engineer, Tester) และบังคับใช้กับทุกโปรเจกต์ที่ดำเนินการภายใต้ skill `sopify-sdlc`

นอกขอบเขต: ความเสี่ยงด้าน IT ระดับองค์กร (เครือข่าย, อุปกรณ์ปลายทาง, ความปลอดภัยทางกายภาพ) ซึ่งอยู่ในความรับผิดชอบของฝ่าย IT ของ GS Battery ตามนโยบายแยกต่างหาก

## 2. วิธีการประเมิน — 5x5 โอกาสเกิด x ผลกระทบ

ความเสี่ยงแต่ละรายการให้คะแนนเป็น **Risk Score = โอกาสเกิด (L) x ผลกระทบ (I)** โดยแต่ละด้านให้คะแนน 1–5

### โอกาสเกิด (Likelihood)

| ระดับ | ชื่อเรียก | ความหมาย |
|---|---|---|
| 1 | แทบไม่เกิด (Rare) | แทบเป็นไปไม่ได้ในการทำโปรเจกต์ปกติ |
| 2 | ไม่น่าเกิด (Unlikely) | อาจเกิดได้ในสถานการณ์พิเศษเท่านั้น |
| 3 | เป็นไปได้ (Possible) | อาจเกิดขึ้นในบางโปรเจกต์ |
| 4 | น่าจะเกิด (Likely) | คาดว่าจะเกิดในโปรเจกต์ส่วนใหญ่หากไม่มีการควบคุม |
| 5 | เกิดแน่นอน (Almost certain) | จะเกิดขึ้นแน่นอนหากไม่มีการควบคุม |

### ผลกระทบ (Impact)

| ระดับ | ชื่อเรียก | ความหมาย |
|---|---|---|
| 1 | เล็กน้อยมาก (Negligible) | ผลกระทบผิวเผิน ไม่มีงานแก้ ไม่มีผลต่อข้อมูลหรือความปลอดภัย |
| 2 | เล็กน้อย (Minor) | งานแก้เล็กน้อยภายในเฟสเดียว |
| 3 | ปานกลาง (Moderate) | งานแก้ข้ามเฟส หรือกระทบกำหนดการ |
| 4 | รุนแรง (Major) | เกิด defect ใน production, ระบบล่ม หรืองานแก้จำนวนมาก |
| 5 | รุนแรงมาก (Severe) | ข้อมูลรั่วไหล ข้อมูลสูญหาย หรือเหตุการณ์ด้านความปลอดภัย |

### ระดับความเสี่ยง (Risk level bands)

| คะแนน | ระดับ | การตอบสนองที่ต้องทำ |
|---|---|---|
| 15–25 | **สูง (High)** | ต้องมี mitigation และตรวจสอบยืนยันที่ gate เสมอ; ยกระดับทันทีเมื่อเกิดเหตุ |
| 8–12 | **กลาง (Medium)** | ต้องมี mitigation; ติดตามที่ phase gate |
| 1–6 | **ต่ำ (Low)** | ยอมรับได้ภายใต้การควบคุมมาตรฐาน; ทบทวนทุกรอบ |

ทะเบียนความเสี่ยงต้องถูกทบทวนทุกครั้งที่ตัดสิน phase gate และปรับฐานใหม่ (re-baseline) เมื่อเริ่มโปรเจกต์และก่อนปล่อยแต่ละ release (Release Gate 2)

## 3. ทะเบียนความเสี่ยง (Risk Register)

ความเสี่ยงที่ระบุได้ 14 รายการ — L = โอกาสเกิด, I = ผลกระทบ, S = คะแนน

### ความเสี่ยงระดับสูง (คะแนน 15–25)

| ID | ความเสี่ยง | L | I | S | ผู้รับผิดชอบ | Mitigation |
|---|---|---|---|---|---|---|
| R-01 | **การรั่วไหลของ secret** — Supabase service key, JWT secret หรือ `.env` ถูก commit ลง repo หรือถูกวางใน context/แชต | 4 | 5 | 20 | IT + User (orchestrator) | เก็บ secret ใน env vars / Railway variables เท่านั้น; ห้าม commit `.env` (ใช้ `.env.example` เท่านั้น); IT ส่ง token ผ่านช่องทางที่ปลอดภัย; reviewer ตรวจหา secret ทุก PR; หากรั่วไหลให้ทำขั้นตอนหมุนเวียนกุญแจ (key rotation) ตามหัวข้อ 5 ทันที |
| R-02 | **การข้าม phase gate** — เริ่มงาน downstream บน artifact ต้นทางที่ยังไม่ผ่านการอนุมัติ (การทำงานแบบ non-linear ไม่ได้ยกเว้น gate) | 4 | 4 | 16 | User (orchestrator) | Gate คือจุดตรวจความครบถ้วนเดียวก่อน Push; Tester ตรวจยืนยันทุก gate กับไฟล์จริงอย่างอิสระ; อ่าน ledger `docs/PHASE_STATE.md` จากดิสก์ก่อนการมอบหมายหรือตัดสิน gate ทุกครั้ง; ผลผ่านที่ worker รายงานเองไม่เพียงพอ |
| R-03 | **การแก้ schema โดยไม่ได้รับอนุมัติ** — เขียนหรือรัน SQL ก่อนที่เอกสาร schema จะผ่านการอนุมัติ | 3 | 5 | 15 | Backend Engineer agent | เอกสาร schema มาก่อน SQL เสมอ — Backend agent ต้องหยุดรอการอนุมัติจาก user ผ่าน orchestrator; บันทึกการอนุมัติลง ledger; ทำ migration ผ่าน Supabase MCP เท่านั้น พร้อมทดสอบ UP/DOWN |
| R-04 | **AI สร้าง requirement เกินจริง (hallucination)** — agent แต่ง story, AC หรือขอบเขตที่ user ไม่เคยขอ แล้วเฟสถัดไปสร้างงานต่อจากสิ่งนั้น | 4 | 4 | 16 | PM agent + User | MoSCoW + user stories + AC ต้องมาจาก brief ของ user เท่านั้น; user อนุมัติ `docs/requirements.md` ก่อนเริ่ม design/database; AC ถูกใช้เป็น UAT scenario ทำให้ขอบเขตที่ถูกแต่งขึ้นถูกจับได้ที่ Gate 2 |
| R-05 | **โค้ดที่ AI สร้างถูก merge โดยไม่มีการทดสอบ** — โค้ดผ่านการรีวิวแบบผิวเผินแต่ไม่มีเทสต์หรือมี defect ซ่อนอยู่ | 4 | 4 | 16 | Tester agent + Senior reviewer | เขียนเทสต์คู่กับโค้ด (coverage FE >= 70%, BE >= 80%); Gate 1 ทุก PR (lint, type-check, tests, ไม่มี debug code); Gate 2 ก่อน release (integration ครบ 100% ของ endpoint, k6 P95 < 2s, OWASP scan 0 critical); senior review พร้อม label MUST/SHOULD/NIT |

### ความเสี่ยงระดับกลาง (คะแนน 8–12)

| ID | ความเสี่ยง | L | I | S | ผู้รับผิดชอบ | Mitigation |
|---|---|---|---|---|---|---|
| R-06 | **Context drift ("lost in the middle")** — กฎ SOP ถูกละทิ้งเงียบ ๆ ใน session ที่ยาว | 3 | 3 | 9 | User (orchestrator) | รูปแบบ multi-agent: หนึ่งเฟส = sub-agent ใหม่หนึ่งตัวที่ได้รับ SOP slice ของเฟสนั้นแบบคำต่