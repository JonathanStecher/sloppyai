// Fixture-only hook. Changes exactly one known heading, or refuses the input.
import { readFile, writeFile, stat } from 'node:fs/promises';
import path from 'node:path';

const target = process.env.CRAFTCHECK_TARGET;
const file = (await stat(target)).isDirectory() ? path.join(target, 'index.html') : target;
const source = await readFile(file, 'utf8');
const expected = '<h1>Unlock your potential</h1>';
if (!source.includes(expected)) {
  console.error('This fixture fixer only handles the documented demonstration heading.');
  process.exitCode = 1;
} else await writeFile(file, source.replace(expected, '<h1>Export a report</h1>'));
