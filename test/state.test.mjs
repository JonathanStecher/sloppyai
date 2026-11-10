import test from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';
import { readFile, writeFile, rm } from 'node:fs/promises';
import { promisify } from 'node:util';
import { execFile } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { audit } from '../src/audit.mjs';
import { saveReport } from '../src/state.mjs';
import { compareReports } from '../src/ratings.mjs';
import { htmlReport, markdownReport } from '../src/report.mjs';
import { readJson } from '../src/util.mjs';
import { fixture } from './helpers.mjs';

const exec = promisify(execFile);
const cli = new URL('../skills/sloppyai/scripts/sloppyai.mjs', import.meta.url);

test('removed inputs leave prior issues unassessed and do not manufacture score improvements', async t => {
  const f = await fixture(t, { 'index.html': '<!doctype html><html><body><button>Save</button></body></html>', 'copy.md': 'Specific description.' });
  const first = await audit(f.target);
  await saveReport(f.output, first.report);
  await rm(path.join(f.target, 'index.html'));
  const next = await audit(f.target);
  const saved = await saveReport(f.output, next.report);
  const issue = first.report.findings.find(item => item.ruleId === 'A01');
  assert.ok(saved.comparison.unassessed.includes(issue.id));
  assert.ok(!saved.comparison.resolved.includes(issue.id));
  assert.ok(saved.comparison.scoreChanges.every(item => item.delta === null));
  assert.equal(saved.history.issues[issue.id].status, 'not_assessed');
});

test('explicit verify baseline survives report persistence instead of becoming the latest-run baseline', async t => {
  const f = await fixture(t, { 'index.html': '<!doctype html><html><body><img src="photo.png"></body></html>' });
  const first = await audit(f.target);
  const baseline = path.join(f.directory, 'baseline.json');
  await writeFile(baseline, JSON.stringify(first.report));
  await saveReport(f.output, first.report);
  await writeFile(path.join(f.target, 'index.html'), '<!doctype html><html lang="en"><body><img src="photo.png"></body></html>');
  await saveReport(f.output, (await audit(f.target)).report);
  await writeFile(path.join(f.target, 'index.html'), '<!doctype html><html lang="en"><body><img src="photo.png" alt="A mountain" width="200" height="200"></body></html>');
  const { stdout } = await exec(process.execPath, [fileURLToPath(cli), 'verify', f.target, '--out', f.output, '--baseline', baseline, '--json']);
  const report = JSON.parse(stdout);
  assert.deepEqual(report.comparison, compareReports(first.report, report));
  assert.deepEqual((await readJson(path.join(f.output, 'report.json'))).comparison, report.comparison);
  assert.equal(report.comparison.resolved.length, 3);
});

test('report HTML escapes reviewer input and shows both rating scales and command attempts', async t => {
  const f = await fixture(t, { 'copy.md': 'Specific product information.' });
  const result = await audit(f.target);
  const review = { inputDigest: result.report.inputDigest, reviewer: { name: '<script>unsafe</script>', kind: 'human' }, assessments: [{ domain: 'copy', score: 4, rationale: 'Specific and readable.', evidence: 'Reviewed the paragraph in copy.md.' }], findings: [] };
  const { report } = await audit(f.target, { review });
  report.checksExecution.push({ name: 'example check', status: 'passed_after_retry', attempts: [{ exitCode: 1, timedOut: false, durationMs: 10 }, { exitCode: 0, timedOut: false, durationMs: 10 }] });
  const html = htmlReport(report);
  assert.ok(html.includes('Reviewer assessments'));
  assert.ok(html.includes('4/5'));
  assert.ok(html.includes('passed_after_retry'));
  assert.ok(html.includes('2 recorded attempt(s)'));
  assert.ok(!html.includes('<script>'));
  assert.ok(html.includes('&lt;script&gt;'));
  assert.ok(!markdownReport(report).includes('<script>'));
  assert.equal(await readFile(path.join(f.target, 'copy.md'), 'utf8'), 'Specific product information.');
});

test('a comparable reviewer rating decline is a review regression', async t => {
  const f = await fixture(t, { 'copy.md': 'Specific product information.' });
  const first = (await audit(f.target)).report;
  const reviewer = { name: 'same reviewer', kind: 'human' };
  first.reviewerAssessments = [{ domain: 'copy', score: 4, reviewer }];
  const after = structuredClone(first);
  after.reviewerAssessments[0].score = 3;
  const comparison = compareReports(first, after);
  assert.equal(comparison.regression, true);
  assert.equal(comparison.reviewerChanges[0].delta, -1);
});
