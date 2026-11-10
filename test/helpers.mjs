import { mkdtemp, mkdir, writeFile, rm } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';

export async function fixture(t, files = {}) {
  const directory = await mkdtemp(path.join(os.tmpdir(), 'craftcheck-test-'));
  t.after(() => rm(directory, { recursive: true, force: true }));
  const target = path.join(directory, 'artifact');
  const output = path.join(directory, 'reports');
  await mkdir(target);
  for (const [name, text] of Object.entries(files)) {
    const file = path.join(target, name);
    await mkdir(path.dirname(file), { recursive: true });
    await writeFile(file, text);
  }
  return { directory, target, output };
}
