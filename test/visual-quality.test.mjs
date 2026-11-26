import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { audit } from '../src/audit.mjs';
import { improvementGuidance } from '../src/guidance.mjs';
import { releaseChecklist } from '../src/release-checklist.mjs';
import { fixture } from './helpers.mjs';

const exec = promisify(execFile);

test('a clean source scan leaves visual taste unassessed and preserves the supplied direction', async t => {
  const f = await fixture(t, { 'index.html': '<main><h1>Studio journal</h1><p>Notes from the workshop</p></main>' });
  const brief = { audience: 'Working designers', intent: 'Warm editorial identity', character: ['Tactile', 'Quiet'], preserve: ['Expressive serif', 'Warm paper'], avoid: ['A generic monochrome replacement'], references: ['The existing printed journal'] };
  const result = await audit(f.target, { config: { designBrief: brief } });
  assert.equal(result.report.findings.length, 0);
  const guidance = improvementGuidance(result);
  assert.deepEqual(guidance.designReview.brief, brief);
  assert.equal(guidance.designReview.referencePolicy.use, 'quality');
  assert.equal(guidance.designReview.referencePolicy.explicit, false);
  assert.deepEqual(guidance.designReview.referencePolicy.references, brief.references);
  assert.equal(guidance.designReview.qualityWorkflow.status, 'not_assessed');
  assert.deepEqual(guidance.designReview.qualityWorkflow.evidence, []);
  assert.ok((await readFile(guidance.designReview.qualityWorkflow.guideFile, 'utf8')).length > 1000);
  assert.equal(guidance.designReview.criteria.length, 8);
  for (const item of guidance.designReview.criteria) {
    assert.equal(item.status, 'not_assessed');
    assert.equal(item.score, null);
    assert.deepEqual(item.evidence, []);
    assert.equal(result.catalog.byId.get(item.ruleId).automation, 'none');
    assert.ok(item.verification.length >= 3);
  }
  assert.ok((await readFile(guidance.designReview.guideFile, 'utf8')).length > 1000);
  assert.deepEqual(result.report.reviewerAssessments, []);
  assert.deepEqual(guidance.steps, []);
});

test('changing the design brief invalidates a previous reviewer binding', async t => {
  const f = await fixture(t, { 'index.html': '<h1>Studio journal</h1>' });
  const first = await audit(f.target, { config: { designBrief: { intent: 'Warm editorial' } } });
  const review = { inputDigest: first.report.inputDigest, reviewer: { name: 'Visual reviewer', kind: 'agent' }, assessments: [], findings: [] };
  await assert.rejects(audit(f.target, { config: { designBrief: { intent: 'Precise technical' } }, review }), error => error.code === 'STALE_REVIEW');
});

test('nonvisual scope does not receive taste prompts and malformed briefs are rejected', async t => {
  const f = await fixture(t, { 'copy.txt': 'Export a report for your accountant.' });
  const result = await audit(f.target, { config: { domains: ['copy'] } });
  assert.equal('designReview' in improvementGuidance(result), false);
  for (const designBrief of [{ intent: 12 }, { character: ['Calm', 'Calm'] }, { command: ['delete'] }, { avoid: [''] }, { referenceUse: 'copy' }]) {
    await assert.rejects(audit(f.target, { config: { designBrief } }));
  }
});

test('explicit style references remain supported and changing their role invalidates a review', async t => {
  const f = await fixture(t, { 'index.html': '<h1>A shared studio</h1>' });
  const brief = { intent: 'Use the accepted visual system', references: ['The parent company website'], referenceUse: 'style' };
  const styled = await audit(f.target, { config: { designBrief: brief } });
  const policy = improvementGuidance(styled).designReview.referencePolicy;
  assert.equal(policy.use, 'style');
  assert.equal(policy.explicit, true);
  assert.deepEqual(policy.references, brief.references);
  assert.deepEqual(improvementGuidance(styled).designReview.brief, brief);
  const review = { inputDigest: styled.report.inputDigest, reviewer: { name: 'Visual reviewer', kind: 'agent' }, assessments: [], findings: [] };
  await assert.rejects(audit(f.target, { config: { designBrief: { ...brief, referenceUse: 'quality' } }, review }), error => error.code === 'STALE_REVIEW');
  const quality = await audit(f.target, { config: { designBrief: { ...brief, referenceUse: 'quality' } } });
  assert.equal(improvementGuidance(quality).designReview.referencePolicy.use, 'quality');
  assert.equal(improvementGuidance(quality).designReview.qualityWorkflow.status, 'not_assessed');
  assert.equal(quality.report.reviewerAssessments.length, 0);
});

test('visual checklist filters resolve real catalogue rules without manufacturing outcomes', async () => {
  const matrix = await releaseChecklist({ domain: 'design', query: 'colour' });
  const palette = matrix.items.find(item => item.ruleIds.includes('D24'));
  assert.ok(palette);
  assert.equal(palette.status, 'not_assessed');
  assert.deepEqual(palette.evidence, []);
  assert.ok(palette.verification.length >= 3);
  assert.equal('ratings' in matrix, false);
});

test('the portable plan exposes unassessed visual criteria even when source findings are absent', async t => {
  const f = await fixture(t, { 'index.html': '<h1>Studio journal</h1>' });
  const { stdout } = await exec(process.execPath, ['skills/sloppyai/scripts/sloppyai.mjs', 'plan', f.target, '--json', '--no-save']);
  const result = JSON.parse(stdout);
  assert.equal(result.findings.length, 0);
  assert.equal(result.guidance.designReview.criteria.length, 8);
  assert.equal(result.guidance.designReview.referencePolicy.use, 'quality');
  assert.equal(result.guidance.designReview.qualityWorkflow.status, 'not_assessed');
  assert.ok(result.guidance.designReview.criteria.every(item => item.score === null && item.status === 'not_assessed'));
});
