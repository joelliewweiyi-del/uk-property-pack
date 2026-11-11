#!/usr/bin/env python3
"""Score an agent's findings against the planted issues in truth.json. Python 3 standard library only.

A finding counts only when every quote it cites is on the page it names. It catches a planted issue
when it cites at least two of that issue's evidence quotes (or the one, if the issue has one),
and names the mail or register the issue rests on. So a finding has to point at the proof, not just say the right words.

usage: python3 score.py PACK FINDINGS.json
  PACK      this pack's folder (reads truth.json and text/)
  FINDINGS  {"findings": [{"title", "evidence": [{"doc", "page", "quote"}], "mail": "m15", "register": "compliance"}]}
            mail and register are optional: name them when the finding rests on a mail or a register row
Prints caught and missed issues, findings that match none, and "caught N/M".
Exit code 1 when any finding cites a quote that is not on its page.
"""
import json
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from check_quotes import norm  # noqa: E402
from trace_check import Docs  # noqa: E402


def on_page(docs, e):
    pages = docs.pages(e.get("doc", ""))
    page = e.get("page")
    if pages is None or not isinstance(page, int) or not 1 <= page <= len(pages) or not e.get("quote"):
        return False
    return norm(e["quote"]) in norm(pages[page - 1])


def overlaps(e, t):
    qa, qb = norm(e.get("quote", "")), norm(t["quote"])
    # The cited quote holds the planted quote, or is a long enough piece of it (no one-word quotes).
    return e.get("doc") == t["document"] and e.get("page") == t["page"] and (qb in qa or (qa in qb and len(qa) >= min(20, len(qb))))


def catches(finding, issue):
    for key in ("mail", "register"):
        if issue.get(key) and finding.get(key) != issue[key]:
            return False
    need = min(2, len(issue["evidence"]))
    hits = sum(any(overlaps(e, t) for e in finding.get("evidence", [])) for t in issue["evidence"])
    return hits >= need


def main(argv):
    sys.stdout.reconfigure(encoding="utf-8")
    if len(argv) != 3:
        print(__doc__.strip(), file=sys.stderr)
        return 2
    pack = Path(argv[1])
    docs = Docs(pack)
    issues = json.loads((pack / "truth.json").read_text(encoding="utf-8"))["issues"]
    data = json.loads(Path(argv[2]).read_text(encoding="utf-8"))
    findings = data["findings"] if isinstance(data, dict) else data

    valid, rejected = [], 0
    for f in findings:
        bad = [e for e in f.get("evidence", []) if not on_page(docs, e)]
        if bad:
            rejected += 1
            print(f'! rejected  {f.get("title", "")}: quote not on {bad[0].get("doc")} p.{bad[0].get("page")}')
        else:
            valid.append(f)

    matched, caught = set(), 0
    for issue in issues:
        hit = [i for i, f in enumerate(valid) if catches(f, issue)]
        matched.update(hit)
        caught += bool(hit)
        print(f'{"✓" if hit else "✗"} {issue["id"]:<20} {issue["title"]}')
    extra = [f for i, f in enumerate(valid) if i not in matched]
    for f in extra:
        print(f'+ unmatched {f.get("title", "")}')
    print(f"\ncaught {caught}/{len(issues)}, {len(extra)} unmatched, {rejected} rejected")
    return 1 if rejected else 0


if __name__ == "__main__":
    sys.exit(main(sys.argv))
