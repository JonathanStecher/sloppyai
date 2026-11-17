import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { improveLoop } from '../src/loop.mjs';

const example = fileURLToPath(new URL('../examples/visual-review/', import.meta.url));
const output = path.resolve(process.argv[2] || '.sloppyai/workroom');

async function review(name) {
  const { report } = await improveLoop(path.join(example, name), {
    output: path.join(output, name), fullReview: true, allowExec: true
  });
  assert.equal(report.runtime.visual.status, 'captured');
  return report;
}

const before = await review('before');
const after = await review('after');
const lightMobile = report => report.runtime.visual.captures.find(view => view.viewport === 'mobile' && view.theme === 'light');
assert.ok(lightMobile(before).horizontalOverflow > 300);
assert.equal(lightMobile(before).unnamedButtons, 1);
assert.ok(lightMobile(before).consoleWarnings >= 1);
assert.equal(lightMobile(after).horizontalOverflow, 0);
assert.equal(lightMobile(after).unnamedButtons, 0);
assert.equal(lightMobile(after).consoleWarnings, 0);
assert.equal(after.checksExecution[0]?.status, 'passed');

const { chromium } = createRequire(import.meta.url)('playwright');
const browser = await chromium.launch({ executablePath: process.env.SLOPPYAI_CHROMIUM });
try {
  const page = await browser.newPage({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  const assets = {
    '/': ['index.html', 'text/html'], '/screen.css': ['screen.css', 'text/css'],
    '/booking.mjs': ['booking.mjs', 'text/javascript'], '/rules.mjs': ['rules.mjs', 'text/javascript'],
    '/inter.woff2': ['inter.woff2', 'font/woff2']
  };
  await page.route('http://workroom.local/**', async route => {
    const asset = assets[new URL(route.request().url()).pathname];
    if (!asset) return route.abort();
    const [filename, contentType] = asset;
    await route.fulfill({ contentType, body: await readFile(path.join(example, 'after', filename)) });
  });
  await page.goto('http://workroom.local/');
  await page.locator('label').filter({ hasText: 'Thu' }).click({ timeout: 5_000 });
  await page.getByRole('button', { name: 'Confirm selection' }).click();
  assert.match(await page.getByRole('status').textContent(), /Thursday/);
} finally { await browser.close(); }

console.log('Rendered the Workroom comparison and verified a mobile booking selection.');
