import test from 'node:test';
import assert from 'node:assert/strict';
import { findingAssessed } from '../src/ratings.mjs';
import { isTestFixture } from '../src/checks/scope.mjs';
import { audit } from '../src/audit.mjs';
import { fixture } from './helpers.mjs';
import path from 'node:path';

test('fixture selection is limited to test paths and files', () => {
  assert.equal(isTestFixture('tests/ai.test.ts'), true);
  assert.equal(isTestFixture('src/fixtures/payment.js'), true);
  assert.equal(isTestFixture('src/app.spec.ts'), true);
  assert.equal(isTestFixture('src/latest.ts'), false);
  assert.equal(isTestFixture('test-booking.mjs'), true);
  assert.equal(isTestFixture('payments/test_checkout.py'), true);
  assert.equal(isTestFixture('pages/test-drive.html'), false);
  assert.equal(isTestFixture('docs/test-automation.md'), false);
  assert.equal(isTestFixture('src/testimonials.ts'), false);
});

test('prefixed test scripts stay inventoried and direct audits still inspect them', async t => {
  const f = await fixture(t, { 'index.html': '<h1>Booking</h1>', 'test-booking.mjs': 'const fixture = { rejectUnauthorized: false };' });
  const directory = await audit(f.target);
  assert.equal(directory.report.inventory.testFiles, 1);
  assert.ok(directory.report.manifest.some(item => item.path === 'test-booking.mjs'));
  assert.ok(directory.report.coverage.skipped.some(item => item.path === 'test-booking.mjs'));
  assert.equal(directory.report.findings.some(item => item.ruleId === 'S26'), false);
  const direct = await audit(path.join(f.target, 'test-booking.mjs'));
  assert.ok(direct.report.findings.some(item => item.ruleId === 'S26'));
});

test('a finding in a skipped file is not treated as resolved', () => {
  const report = { coverage: { capped: false, assessedFiles: 1, skipped: [{ path: 'tests' }] },
    status: 'needs_review', checks: [{ ruleId: 'S23', assessedFiles: 1 }],
    manifest: [{ path: 'tests/payment.js' }], reviewerAssessments: [] };
  assert.equal(findingAssessed({ origin: 'static', ruleId: 'S23', location: { path: 'tests/payment.js' } }, report), false);
});
