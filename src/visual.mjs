import { access, open } from 'node:fs/promises';
import { createRequire } from 'node:module';
import path from 'node:path';
import { assertNotAborted, atomicWrite, hash, READ_FLAGS, readBounded, safeChild } from './util.mjs';
import { isTestFixture } from './checks/scope.mjs';

const offlineOrigin = 'http://sloppyai.local';
const types = {
  '.html': 'text/html', '.htm': 'text/html', '.css': 'text/css', '.js': 'text/javascript',
  '.mjs': 'text/javascript', '.json': 'application/json', '.svg': 'image/svg+xml',
  '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp',
  '.gif': 'image/gif', '.ico': 'image/x-icon', '.woff2': 'font/woff2', '.woff': 'font/woff',
  '.ttf': 'font/ttf', '.otf': 'font/otf', '.vtt': 'text/vtt'
};
const viewports = [
  { name: 'desktop', width: 1440, height: 900 },
  { name: 'mobile', width: 390, height: 844 }
];

function getPlaywright(root) {
  for (const from of [path.join(root, 'package.json'), import.meta.url]) {
    const require = createRequire(from);
    for (const name of ['playwright', 'playwright-core']) {
      try { return require(name); }
      catch (error) { if (error.code !== 'MODULE_NOT_FOUND') throw error; }
    }
  }
  return null;
}

async function chromiumPath() {
  for (const candidate of [process.env.SLOPPYAI_CHROMIUM, '/usr/bin/chromium', '/usr/bin/chromium-browser', '/usr/bin/google-chrome']) {
    if (!candidate) continue;
    try { await access(candidate); return candidate; }
    catch (_error) { /* Use the next locally installed browser. */ }
  }
  return undefined;
}

async function staticAsset(route, root, url) {
  let relative = decodeURIComponent(url.pathname).replace(/^\/+/, '');
  if (!relative || relative.endsWith('/')) relative += 'index.html';
  if (relative.includes('\\') || relative.split('/').some(segment => !segment || segment.startsWith('.'))) {
    await route.fulfill({ status: 404 }); return;
  }
  const type = types[path.extname(relative).toLowerCase()];
  if (!type) { await route.fulfill({ status: 404 }); return; }
  let handle;
  try {
    handle = await open(await safeChild(root, relative), READ_FLAGS);
    const stats = await handle.stat();
    if (!stats.isFile() || stats.size > 20_000_000) { await route.fulfill({ status: 404 }); return; }
    const body = await readBounded(handle, 20_000_000);
    await route.fulfill({ status: 200, contentType: type, body });
  } catch (_error) { await route.fulfill({ status: 404 }); }
  finally { await handle?.close(); }
}

async function view(browser, source, result, options, routePath, preset, theme, index) {
  const { width, height, name } = preset;
  const context = await browser.newContext({
    viewport: { width, height }, colorScheme: theme, reducedMotion: 'reduce',
    deviceScaleFactor: 1, isMobile: name === 'mobile', hasTouch: name === 'mobile', serviceWorkers: 'block'
  });
  const area = { route: routePath, viewport: name, theme, width, height };
  let blockedRequests = 0;
  let pageErrors = 0;
  let consoleErrors = 0;
  let consoleWarnings = 0;
  let failedResponses = 0;
  try {
    await context.routeWebSocket?.('**/*', socket => socket.close());
    await context.route('**/*', async route => {
      const url = new URL(route.request().url());
      if (url.origin !== source.origin || !['GET', 'HEAD'].includes(route.request().method())) {
        blockedRequests++;
        await route.abort();
      } else if (source.offline) {
        await staticAsset(route, result.info.root, url);
      } else {
        await route.continue();
      }
    });
    const page = await context.newPage();
    page.on('pageerror', () => { pageErrors++; });
    page.on('console', message => {
      if (message.type() === 'error') consoleErrors++;
      if (message.type() === 'warning') consoleWarnings++;
    });
    page.on('response', response => { if (response.status() >= 400) failedResponses++; });
    const timeout = Math.max(1, Math.min(12_000, options.deadline - Date.now()));
    page.setDefaultTimeout(timeout);
    const response = await page.goto(new URL(routePath, source.origin).href, { waitUntil: 'load', timeout });
    const httpStatus = response?.status() ?? 0;
    if (new URL(page.url()).origin !== source.origin) return { ...area, status: 'failed', httpStatus, reason: 'Navigation left the selected preview origin.' };
    if (httpStatus < 200 || httpStatus >= 400) return { ...area, status: 'failed', httpStatus, reason: 'Preview returned an unsuccessful response.' };
    const geometry = await page.evaluate(() => {
      const visibleText = globalThis.document.body?.innerText?.trim() || '';
      const root = globalThis.document.documentElement;
      return {
        scrollWidth: root.scrollWidth,
        scrollHeight: root.scrollHeight,
        layoutWidth: root.clientWidth,
        visibleTextCharacters: Math.min(100_000, visibleText.length)
      };
    });
    const unnamedButtons = await page.getByRole('button', { name: '', exact: true }).count();
    const fullPage = geometry.scrollHeight <= 3400 && geometry.scrollWidth <= width * 2;
    const buffer = await page.screenshot({ fullPage, animations: 'disabled', timeout });
    const screenshot = options.noSave ? null : `visual/${result.report.id}/${index}-${name}-${theme}.png`;
    if (screenshot) await atomicWrite(path.join(options.output, screenshot), buffer);
    return {
      ...area, status: 'captured', httpStatus, screenshot, screenshotDigest: hash(buffer), fullPage,
      ...geometry, horizontalOverflow: Math.max(0, geometry.scrollWidth - width), unnamedButtons,
      pageErrors, consoleErrors, consoleWarnings, failedResponses, blockedRequests
    };
  } catch (_error) {
    return { ...area, status: 'failed', httpStatus: 0, reason: 'The preview did not finish rendering within the available browser scope or time.' };
  } finally { await context.close().catch(() => {}); }
}

export async function captureVisual(result, options) {
  const visual = result.config.visual;
  const files = result.files.filter(file => !isTestFixture(file.path));
  const htmlEntry = result.info.isFile ? files.find(file => /\.html?$/i.test(file.path)) : files.find(file => file.path === 'index.html');
  const ui = result.report.inventory.uiFiles > 0 || Boolean(visual);
  if (!ui) return { status: 'not_applicable', reason: 'No UI source or preview was identified.', captures: [] };
  if (visual?.artifacts && !visual.url && !visual.routes && !htmlEntry) return { status: 'not_applicable', reason: 'The project test runner supplies rendered views.', captures: [] };
  if (!options.allowExec) return { status: 'unassessed', reason: 'Browser execution requires --allow-exec.', captures: [] };
  if (!visual?.url && !htmlEntry) return { status: 'unassessed', reason: 'Start the application preview and configure visual.url for its routes.', captures: [] };
  const routes = visual?.routes || [htmlEntry && result.info.isFile ? '/' + encodeURIComponent(htmlEntry.path) : '/'];
  const source = visual?.url ? { origin: new URL(visual.url).origin, offline: false } : { origin: offlineOrigin, offline: true };
  const themes = visual?.themes || ['light', 'dark'];
  let browser;
  try {
    const playwright = getPlaywright(result.info.root);
    if (!playwright) return { status: 'unassessed', reason: 'Playwright is unavailable in this installation or project.', captures: [] };
    const executablePath = await chromiumPath();
    browser = await playwright.chromium.launch({
      ...(executablePath ? { executablePath } : {}),
      timeout: Math.max(1, Math.min(10_000, options.deadline - Date.now()))
    });
  } catch (_error) { return { status: 'unassessed', reason: 'A local Chromium browser could not be started.', captures: [] }; }
  const captures = [];
  const abort = () => { void browser.close().catch(() => {}); };
  options.signal?.addEventListener('abort', abort, { once: true });
  try {
    for (const route of routes) {
      for (const preset of viewports) {
        for (const theme of themes) {
          assertNotAborted(options.signal);
          if (Date.now() >= options.deadline) return { status: 'partial', reason: 'The browser evidence deadline elapsed.', captures };
          captures.push(await view(browser, source, result, options, route, preset, theme, captures.length + 1));
        }
      }
    }
    assertNotAborted(options.signal);
    const partial = captures.some(capture => capture.status === 'failed' || capture.blockedRequests > 0 || capture.failedResponses > 0);
    return { status: partial ? 'partial' : 'captured', reason: partial ? 'Some routes or resources did not load within the permitted preview origin.' : 'Captured the selected routes, viewports and themes.', captures };
  } finally {
    options.signal?.removeEventListener('abort', abort);
    await browser.close().catch(() => {});
  }
}

export async function captureProjectImages(result, options) {
  const captures = [];
  for (const relative of result.config.visual?.artifacts ?? []) {
    assertNotAborted(options.signal);
    let handle;
    try {
      handle = await open(await safeChild(result.info.root, relative), READ_FLAGS);
      const stat = await handle.stat();
      if (!stat.isFile() || stat.size < 33 || stat.size > 10_000_000) throw new Error('Expected a bounded PNG file');
      if (!options.allowExec || stat.mtimeMs < options.startedAt) {
        captures.push({ path: relative, status: 'stale' });
        continue;
      }
      const bytes = await readBounded(handle, 10_000_000);
      const width = bytes.readUInt32BE(16);
      const height = bytes.readUInt32BE(20);
      if (bytes.subarray(0, 8).toString('hex') !== '89504e470d0a1a0a' || bytes.toString('ascii', 12, 16) !== 'IHDR' ||
        !width || !height || width * height > 40_000_000) throw new Error('Invalid PNG header');
      const screenshot = options.noSave ? null : `visual/${result.report.id}/project-${captures.length + 1}.png`;
      if (screenshot) await atomicWrite(path.join(options.output, screenshot), bytes);
      captures.push({ path: relative, status: 'captured', width, height, screenshot, screenshotDigest: hash(bytes) });
    } catch (_error) { captures.push({ path: relative, status: 'unavailable' }); }
    finally { await handle?.close(); }
  }
  return captures;
}
