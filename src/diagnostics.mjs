import { open } from 'node:fs/promises';
import { hash, READ_FLAGS, safeChild, short } from './util.mjs';

export function logLevels(text) {
  const levels = { lines: 0, errors: 0, warnings: 0 };
  for (const line of text.split(/\r?\n/)) {
    if (!line.trim()) continue;
    levels.lines++;
    if (/\b(?:error|fatal|critical)\s*[:\]]|"(?:level|severity)"\s*:\s*"(?:error|fatal|critical)"|^\s*(?:not ok\b|Traceback\b|[A-Za-z]+Error:)/i.test(line)) levels.errors++;
    else if (/\b(?:warn|warning)\s*[:\]]|"(?:level|severity)"\s*:\s*"(?:warn|warning)"/i.test(line)) levels.warnings++;
  }
  return levels;
}

export async function sampleLogs(info, configured) {
  const logs = [];
  for (const relative of configured) {
    let handle;
    try {
      handle = await open(await safeChild(info.root, relative), READ_FLAGS);
      const stats = await handle.stat();
      if (!stats.isFile()) throw new Error('Expected a regular log file');
      const buffer = Buffer.alloc(Math.min(stats.size, 65_536));
      const start = Math.max(0, stats.size - buffer.length);
      const { bytesRead } = await handle.read(buffer, 0, buffer.length, start);
      const data = buffer.subarray(0, bytesRead);
      logs.push({ path: short(relative, 300), status: 'sampled', truncated: start > 0, digest: hash(data), ...logLevels(data.toString('utf8')) });
    } catch (_error) { logs.push({ path: short(relative, 300), status: 'unavailable' }); }
    finally { await handle?.close(); }
  }
  return logs;
}
