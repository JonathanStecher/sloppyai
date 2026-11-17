import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import test from 'node:test';
import { audit } from '../src/audit.mjs';
import { loadConfig } from '../src/config.mjs';
import { improveLoop } from '../src/loop.mjs';
import { runtimeRegressed } from '../src/runtime.mjs';
import { fixture } from './helpers.mjs';

test('inventories unfamiliar UTF-8 source, web and server languages without scanning raw log files', async t => {
  const f = await fixture(t, { 'components/Counter.vue': '<template>Count</template>', 'server/main.go': 'package main', 'custom.unknown': 'local source', 'server.log': 'ERROR: private local value' });
  const { report } = await audit(f.target);
  assert.deepEqual(report.inventory.languages.map(item => item.name), ['Go', 'Other UTF-8', 'Vue']);
  assert.equal(report.inventory.uiFiles, 1);
  assert.equal(report.inventory.backendFiles, 1);
  assert.equal(report.inventory.builtInFiles, 0);
  assert.ok(!JSON.stringify(report).includes('private local value'));
});

test('full review records missing browser scope and samples authorized commands and bounded logs', async t => {
  const f = await fixture(t, { 'components/Counter.vue': '<template>Count</template>', 'server.log': 'ERROR: client_secret=fixture-value\nWARN: sample warning\n' });
  const result = await improveLoop(f.target, {
    output: f.output, fullReview: true, allowExec: true,
    config: { logs: ['server.log'], checks: [{ name: 'Fixture backend', command: [process.execPath, '-e', "console.warn('WARN: fixture warning')"] }] }
  });
  assert.equal(result.report.runtime.visual.status, 'unassessed');
  assert.equal(result.report.runtime.logs[0].errors, 1);
  assert.equal(result.report.runtime.commands[0].samples[0].warnings, 1);
  assert.ok(!JSON.stringify(result.report).includes('fixture-value'));
  await assert.rejects(loadConfig(f.target, { config: { visual: { url: 'https://host.invalid/path' } } }), error => error.code === 'INVALID_PREVIEW');
});

test('rendered review captures actual mobile overflow in Chromium', async t => {
  const f = await fixture(t, { 'index.html': '<!doctype html><html lang="en"><head><meta name="viewport" content="width=device-width, initial-scale=1"></head><body><main style="width:720px"><h1>Measured fixture</h1><button><span aria-hidden="true">→</span></button></main></body></html>' });
  const result = await improveLoop(f.target, { output: f.output, allowExec: true, fullReview: true, config: { visual: { themes: ['light'] } } });
  if (result.report.runtime.visual.status === 'unassessed' && !process.env.SLOPPYAI_REQUIRE_BROWSER) {
    t.skip(result.report.runtime.visual.reason);
    return;
  }
  assert.equal(result.report.runtime.visual.status, 'captured');
  const capture = result.report.runtime.visual.captures.find(item => item.viewport === 'mobile');
  assert.ok(capture.horizontalOverflow > 250);
  assert.equal(capture.unnamedButtons, 1);
  assert.equal((await readFile(path.join(f.output, capture.screenshot))).subarray(1, 4).toString(), 'PNG');
  assert.equal(runtimeRegressed(result.report.runtime, { visual: { captures: [] } }), true);
});

test('includes fresh renders from a project UI runner and rejects stale evidence', async t => {
  const f = await fixture(t, { 'App.swift': 'struct App {}' });
  const config = { visual: { artifacts: ['render.png'] } };
  const create = 'require("node:fs").writeFileSync("render.png", Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+jR1sAAAAASUVORK5CYII=", "base64"))';
  const options = { output: f.output, fullReview: true, allowExec: true };
  const fresh = await improveLoop(f.target, { ...options, config: { ...config, checks: [{ name: 'Fixture UI', command: [process.execPath, '-e', create] }] } });
  const image = fresh.report.runtime.projectImages[0];
  assert.deepEqual([image.status, image.width, image.height], ['captured', 1, 1]);
  assert.ok((await readFile(path.join(f.output, 'report.html'), 'utf8')).includes(image.screenshot));
  const stale = await improveLoop(f.target, { ...options, config });
  assert.equal(stale.report.runtime.projectImages[0].status, 'stale');
  assert.equal(runtimeRegressed(fresh.report.runtime, stale.report.runtime), true);
});
