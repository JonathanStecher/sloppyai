import { writeFile, mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { loadCatalog } from '../src/catalog.mjs';

const root = fileURLToPath(new URL('../', import.meta.url));
const catalog = await loadCatalog();
const lines = ['# Craftcheck catalogue', '', 'Generated from the canonical JSON records. Edit skills/craftcheck/catalog, then run npm run catalog.', '', `${catalog.entries.length} entries, including all 102 original screenshot labels.`, '', 'Kinds: requirement, heuristic, option, definition. An entry is not necessarily an implemented automated check.', '', '## Entries', ''];
for (const entry of catalog.entries) {
  lines.push(`### ${entry.id}: ${entry.title}`, '', `Domain: ${entry.domain}. Kind: ${entry.kind}. Automation: ${entry.automation}.`, '', entry.description, '', entry.guidance, '', 'Verification: ' + entry.verification.join(' '), '', ...(entry.counterexamples.length ? ['Counterexample: ' + entry.counterexamples.join(' '), ''] : []), 'Sources: ' + entry.sourceIds.map(id => `[${id}](#source-${id})`).join(', '), '');
}
lines.push('## Sources', '', 'Sources include normative standards, guidance, workflow inspiration and qualitative community observations. They do not all establish an empirical claim or a universal rule.', '');
for (const source of catalog.sources) lines.push(`<a id="source-${source.id}"></a>`, `### ${source.title}`, '', `Type: ${source.kind}.` + (source.reviewed ? ` Reviewed ${source.reviewed}.` : ''), '', ...(source.url ? [`[Original source](${source.url})`, ''] : []), source.note, '');
await mkdir(path.join(root, 'docs'), { recursive: true });
await writeFile(path.join(root, 'docs/catalog.md'), lines.join('\n'));
console.log(`Generated catalogue documentation for ${catalog.entries.length} entries.`);
