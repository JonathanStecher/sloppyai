import path from 'node:path';
import { lstat } from 'node:fs/promises';
import { DOMAINS } from './assets.mjs';
import { validate } from './schema.mjs';
import { readJson, inside, stable, hash } from './util.mjs';
import { fail } from './errors.mjs';

export const DEFAULT_CONFIG = Object.freeze({
  domains: DOMAINS, htmlMode: 'auto', maxFiles: 2000, maxFileBytes: 1_000_000,
  maxTotalBytes: 20_000_000, exclude: [], acceptedHeuristics: [], preserve: [], checks: [], logs: [],
  loop: { maxRounds: 3, targetScore: 100, reviewTarget: 4, stallRounds: 2, maxDurationMs: 300_000 }
});

export async function loadConfig(root, options = {}) {
  let supplied = options.config ?? {};
  let from = 'defaults';
  if (!options.config) {
    const file = options.configFile ? path.resolve(options.configFile) : path.join(root, '.sloppyai.json');
    try {
      const stat = await lstat(file);
      if (stat.isSymbolicLink()) fail('CONFIG_SYMLINK', 'Configuration must be a regular file.', 'Select a regular configuration file explicitly.');
      supplied = await readJson(file, 100_000);
      from = options.configFile ? 'explicit file' : '.sloppyai.json';
    } catch (error) { if (error.code !== 'ENOENT' || options.configFile) throw error; }
  }
  await validate('config', supplied);
  const config = structuredClone({ ...DEFAULT_CONFIG, ...supplied, loop: { ...DEFAULT_CONFIG.loop, ...supplied.loop } });
  if (options.domains) config.domains = options.domains;
  if (options.language) config.language = options.language;
  if (options.preview) config.visual = { ...config.visual, url: options.preview };
  if (options.maxRounds !== undefined) config.loop.maxRounds = options.maxRounds;
  if (options.targetScore !== undefined) config.loop.targetScore = options.targetScore;
  if (options.maxDurationMs !== undefined) config.loop.maxDurationMs = options.maxDurationMs;
  await validate('config', config);
  for (const excluded of config.exclude) {
    if (path.isAbsolute(excluded) || !inside(root, path.resolve(root, excluded))) fail('INVALID_EXCLUDE', 'Exclusions must name paths inside the artifact.', 'Use relative directory or file prefixes without globs.');
  }
  for (const item of config.preserve) {
    if (path.isAbsolute(item.path) || !inside(root, path.resolve(root, item.path))) fail('INVALID_PRESERVATION', 'A preservation path escapes the artifact.', 'Use relative paths inside the selected artifact.');
  }
  for (const log of config.logs) {
    if (path.isAbsolute(log) || log.includes('\0') || !inside(root, path.resolve(root, log))) fail('INVALID_LOG_PATH', 'A log path escapes the artifact.', 'Select a relative log path inside the artifact.');
  }
  for (const file of config.visual?.artifacts ?? []) {
    if (path.isAbsolute(file) || file.includes('\0') || !inside(root, path.resolve(root, file))) fail('INVALID_SCREENSHOT_PATH', 'A screenshot path escapes the artifact.', 'Select a relative PNG path inside the artifact.');
  }
  if (config.visual?.url) {
    let url;
    try { url = new URL(config.visual.url); }
    catch (_error) { fail('INVALID_PREVIEW', 'The preview URL is invalid.', 'Set visual.url to an HTTPS or local HTTP origin.'); }
    const local = ['localhost', '127.0.0.1', '[::1]'].includes(url.hostname);
    if ((url.protocol !== 'https:' && !(local && url.protocol === 'http:')) ||
        url.username || url.password || url.pathname !== '/' || url.search || url.hash) {
      fail('INVALID_PREVIEW', 'The preview URL must be an origin without credentials.', 'Use visual.routes for paths. HTTP previews must be local.');
    }
  }
  const names = config.checks.map(c => c.name);
  if (new Set(names).size !== names.length) fail('DUPLICATE_CHECK_NAME', 'Check names must be unique.', 'Give each check a stable, distinct name.');
  return { config, from, digest: hash(stable(config)) };
}
