import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { DOCS, ISSUES } from '../src/docs.js';
import { problems } from '../src/verify.js';

const root = new URL('../', import.meta.url).pathname;
const checker = join(root, 'check/check_quotes.py');
const hasPdftotext = spawnSync('pdftotext', ['-v']).error === undefined;
const tmp = mkdtempSync(join(tmpdir(), 'pack-'));

function check(source, fields) {
  const file = join(tmp, `x${Math.random()}.json`);
  writeFileSync(file, JSON.stringify(fields));
  return spawnSync('python3', [checker, source, file], { encoding: 'utf8' });
}

test('every field and every issue quote is on the page it names', () => {
  assert.deepEqual(problems(DOCS, ISSUES), []);
});

test('the build check fails on a quote that is not in the document', () => {
  const docs = structuredClone(DOCS);
  docs['lease-canal-4b.pdf'].fields[4].quote = 'The annual rent is GBP 52,000, payable quarterly in advance.';
  assert.equal(problems(docs, []).length, 2); // quote not on the page, and the value no longer inside it
});

test('the checker traces every truth field, from the page text', () => {
  for (const [name, doc] of Object.entries(DOCS)) {
    const r = check(join(root, 'text', name.replace(/\.pdf$/, '')), doc.fields);
    assert.equal(r.status, 0, `${name}\n${r.stdout}${r.stderr}`);
  }
});

test('the checker traces every truth field, from the PDF', { skip: !hasPdftotext && 'pdftotext not installed' }, () => {
  for (const [name, doc] of Object.entries(DOCS)) {
    const r = check(join(root, 'pdf', name), doc.fields);
    assert.equal(r.status, 0, `${name}\n${r.stdout}${r.stderr}`);
  }
});

test('the checker rejects an invented value, a wrong page and a missing value', () => {
  const lease = join(root, 'text/lease-canal-4b');
  const rent = DOCS['lease-canal-4b.pdf'].fields.find((f) => f.key === 'annual_rent');
  const cases = [
    [{ ...rent, value: 'GBP 52,000' }, 'value is not in the quote'],
    [{ ...rent, page: 1 }, 'quote not found on page 1'],
    [{ ...rent, page: 9 }, 'page 9 does not exist'],
    [{ ...rent, value: null }, 'not found in the document'],
  ];
  for (const [field, reason] of cases) {
    const r = check(lease, [field]);
    assert.equal(r.status, 1);
    assert.match(r.stdout, new RegExp(reason));
  }
});

// The planted errors must stay errors. If someone "fixes" the data, these fail.
test('the service charge lines do not add up to the printed total', () => {
  const lines = DOCS['service-charge-millbrook-2026.pdf'].pages[0];
  const amount = (l) => Number(l.match(/GBP ([\d,]+)/)[1].replace(/,/g, ''));
  const totalAt = lines.findIndex((l) => l.startsWith('Total budget'));
  const items = lines.slice(0, totalAt).filter((l) => l.includes('GBP'));
  const total = amount(lines[totalAt]);
  assert.equal(items.length, 8);
  assert.equal(items.reduce((s, l) => s + amount(l), 0), 60070);
  assert.notEqual(total, 60070);
});

test('flat 2A deposit is above five weeks of rent, flat 5C is within it', () => {
  const gbp = (doc, key) => Number(DOCS[doc].fields.find((f) => f.key === key).value.replace(/[^\d.]/g, ''));
  const overCap = (doc) => gbp(doc, 'deposit') > Math.floor(((gbp(doc, 'monthly_rent') * 12) / 52) * 5);
  assert.equal(overCap('tenancy-canal-2a.pdf'), true);
  assert.equal(overCap('tenancy-canal-5c.pdf'), false);
});

test('the OM yield follows from its own rent, and drops with the lease rent', () => {
  const om = (key) => DOCS['om-22-canal-street.pdf'].fields.find((f) => f.key === key).value;
  const num = (s) => Number(s.replace(/[^\d.]/g, ''));
  const niy = (rent) => Math.round((rent / (num(om('price')) * (1 + num(om('purchaser_costs')) / 100))) * 10000) / 100;
  const lease = num(DOCS['lease-canal-4b.pdf'].fields.find((f) => f.key === 'annual_rent').value);
  assert.equal(niy(num(om('total_rent'))), num(om('niy')));
  assert.equal(niy(num(om('total_rent')) - num(om('rent_4b')) + lease), 5.15);
});
