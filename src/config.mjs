import path from 'node:path';
import { lstat } from 'node:fs/promises';
import { DOMAINS } from './assets.mjs';
import { validate } from './schema.mjs';
import { readJson, inside, stable, hash } from './util.mjs';
import { fail } from './errors.mjs';

export const DEFAULT_CONFIG = Object.freeze({
  domains: DOMAINS, htmlMode: 'auto', maxFiles: 2000, maxFileBytes: 1_000_000,
  maxTotalBytes: 20_000_000, exclude: [], acceptedHeuristics: [], preserve: [], checks: [],
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
  const names = config.checks.map(c => c.name);
  if (new Set(names).size !== names.length) fail('DUPLICATE_CHECK_NAME', 'Check names must be unique.', 'Give each check a stable, distinct name.');
  return { config, from, digest: hash(stable(config)) };
}
