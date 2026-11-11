#!/usr/bin/env python3
"""Score an agent's output for one brief in briefs.json. Python 3 standard library only.

A figure counts when the output states it, every source quote is on its page with the value inside,
the sources give that value (equal, sum or ratio, as in trace_check.py), and it matches the answer key.
An issue counts as in score.py: the finding cites the planted evidence.

usage: python3 score_brief.py PACK BRIEF OUTPUT.json
  PACK    this pack's folder (reads briefs.json, truth.json and text/)
  BRIEF   ic-memo or am-update
  OUTPUT  {"figures": [{"key", "value", "check", "sources": [{"doc", "page", "quote", "value", "factor"?}]}],
           "findings": [{"title", "evidence": [{"doc", "page", "quote"}], "mail"?, "register"?}]}
Exit code 1 when any quote is rejected.
"""
import json
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from score import catches, on_page  # noqa: E402
from trace_check import Docs, judge, same  # noqa: E402


def score_figure(docs, want, got):
    if got is None:
        return "✗", "missing"
    c = {"check": got.get("check", "equal"), "claim": {"value": got.get("value")}, "sources": got.get("sources", [])}
    mark, detail = judge(docs, c, trace_claim=False)
    if mark != "✓":
        return mark, detail
    if not same(want["value"], got["value"]):
        return "✗", f'{got["value"]} vs expected {want["value"]}'
    return "✓", detail


def main(argv):
    sys.stdout.reconfigure(encoding="utf-8")
    if len(argv) != 4:
        print(__doc__.strip(), file=sys.stderr)
        return 2
    pack, docs = Path(argv[1]), Docs(argv[1])
    briefs = {b["id"]: b for b in json.loads((pack / "briefs.json").read_text(encoding="utf-8"))["briefs"]}
    if argv[2] not in briefs:
        print(f'unknown brief {argv[2]}: {", ".join(briefs)}', file=sys.stderr)
        return 2
    brief = briefs[argv[2]]
    issues = {i["id"]: i for i in json.loads((pack / "truth.json").read_text(encoding="utf-8"))["issues"]}
    out = json.loads(Path(argv[3]).read_text(encoding="utf-8"))

    got = {}
    for f in out.get("figures", []):
        got.setdefault(f.get("key"), f)
    counts = {"✓": 0, "✗": 0, "?": 0, "!": 0}
    print(brief["title"])
    for want in brief["figures"]:
        mark, detail = score_figure(docs, want, got.get(want["key"]))
        counts[mark] += 1
        print(f'{mark} {want["key"]:<16} {str((got.get(want["key"]) or {}).get("value", "")):<16} {detail}')

    findings = out.get("findings", [])
    valid = [f for f in findings if all(on_page(docs, e) for e in f.get("evidence", []))]
    rejected = len(findings) - len(valid)
    caught = 0
    for iid in brief["issues"]:
        hit = any(catches(f, issues[iid]) for f in valid)
        caught += hit
        print(f'{"✓" if hit else "✗"} {iid:<20} {issues[iid]["title"]}')

    n = len(brief["figures"])
    print(f'\nfigures {counts["✓"]}/{n} right and traced, issues {caught}/{len(brief["issues"])} caught, '
          f'{counts["!"] + rejected} rejected')
    return 1 if counts["!"] or rejected else 0


if __name__ == "__main__":
    sys.exit(main(sys.argv))
