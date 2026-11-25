import test from 'node:test';
import assert from 'node:assert/strict';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { releaseChecklist, checklistMarkdown } from '../src/release-checklist.mjs';
const exec = promisify(execFile);

test('all ten reference lists remain mapped without inventing audit evidence', async () => {
  const result = await releaseChecklist();
  assert.equal(result.items.length, 188);
  assert.equal(new Set(result.items.map(item => item.id)).size, 188);
  assert.equal(new Set(result.items.map(item => item.group)).size, 10);
  assert.deepEqual(result.summary, { total: 188, notAssessed: 188 });
  for (const item of result.items) {
    assert.equal(item.status, 'not_assessed');
    assert.equal(item.applicability, 'unresolved');
    assert.deepEqual(item.evidence, []);
    assert.ok(item.verification.length);
  }
  assert.equal('ratings' in result, false);
  assert.match(checklistMarkdown(result), /Not assessed/);
});

test('each adverse journey includes a concrete scenario and preserves password whitespace', async () => {
  const result = await releaseChecklist();
  const journeys = result.items.filter(item => item.group === 'stress-journeys');
  assert.equal(journeys.length, 19);
  for (const item of journeys) assert.ok(item.scenario.length > 50);
  assert.match(journeys.find(item => item.label === 'Use spaces in a password').scenario, /do not silently trim/);
  assert.match(result.policy.join(' '), /fixed fines/);
  assert.match(result.policy.join(' '), /Do not add analytics, FAQs/);
});

test('filters retain unassessed status and CLI emits parseable JSON without executing a project', async () => {
  const result = await releaseChecklist({ domain: 'security', query: 'JWT' });
  assert.ok(result.items.length > 0);
  assert.ok(result.items.every(item => item.domains.includes('security')));
  const { stdout } = await exec(process.execPath, ['skills/sloppyai/scripts/sloppyai.mjs', 'checklist', '--json', '--query', 'two devices']);
  const output = JSON.parse(stdout);
  assert.equal(output.items.length, 1);
  assert.equal(output.items[0].status, 'not_assessed');
});

test('checklist rejects targets and execution flags instead of pretending to assess them', async () => {
  for (const args of [['checklist', '/missing'], ['checklist', '--allow-exec'], ['checklist', '--apply']]) {
    await assert.rejects(exec(process.execPath, ['skills/sloppyai/scripts/sloppyai.mjs', ...args]));
  }
});
