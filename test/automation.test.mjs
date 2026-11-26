import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { audit } from '../src/audit.mjs';
import { improveLoop } from '../src/loop.mjs';
import { undoTransaction } from '../src/repair.mjs';
import { targetInfo } from '../src/files.mjs';
import { fixture } from './helpers.mjs';

test('available CSS and Next.js repairs run even when scoped scores already meet the target', async t => {
  const css = [
    '.layout {',
    '  color: red;',
    '  color: red;',
    '  display: block;',
    '  display: grid;',
    '  /* Keep this explanation. */',
    '  display: grid;',
    '}',
    ''
  ].join('\n');
  const configSource = [
    "import type { NextConfig } from 'next';",
    'const options: NextConfig = {',
    '  reactStrictMode: true,',
    '};',
    'export default options;',
    ''
  ].join('\n');
  const wrapped = 'export default withPlugin({ reactStrictMode: true });';
  const explicit = 'module.exports = { poweredByHeader: true };';
  const spread = 'export default { ...shared };';
  const f = await fixture(t, {
    'layout.css': css, 'next.config.ts': configSource, 'wrapped/next.config.mjs': wrapped,
    'explicit/next.config.js': explicit, 'spread/next.config.mjs': spread
  });
  const original = await audit(f.target);
  assert.deepEqual(new Set(original.patches.map(patch => patch.ruleId)), new Set(['E12', 'S35']));
  assert.ok(original.report.ratings.filter(rating => rating.score !== null).every(rating => rating.score === 100));
  assert.equal(await readFile(path.join(f.target, 'layout.css'), 'utf8'), css);

  const result = await improveLoop(f.target, { apply: true, output: f.output });
  assert.equal(result.summary.repairRounds, 1);
  assert.equal(result.summary.stopReason, 'target_met_assessed_scope');
  assert.equal(await readFile(path.join(f.target, 'layout.css'), 'utf8'), css.replace('  color: red;\n  color: red;', '  color: red;'));
  assert.equal(await readFile(path.join(f.target, 'next.config.ts'), 'utf8'), configSource.replace('  reactStrictMode:', '  poweredByHeader: false,\n  reactStrictMode:'));
  assert.equal(await readFile(path.join(f.target, 'wrapped/next.config.mjs'), 'utf8'), wrapped);
  assert.equal(await readFile(path.join(f.target, 'explicit/next.config.js'), 'utf8'), explicit);
  assert.equal(await readFile(path.join(f.target, 'spread/next.config.mjs'), 'utf8'), spread);
  assert.ok(result.report.findings.some(item => item.ruleId === 'S35' && item.location.path === 'explicit/next.config.js'));

  await undoTransaction(await targetInfo(f.target), f.output, result.summary.transactions[0].id);
  assert.equal(await readFile(path.join(f.target, 'layout.css'), 'utf8'), css);
  assert.equal(await readFile(path.join(f.target, 'next.config.ts'), 'utf8'), configSource);
});

test('embedded CSS repair preserves the enclosing document and final declaration syntax', async t => {
  const html = '<!doctype html><html lang="en"><style>.box { color: red; color: red }</style><h1>Layouts</h1></html>';
  const f = await fixture(t, { 'index.html': html });
  const result = await improveLoop(f.target, { apply: true, output: f.output });
  assert.equal(result.summary.repairRounds, 1);
  assert.equal(await readFile(path.join(f.target, 'index.html'), 'utf8'), html.replace(' color: red; color: red', ' color: red;'));
});

test('likely privileged Next.js substitutions are reviewed without editing env or reporting values', async t => {
  const sample = [
    'module.exports = { poweredByHeader: false, env: {',
    "  DISPLAY_NAME: 'Portal',",
    '  PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_PUBLISHABLE_KEY,',
    "  DATA_CONFIG: process.env['DATABASE_URL'],",
    "  SESSION_SECRET: 'synthetic-placeholder-for-tests'",
    '} };'
  ].join('\n');
  const f = await fixture(t, { 'next.config.js': sample });
  const { patches, report } = await audit(f.target);
  const findings = report.findings.filter(item => item.ruleId === 'S36');
  assert.deepEqual(findings.map(item => item.location.line), [4, 5]);
  assert.ok(findings.every(item => item.confidence === 'tentative'));
  assert.deepEqual(patches, []);
  assert.ok(!JSON.stringify(report).includes('synthetic-placeholder-for-tests'));
});

test('native JSX link repairs preserve intentional openers, spreads and dynamic relations', async t => {
  const input = [
    'export const Links = ({ props, relation }) => <>',
    '  <a href="/docs" target="_blank">Documentation</a>',
    "  <a href=\"/terms\" rel={'external'} target={'_blank'}>Terms</a>",
    '  <a href="/edit" rel="opener" target="_blank">Editor</a>',
    '  <a href="/settings" target="_blank" {...props}>Settings</a>',
    '  <a href="/history" target="_blank" rel={relation}>History</a>',
    '  <a href="/billing" target="_blank" rel="noreferrer">Billing</a>',
    '  <a href="#">Choose</a>',
    '</>;'
  ].join('\n');
  const f = await fixture(t, { 'links.tsx': input });
  const original = await audit(f.target);
  assert.equal(original.patches.length, 2);
  assert.equal(original.report.findings.filter(item => item.ruleId === 'UX01').length, 1);
  const result = await improveLoop(f.target, { output: f.output, apply: true });
  const updated = await readFile(path.join(f.target, 'links.tsx'), 'utf8');
  assert.equal(updated, input.replace('<a href="/docs"', '<a rel="noopener" href="/docs"').replace("'external'", "'external noopener'"));
  assert.deepEqual(result.report.findings.filter(item => item.ruleId === 'S21').map(item => item.confidence), ['tentative']);
});

test('design and copy prompts identify redundant labels and preserve real status and navigation', async t => {
  const f = await fixture(t, {
    'index.html': '<header><span>PRICING</span><h1>Pricing</h1></header><section><span id="context">Terms</span><h2>Terms</h2></section><nav><a href="/usage">Usage</a><h2>Usage</h2></nav>',
    'page.tsx': 'export const Page = () => <section><span>Pricing</span><h1>Pricing</h1><span role="status">Ready</span><h2>Ready</h2><p>Get guaranteed results.</p><p>Replace lorem ipsum here.</p></section>;'
  });
  const { report, patches } = await audit(f.target);
  assert.deepEqual(report.findings.filter(item => item.ruleId === 'D02').map(item => item.location.path), ['index.html', 'page.tsx']);
  assert.ok(report.findings.some(item => item.ruleId === 'C02' && item.location.path === 'page.tsx'));
  assert.ok(report.findings.some(item => item.ruleId === 'UX02' && item.location.path === 'page.tsx'));
  assert.deepEqual(patches, []);
});

test('the agent hook receives repair instructions and acts on a confirmed design finding above the score target', async t => {
  const original = '<header><span>Pricing</span><h1>Pricing</h1></header><button>Choose plan</button>';
  const repaired = original.replace('<span>Pricing</span>', '');
  const reviewer = [
    "import assert from 'node:assert/strict';",
    "import fs from 'node:fs';",
    "const request = JSON.parse(fs.readFileSync(process.env.SLOPPYAI_REQUEST, 'utf8'));",
    "assert.ok(fs.readFileSync(request.guidance.checklistFile, 'utf8').includes('Product and release review'));",
    "assert.ok(fs.existsSync(request.guidance.reviewSchemaFile));",
    "assert.equal(request.guidance.designReview.brief.intent, 'Keep the existing print-like identity');",
    "assert.equal(request.guidance.designReview.referencePolicy.use, 'quality');",
    "assert.equal(request.guidance.designReview.qualityWorkflow.status, 'not_assessed');",
    "assert.ok(request.guidance.designReview.criteria.some(item => item.ruleId === 'D24' && item.status === 'not_assessed' && item.score === null));",
    "assert.ok(fs.existsSync(request.guidance.designReview.guideFile));",
    "assert.ok(fs.existsSync(request.guidance.designReview.qualityWorkflow.guideFile));",
    "const report = JSON.parse(fs.readFileSync(request.reportFile, 'utf8'));",
    "const label = report.findings.find(item => item.ruleId === 'D02');",
    "const findings = label ? [{ruleId:'D02', anchor:label.location.anchor, path:'index.html', severity:'low', confidence:'supported', evidence:'The visible label and heading repeat the exact page name.', recommendation:'Remove the duplicate label and retain the heading.'}] : [];",
    "fs.writeFileSync(process.env.SLOPPYAI_REVIEW, JSON.stringify({inputDigest:request.inputDigest, reviewer:{name:'fixture reviewer',kind:'agent'}, assessments:[{domain:'design',score:4,rationale:'Use the same styling and visible main action.',evidence:'Inspected the heading and primary action in the authored fixture.'}], findings}));"
  ].join('\n');
  const fixer = [
    "import assert from 'node:assert/strict';",
    "import fs from 'node:fs';",
    "const request = JSON.parse(fs.readFileSync(process.env.SLOPPYAI_REQUEST, 'utf8'));",
    "assert.ok(fs.readFileSync(request.guidance.repairGuideFile, 'utf8').includes('Repair by problem'));",
    "assert.ok(request.guidance.steps.some(step => step.ruleId === 'D02' && step.reviewerConfirmed && step.method === 'contextual' && step.verification.length));",
    "assert.ok(request.preservation.some(item => item.contains.includes('Choose plan')));",
    "assert.equal(request.guidance.designReview.brief.intent, 'Keep the existing print-like identity');",
    "assert.equal(request.guidance.designReview.referencePolicy.use, 'quality');",
    "assert.equal(request.guidance.designReview.qualityWorkflow.status, 'not_assessed');",
    "fs.writeFileSync('index.html', fs.readFileSync('index.html', 'utf8').replace('<span>Pricing</span>', ''));"
  ].join('\n');
  const f = await fixture(t, { 'index.html': original, 'review.mjs': reviewer, 'fix.mjs': fixer });
  const config = {
    designBrief: { intent: 'Keep the existing print-like identity', preserve: ['The primary action and palette'] },
    preserve: [{ path: 'index.html', contains: ['Choose plan'] }],
    reviewer: { name: 'fixture reviewer', command: [process.execPath, 'review.mjs'] },
    fixer: { name: 'fixture fixer', command: [process.execPath, 'fix.mjs'] }
  };
  const result = await improveLoop(f.target, { config, output: f.output, apply: true, allowExec: true });
  assert.equal(result.summary.repairRounds, 1);
  assert.equal(result.summary.stopReason, 'target_met_assessed_scope');
  assert.equal(result.report.reviewerAssessments[0].score, 4);
  assert.equal(await readFile(path.join(f.target, 'index.html'), 'utf8'), repaired);
});
