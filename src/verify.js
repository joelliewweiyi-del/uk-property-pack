// Same rule as check/check_quotes.py: a quote must be on the page it names, and the value inside the quote.
const norm = (s) => String(s).replace(/\s+/g, ' ').trim();

export function problems(docs, issues) {
  const errors = [];
  const onPage = (name, page, quote, where) => {
    const doc = docs[name];
    if (!doc) return errors.push(`${where}: no document ${name}`);
    const text = doc.pages[page - 1];
    if (!text) return errors.push(`${where}: ${name} has no page ${page}`);
    if (!norm(text.join('\n')).includes(norm(quote))) errors.push(`${where}: quote not on ${name} p.${page}: "${quote}"`);
  };
  for (const [name, doc] of Object.entries(docs)) {
    for (const f of doc.fields) {
      onPage(name, f.page, f.quote, `${name} field ${f.key}`);
      if (!norm(f.quote).includes(norm(f.value))) errors.push(`${name} field ${f.key}: value "${f.value}" not in its quote`);
    }
  }
  for (const issue of issues) for (const [name, page, quote] of issue.evidence) onPage(name, page, quote, `issue ${issue.id}`);
  return errors;
}
