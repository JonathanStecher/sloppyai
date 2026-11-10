import test from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';
import { readFile, writeFile } from 'node:fs/promises';
import { runChecks, executeCommand } from '../src/commands.mjs';
import { fixture } from './helpers.mjs';
import { redact } from '../src/util.mjs';

test('failed attempts remain recorded after a successful retry', async t => {
  const f = await fixture(t);
  const program = "const fs=require('fs');if(fs.existsSync('attempt'))process.exit(0);fs.writeFileSync('attempt','1');process.exit(1)";
  const [result] = await runChecks([{ name: 'retry fixture', command: [process.execPath, '-e', program], attempts: 2 }], { cwd: f.target, allowExec: true, deadline: Date.now() + 3000 });
  assert.equal(result.status, 'passed_after_retry');
  assert.deepEqual(result.attempts.map(item => item.exitCode), [1, 0]);
});

test('timeouts terminate a hanging check and record the limit', async t => {
  const f = await fixture(t);
  const result = await executeCommand({ name: 'hang', command: [process.execPath, '-e', 'setInterval(()=>{},1000)'], timeoutMs: 100 }, { cwd: f.target, deadline: Date.now() + 3000 });
  assert.equal(result.timedOut, true);
  assert.ok(result.durationMs < 2500);
});

test('cancellation ends an active command', async t => {
  const f = await fixture(t);
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 100);
  const result = await executeCommand({ name: 'cancel', command: [process.execPath, '-e', 'setInterval(()=>{},1000)'] }, { cwd: f.target, deadline: Date.now() + 3000, signal: controller.signal });
  clearTimeout(timer);
  assert.equal(result.cancelled, true);
});

test('command output is omitted by default and recognizable secrets are redacted on opt-in', async t => {
  const f = await fixture(t);
  const secret = 'sk_live_' + 'B'.repeat(24);
  const definition = { name: 'private output', command: [process.execPath, '-e', `console.error(${JSON.stringify(secret)});process.exit(1)`] };
  const ordinary = await executeCommand(definition, { cwd: f.target, deadline: Date.now() + 3000 });
  assert.equal(ordinary.output, undefined);
  const diagnostic = await executeCommand(definition, { cwd: f.target, deadline: Date.now() + 3000, includeOutput: true });
  assert.ok(!diagnostic.output.includes(secret));
  assert.ok(diagnostic.output.includes('REDACTED'));
});

test('quoted assignments and JSON secret values are redacted', () => {
  const value = 'example-private-value';
  const result = redact(JSON.stringify({ password: value, api_key: value }));
  assert.ok(!result.includes(value));
  assert.equal(JSON.parse(result).password, '[REDACTED]');
});

test('explicit command arrays do not interpolate shell metacharacters', async t => {
  const f = await fixture(t);
  const value = 'literal; $(touch unexpected)';
  const command = [process.execPath, '-e', "require('fs').writeFileSync('argument',process.argv[1])", value];
  const result = await executeCommand({ name: 'arguments', command }, { cwd: f.target, deadline: Date.now() + 3000 });
  assert.equal(result.exitCode, 0);
  assert.equal(await readFile(path.join(f.target, 'argument'), 'utf8'), value);
  await assert.rejects(readFile(path.join(f.target, 'unexpected')), error => error.code === 'ENOENT');
});

test('configuration commands stay inert during a normal audit', async t => {
  const f = await fixture(t, { 'copy.md': 'Useful description.' });
  const marker = path.join(f.target, 'should-not-exist');
  await writeFile(path.join(f.target, '.sloppyai.json'), JSON.stringify({ checks: [{ name: 'inert', command: [process.execPath, '-e', `require('fs').writeFileSync(${JSON.stringify(marker)},'bad')`] }] }));
  const { audit } = await import('../src/audit.mjs');
  await audit(f.target);
  await assert.rejects(readFile(marker), error => error.code === 'ENOENT');
});
