import test from 'node:test';
import assert from 'node:assert/strict';
import { findingAssessed } from '../src/ratings.mjs';
import { isTestFixture } from '../src/checks/scope.mjs';

test('fixture selection is limited to test paths and files', () => {
  assert.equal(isTestFixture('tests/ai.test.ts'), true);
  assert.equal(isTestFixture('src/fixtures/payment.js'), true);
  assert.equal(isTestFixture('src/app.spec.ts'), true);
  assert.equal(isTestFixture('src/latest.ts'), false);
});

test('a finding in a skipped file is not treated as resolved', () => {
  const report = { coverage: { capped: false, assessedFiles: 1, skipped: [{ path: 'tests' }] },
    status: 'needs_review', checks: [{ ruleId: 'S23', assessedFiles: 1 }],
    manifest: [{ path: 'tests/payment.js' }], reviewerAssessments: [] };
  assert.equal(findingAssessed({ origin: 'static', ruleId: 'S23', location: { path: 'tests/payment.js' } }, report), false);
});
