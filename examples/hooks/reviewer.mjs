// Fixture-only hook contract example. This is not a general quality evaluator.
import { readFile, writeFile, stat } from 'node:fs/promises';
import path from 'node:path';

const request = JSON.parse(await readFile(process.env.CRAFTCHECK_REQUEST, 'utf8'));
const target = process.env.CRAFTCHECK_TARGET;
const file = (await stat(target)).isDirectory() ? path.join(target, 'index.html') : target;
const source = await readFile(file, 'utf8');
const specific = source.includes('<h1>Export a report</h1>');
await writeFile(process.env.CRAFTCHECK_REVIEW, JSON.stringify({
  inputDigest: request.inputDigest,
  reviewer: { name: 'deterministic heading fixture', kind: 'agent' },
  assessments: [{
    domain: 'copy', score: specific ? 4 : 2,
    rationale: specific ? 'The fixture heading names its intended report-export task.' : 'The fixture heading makes a vague promise rather than naming the intended task.',
    evidence: 'Observed index.html against the authored fixture task only. This narrow deterministic example is not an independent or general writing assessment.'
  }],
  findings: []
}, null, 2));
