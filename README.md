# uk-property-pack

[![test](https://github.com/joelliewweiyi-del/uk-property-pack/actions/workflows/test.yml/badge.svg)](https://github.com/joelliewweiyi-del/uk-property-pack/actions/workflows/test.yml)

Synthetic UK property documents, tenant mail and registers, with errors planted on purpose. Use it to test an agent that reads documents or runs a property back office: does it catch what a careful property manager would catch?

Every person, company, address and number is made up. Read the dates as of **12 November 2026**.

## What is in it

| Folder | Contents |
|---|---|
| `pdf/` | 11 PDFs: a commercial lease, 2 residential tenancies, 2 gas safety records, 2 electrical reports (EICR), an offering memorandum, a rent roll, a quarterly property report, a service charge budget |
| `text/` | The same documents as plain text, one file per page |
| `mail/inbox.json` | 12 mails to the property manager: repairs, a service charge dispute, a buyer's surveyor, a notice to leave, a bank-detail change |
| `registers/` | Units, compliance dates and contractors, as CSV |
| `truth.json` | Every field with its page and quote, and the planted issues with the quotes that prove them |
| `briefs.json` | Two briefs (data room in, IC memo out; PM report in, AM update out) with the figures and issues a good output must have |
| `check/` | The checkers (Python 3, standard library): `check_quotes.py` for fields, `trace_check.py` for figures against their sources, `score.py` for findings against the planted issues, `score_brief.py` for a whole output against a brief |
| `examples/` | A claims file, a findings file and one output per brief to run the checkers on |
| `skill/` | Grok Bot skills: "Extract with quote" and "Trace every figure" |

Two buildings: **22 Canal Street** (a shop and four flats, owned by a fund that is selling it, with the vendor's memo, rent roll and the managing agent's Q3 report) and **Millbrook House** (a block of 12 leasehold flats with a managing agent). The same names appear in [doc-trace](https://github.com/joelliewweiyi-del/doc-trace) and [work-order-agent](https://github.com/joelliewweiyi-del/work-order-agent).

## The quote check

A field counts only when its quote is on the page it names and its value is inside that quote. The checker does not trust whoever did the extraction.

```sh
python3 check/check_quotes.py pdf/om-22-canal-street.pdf fields.json
✓ price            GBP 2,150,000        p.1 "Offers are invited for the freehold at GBP 2,150,000, subject to contract."
✗ rent_4b          GBP 48,100           value is not in the quote

1/2 fields traced
```

`fields.json` is a list of `{"key", "value", "page", "quote"}`. The source can be a PDF (needs `pdftotext` from poppler) or a folder of page files from `text/`. Exit code 1 when any field fails.

## Tracing figures to their sources

`trace_check.py` takes claims: a figure in one document and the sources that should prove it. Every quote passes the check above first. Then the code compares the values: `equal` (with a `factor` for monthly or quarterly figures), `sum` for totals, `ratio` for percentages and yields.

```sh
python3 check/trace_check.py . examples/claims-22-canal-street.json
✗ rent_4b            GBP 52,000       GBP 52,000 vs GBP 48,100 (lease-canal-4b.pdf p.2); ...
✓ rent_2a            GBP 23,400       ties to tenancy-canal-2a.pdf p.1, rent-roll-22-canal-street.pdf p.1
✗ niy                5.32%            5.32% vs 5.152% (118,300 / 2,296,200)
✗ pm_collection      100%             100% vs 93.4066% (27,625 / 29,575)

11 claims: 5 tie, 5 mismatch, 1 no source, 0 rejected
```

A mismatch is a finding. A rejected quote is an error (exit code 1).

## Scoring an agent

`score.py` reads an agent's findings, each with the quotes it rests on, and counts the planted issues it caught. A finding counts only when its quotes are on their pages, and it catches an issue only when it cites that issue's proof.

```sh
python3 check/score.py . examples/findings-sample.json
caught 3/15, 1 unmatched, 0 rejected
```

## Scoring a brief

`briefs.json` holds the two briefs we expect: **ic-memo** (write the investment committee memo from the data room) and **am-update** (write the asset manager's quarterly update from the property manager's report). Each lists the figures a good output states and the planted issues it flags. `score_brief.py` scores one output: a figure counts when its sources are on their pages, give that value, and match the answer key. A memo that copies the broker's GBP 52,000 is traced, and still wrong.

```sh
python3 check/score_brief.py . ic-memo examples/output-ic-memo.json
figures 12/12 right and traced, issues 0/9 caught, 0 rejected
```

The example outputs hold figures only, so they catch no issues. Add `findings` in the format of `score.py`.

For a blind run, give the agent a folder with only `pdf/`, `registers/`, `mail/` and the two quote checkers, the brief's task and its figure keys and labels, never `briefs.json`, `truth.json` or `examples/`. Then score its output here. A register is cited as one page (`{"doc": "compliance.csv", "page": 1}`), a mail as `inbox.json` with its position in the file as the page.

## The planted issues

Spoilers. Fifteen problems are planted across the documents, mail and registers: an offering memorandum that overstates rent and income security, a quarterly report that claims full rent collection and an on-track repairs budget when neither is true, and says every certificate is in date, overdue gas and electrical checks, an open C2 electrical defect, a deposit above the legal cap, a service charge budget that doesn't add up, works that need a Section 20 consultation, a typo in the compliance register, and a bank-detail change from a look-alike domain. `truth.json` lists each one with the quotes that prove it.

## Rebuild

Needs Node.js 22 or later.

```sh
npm install
npm run build   # writes pdf/, text/, mail/, registers/ and truth.json from src/
npm test
```

The build stops if any quote in `src/` is not on the page it names. The tests also check that the planted errors stay errors.

## License

MIT
