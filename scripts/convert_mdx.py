#!/usr/bin/env python3
"""Convert local MDX dictionaries into compact JSON for Iberia.

Usage:
  python3 scripts/convert_mdx.py
"""

from __future__ import annotations

import html
import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DOWNLOADS = Path.home() / "Downloads"
OUT = ROOT / "data"

JOBS = [
    (DOWNLOADS / "简明西汉汉西词典.mdx", OUT / "mdx-zh-es.json", False),
    (DOWNLOADS / "红葡汉词典[69950](100410).mdx", OUT / "mdx-pt-zh.json", True),
]


def strip_html(s: str) -> str:
    s = re.sub(r"(?is)<script.*?>.*?</script>", " ", s)
    s = re.sub(r"(?is)<style.*?>.*?</style>", " ", s)
    s = re.sub(r"(?is)<img[^>]*>", " ", s)
    s = re.sub(r"(?is)<br\s*/?>", "\n", s)
    s = re.sub(r"(?is)</p>", "\n", s)
    s = re.sub(r"(?s)<[^>]+>", " ", s)
    s = html.unescape(s)
    s = re.sub(r"[ \t]+", " ", s)
    s = re.sub(r"\n{3,}", "\n\n", s)
    return s.strip()


def load_mdx(path: Path):
    pkg = Path.home() / "Library/Python/3.11/lib/python/site-packages/readmdict"
    sys.path.insert(0, str(pkg.parent))
    init = pkg / "__init__.py"
    backup = init.read_text(encoding="utf-8")
    init.write_text('from .readmdict import MDX, MDD\n__version__="0.1.1"\n', encoding="utf-8")
    try:
        from readmdict import MDX  # type: ignore

        return MDX(str(path))
    finally:
        init.write_text(backup, encoding="utf-8")


def convert(src: Path, dest: Path, force_utf8: bool = False) -> int:
    mdx = load_mdx(src)
    # Some MDX headers claim UTF-16 while payload is UTF-8 (e.g. 红葡汉词典).
    enc = "utf-8" if force_utf8 else mdx._encoding
    entries = []
    for k, v in mdx.items():
        key = k.decode(enc, errors="replace") if isinstance(k, bytes) else str(k)
        val = v.decode(enc, errors="replace") if isinstance(v, bytes) else str(v)
        text = strip_html(val)
        if key and text:
            entries.append({"h": key, "d": text[:1200]})
    dest.write_text(json.dumps(entries, ensure_ascii=False, separators=(",", ":")), encoding="utf-8")
    return len(entries)


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    for src, dest, force_utf8 in JOBS:
        if not src.exists():
            print(f"skip missing: {src}")
            continue
        n = convert(src, dest, force_utf8=force_utf8)
        print(f"{src.name} -> {dest.name}: {n} entries, {dest.stat().st_size} bytes")


if __name__ == "__main__":
    main()
