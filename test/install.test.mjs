import test from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';
import { access, readFile, writeFile } from 'node:fs/promises';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { installSkill, uninstallSkill } from '../src/install.mjs';
import { fixture } from './helpers.mjs';

const exec = promisify(execFile);

test('installed skill runs without its source checkout or node_modules', async t => {
  const f = await fixture(t, { 'copy.md': 'Concrete description.' });
  const destination = path.join(f.directory, 'skills');
  const result = await installSkill({ destination });
  const cli = path.join(result.destination, 'scripts/craftcheck.mjs');
  const { stdout } = await exec(process.execPath, [cli, 'audit', f.target, '--json', '--no-save'], { cwd: f.directory });
  assert.equal(JSON.parse(stdout).coverage.assessedFiles, 1);
  await access(path.join(result.destination, 'catalog/security.json'));
  await access(path.join(result.destination, 'scripts/THIRD_PARTY_LICENSES.md'));
  assert.equal((await uninstallSkill({ destination })).status, 'removed');
  await assert.rejects(access(result.destination), error => error.code === 'ENOENT');
});

test('installation refuses to overwrite an existing skill', async t => {
  const f = await fixture(t);
  const destination = path.join(f.directory, 'skills');
  await installSkill({ destination });
  await assert.rejects(installSkill({ destination }), error => error.code === 'INSTALL_EXISTS');
});

test('uninstall preserves local edits and added files', async t => {
  const f = await fixture(t);
  const destination = path.join(f.directory, 'skills');
  const installed = await installSkill({ destination });
  await writeFile(path.join(installed.destination, 'my-notes.md'), 'Keep this local work.');
  await assert.rejects(uninstallSkill({ destination }), error => error.code === 'INSTALL_MODIFIED');
  assert.equal(await readFile(path.join(installed.destination, 'my-notes.md'), 'utf8'), 'Keep this local work.');
});
