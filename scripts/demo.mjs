import { cp, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { randomUUID } from 'node:crypto';
import { improveLoop } from '../src/loop.mjs';
import { readJson } from '../src/util.mjs';

const root = fileURLToPath(new URL('../', import.meta.url));
const hooks = process.argv.includes('--hooks');
const workspace = path.join(root, '.craftcheck', 'demo', 'run-' + randomUUID());
const target = path.join(workspace, 'artifact');
await mkdir(workspace, { recursive: true, mode: 0o700 });
await cp(path.join(root, 'examples/landing-page'), target, { recursive: true });
const config = await readJson(path.join(target, '.craftcheck.json'));
if (hooks) {
  await cp(path.join(root, 'examples/hooks/reviewer.mjs'), path.join(target, 'reviewer.mjs'));
  await cp(path.join(root, 'examples/hooks/fixer.mjs'), path.join(target, 'fixer.mjs'));
  config.reviewer = { name: 'fixture reviewer', command: [process.execPath, 'reviewer.mjs'] };
  config.fixer = { name: 'fixture fixer', command: [process.execPath, 'fixer.mjs'] };
}
const result = await improveLoop(target, {
  output: path.join(workspace, 'reports'), config, apply: true, allowExec: hooks,
  onProgress(event) {
    if (event.type === 'assessment') console.log(`Round ${event.round}: ${event.report.findings.length} findings; ${event.report.reviewerAssessments.map(item => `${item.domain} ${item.score}/5`).join(', ') || 'static assessment'}`);
  }
});
console.log(`Stopped: ${result.summary.stopReason}; ${result.summary.repairRounds} repair rounds.`);
console.log('Open ' + path.join(result.output, 'report.html'));
console.log('Original examples are unchanged. Hook ratings, when enabled, assess only the authored fixture task.');
