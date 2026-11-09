// Writes the pack: pdf/, text/ (one file per page), mail/, registers/ and truth.json.
// Fails loudly if any field or issue quote is not on the page it names.
import { PDFDocument, StandardFonts } from 'pdf-lib';
import { mkdir, writeFile, rm } from 'node:fs/promises';
import { DOCS, ISSUES } from '../src/docs.js';
import { INBOX, COMPLIANCE, UNITS, CONTRACTORS } from '../src/records.js';
import { problems } from '../src/verify.js';

const root = new URL('../', import.meta.url);
const out = (p) => new URL(p, root);

const errors = problems(DOCS, ISSUES);
if (errors.length) {
  console.error(errors.join('\n'));
  process.exit(1);
}

for (const dir of ['pdf', 'text', 'mail', 'registers']) {
  await rm(out(dir), { recursive: true, force: true });
  await mkdir(out(dir), { recursive: true });
}

for (const [name, doc] of Object.entries(DOCS)) {
  const pdf = await PDFDocument.create();
  pdf.setTitle(doc.title);
  pdf.setCreationDate(new Date('2026-11-01T00:00:00Z')); // fixed, so a rebuild gives the same bytes
  pdf.setModificationDate(new Date('2026-11-01T00:00:00Z'));
  const font = await pdf.embedFont(StandardFonts.Helvetica);
  const base = name.replace(/\.pdf$/, '');
  await mkdir(out(`text/${base}`), { recursive: true });
  for (const [i, lines] of doc.pages.entries()) {
    const page = pdf.addPage([595, 842]);
    for (const line of lines) if (font.widthOfTextAtSize(line, 11) > 595 - 2 * 56) throw new Error(`${name}: line too wide: "${line}"`);
    if (lines.length > 36) throw new Error(`${name}: page ${i + 1} has too many lines`);
    lines.forEach((line, j) => page.drawText(line, { x: 56, y: 780 - j * 20, size: 11, font }));
    await writeFile(out(`text/${base}/p${i + 1}.txt`), lines.join('\n') + '\n');
  }
  await writeFile(out(`pdf/${name}`), await pdf.save({ useObjectStreams: false }));
}

const csv = (rows) => rows.map((r) => r.map((c) => (/[",]/.test(c) ? `"${c.replace(/"/g, '""')}"` : c)).join(',')).join('\n') + '\n';
await writeFile(out('mail/inbox.json'), JSON.stringify(INBOX, null, 2) + '\n');
await writeFile(out('registers/compliance.csv'), csv(COMPLIANCE));
await writeFile(out('registers/units.csv'), csv(UNITS));
await writeFile(out('registers/contractors.csv'), csv(CONTRACTORS));

const truth = {
  _note: 'Synthetic data. Every property, person, company and address is made up. Read dates as of 12 November 2026.',
  documents: Object.fromEntries(Object.entries(DOCS).map(([name, d]) => [name, { title: d.title, pages: d.pages.length, fields: d.fields }])),
  issues: ISSUES.map((i) => ({ ...i, evidence: i.evidence.map(([document, page, quote]) => ({ document, page, quote })) })),
};
await writeFile(out('truth.json'), JSON.stringify(truth, null, 2) + '\n');
console.log(`wrote ${Object.keys(DOCS).length} documents, ${INBOX.length} mails, ${ISSUES.length} planted issues`);
