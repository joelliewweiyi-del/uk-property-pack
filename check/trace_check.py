#!/usr/bin/env python3
"""Trace figures in one document (a memo, a report) to their sources. Python 3 standard library only.

Every quote, in the claim and in its sources, must pass the same check as check_quotes.py:
on the page it names, with its value inside it. Then the code, not the extractor, compares the values.

usage: python3 trace_check.py DOCS CLAIMS.json
  DOCS    a folder with the documents: PDFs (needs pdftotext), or text/<name>/p1.txt ... as in this pack
  CLAIMS  {"claims": [{"id", "check", "claim": {...}, "sources": [{...}, ...]}]}
          claim and each source: {"doc", "page", "quote", "value"}; a source may add "factor" (12 turns a
          monthly rent into a yearly one)
          check: "equal"  the claim equals each source
                 "sum"    the claim equals the sum of the sources
                 "ratio"  the claim, a percentage, equals source 1 / source 2 x 100, to the claim's decimals
Prints one line per claim: ✓ ties, ✗ mismatch, ? no source, ! rejected (a quote failed the check).
Exit code 1 when any quote is rejected. A mismatch is a finding, not an error.
"""
import json
import re
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from check_quotes import norm, read_pages, verify  # noqa: E402


def number(value):
    # Only amounts and percentages count as numbers ("GBP 48,100", "5.32%", 118300); a date is text.
    m = re.fullmatch(r"\s*(?:GBP|EUR|£|€)?\s*(-?[\d,]*\.?\d+)\s*%?\s*", str(value))
    return float(m.group(1).replace(",", "")) if m else None


def same(a, b):
    na, nb = number(a), number(b)
    if na is not None and nb is not None:
        decimals = len(str(a).split(".")[1].rstrip("%")) if "." in str(a) else 0
        return round(nb, decimals) == round(na, decimals)
    return norm(a).lower() == norm(b).lower()


def amount(source):
    n = number(source["value"])
    return None if n is None else n * source.get("factor", 1)


def fmt(n):
    return f"{n:,.4f}".rstrip("0").rstrip(".")


class Docs:
    def __init__(self, root):
        self.root, self.cache = Path(root), {}

    def pages(self, name):
        if name not in self.cache:
            base = Path(name).stem
            for candidate in (self.root / "text" / base, self.root / name, self.root / "pdf" / name):
                if candidate.exists():
                    self.cache[name] = read_pages(candidate)
                    break
            else:
                self.cache[name] = None
        return self.cache[name]


def check_quote(docs, ref):
    pages = docs.pages(ref.get("doc", ""))
    if pages is None:
        return f'no document {ref.get("doc")}'
    status, reason = verify(pages, ref)
    return None if status == "traced" else f'{ref.get("doc")}: {reason}'


def judge(docs, c):
    claim, sources, kind = c.get("claim", {}), c.get("sources", []), c.get("check", "equal")
    for ref in [claim, *sources]:
        problem = check_quote(docs, ref)
        if problem:
            return "!", problem
    if not sources:
        return "?", "no source given"
    if any(amount(x) is None for x in sources) and kind != "equal":
        return "!", "a source value is not a number"
    if kind == "sum":
        total = sum(amount(x) for x in sources)
        return ("✓", f"= sum of {len(sources)} sources") if same(claim["value"], total) else ("✗", f'{claim["value"]} vs sum {fmt(total)}')
    if kind == "ratio":
        if len(sources) != 2 or not amount(sources[1]):
            return "!", "ratio needs two sources and a non-zero second one"
        pct = amount(sources[0]) / amount(sources[1]) * 100
        return ("✓", f"= {fmt(pct)}%") if same(claim["value"], pct) else ("✗", f'{claim["value"]} vs {fmt(pct)}% ({fmt(amount(sources[0]))} / {fmt(amount(sources[1]))})')
    if kind != "equal":
        return "!", f"unknown check {kind}"
    want = lambda x: amount(x) if "factor" in x else x["value"]  # noqa: E731
    off = [x for x in sources if not same(claim["value"], want(x))]
    if not off:
        return "✓", "ties to " + ", ".join(f'{x["doc"]} p.{x["page"]}' for x in sources)
    return "✗", "; ".join(f'{claim["value"]} vs {fmt(want(x)) if "factor" in x else x["value"]} ({x["doc"]} p.{x["page"]})' for x in off)


def main(argv):
    sys.stdout.reconfigure(encoding="utf-8")
    if len(argv) != 3:
        print(__doc__.strip(), file=sys.stderr)
        return 2
    docs = Docs(argv[1])
    data = json.loads(Path(argv[2]).read_text(encoding="utf-8"))
    claims = data["claims"] if isinstance(data, dict) else data
    counts = {"✓": 0, "✗": 0, "?": 0, "!": 0}
    for c in claims:
        mark, detail = judge(docs, c)
        counts[mark] += 1
        print(f'{mark} {str(c.get("id", "")):<18} {str(c.get("claim", {}).get("value", "")):<16} {detail}')
    print(f'\n{len(claims)} claims: {counts["✓"]} tie, {counts["✗"]} mismatch, {counts["?"]} no source, {counts["!"]} rejected')
    return 1 if counts["!"] else 0


if __name__ == "__main__":
    sys.exit(main(sys.argv))
