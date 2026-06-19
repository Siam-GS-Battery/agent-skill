# Setup Guide (SOF-60)

Generates `SETUP_GUIDE.docx` — a Thai-language setup guide for the **Agent Skill** (`skill-sop-sdlc`).

## Build

```bash
# requires python-docx
uv run --with python-docx python build_setup_guide.py
# or, in an env that has python-docx:
python build_setup_guide.py
```

Output: `SETUP_GUIDE.docx` in this folder.

## SOF-60 requirements implemented

| # | Requirement | How |
|---|-------------|-----|
| 1 | Thai tone marks must not clip | Tahoma + complex-script (`w:cs`) font on every run + 1.4–1.5 line spacing |
| 2 / 5 | Screenshot for every install step | Labeled placeholder frame after each step |
| 3 | "เครื่องมือที่ใช้บ่อย" for non-tech readers | Plain-language explanation table |
| 4 | "ข้อควรระวังตาม SOP" heading | Rendered red (`C00000`) |
| 6 | Prohibitions / mandatory rules | Highlighted red callout boxes, visually distinct |

> Screenshot frames are intentional placeholders — drop real screenshots into each frame in Word before distributing.
