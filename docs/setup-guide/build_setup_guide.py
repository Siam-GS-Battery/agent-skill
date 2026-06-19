#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
SOF-60 / SOF-64 — Setup Guide (.docx) generator.

Reproducibly builds SETUP_GUIDE.docx from the source content of the original
SETUP_GUIDE.pdf, applying the SOF-64 polish requirements:

  1. Thai tone marks must not clip  -> Tahoma (full Thai shaping) + generous line spacing,
                                        complex-script (w:cs) font set explicitly.
  2/5. Screenshot for every install step -> labelled placeholder frame after each step.
  3. "เครื่องมือที่ใช้บ่อย" for non-tech readers -> plain-language table.
  4. "ข้อควรระวังตาม SOP" heading -> red.
  6. Prohibitions / mandatory rules -> highlighted red callout box, visually distinct.

Run:  python build_setup_guide.py   ->  writes ./SETUP_GUIDE.docx
"""
import os
from docx import Document
from docx.shared import Pt, RGBColor, Cm
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT
from docx.oxml.ns import qn
from docx.oxml import OxmlElement

# ---- palette -----------------------------------------------------------------
FONT   = "Tahoma"          # full Thai tone-mark/vowel shaping on macOS + Windows
NAVY   = RGBColor(0x1F, 0x38, 0x64)
BLUE   = RGBColor(0x2E, 0x74, 0xB5)
RED    = RGBColor(0xC0, 0x00, 0x00)
GREY   = RGBColor(0x60, 0x60, 0x60)
BLACK  = RGBColor(0x20, 0x20, 0x20)

IMAGES_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "images")
IMG_EXTS   = (".png", ".jpg", ".jpeg")
IMG_WIDTH  = Cm(15.5)   # fits inside the 16.0 cm screenshot frame

STEP_FILL  = "EAF1F8"   # light blue for step rows (matches original)
SHOT_FILL  = "F4F4F4"   # light grey for screenshot placeholders
WARN_FILL  = "FCE4E4"   # light red for prohibition callouts
TABLE_HEAD = "1F3864"   # navy table header


# ---- low-level helpers -------------------------------------------------------
def _set_cs_font(run, name=FONT):
    """Set ascii/hAnsi AND complex-script font so Thai glyphs use the right face."""
    run.font.name = name
    rpr = run._element.get_or_add_rPr()
    rfonts = rpr.find(qn("w:rFonts"))
    if rfonts is None:
        rfonts = OxmlElement("w:rFonts")
        rpr.append(rfonts)
    for attr in ("w:ascii", "w:hAnsi", "w:cs"):
        rfonts.set(qn(attr), name)


def _shade(cell, fill_hex):
    shd = OxmlElement("w:shd")
    shd.set(qn("w:val"), "clear")
    shd.set(qn("w:fill"), fill_hex)
    cell._tc.get_or_add_tcPr().append(shd)


def _cell_border(cell, color="C0C0C0", size="6", left_accent=None):
    tcpr = cell._tc.get_or_add_tcPr()
    borders = OxmlElement("w:tcBorders")
    for edge in ("top", "left", "bottom", "right"):
        e = OxmlElement(f"w:{edge}")
        e.set(qn("w:val"), "single")
        if edge == "left" and left_accent:
            e.set(qn("w:sz"), "24")
            e.set(qn("w:color"), left_accent)
        else:
            e.set(qn("w:sz"), size)
            e.set(qn("w:color"), color)
        e.set(qn("w:space"), "0")
        borders.append(e)
    tcpr.append(borders)


def run(p, text, size=14, bold=False, color=BLACK, italic=False):
    r = p.add_run(text)
    r.bold = bold
    r.italic = italic
    r.font.size = Pt(size)
    r.font.color.rgb = color
    _set_cs_font(r)
    return r


def body(doc, text, size=14, color=BLACK, space_after=6, bullet=False):
    p = doc.add_paragraph(style="List Bullet" if bullet else None)
    p.paragraph_format.line_spacing = 1.5          # keeps tone marks clear
    p.paragraph_format.space_after = Pt(space_after)
    run(p, text, size=size, color=color)
    return p


def heading(doc, text, size=17, color=NAVY, space_before=14):
    p = doc.add_paragraph()
    p.paragraph_format.space_before = Pt(space_before)
    p.paragraph_format.space_after = Pt(6)
    p.paragraph_format.line_spacing = 1.4
    run(p, text, size=size, bold=True, color=color)
    return p


def subheading(doc, text):
    p = doc.add_paragraph()
    p.paragraph_format.space_before = Pt(10)
    p.paragraph_format.space_after = Pt(4)
    p.paragraph_format.line_spacing = 1.4
    run(p, text, size=14, bold=True, color=BLUE)
    return p


# ---- composite blocks --------------------------------------------------------
def _slug(label):
    """'Supabase MCP' -> 'supabase-mcp' for deterministic image filenames."""
    return "-".join(label.lower().split())


def _find_image(slug, index):
    """Return path to images/<slug>-<index>.<ext> if a real screenshot was dropped in, else None."""
    for ext in IMG_EXTS:
        p = os.path.join(IMAGES_DIR, f"{slug}-{index}{ext}")
        if os.path.isfile(p):
            return p
    return None


def steps_with_screenshots(doc, section_label, steps):
    """Numbered install steps; each step followed by a real screenshot (if provided) or a labelled placeholder."""
    slug = _slug(section_label)
    for i, text in enumerate(steps, 1):
        t = doc.add_table(rows=1, cols=2)
        t.alignment = WD_TABLE_ALIGNMENT.LEFT
        t.columns[0].width = Cm(1.1)
        t.columns[1].width = Cm(15.0)
        num, txt = t.rows[0].cells
        _shade(num, STEP_FILL); _shade(txt, STEP_FILL)
        _cell_border(num); _cell_border(txt)
        pn = num.paragraphs[0]; pn.alignment = WD_ALIGN_PARAGRAPH.CENTER
        run(pn, str(i), size=13, bold=True, color=BLUE)
        pt = txt.paragraphs[0]; pt.paragraph_format.line_spacing = 1.4
        run(pt, text, size=13)
        _screenshot_placeholder(doc, f"{section_label} — ภาพประกอบขั้นตอนที่ {i}",
                                image=_find_image(slug, i))
    doc.add_paragraph().paragraph_format.space_after = Pt(2)


def _screenshot_placeholder(doc, caption, image=None):
    # Real screenshot supplied -> embed it; otherwise draw the labelled placeholder frame.
    if image:
        p = doc.add_paragraph(); p.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p.add_run().add_picture(image, width=IMG_WIDTH)
        pc = doc.add_paragraph(); pc.alignment = WD_ALIGN_PARAGRAPH.CENTER
        run(pc, caption, size=11, color=GREY, italic=True)
        doc.add_paragraph().paragraph_format.space_after = Pt(2)
        return
    t = doc.add_table(rows=2, cols=1)
    t.alignment = WD_TABLE_ALIGNMENT.LEFT
    t.columns[0].width = Cm(16.0)
    box = t.rows[0].cells[0]
    _shade(box, SHOT_FILL); _cell_border(box, color="BBBBBB")
    pb = box.paragraphs[0]; pb.alignment = WD_ALIGN_PARAGRAPH.CENTER
    pb.paragraph_format.line_spacing = 1.4
    pb.paragraph_format.space_before = Pt(16); pb.paragraph_format.space_after = Pt(16)
    run(pb, "[ แทรกภาพหน้าจอที่นี่ / Insert screenshot here ]", size=12, color=GREY, italic=True)
    cap = t.rows[1].cells[0]
    _cell_border(cap, color="FFFFFF")
    pc = cap.paragraphs[0]; pc.alignment = WD_ALIGN_PARAGRAPH.CENTER
    run(pc, f"ภาพที่ต้องการ: {caption}", size=11, color=GREY, italic=True)
    doc.add_paragraph().paragraph_format.space_after = Pt(2)


def prohibition_callout(doc, title, items):
    """Highlighted red box for prohibitions / mandatory rules (SOF-64 #6)."""
    t = doc.add_table(rows=1, cols=1)
    t.alignment = WD_TABLE_ALIGNMENT.LEFT
    t.columns[0].width = Cm(16.0)
    cell = t.rows[0].cells[0]
    _shade(cell, WARN_FILL)
    _cell_border(cell, color="E0A0A0", left_accent="C00000")
    ph = cell.paragraphs[0]
    ph.paragraph_format.line_spacing = 1.4
    ph.paragraph_format.space_after = Pt(4)
    run(ph, f"[ ! ]  {title}", size=13, bold=True, color=RED)
    for it in items:
        pi = cell.add_paragraph()
        pi.paragraph_format.line_spacing = 1.4
        pi.paragraph_format.space_after = Pt(3)
        run(pi, "•  ", size=13, bold=True, color=RED)
        run(pi, it, size=13, color=BLACK)
    doc.add_paragraph().paragraph_format.space_after = Pt(2)


def tools_table(doc, rows):
    """Plain-language explanation table (SOF-64 #3)."""
    headers = ["เครื่องมือ (คำสั่ง)", "คืออะไร — อธิบายแบบเข้าใจง่าย", "ใช้ตอนไหน"]
    t = doc.add_table(rows=1, cols=3)
    t.alignment = WD_TABLE_ALIGNMENT.LEFT
    t.autofit = False; t.allow_autofit = False
    # widths sum to 16.0 cm to fit A4 usable width (21.0 - 2.2*2 = 16.6 cm)
    t.columns[0].width = Cm(3.5); t.columns[1].width = Cm(8.0); t.columns[2].width = Cm(4.5)
    for c, h in zip(t.rows[0].cells, headers):
        _shade(c, TABLE_HEAD); _cell_border(c, color="FFFFFF")
        p = c.paragraphs[0]
        run(p, h, size=12, bold=True, color=RGBColor(0xFF, 0xFF, 0xFF))
    for r0 in rows:
        cells = t.add_row().cells
        for c, val, bold in zip(cells, r0, (True, False, False)):
            _cell_border(c)
            p = c.paragraphs[0]; p.paragraph_format.line_spacing = 1.3
            run(p, val, size=12, bold=bold, color=(BLUE if bold else BLACK))
    doc.add_paragraph().paragraph_format.space_after = Pt(2)


# ---- document ----------------------------------------------------------------
def build():
    doc = Document()
    normal = doc.styles["Normal"]
    normal.font.name = FONT
    normal.font.size = Pt(14)
    # set complex-script font on the Normal style so any stray run defaults to Tahoma too
    rpr = normal.element.get_or_add_rPr()
    rfonts = rpr.find(qn("w:rFonts"))
    if rfonts is None:
        rfonts = OxmlElement("w:rFonts")
        rpr.append(rfonts)
    for attr in ("w:ascii", "w:hAnsi", "w:cs"):
        rfonts.set(qn(attr), FONT)

    sec = doc.sections[0]
    sec.left_margin = sec.right_margin = Cm(2.2)
    sec.top_margin = sec.bottom_margin = Cm(2.0)

    # ---- cover ----
    title = doc.add_paragraph(); title.alignment = WD_ALIGN_PARAGRAPH.CENTER
    title.paragraph_format.space_before = Pt(20)
    run(title, "คู่มือการติดตั้งและตั้งค่าเครื่องมือ (Setup Guide)", size=24, bold=True, color=NAVY)
    sub = doc.add_paragraph(); sub.alignment = WD_ALIGN_PARAGRAPH.CENTER
    run(sub, "GitHub MCP · Agent Skill", size=15, color=BLUE)
    p1 = doc.add_paragraph(); p1.alignment = WD_ALIGN_PARAGRAPH.CENTER
    run(p1, "โครงการ [RD-M-26-O7-Q1-KR6.4/AI] Sopify & Risk Management AI Strategy", size=12, color=GREY)
    p2 = doc.add_paragraph(); p2.alignment = WD_ALIGN_PARAGRAPH.CENTER
    run(p2, "เอกสารประกอบ Card \"Docs\" (SOF-60) · ปรับปรุงวันที่ 12 มิถุนายน 2569 (2026-06-12)", size=12, color=GREY)

    heading(doc, "บทนำ", size=18)
    body(doc,
         "เอกสารฉบับนี้เป็นคู่มือสำหรับทีมพัฒนาในการติดตั้งและตั้งค่าเครื่องมือหลัก 2 รายการที่ใช้ในโครงการ "
         "ได้แก่ GitHub MCP สำหรับจัดการ source code และ Pull Request, "
         "และ Agent Skill (skill-sop-sdlc) ซึ่งเป็นชุดมาตรฐาน SOP-SDLC ของทีม GS Battery")
    body(doc,
         "หมายเหตุสำหรับผู้เริ่มต้น: MCP (Model Context Protocol) คือ \"ช่องทางเชื่อมต่อมาตรฐาน\" "
         "ที่ทำให้ Claude ทำงานร่วมกับระบบภายนอก (เช่น GitHub) ได้โดยตรงและปลอดภัย "
         "เปรียบเหมือนปลั๊กมาตรฐานที่เสียบใช้กับอุปกรณ์ได้หลายชนิด")

    # ---- 1. GitHub MCP ----
    heading(doc, "1. GitHub MCP Setup")
    subheading(doc, "ภาพรวม")
    body(doc,
         "GitHub MCP ช่วยให้ Claude ทำงานกับ repository ขององค์กร Siam-GS-Battery ได้โดยตรง เช่น อ่านไฟล์, "
         "สร้าง branch, commit, เปิด Pull Request และจัดการ issues ตาม Git Workflow ของทีม")
    subheading(doc, "ขั้นตอนการติดตั้ง")
    steps_with_screenshots(doc, "GitHub MCP", [
        "เปิด Claude Desktop ไปที่ Settings > Connectors > Add custom connector",
        "กรอก Remote MCP server URL ของ GitHub: https://api.githubcopilot.com/mcp/",
        "กด Connect แล้วล็อกอิน GitHub ผ่าน OAuth และกด Authorize",
        "อนุญาตการเข้าถึง Organization Siam-GS-Battery (หากไม่เห็น repo ให้ขอ admin อนุมัติ OAuth App)",
        "ทดสอบโดยให้ Claude เรียกดูไฟล์ใน repo เช่น agent-skill หรือ list branches",
    ])
    heading(doc, "Git Workflow ตาม SOP-SDLC (บังคับใช้)", size=15, color=RED, space_before=10)
    prohibition_callout(doc, "ข้อบังคับ — ห้ามฝ่าฝืน", [
        "ห้าม push ตรงเข้า main/develop — ทั้งสอง branch เป็น protected branch",
        "แตก branch จาก develop สำหรับงานทั่วไป: feature/ · fix/ · refactor/ · chore/ (ส่วน hotfix/ และ release/ แตกจาก main)",
        "ตั้งชื่อ branch ตามรูปแบบ <type>/<jira-task-id>-<short-description> เช่น feature/SOF-123-add-login — ใส่ Jira Task ID เสมอ",
        "เขียน commit message แบบ Conventional Commits เช่น docs: add setup guide",
        "เปิด Pull Request พร้อมลิงก์ Jira ticket และต้องผ่าน review + CI ก่อน merge แล้วลบ branch หลัง merge",
    ])

    # ---- 2. Agent Skill ----
    heading(doc, "2. Agent Skill Setup")
    subheading(doc, "ภาพรวม")
    body(doc,
         "Agent Skill คือชุดความรู้และข้อกำหนดที่สอนให้ Claude ทำงานตามมาตรฐานของทีม โดย skill หลักของโครงการคือ "
         "sopify-sdlc ซึ่งครอบคลุม SOP ตลอดวงจรพัฒนา: Requirements · Design · Database · Development · Testing · "
         "Git Workflow · Deploy")
    subheading(doc, "โครงสร้างไฟล์ใน repository agent-skill")
    body(doc, "skill-sop-sdlc/SKILL.md — เนื้อหา SOP หลักที่ Claude ใช้อ้างอิง", bullet=True)
    body(doc, "skill-sop-sdlc/ref/ — เอกสารอ้างอิงเพิ่มเติมของแต่ละ phase", bullet=True)
    body(doc, "skill-sop-sdlc/evals/ — ชุดทดสอบสำหรับวัดคุณภาพของ skill", bullet=True)
    subheading(doc, "ขั้นตอนการติดตั้ง")
    steps_with_screenshots(doc, "Agent Skill", [
        "ดาวน์โหลด/บีบอัด skill โฟลเดอร์ skill-sop-sdlc จาก repository Siam-GS-Battery/agent-skill เป็นไฟล์ .zip",
        "เปิด Claude Desktop ไปที่ Settings > Capabilities > Skills",
        "กด Upload skill แล้วเลือกไฟล์ zip ที่เตรียมไว้",
        "ตรวจสอบว่า skill sopify-sdlc ปรากฏในรายการและเปิดใช้งาน (enabled)",
        "ทดสอบโดยสั่งงานที่เกี่ยวกับ SDLC เช่น ขอ code review — Claude ต้องอ้างอิงมาตรฐานจาก SOP อัตโนมัติ",
    ])
    subheading(doc, "การอัปเดต skill")
    body(doc,
         "เมื่อ SOP มีการเปลี่ยนแปลง ให้แก้ไข SKILL.md ใน branch ใหม่ > เปิด PR ตาม Git Workflow > "
         "หลัง merge แล้วบีบอัดแพ็กเกจใหม่และอัปโหลดเข้า Claude อีกครั้ง เพื่อให้ทุกคนในทีมใช้เวอร์ชันเดียวกัน")

    # ---- footer ----
    doc.add_paragraph().paragraph_format.space_after = Pt(8)
    f1 = doc.add_paragraph(); f1.alignment = WD_ALIGN_PARAGRAPH.CENTER
    run(f1, "อ้างอิง: Jira — Docs / SOF-60", size=10, color=GREY)
    f2 = doc.add_paragraph(); f2.alignment = WD_ALIGN_PARAGRAPH.CENTER
    run(f2, "Repository: github.com/Siam-GS-Battery/agent-skill · จัดทำโดยทีม R&D · GS Battery (Thailand)", size=10, color=GREY)

    out = os.path.join(os.path.dirname(os.path.abspath(__file__)), "SETUP_GUIDE.docx")
    doc.save(out)
    print("wrote", out)
    return out


if __name__ == "__main__":
    build()
