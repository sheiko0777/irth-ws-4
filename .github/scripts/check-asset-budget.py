#!/usr/bin/env python3
"""Asset budget for the IRTH theme.

Fails CI when a theme asset regresses in weight, e.g. the 3 MB favicon.svg
(a PNG embedded inside an SVG) that shipped to every visitor.
"""
import pathlib
import sys

ROOT = pathlib.Path(__file__).resolve().parents[2]
ASSETS = ROOT / "assets"

# Hard cap for any single file in assets/.
MAX_ASSET_BYTES = 300 * 1024
# Tighter caps for files that load on every page.
FILE_BUDGETS = {
    "favicon.svg": 50 * 1024,
    "favicon.ico": 50 * 1024,
    "favicon-96x96.png": 50 * 1024,
    "apple-touch-icon.png": 50 * 1024,
    "base.css": 150 * 1024,
}
MAX_WOFF2_BYTES = 120 * 1024

errors = []

for path in sorted(ASSETS.iterdir()):
    if not path.is_file():
        continue
    size = path.stat().st_size
    budget = FILE_BUDGETS.get(path.name, MAX_ASSET_BYTES)
    if path.suffix == ".woff2":
        budget = min(budget, MAX_WOFF2_BYTES)
    if size > budget:
        errors.append(f"{path.name}: {size / 1024:.0f} KB exceeds budget of {budget / 1024:.0f} KB")
    # Desktop font formats are fallbacks only; browsers must be offered WOFF2.
    if path.suffix in (".ttf", ".otf") and not path.with_suffix(".woff2").exists():
        errors.append(f"{path.name}: no {path.stem}.woff2 alongside it; serve WOFF2 first")

if errors:
    print("Asset budget exceeded:")
    for e in errors:
        print(f"  - {e}")
    sys.exit(1)

print("Asset budget OK")
