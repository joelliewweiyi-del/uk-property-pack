# Grok Bot skill: Extract with quote

Paste the block below into a Grok Bot chat. The Bot saves it as a skill you can call by name from any Bot.

---

Save this as a skill called "Extract with quote".

When to use it: someone asks for figures, dates, names or terms from a document (lease, tenancy, invoice, certificate, offering memorandum, service charge budget), or asks whether two documents agree.

Inputs: one or more PDFs, and the list of fields wanted. If no list is given, propose one and wait for my yes.

Steps:
1. Make sure the checker is on the computer: `check_quotes.py` from https://github.com/joelliewweiyi-del/uk-property-pack (folder `check`). It needs Python 3 and `pdftotext` (install poppler-utils if it is missing).
2. Read the PDF page by page. For every field write `key`, `value`, `page` (a number) and `quote`. The quote is copied character for character from that page. The value appears inside the quote, written the same way as in the document. If the document does not say it, set the value to null. Never guess.
3. Save the fields as JSON next to the PDF and run `python3 check_quotes.py <file.pdf> <fields.json>`.
4. For every field marked ✗, go back to the page and fix the quote or the value. Never edit a quote to make it pass. If it still fails, set the value to null.
5. Run the checker again until no field is ✗.

What to return:
- A table: field, value, page, quote, and ✓ or ✗ from the checker. Paste the checker output under it.
- When comparing documents: one row per mismatch with both quotes and both pages, then the arithmetic if a number depends on others (totals, yields, deposit caps).
- Say how many fields were traced out of how many.

Rules:
- Every number in the answer comes from a traced field or from arithmetic shown on traced fields.
- Never send mail, change a register or pay anything without my approval.
