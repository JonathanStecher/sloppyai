import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { audit } from '../src/audit.mjs';
import { improveLoop, watchTarget } from '../src/loop.mjs';
import { undoTransaction } from '../src/repair.mjs';
import { targetInfo } from '../src/files.mjs';
import { readJson } from '../src/util.mjs';
import { fixture } from './helpers.mjs';

const html = '<!doctype html><html lang=""><head><meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no"></head><body><h1>Export a report</h1><a href="https://example.org" target="_blank" rel="external">Reference</a><button>Save</button></body></html>';

test('narrow fixes recheck, raise assessed scores and preserve unrelated source', async t => {
  const f = await fixture(t, { 'index.html': html });
  const result = await improveLoop(f.target, { output: f.output, apply: true, config: { language: 'en' } });
  assert.equal(result.summary.stopReason, 'target_met_assessed_scope');
  assert.equal(result.summary.repairRounds, 1);
  const updated = await readFile(path.join(f.target, 'index.html'), 'utf8');
  assert.ok(updated.includes('lang="en"'));
  assert.ok(!updated.includes('maximum-scale'));
  assert.ok(updated.includes('rel="external noopener"'));
  assert.ok(updated.includes('<button>Save</button>'));
  const history = await readJson(path.join(f.output, 'history.json'));
  assert.equal(history.runs.length, 2, 'finalization must not invent a third assessment');
  assert.ok(history.runs[1].comparison.scoreChanges.some(item => item.delta > 0));
  assert.ok(Object.values(history.issues).some(item => item.status === 'not_observed'));
});

test('review-only loop never edits source', async t => {
  const f = await fixture(t, { 'index.html': html });
  const result = await improveLoop(f.target, { output: f.output, config: { language: 'en' } });
  assert.equal(result.summary.stopReason, 'review_only');
  assert.equal(await readFile(path.join(f.target, 'index.html'), 'utf8'), html);
});

test('a failed fixer that changes source retains a current partial assessment', async t => {
  const f = await fixture(t, { 'index.html': '<!doctype html><html lang="en"><body><img src="a.png"></body></html>' });
  const program = "require('fs').writeFileSync('index.html','<!doctype html><html lang=\"en\"><body><button>Save</button></body></html>');process.exit(1)";
  const result = await improveLoop(f.target, { output: f.output, apply: true, allowExec: true, config: { fixer: { name: 'partial repair', command: [process.execPath, '-e', program] } } });
  assert.equal(result.summary.stopReason, 'fixer_failed');
  assert.equal(result.report.status, 'partial');
  const actual = await audit(f.target, { config: { fixer: { name: 'partial repair', command: [process.execPath, '-e', program] } } });
  assert.equal(result.report.inputDigest, actual.report.inputDigest);
  assert.equal((await readJson(path.join(f.output, 'report.json'))).loop.stopReason, 'fixer_failed');
});

test('a failed reviewer leaves durable partial evidence and a completed error stop record', async t => {
  const f = await fixture(t, { 'index.html': '<!doctype html><html lang="en"><body><button>Save</button></body></html>' });
  await assert.rejects(improveLoop(f.target, { output: f.output, allowExec: true, config: { reviewer: { name: 'failed review', command: [process.execPath, '-e', 'process.exit(1)'] } } }), error => error.code === 'REVIEW_FAILED');
  const report = await readJson(path.join(f.output, 'report.json'));
  assert.equal(report.status, 'partial');
  assert.equal(report.loop.stopReason, 'operational_error');
  assert.equal(report.loop.error.code, 'REVIEW_FAILED');
  assert.equal(report.reviewerAssessments.length, 0);
});

test('passing-to-failing project checks stop an otherwise improving repair', async t => {
  const f = await fixture(t, { 'index.html': '<!doctype html><html lang="en"><body><img src="a.png"></body></html>' });
  const fixer = "const fs=require('fs');fs.writeFileSync('index.html','<!doctype html><html lang=\"en\"><body><img src=\"a.png\" alt=\"A tree\" width=\"20\" height=\"20\"></body></html>');fs.writeFileSync('.failure','1')";
  const check = "process.exit(require('fs').existsSync('.failure')?1:0)";
  const result = await improveLoop(f.target, { output: f.output, apply: true, allowExec: true, config: { checks: [{ name: 'preserved behaviour', command: [process.execPath, '-e', check] }], fixer: { name: 'repair breaks check', command: [process.execPath, '-e', fixer] } } });
  assert.equal(result.summary.stopReason, 'regression');
  assert.equal(result.report.checksExecution[0].status, 'failed');
  const history = await readJson(path.join(f.output, 'history.json'));
  assert.equal(history.runs[0].ratings.find(item => item.domain === 'engineering').score, 100);
});

test('the explicit repair-round limit wins before a larger stall bound', async t => {
  const f = await fixture(t, { 'index.html': '<!doctype html><html lang="en"><body><img src="a.png"></body></html>' });
  const result = await improveLoop(f.target, { output: f.output, apply: true, allowExec: true, config: { fixer: { name: 'no-op', command: [process.execPath, '-e', 'process.exit(0)'] }, loop: { maxRounds: 1, stallRounds: 2 } } });
  assert.equal(result.summary.stopReason, 'max_rounds');
  assert.equal(result.summary.repairRounds, 1);
});

test('deleting an assessed file cannot satisfy the loop target by shrinking coverage', async t => {
  const f = await fixture(t, { 'index.html': '<!doctype html><html lang="en"><body><img src="a.png"></body></html>', 'copy.md': 'Specific description.' });
  const result = await improveLoop(f.target, { output: f.output, apply: true, allowExec: true, config: { fixer: { name: 'deletes input', command: [process.execPath, '-e', "require('fs').unlinkSync('index.html')"] } } });
  assert.equal(result.summary.stopReason, 'coverage_reduced');
  assert.ok(result.report.comparison.unassessed.length > 0);
});

test('configuration edits during repair cannot add executable hooks', async t => {
  const f = await fixture(t, { 'index.html': '<!doctype html><html lang="en"><body><img src="a.png"></body></html>' });
  const injected = { checks: [{ name: 'injected command', command: [process.execPath, '-e', "require('fs').writeFileSync('executed','bad')"] }] };
  const program = `require('fs').writeFileSync('.craftcheck.json',${JSON.stringify(JSON.stringify(injected))})`;
  const result = await improveLoop(f.target, { output: f.output, apply: true, allowExec: true, config: { fixer: { name: 'edits configuration', command: [process.execPath, '-e', program] }, loop: { maxRounds: 1 } } });
  assert.equal(result.summary.stopReason, 'max_rounds');
  assert.equal(result.report.checksExecution.length, 0);
  await assert.rejects(readFile(path.join(f.target, 'executed')), error => error.code === 'ENOENT');
});

test('checks that mutate assessed source invalidate the assessment instead of approving stale ratings', async t => {
  const f = await fixture(t, { 'index.html': '<!doctype html><html lang="en"><body><button>Save</button></body></html>' });
  const check = "require('fs').appendFileSync('index.html','<p>Changed by check</p>')";
  await assert.rejects(improveLoop(f.target, { output: f.output, allowExec: true, config: { checks: [{ name: 'mutates source', command: [process.execPath, '-e', check] }] } }), error => error.code === 'INPUT_CHANGED_DURING_CHECKS');
  const saved = await readJson(path.join(f.output, 'report.json'));
  assert.equal(saved.status, 'partial');
  assert.equal(saved.loop.error.code, 'INPUT_CHANGED_DURING_CHECKS');
  assert.equal(saved.reviewerAssessments.length, 0);
  assert.equal(saved.checksExecution[0].status, 'not_run');
});

test('a declared opener relationship is not rewritten automatically', async t => {
  const original = '<!doctype html><html lang="en"><body><a href="/child" target="_blank" rel="opener">Open editor</a></body></html>';
  const f = await fixture(t, { 'index.html': original });
  const result = await improveLoop(f.target, { output: f.output, apply: true });
  assert.equal(await readFile(path.join(f.target, 'index.html'), 'utf8'), original);
  assert.ok(result.report.findings.some(item => item.ruleId === 'S21' && item.confidence === 'tentative'));
});

test('undo restores original bytes and rejects later user changes', async t => {
  const f = await fixture(t, { 'index.html': html });
  const result = await improveLoop(f.target, { output: f.output, apply: true, config: { language: 'en' } });
  const transaction = result.summary.transactions[0].id;
  await writeFile(path.join(f.target, 'index.html'), 'later user changes');
  await assert.rejects(undoTransaction(await targetInfo(f.target), f.output, transaction), error => error.code === 'UNDO_CONFLICT');
  const backup = await readJson(path.join(f.output, 'backups', transaction, 'manifest.json'));
  assert.equal(backup.status, 'applied');
});

test('unchanged repaired files can be restored exactly', async t => {
  const f = await fixture(t, { 'index.html': html });
  const result = await improveLoop(f.target, { output: f.output, apply: true, config: { language: 'en' } });
  await undoTransaction(await targetInfo(f.target), f.output, result.summary.transactions[0].id);
  assert.equal(await readFile(path.join(f.target, 'index.html'), 'utf8'), html);
});

test('configured commands are not executed without explicit authorization', async t => {
  const f = await fixture(t, { 'index.html': html });
  const marker = path.join(f.directory, 'executed');
  const config = { language: 'en', checks: [{ name: 'must remain inert', command: [process.execPath, '-e', `require('fs').writeFileSync(${JSON.stringify(marker)}, 'executed')`] }] };
  const result = await improveLoop(f.target, { output: f.output, apply: true, config });
  assert.equal(result.summary.stopReason, 'checks_not_authorized');
  assert.equal(result.report.checksExecution[0].status, 'not_run');
  await assert.rejects(readFile(marker), error => error.code === 'ENOENT');
});

test('external repair hooks are bounded by no-progress and maximum rounds', async t => {
  const f = await fixture(t, { 'index.html': '<!doctype html><html lang="en"><body><img src="a.png"></body></html>' });
  const config = { fixer: { name: 'no-op fixer', command: [process.execPath, '-e', 'process.exit(0)'] }, loop: { maxRounds: 4, stallRounds: 2 } };
  const result = await improveLoop(f.target, { output: f.output, apply: true, allowExec: true, config });
  assert.equal(result.summary.stopReason, 'stalled');
  assert.equal(result.summary.repairRounds, 2);
});

test('new objective failures stop the loop as a regression', async t => {
  const original = '<!doctype html><html lang="en"><body><img src="a.png"><button>Save</button></body></html>';
  const f = await fixture(t, { 'index.html': original });
  const config = { fixer: { name: 'regressing fixer', command: [process.execPath, '-e', "let fs=require('fs');fs.writeFileSync('index.html',fs.readFileSync('index.html','utf8').replace('lang=\"en\"',''))"] } };
  const result = await improveLoop(f.target, { output: f.output, apply: true, allowExec: true, config });
  assert.equal(result.summary.stopReason, 'regression');
  assert.equal(result.summary.repairRounds, 1);
  assert.ok(result.report.findings.some(item => item.ruleId === 'A01'));
});

test('preservation anchors cannot be satisfied by deleting the feature', async t => {
  const f = await fixture(t, { 'index.html': '<!doctype html><html lang="en"><body><p>Export</p></body></html>' });
  const { report } = await audit(f.target, { config: { preserve: [{ path: 'index.html', contains: ['Cancel'] }] } });
  assert.ok(report.findings.some(item => item.ruleId === 'E03' && item.confidence === 'supported'));
});

test('watch rechecks changed source and keeps prior assessments', async t => {
  const f = await fixture(t, { 'copy.md': 'Specific copy.' });
  let changed = false;
  const result = await watchTarget(f.target, { output: f.output, maxCycles: 2, intervalMs: 20, durationMs: 3000, onProgress(event) {
    if (event.type === 'stopped' && !changed) { changed = true; return writeFile(path.join(f.target, 'copy.md'), 'Different specific copy.'); }
  } });
  assert.equal(result.cycles, 2);
  assert.equal(result.stopReason, 'max_cycles');
  assert.equal((await readJson(path.join(f.output, 'history.json'))).runs.length, 2);
});

test('review hooks produce fresh per-iteration ratings and recorded deltas', async t => {
  const reviewer = `import fs from 'node:fs';const req=JSON.parse(fs.readFileSync(process.env.CRAFTCHECK_REQUEST,'utf8'));const html=fs.readFileSync('index.html','utf8');fs.writeFileSync(process.env.CRAFTCHECK_REVIEW,JSON.stringify({inputDigest:req.inputDigest,reviewer:{name:'fixture reviewer',kind:'agent'},assessments:[{domain:'ux',score:html.includes('maximum-scale')?2:4,rationale:'Observed the relevant viewport and control source.',evidence:'The source viewport restriction is present or removed.'}],findings:[]}));`;
  const f = await fixture(t, { 'index.html': html, 'review.mjs': reviewer });
  const config = { language: 'en', reviewer: { name: 'fixture reviewer', command: [process.execPath, 'review.mjs'] } };
  const result = await improveLoop(f.target, { output: f.output, apply: true, allowExec: true, config });
  assert.equal(result.summary.stopReason, 'target_met_assessed_scope');
  assert.equal(result.report.reviewerAssessments[0].score, 4);
  const history = await readJson(path.join(f.output, 'history.json'));
  assert.equal(history.runs[1].comparison.reviewerChanges[0].delta, 2);
  assert.equal(history.runs[0].reviewerAssessments[0].score, 2);
});
