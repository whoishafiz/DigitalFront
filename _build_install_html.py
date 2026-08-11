"""Regenerates install.html from _install_template.html, embedding
8bitClassic.ttf (the @88cntrl brand display font) as a self-contained
base64 @font-face. Run this after editing _install_template.html — never
hand-edit install.html directly, it's generated.

Usage:
    python _build_install_html.py
"""
import base64
from pathlib import Path

here = Path(__file__).parent
font_b64 = base64.b64encode((here / "8bitClassic.ttf").read_bytes()).decode("ascii")
template = (here / "_install_template.html").read_text(encoding="utf-8")
(here / "install.html").write_text(template.replace("{{FONT_B64}}", font_b64), encoding="utf-8")
print(f"wrote install.html ({(here / 'install.html').stat().st_size} bytes)")
