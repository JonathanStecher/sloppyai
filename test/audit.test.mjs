import test from 'node:test';
import assert from 'node:assert/strict';
import { writeFile, readFile, symlink } from 'node:fs/promises';
import path from 'node:path';
import { audit } from '../src/audit.mjs';
import { fixture } from './helpers.mjs';
import { contrastRatio } from '../src/checks/html.mjs';

test('HTML audit finds named source failures without mutating the artifact', async t => {
  const html = '<!doctype html><html><body><h1>Example</h1><img src="a.png"><input placeholder="Email"><button></button></body></html>';
  const f = await fixture(t, { 'index.html': html });
  const result = await audit(f.target);
  for (const rule of ['A01', 'A02', 'A03', 'A04']) assert.ok(result.report.findings.some(item => item.ruleId === rule), rule);
  assert.equal(await readFile(path.join(f.target, 'index.html'), 'utf8'), html);
  assert.equal(result.report.coverage.fullArtifactVerified, false);
  assert.equal(result.report.ratings.find(item => item.domain === 'security').score, null);
});

test('legitimate labels, image links and decorative images are accepted', async t => {
  const f = await fixture(t, { 'index.html': '<!doctype html><html lang="de"><body><label for="email">E-Mail</label><input id="email"><button aria-label="Speichern"><svg></svg></button><a href="/home"><img src="a.png" alt="Startseite" width="20" height="20"></a><img src="b.png" alt="" width="30" height="30"></body></html>' });
  const { report } = await audit(f.target);
  assert.equal(report.findings.filter(item => item.kind === 'requirement' && item.confidence === 'supported').length, 0);
});

test('a legitimate gradient, serif and rounded cards are not automatic defects', async t => {
  const f = await fixture(t, { 'index.html': '<!doctype html><html lang="en"><body style="background:linear-gradient(purple,blue);font-family:serif"><h1>Editorial work.</h1><article style="border-radius:20px">A deliberate composition.</article></body></html>' });
  const { report } = await audit(f.target);
  assert.equal(report.findings.length, 0);
  assert.equal(report.status, 'no_supported_static_findings');
});

test('fragments do not acquire a false missing-document-language issue', async t => {
  const f = await fixture(t, { 'part.html': '<section><h2>Works</h2><p>Content.</p></section>' });
  const { report } = await audit(f.target);
  assert.ok(!report.findings.some(item => item.ruleId === 'A01'));
  assert.equal(report.checks.find(item => item.ruleId === 'A01').status, 'not_assessed');
});

test('credential candidates are redacted and never treated as demonstrated vulnerabilities', async t => {
  const secret = 'sk_live_' + 'A'.repeat(28);
  const f = await fixture(t, { 'app.js': 'const key = "' + secret + '";' });
  const { report } = await audit(f.target);
  assert.ok(report.findings.some(item => item.ruleId === 'S23' && item.confidence === 'tentative'));
  assert.ok(!JSON.stringify(report).includes(secret));
  assert.equal(report.ratings.find(item => item.domain === 'security').confirmedIssues, 0);
});

test('reviews are bound to exact input and cannot reuse stale scores', async t => {
  const f = await fixture(t, { 'copy.md': 'A useful product description.' });
  const first = await audit(f.target);
  const review = { inputDigest: first.report.inputDigest, reviewer: { name: 'Example reviewer', kind: 'human' }, assessments: [{ domain: 'copy', score: 4, rationale: 'Concrete language helps the intended reader.', evidence: 'Reviewed the complete short paragraph in copy.md.' }], findings: [] };
  const imported = await audit(f.target, { review });
  assert.equal(imported.report.reviewerAssessments[0].score, 4);
  await writeFile(path.join(f.target, 'copy.md'), 'Different content.');
  await assert.rejects(audit(f.target, { review }), error => error.code === 'STALE_REVIEW');
});

test('missing tools and non-applicable domains have no invented scores', async t => {
  const f = await fixture(t, { 'copy.md': 'Specific product information.' });
  const { report } = await audit(f.target);
  assert.equal(report.ratings.find(item => item.domain === 'media').score, null);
  assert.ok(report.coverage.manualRules.includes('M05'));
});

test('accepted style decisions apply to imported heuristic reviews', async t => {
  const f = await fixture(t, { 'copy.md': 'Specific product information.' });
  const config = { acceptedHeuristics: [{ ruleId: 'H19', reason: 'The gradient is an intentional part of this product identity.' }] };
  const first = await audit(f.target, { config });
  const review = { inputDigest: first.report.inputDigest, reviewer: { name: 'Example reviewer', kind: 'human' }, assessments: [], findings: [{ ruleId: 'H19', anchor: 'background', path: '<artifact>', severity: 'suggestion', confidence: 'tentative', evidence: 'A gradient is visible in the authored product background.', recommendation: 'Consider a plainer background if the current composition distracts.' }] };
  const imported = await audit(f.target, { config, review });
  assert.equal(imported.report.findings[0].disposition, 'accepted');
  assert.ok(imported.report.findings[0].acceptanceReason.includes('intentional'));
});

test('objective requirements cannot be waived as aesthetic preferences', async t => {
  const f = await fixture(t, { 'index.html': '<!doctype html><html><body><button></button></body></html>' });
  await assert.rejects(audit(f.target, { config: { acceptedHeuristics: [{ ruleId: 'A04', reason: 'An aesthetic preference cannot remove a functional requirement.' }] } }), error => error.code === 'INVALID_EXCEPTION');
});

test('symlinked source and secret files are excluded', async t => {
  const f = await fixture(t, { 'copy.md': 'Useful content.', '.env': 'PASSWORD=private', 'outside.txt': 'Local regular file.' });
  const outside = path.join(f.directory, 'private.js');
  await writeFile(outside, 'const secret = 1;');
  await symlink(outside, path.join(f.target, 'linked.js'));
  const { report } = await audit(f.target);
  assert.ok(!report.manifest.some(item => ['.env', 'linked.js'].includes(item.path)));
  assert.ok(report.coverage.skipped.some(item => item.path === 'linked.js'));
});

test('limits remain visible instead of producing a whole-artifact pass', async t => {
  const f = await fixture(t, { 'one.md': 'One.', 'two.md': 'Two.' });
  const { report } = await audit(f.target, { config: { maxFiles: 1 } });
  assert.equal(report.coverage.capped, true);
  assert.equal(report.status, 'partial');
});

test('literal contrast math uses correct luminance and preserves unknown CSS values', () => {
  assert.equal(contrastRatio('#000', '#fff'), 21);
  assert.equal(contrastRatio('white', 'white'), 1);
  assert.equal(contrastRatio('var(--text)', '#fff'), null);
});
