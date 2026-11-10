import { realpath, lstat, readdir, open } from 'node:fs/promises';
import path from 'node:path';
import { hash, inside, slash, stable, assertNotAborted, READ_FLAGS, readBounded } from './util.mjs';
import { fail } from './errors.mjs';

const EXTENSIONS = new Set(['.html', '.htm', '.css', '.js', '.mjs', '.cjs', '.jsx', '.ts', '.tsx', '.py', '.sql', '.md', '.txt', '.json', '.yaml', '.yml']);
const IGNORED = new Set(['.git', '.craftcheck', 'node_modules', 'vendor', 'coverage', '.next', '.nuxt', 'dist', 'build', '__pycache__', '.venv', 'venv']);
const SECRET_FILE = /^(?:\.env(?:\..*)?|credentials(?:\..*)?|id_(?:rsa|ed25519|ecdsa)(?:\.pub)?|.*\.(?:pem|key|p12|pfx))$/i;
const LOCK_FILE = /^(?:package-lock\.json|yarn\.lock|pnpm-lock\.yaml|bun\.lock|uv\.lock)$/;

export async function targetInfo(target) {
  let resolved;
  try { resolved = await realpath(path.resolve(target)); }
  catch (_error) { fail('TARGET_NOT_FOUND', 'The target does not exist or cannot be read.', 'Select an existing file or directory.'); }
  const stat = await lstat(resolved);
  if (!stat.isFile() && !stat.isDirectory()) fail('UNSUPPORTED_TARGET', 'The target is not a file or directory.', 'Select a regular file or directory.');
  return { target: resolved, root: stat.isDirectory() ? resolved : path.dirname(resolved), isFile: stat.isFile(), label: path.basename(resolved) };
}

export async function collectFiles(info, config, options = {}) {
  const files = [];
  const skipped = [];
  let total = 0;
  let capped = false;
  const output = options.output ? path.resolve(options.output) : null;
  const excluded = config.exclude.map(item => path.resolve(info.root, item));
  const skip = (relative, reason) => { if (skipped.length < 200) skipped.push({ path: relative, reason }); };
  async function visit(file) {
    assertNotAborted(options.signal);
    const relative = slash(path.relative(info.root, file));
    const base = path.basename(file);
    if (output && inside(output, file)) return;
    if (excluded.some(item => inside(item, file))) { skip(relative, 'configured exclusion'); return; }
    if (SECRET_FILE.test(base) || LOCK_FILE.test(base)) { skip(relative, 'sensitive or dependency metadata excluded'); return; }
    if (IGNORED.has(base) || (base.startsWith('.') && base !== '.github' && base !== '.well-known')) return;
    let stat;
    try { stat = await lstat(file); }
    catch (_error) { skip(relative, 'unreadable path'); return; }
    if (stat.isSymbolicLink()) { skip(relative, 'symbolic link excluded'); return; }
    if (stat.isDirectory()) {
      let children;
      try { children = (await readdir(file)).sort(); }
      catch (_error) { skip(relative, 'unreadable directory'); return; }
      for (const child of children) { if (capped) break; await visit(path.join(file, child)); }
      return;
    }
    if (!stat.isFile() || !EXTENSIONS.has(path.extname(file).toLowerCase())) { skip(relative, 'unsupported file type'); return; }
    if (files.length >= config.maxFiles) { capped = true; skip(relative, 'file count limit'); return; }
    if (stat.size > config.maxFileBytes) { skip(relative, 'file byte limit'); return; }
    if (total + stat.size > config.maxTotalBytes) { capped = true; skip(relative, 'total byte limit'); return; }
    let handle;
    try {
      // lstat + realpath are repeated immediately before reading; child links are never followed deliberately.
      const resolved = await realpath(file);
      if (!inside(info.root, resolved)) { skip(relative, 'path escaped artifact'); return; }
      handle = await open(file, READ_FLAGS);
      const current = await handle.stat();
      if (!current.isFile() || current.size > config.maxFileBytes || total + current.size > config.maxTotalBytes) { skip(relative, 'file changed or byte limit'); return; }
      const data = await readBounded(handle, Math.min(config.maxFileBytes, config.maxTotalBytes - total));
      if (data.includes(0)) { skip(relative, 'binary content'); return; }
      const text = data.toString('utf8');
      if (!Buffer.from(text, 'utf8').equals(data)) { skip(relative, 'non UTF-8 content'); return; }
      total += data.length;
      files.push({ path: relative, absolute: file, text, hash: hash(data), bytes: data.length, mode: current.mode & 0o777 });
    } catch (_error) { skip(relative, 'unreadable file'); }
    finally { await handle?.close(); }
  }
  if (info.isFile && !EXTENSIONS.has(path.extname(info.target).toLowerCase())) fail('UNSUPPORTED_FILE', 'This file type has no static reader.', 'Use the agent media/document workflow, or select UTF-8 source files.');
  await visit(info.target);
  const manifest = files.map(({ path, hash, bytes }) => ({ path, hash, bytes }));
  return { files, manifest, skipped, capped, bytes: total, digest: hash(stable(manifest)) };
}
