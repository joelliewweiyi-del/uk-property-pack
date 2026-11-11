#!/usr/bin/env python3
"""Check an extraction against its source document. Python 3 standard library only.

A field is accepted only when its quote is on the page it names and its value is inside that quote.
The check does not trust the extractor, so it works the same for a person, a script or a model.

usage: python3 check_quotes.py SOURCE EXTRACTION.json
  SOURCE      a PDF (needs pdftotext from poppler) or a folder of page files p1.txt, p2.txt, ...
  EXTRACTION  a list of {"key", "value", "page", "quote"}, or {"fields": [...]}
Exit code 1 when any field is rejected or missing.
"""
import json
import re
import subprocess
import sys
from pathlib import Path


def norm(s):
    return re.sub(r"\s+", " ", str(s)).strip()


def read_pages(source):
    p = Path(source)
    if p.is_dir():
        files = sorted(p.glob("p*.txt"), key=lambda f: int(f.stem[1:]))
        return [f.read_text(encoding="utf-8") for f in files]
    if p.suffix == ".csv":  # a register is one page
        return [p.read_text(encoding="utf-8")]
    if p.suffix == ".json":  # a mailbox: one page per mail, in file order
        return ["\n".join(str(v) for v in m.values()) for m in json.loads(p.read_text(encoding="utf-8"))]
    text = subprocess.run(["pdftotext", "-layout", str(p), "-"], capture_output=True, text=True, encoding="utf-8", check=True).stdout
    pages = text.split("\f")
    return pages[:-1] if pages and not pages[-1].strip() else pages


def verify(pages, field):
    value, quote, page = field.get("value"), field.get("quote"), field.get("page")
    if value in (None, ""):
        return "missing", "not found in the document"
    if isinstance(page, str) and page.isdigit():
        page = int(page)
    if not isinstance(page, int) or isinstance(page, bool) or not 1 <= page <= len(pages):
        return "rejected", f"page {page} does not exist"
    if not quote:
        return "rejected", "no quote given"
    if norm(quote) not in norm(pages[page - 1]):
        return "rejected", f"quote not found on page {page}"
    if norm(value) not in norm(quote):
        return "rejected", "value is not in the quote"
    return "traced", None


def main(argv):
    sys.stdout.reconfigure(encoding="utf-8")  # Windows consoles default to cp1252, which has no ✓ or ✗
    if len(argv) != 3:
        print(__doc__.strip(), file=sys.stderr)
        return 2
    pages = read_pages(argv[1])
    data = json.loads(Path(argv[2]).read_text(encoding="utf-8"))
    fields = data["fields"] if isinstance(data, dict) else data
    bad = 0
    for f in fields:
        status, reason = verify(pages, f)
        mark = {"traced": "✓", "rejected": "✗", "missing": "-"}[status]
        bad += status != "traced"
        tail = f'p.{f.get("page")} "{f.get("quote")}"' if status == "traced" else reason
        print(f'{mark} {str(f.get("key", "")):<16} {str(f.get("value", "")):<20} {tail}')
    print(f"\n{len(fields) - bad}/{len(fields)} fields traced")
    return 1 if bad else 0


if __name__ == "__main__":
    sys.exit(main(sys.argv))
