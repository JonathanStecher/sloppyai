import assert from 'node:assert/strict';
import os from 'node:os';
import path from 'node:path';
import { mkdtemp, readdir, readFile, writeFile, rm } from 'node:fs/promises';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { pathToFileURL, fileURLToPath } from 'node:url';

const exec = promisify(execFile);
const root = fileURLToPath(new URL('../', import.meta.url));
const pkg = JSON.parse(await readFile(path.join(root, 'package.json'), 'utf8'));
const archive = path.join(root, pkg.name.replace(/^@/, '').replace('/', '-') + '-' + pkg.version + '.tgz');
const temporary = await mkdtemp(path.join(os.tmpdir(), 'craftcheck-package-'));
try {
  assert.ok(process.env.npm_execpath, 'Run this check with npm run package:smoke');
  await exec(process.execPath, [process.env.npm_execpath, 'install', '--prefix', temporary, '--ignore-scripts', '--no-audit', '--no-fund', archive], { cwd: temporary });
  const installed = path.join(temporary, 'node_modules', ...pkg.name.split('/'));
  const installedPackage = JSON.parse(await readFile(path.join(installed, 'package.json'), 'utf8'));
  assert.equal(installedPackage.version, pkg.version);
  assert.ok(!Object.keys(installedPackage.dependencies || {}).length, 'The portable package has no runtime dependency installation');
  const library = await import(pathToFileURL(path.join(installed, 'skills/craftcheck/scripts/core.mjs')));
  assert.equal(library.VERSION, pkg.version);
  assert.equal((await library.loadCatalog()).entries.length, 194);
  const artifact = path.join(temporary, 'fixture.html');
  await writeFile(artifact, '<!doctype html><html lang="en"><body><h1>Export your report</h1><button>Save report</button></body></html>');
  const { stdout } = await exec(process.execPath, [path.join(installed, 'skills/craftcheck/scripts/craftcheck.mjs'), 'audit', artifact, '--json', '--no-save'], { cwd: temporary });
  const report = JSON.parse(stdout);
  assert.equal(report.coverage.assessedFiles, 1);
  assert.equal(report.findings.length, 0);
  assert.ok(!(await readdir(installed)).includes('src'), 'The installed bundle must work without development source');
  console.log('Packaged CLI, catalogue and library work from an isolated installation.');
} finally {
  await rm(temporary, { recursive: true, force: true });
}
