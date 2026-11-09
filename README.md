# uk-property-pack

[![test](https://github.com/joelliewweiyi-del/uk-property-pack/actions/workflows/test.yml/badge.svg)](https://github.com/joelliewweiyi-del/uk-property-pack/actions/workflows/test.yml)

Synthetic UK property documents, tenant mail and registers, with errors planted on purpose. Use it to test an agent that reads documents or runs a property back office: does it catch what a careful property manager would catch?

Every person, company, address and number is made up. Read the dates as of **12 November 2026**.

## What is in it

| Folder | Contents |
|---|---|
| `pdf/` | 9 PDFs: a commercial lease, 2 residential tenancies, 2 gas safety records, 2 electrical reports (EICR), an offering memorandum, a service charge budget |
| `text/` | The same documents as plain text, one file per page |
| `mail/inbox.json` | 12 mails to the property manager: repairs, a service charge dispute, a buyer's surveyor, a notice to leave, a bank-detail change |
| `registers/` | Units, compliance dates and contractors, as CSV |
| `truth.json` | Every field with its page and quote, and the planted issues with the quotes that prove them |
| `check/check_quotes.py` | The quote checker (Python 3, standard library) |
| `skill/` | A Grok Bot skill that extracts with quotes and runs the checker |

Two buildings: **22 Canal Street** (a shop and four flats, owned by a fund that is selling it) and **Millbrook House** (a block of 12 leasehold flats with a managing agent). The same names appear in [doc-trace](https://github.com/joelliewweiyi-del/doc-trace) and [work-order-agent](https://github.com/joelliewweiyi-del/work-order-agent).

## The quote check

A field counts only when its quote is on the page it names and its value is inside that quote. The checker does not trust whoever did the extraction.

```sh
python3 check/check_quotes.py pdf/om-22-canal-street.pdf fields.json
✓ price            GBP 2,150,000        p.1 "Offers are invited for the freehold at GBP 2,150,000, subject to contract."
✗ rent_4b          GBP 48,100           value is not in the quote

1/2 fields traced
```

`fields.json` is a list of `{"key", "value", "page", "quote"}`. The source can be a PDF (needs `pdftotext` from poppler) or a folder of page files from `text/`. Exit code 1 when any field fails.

## The planted issues

Spoilers. Twelve problems are planted across the documents, mail and registers: an offering memorandum that overstates rent and income security, overdue gas and electrical checks, an open C2 electrical defect, a deposit above the legal cap, a service charge budget that doesn't add up, works that need a Section 20 consultation, a typo in the compliance register, and a bank-detail change from a look-alike domain. `truth.json` lists each one with the quotes that prove it.

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
