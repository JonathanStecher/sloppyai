import { readdir } from 'node:fs/promises';
import path from 'node:path';
import { SKILL_ROOT } from './assets.mjs';
import { readJson, hash, stable } from './util.mjs';
import { fail } from './errors.mjs';

export async function loadCatalog() {
  const directory = path.join(SKILL_ROOT, 'catalog');
  const names = (await readdir(directory)).filter(name => name.endsWith('.json') && name !== 'sources.json').sort();
  const entries = (await Promise.all(names.map(name => readJson(path.join(directory, name))))).flat();
  const byId = new Map(entries.map(entry => [entry.id, entry]));
  if (byId.size !== entries.length) fail('DUPLICATE_RULE', 'Catalogue identifiers must be unique.', 'Validate the catalogue and remove duplicate identifiers.');
  return { entries, byId, sources: await readJson(path.join(directory, 'sources.json')), digest: hash(stable(entries)) };
}

export function selectCatalog(catalog, options = {}) {
  return catalog.entries.filter(entry =>
    (!options.domain || entry.domain === options.domain) &&
    (!options.kind || entry.kind === options.kind) &&
    (!options.query || `${entry.id} ${entry.title} ${entry.description}`.toLowerCase().includes(options.query.toLowerCase()))
  );
}
