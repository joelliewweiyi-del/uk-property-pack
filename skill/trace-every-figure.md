# Grok Bot skill: Trace every figure

Paste the block below into a Grok Bot chat. The Bot saves it as a skill you can call by name from any Bot.

---

Save this as a skill called "Trace every figure".

When to use it: someone gives me a memo, an investment memorandum, a rent roll or a property report, with the documents behind it, and asks whether the figures hold up.

Inputs: the document to check (the target) and the source documents (leases, tenancies, rent roll, certificates, budgets). If I only give a data room, ask which document is the target.

Steps:
1. Make sure the checkers are on the computer: download the folder `check` from https://github.com/joelliewweiyi-del/uk-property-pack (`check_quotes.py`, `trace_check.py`, `score.py`, in one folder). They need Python 3 and `pdftotext` (install poppler-utils if it is missing). Put all PDFs in one folder.
2. Go through the target page by page. List every figure: amounts, rents, totals, percentages, yields, dates, areas, and claims such as "no break option" or "all certificates are current".
3. For each figure, find the source that should prove it. Write a claim: `id`, `check`, `claim` and `sources`. The claim and every source are `{"doc", "page", "quote", "value"}`, with the quote copied character for character from that page and the value inside the quote.
   - `check: "equal"` when the source should say the same. Add `"factor": 12` to a source that gives a monthly figure for a yearly one, `0.25` for a quarter.
   - `check: "sum"` for a total, with every line it adds up as a source.
   - `check: "ratio"` for a percentage: source 1 divided by source 2. A yield takes the rent and the price, with the purchaser costs as a factor on the price (6.8% costs is factor 1.068).
   - No source in the documents: leave `sources` empty. Never invent one.
4. Save the claims as `claims.json` and run `python3 check/trace_check.py <pdf folder> claims.json`.
5. A line marked `!` means a quote is wrong. Go back to the page and fix the quote. Never edit a quote to make it pass. Run again until there is no `!`.
6. Every `✗` and every claim the sources contradict in words (a break the memo leaves out, a certificate that is overdue) is a finding. Write `findings.json`: `{"findings": [{"title", "evidence": [{"doc", "page", "quote"}]}]}`, with the quotes on both sides.
7. If the documents come from the uk-property-pack, also run `python3 check/score.py <pack folder> findings.json` and report the score.

What to return:
- One line per finding, most money first: what the target says, what the source says, both quotes and pages, and the difference in GBP or percentage points.
- Under it, the `trace_check.py` output as it printed.
- The count: figures traced, figures that tie, mismatches, figures with no source.
- If a figure moves the price (rent, yield), the arithmetic on traced figures only.

Rules:
- Every number in the answer comes from a traced quote or from arithmetic shown on traced quotes.
- Draft questions to the seller or the managing agent, but never send mail, change a register or pay anything without my approval.
