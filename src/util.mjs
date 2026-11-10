import { createHash, randomUUID } from 'node:crypto';
import { readFile, mkdir, open, rename, unlink, realpath, lstat } from 'node:fs/promises';
import path from 'node:path';
import { constants } from 'node:fs';
import { SloppyAIError, fail } from './errors.mjs';

export const hash = value => createHash('sha256').update(value).digest('hex');
export const id = () => randomUUID();
export const slash = value => value.split(path.sep).join('/');

export function stable(value) {
  if (Array.isArray(value)) return '[' + value.map(stable).join(',') + ']';
  if (value && typeof value === 'object') return '{' + Object.keys(value).sort().map(k => JSON.stringify(k) + ':' + stable(value[k])).join(',') + '}';
  return JSON.stringify(value);
}

export function redact(value) {
  return String(value)
    .replace(/-----BEGIN (?:[A-Z ]+ )?PRIVATE KEY-----[\s\S]*?(?:-----END (?:[A-Z ]+ )?PRIVATE KEY-----|$)/g, '[REDACTED PRIVATE KEY]')
    .replace(/\b(?:sk-(?:proj-|ant-)?[A-Za-z0-9_-]{12,}|sk_live_[A-Za-z0-9]{8,}|gh[pousr]_[A-Za-z0-9_]{12,}|github_pat_[A-Za-z0-9_]{12,}|AKIA[A-Z0-9]{16}|xox[baprs]-[A-Za-z0-9-]{10,})\b/g, '[REDACTED TOKEN]')
    .replace(/\beyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\b/g, '[REDACTED JWT]')
    .replace(/(["']?(?:authorization|password|passwd|api[_-]?key|access[_-]?token|client[_-]?secret|service[_-]?role[_-]?key)["']?\s*[=:]\s*)(["']?)([^\s"',;<>\\]{4,})/gi, '$1$2[REDACTED]')
    .replace(/(https?:\/\/)[^/\s:@]+:[^@/\s]+@/g, '$1[REDACTED]@');
}

export const short = (value, max = 180) => redact(value).replace(/\s+/g, ' ').replace(/\p{Cc}/gu, '').trim().slice(0, max);
export function sanitize(value) {
  if (typeof value === 'string') return redact(value);
  if (Array.isArray(value)) return value.map(sanitize);
  if (value && typeof value === 'object') return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, sanitize(item)]));
  return value;
}
export const escapeHtml = value => String(value).replace(/[&<>"']/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[ch]);
export const md = value => short(value, 700).replace(/\\/g, '\\\\').replace(/[|*_[\]]/g, ch => '\\' + ch).replace(/`/g, "'").replace(/</g, '&lt;').replace(/>/g, '&gt;');

export function inside(root, target) {
  const relative = path.relative(root, target);
  return relative === '' || (!relative.startsWith('..' + path.sep) && relative !== '..' && !path.isAbsolute(relative));
}

export async function safeChild(root, relative) {
  if (typeof relative !== 'string' || !relative || path.isAbsolute(relative) || relative.includes('\0')) fail('INVALID_PATH', 'Expected a relative artifact path.', 'Use a path inside the selected artifact.');
  const destination = path.resolve(root, relative);
  if (!inside(root, destination)) fail('PATH_ESCAPE', 'The path escapes the selected artifact.', 'Use a path inside the selected artifact.');
  const resolved = await realpath(destination);
  if (!inside(root, resolved)) fail('SYMLINK_ESCAPE', 'The path follows a link outside the selected artifact.', 'Select a regular file within the artifact.');
  const stat = await lstat(destination);
  if (!stat.isFile() || stat.isSymbolicLink()) fail('NOT_REGULAR_FILE', 'The selected path is not a regular file.', 'Select a regular file within the artifact.');
  return destination;
}

export const READ_FLAGS = constants.O_RDONLY | (constants.O_NONBLOCK || 0) | (constants.O_NOFOLLOW || 0);

export async function readBounded(handle, max) {
  const chunks = [];
  let total = 0;
  while (total <= max) {
    const buffer = Buffer.alloc(Math.min(65_536, max + 1 - total));
    const { bytesRead } = await handle.read(buffer, 0, buffer.length, null);
    if (!bytesRead) return Buffer.concat(chunks, total);
    total += bytesRead;
    if (total > max) fail('INPUT_SIZE_LIMIT', 'The input grew beyond its permitted byte limit.', 'Use a smaller stable input and repeat the assessment.');
    chunks.push(buffer.subarray(0, bytesRead));
  }
}

export async function readJson(file, max = 2_000_000) {
  try {
    const handle = await open(file, READ_FLAGS);
    try {
      const stat = await handle.stat();
      if (!stat.isFile() || stat.size > max) fail('JSON_SIZE_LIMIT', 'JSON input exceeds the permitted size or is not a file.', 'Use a smaller regular JSON file.');
      return JSON.parse((await readBounded(handle, max)).toString('utf8'));
    } finally { await handle.close(); }
  } catch (error) {
    if (error instanceof SloppyAIError || error.code === 'ENOENT') throw error;
    fail('INVALID_JSON', 'Cannot read valid JSON input.', 'Check JSON syntax and file permissions.', { cause: short(error.message) });
  }
}

export async function atomicWrite(file, data, mode = 0o600) {
  file = path.resolve(file);
  await mkdir(path.dirname(file), { recursive: true, mode: 0o700 });
  if (await realpath(path.dirname(file)) !== path.dirname(file)) fail('UNSAFE_WRITE_PARENT', 'The write destination traverses a symbolic-link directory.', 'Use a regular resolved directory and preserve the linked destination.');
  const temporary = file + '.' + randomUUID() + '.tmp';
  const handle = await open(temporary, 'wx', mode);
  try {
    await handle.writeFile(data);
    await handle.sync();
  } finally { await handle.close(); }
  try { await rename(temporary, file); }
  catch (error) { await unlink(temporary).catch(() => {}); throw error; }
}

export const writeJson = (file, value) => atomicWrite(file, JSON.stringify(value, null, 2) + '\n');

export async function withLock(directory, action) {
  await mkdir(directory, { recursive: true, mode: 0o700 });
  const file = path.join(directory, '.lock');
  let handle;
  try { handle = await open(file, 'wx', 0o600); }
  catch (error) {
    if (error.code === 'EEXIST') fail('RUN_LOCKED', 'Another operation owns this report directory.', 'Wait for that operation or choose another output directory. Remove a stale lock only after verifying its process has stopped.');
    throw error;
  }
  await handle.writeFile(JSON.stringify({ pid: process.pid, created: new Date().toISOString() }));
  try { return await action(); }
  finally { await handle.close(); await unlink(file).catch(() => {}); }
}

export async function digestFile(file) { return hash(await readFile(file)); }

export function assertNotAborted(signal) {
  if (signal?.aborted) fail('CANCELLED', 'The operation was cancelled.', 'Resume with the existing report or start a new bounded run.');
}

export function delay(ms, signal) {
  return new Promise((resolve, reject) => {
    if (signal?.aborted) return reject(new SloppyAIError('CANCELLED', 'The operation was cancelled.', 'Resume when ready.'));
    const done = () => { signal?.removeEventListener('abort', abort); resolve(); };
    const timer = setTimeout(done, ms);
    const abort = () => { clearTimeout(timer); signal?.removeEventListener('abort', abort); reject(new SloppyAIError('CANCELLED', 'The operation was cancelled.', 'Resume when ready.')); };
    signal?.addEventListener('abort', abort, { once: true });
  });
}
