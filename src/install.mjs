import os from 'node:os';
import path from 'node:path';
import { readdir, lstat, readFile, mkdir, cp, rename, rm, realpath } from 'node:fs/promises';
import { SKILL_ROOT, VERSION } from './assets.mjs';
import { hash, id, readJson, writeJson, inside } from './util.mjs';
import { fail } from './errors.mjs';

async function inventory(root, relative = '') {
  const records = [];
  for (const name of (await readdir(path.join(root, relative))).sort()) {
    if (!relative && name === '.sloppyai-install.json') continue;
    const item = path.join(relative, name);
    const stat = await lstat(path.join(root, item));
    if (stat.isSymbolicLink()) fail('INSTALL_SYMLINK', 'Skill installation does not follow symbolic links.', 'Use a regular, self-contained skill directory.');
    if (stat.isDirectory()) records.push(...await inventory(root, item));
    else if (stat.isFile()) records.push({ path: item.split(path.sep).join('/'), hash: hash(await readFile(path.join(root, item))) });
    else fail('INSTALL_FILE_TYPE', 'A skill resource is not a regular file.', 'Remove special files from the package.');
  }
  return records;
}

export function installDestination(options = {}) {
  if (options.destination) return path.resolve(options.destination, 'sloppyai');
  const host = options.host || 'codex';
  if (!['codex', 'claude', 'cursor'].includes(host)) fail('UNKNOWN_HOST', 'Unknown installation host.', 'Use codex, claude, cursor, or an explicit --dest skill-parent directory.');
  if (options.scope && !['user', 'project'].includes(options.scope)) fail('INVALID_SCOPE', 'Unknown installation scope.', 'Use user or project.');
  const root = options.scope === 'project' ? path.resolve(options.project || process.cwd()) : os.homedir();
  const folder = host === 'codex' ? options.scope === 'project' ? '.agents' : '.codex' : host === 'claude' ? '.claude' : '.cursor';
  return path.join(root, folder, 'skills', 'sloppyai');
}

export async function installSkill(options = {}) {
  let destination = installDestination(options);
  if (inside(SKILL_ROOT, destination) || inside(destination, SKILL_ROOT)) fail('INSTALL_OVERLAP', 'The installation overlaps the source skill.', 'Choose a different skill-parent directory.');
  try { await lstat(destination); fail('INSTALL_EXISTS', 'A skill already exists at the destination.', 'Preserve local changes. Uninstall an unchanged managed copy before installing this version.'); }
  catch (error) { if (error.code !== 'ENOENT') throw error; }
  await inventory(SKILL_ROOT);
  await mkdir(path.dirname(destination), { recursive: true });
  destination = path.join(await realpath(path.dirname(destination)), path.basename(destination));
  if (inside(SKILL_ROOT, destination) || inside(destination, SKILL_ROOT)) fail('INSTALL_OVERLAP', 'The resolved installation overlaps the source skill.', 'Choose a different skill-parent directory.');
  const staging = path.join(path.dirname(destination), '.sloppyai-install-' + id());
  try {
    await cp(SKILL_ROOT, staging, { recursive: true, errorOnExist: true, force: false, dereference: false });
    const files = await inventory(staging);
    await writeJson(path.join(staging, '.sloppyai-install.json'), { managedBy: 'sloppyai', version: VERSION, files });
    await rename(staging, destination);
    return { destination, version: VERSION, files: files.length, note: 'No project instructions, hooks, model settings or other skills were changed.' };
  } catch (error) { await rm(staging, { recursive: true, force: true }); throw error; }
}

export async function uninstallSkill(options = {}) {
  const destination = installDestination(options);
  const stat = await lstat(destination);
  if (!stat.isDirectory() || stat.isSymbolicLink()) fail('UNMANAGED_INSTALL', 'The selected skill is not a regular managed directory.', 'Preserve the directory and inspect it manually.');
  let manifest;
  try { manifest = await readJson(path.join(destination, '.sloppyai-install.json')); }
  catch (_error) { fail('UNMANAGED_INSTALL', 'No valid sloppyai ownership manifest was found.', 'Remove a manually installed copy only after reviewing its contents.'); }
  const current = await inventory(destination);
  if (manifest.managedBy !== 'sloppyai' || !Array.isArray(manifest.files) || JSON.stringify(current) !== JSON.stringify(manifest.files)) fail('INSTALL_MODIFIED', 'The installed skill has local changes or additional files.', 'Preserve or move those changes before uninstalling. No files were deleted.');
  await rm(destination, { recursive: true });
  return { destination, status: 'removed', note: 'Only the unchanged managed sloppyai folder was removed.' };
}
