import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { DOCS, ISSUES } from '../src/docs.js';
import { problems } from '../src/verify.js';

const root = fileURLToPath(new URL('../', import.meta.url));
const python = process.platform === 'win32' ? 'python' : 'python3';
const checker = join(root, 'check/check_quotes.py');
const hasPdftotext = spawnSync('pdftotext', ['-v']).error === undefined;
const tmp = mkdtempSync(join(tmpdir(), 'pack-'));

function check(source, fields) {
  const file = join(tmp, `x${Math.random()}.json`);
  writeFileSync(file, JSON.stringify(fields));
  return spawnSync(python, [checker, source, file], { encoding: 'utf8' });
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
  const lease = join(root, 'text', 'lease-canal-4b');
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

const run = (script, file) => spawnSync(python, [join(root, 'check', script), root, file], { encoding: 'utf8' });
const tmpJson = (data) => {
  const file = join(tmp, `j${Math.random()}.json`);
  writeFileSync(file, JSON.stringify(data));
  return file;
};
const claimsFile = join(root, 'examples', 'claims-22-canal-street.json');

test('the trace check finds the memo and report mismatches and ties the rest', () => {
  const r = run('trace_check.py', claimsFile);
  assert.equal(r.status, 0, r.stdout + r.stderr);
  for (const line of ['✗ rent_4b', '✓ rent_2a', '✗ total_rent', '✗ niy', '✓ pm_demanded ', '✗ pm_collection', '✗ pm_repairs_pct', '? rent_1a']) {
    assert.ok(r.stdout.includes(line), `missing "${line}"\n${r.stdout}`);
  }
  assert.match(r.stdout, /11 claims: 5 tie, 5 mismatch, 1 no source, 0 rejected/);
});

test('the trace check rejects a source quote that is not in the document', () => {
  const data = JSON.parse(readFileSync(claimsFile, 'utf8'));
  data.claims[0].sources[0].quote = 'The annual rent is GBP 52,000, payable quarterly in advance.';
  data.claims[0].sources[0].value = 'GBP 52,000';
  const r = run('trace_check.py', tmpJson(data));
  assert.equal(r.status, 1);
  assert.match(r.stdout, /! rent_4b .*quote not found on page 2/);
});

test('the scorer gives the answer key full marks and the sample 3', () => {
  const { issues } = JSON.parse(readFileSync(join(root, 'truth.json'), 'utf8'));
  const key = issues.map((i) => ({
    title: i.title,
    mail: i.mail,
    register: i.register,
    evidence: i.evidence.map((e) => ({ doc: e.document, page: e.page, quote: e.quote })),
  }));
  assert.match(run('score.py', tmpJson({ findings: key })).stdout, new RegExp(`caught ${issues.length}/${issues.length}, 0 unmatched`));
  assert.match(run('score.py', join(root, 'examples', 'findings-sample.json')).stdout, /caught 3\/15, 1 unmatched, 0 rejected/);
});

test('the scorer rejects an invented quote and does not count a one-word quote', () => {
  const om = 'om-22-canal-street.pdf';
  const fake = run('score.py', tmpJson({ findings: [{ title: 'x', evidence: [{ doc: om, page: 2, quote: 'Unit 4B rent is GBP 48,100' }] }] }));
  assert.equal(fake.status, 1);
  assert.match(fake.stdout, /caught 0\/15, 0 unmatched, 1 rejected/);
  const short = run('score.py', tmpJson({ findings: [{ title: 'x', evidence: [{ doc: om, page: 2, quote: 'GBP' }, { doc: 'lease-canal-4b.pdf', page: 2, quote: 'GBP' }] }] }));
  assert.match(short.stdout, /caught 0\/15, 1 unmatched/);
});

test('the rent roll agrees with the leases; the quarterly report percentages stay wrong', () => {
  const field = (doc, key) => DOCS[doc].fields.find((f) => f.key === key).value;
  const num = (s) => Number(s.replace(/[^\d.]/g, ''));
  const rr = 'rent-roll-22-canal-street.pdf';
  const pm = 'pm-report-22-canal-street-q3-2026.pdf';
  assert.equal(['rent_4b', 'rent_1a', 'rent_2a', 'rent_5c'].reduce((s, k) => s + num(field(rr, k)), 0), num(field(rr, 'total_rent')));
  assert.equal(num(field(rr, 'rent_4b')), num(field('lease-canal-4b.pdf', 'annual_rent')));
  assert.notEqual(Math.round((num(field(pm, 'collected')) / num(field(pm, 'demanded'))) * 100), num(field(pm, 'collection_rate')));
  assert.notEqual(Math.round((num(field(pm, 'repairs_spent')) / num(field(pm, 'repairs_budget'))) * 100), num(field(pm, 'repairs_pct')));
  assert.equal(num(field(pm, 'demanded')) - num(field(pm, 'collected')), num(field(pm, 'arrears')));
});

// The two briefs: an output scores a figure only when it is traced and right, and an issue only when it cites the proof.
const brief = (id, data) => spawnSync(python, [join(root, 'check', 'score_brief.py'), root, id, tmpJson(data)], { encoding: 'utf8' });
const example = (id) => JSON.parse(readFileSync(join(root, 'examples', `output-${id}.json`), 'utf8'));
const truthFindings = (ids) => {
  const { issues } = JSON.parse(readFileSync(join(root, 'truth.json'), 'utf8'));
  return issues.filter((i) => ids.includes(i.id)).map((i) => ({
    title: i.title, mail: i.mail, register: i.register,
    evidence: i.evidence.map((e) => ({ doc: e.document, page: e.page, quote: e.quote })),
  }));
};

test('each brief: the example figures and the planted evidence score full marks', () => {
  const { briefs } = JSON.parse(readFileSync(join(root, 'briefs.json'), 'utf8'));
  for (const b of briefs) {
    const r = brief(b.id, { ...example(b.id), findings: truthFindings(b.issues) });
    assert.equal(r.status, 0, r.stdout + r.stderr);
    assert.match(r.stdout, new RegExp(`figures ${b.figures.length}/${b.figures.length} right and traced, issues ${b.issues.length}/${b.issues.length} caught, 0 rejected`));
  }
});

test('an IC memo that copies the broker is traced but wrong', () => {
  const out = example('ic-memo');
  const rent = out.figures.find((f) => f.key === 'rent_4b');
  rent.value = 'GBP 52,000';
  rent.sources = [{ doc: 'om-22-canal-street.pdf', page: 2, quote: '4B Copperleaf Coffee Ltd Commercial GBP 52,000 31 March 2031', value: 'GBP 52,000' }];
  const r = brief('ic-memo', out);
  assert.match(r.stdout, /✗ rent_4b .*GBP 52,000 vs expected GBP 48,100/);
  assert.match(r.stdout, /figures 11\/12/);
});

test('a brief output loses a figure that is missing, unsourced, or not what its source says', () => {
  const out = example('am-update');
  out.figures = out.figures.filter((f) => f.key !== 'arrears_now');
  out.figures.find((f) => f.key === 'repairs_budget').sources = [];
  out.figures.find((f) => f.key === 'collection_rate').value = '100%';
  const r = brief('am-update', out);
  assert.equal(r.status, 0);
  assert.match(r.stdout, /✗ arrears_now .*missing/);
  assert.match(r.stdout, /\? repairs_budget .*no source given/);
  assert.match(r.stdout, /✗ collection_rate .*100% vs 93\.4066%/);
  assert.match(r.stdout, /figures 5\/8/);
});

test('a brief output with an invented source quote is rejected', () => {
  const out = example('ic-memo');
  out.figures[0].sources[0].quote = 'The annual rent is GBP 48,100 per year.';
  const r = brief('ic-memo', out);
  assert.equal(r.status, 1);
  assert.match(r.stdout, /! rent_4b /);
});
