import assert from 'node:assert/strict';
import { readFile, readdir, lstat, access } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadCatalog } from '../src/catalog.mjs';
import { validate } from '../src/schema.mjs';
import { VERSION } from '../src/assets.mjs';

const root = fileURLToPath(new URL('../', import.meta.url));
const catalog = await loadCatalog();
const sources = new Set(catalog.sources.map(item => item.id));
assert.equal(sources.size, catalog.sources.length, 'Duplicate source identifier');
for (const entry of catalog.entries) {
  await validate('rule', entry);
  for (const source of entry.sourceIds) assert.ok(sources.has(source), `Unknown source ${source} in ${entry.id}`);
  if (entry.kind === 'heuristic') assert.ok(entry.counterexamples.length, `Missing counterexample for ${entry.id}`);
}
const originals = catalog.entries.filter(entry => entry.original);
assert.equal(originals.length, 102);
const expected = [20, 22, 20, 20, 20];
for (let image = 1; image <= 5; image++) {
  const rows = originals.filter(entry => entry.original.image === image).map(entry => entry.original.item).sort((a, b) => a - b);
  assert.deepEqual(rows, Array.from({ length: expected[image - 1] }, (_, i) => i + 1));
}
const pkg = JSON.parse(await readFile(path.join(root, 'package.json'), 'utf8'));
assert.equal(pkg.version, VERSION, 'Engine/package version drift');
const skill = await readFile(path.join(root, 'skills/sloppyai/SKILL.md'), 'utf8');
assert.match(skill, /^---\nname: sloppyai\ndescription: .+\nlicense: MIT\n---\n/);
assert.ok(skill.split('\n').length < 180, 'Entrypoint grew beyond its project context budget');
assert.ok(!skill.includes('/Users/'), 'Private path in skill');
let markdownFiles = 0;
async function walk(directory) {
  for (const name of await readdir(directory)) {
    if (['node_modules', '.git', '.sloppyai', '.craftcheck'].includes(name)) continue;
    const file = path.join(directory, name);
    const stat = await lstat(file);
    if (stat.isDirectory()) await walk(file);
    else if (name.endsWith('.md')) {
      markdownFiles++;
      const text = await readFile(file, 'utf8');
      assert.ok(!text.includes('/Users/jonathanstecher/'), `Private path in ${path.relative(root, file)}`);
      for (const match of text.matchAll(/\[[^\]]*\]\(([^)\s]+)\)/g)) {
        const target = match[1];
        if (/^[a-z]+:|^#/i.test(target)) continue;
        const local = decodeURIComponent(target.split('#')[0]);
        if (local) await access(path.resolve(path.dirname(file), local)).catch(() => { throw new Error(`Broken link ${target} in ${path.relative(root, file)}`); });
      }
    }
  }
}
await walk(root);
await access(path.join(root, 'skills/sloppyai/scripts/THIRD_PARTY_LICENSES.md'));
assert.ok((await readFile(path.join(root, 'docs/catalog.md'), 'utf8')).includes(`${catalog.entries.length} entries`));
console.log(`Validated ${catalog.entries.length} catalogue entries, 102 original labels, ${catalog.sources.length} sources and ${markdownFiles} Markdown files.`);
