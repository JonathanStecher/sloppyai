import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { improveLoop } from '../src/loop.mjs';
import { fixture } from './helpers.mjs';

async function refinementCase(t, regress) {
  const original = '<!doctype html><html lang="en"><head><title>Instrument rentals</title><link rel="stylesheet" href="style.css"></head><body><header><span>Instruments</span><h1>Instruments</h1></header><main><section class="hero" data-identity="coral-stage"><p>Rent a compact keyboard in Hamburg.</p></section><button type="button">Play preview</button></main></body></html>';
  const style = '.hero{background:#f5a780;padding:40px}button{border-radius:4px}';
  const designBrief = {
    changeScope: 'refine', preferredDirection: 'The warm image-led landing page',
    requestedChanges: ['Remove the repeated heading label', 'Round the existing button'],
    preserve: ['Coral product stage', 'Landing-page composition', 'Rental calculations'],
    avoid: ['Replacing the introduction with a neutral catalogue']
  };
  const contractChecks = [
    "const contract=request.guidance.designReview.changeContract;",
    "assert.equal(contract.scope,'refine');assert.equal(contract.explicit,true);",
    "assert.equal(contract.preferredDirection,'The warm image-led landing page');",
    "assert.deepEqual(contract.requestedChanges,['Remove the repeated heading label','Round the existing button']);",
    "assert.ok(contract.preserve.includes('Coral product stage'));",
    "assert.equal(contract.status,'not_assessed');assert.deepEqual(contract.evidence,[]);"
  ].join('\n');
  const preamble = "import fs from 'node:fs';import assert from 'node:assert/strict';const request=JSON.parse(fs.readFileSync(process.env.SLOPPYAI_REQUEST,'utf8'));";
  const reviewer = preamble + '\n' + contractChecks + '\n' + [
    "const report=JSON.parse(fs.readFileSync(request.reportFile,'utf8'));",
    "const hidden=fs.readFileSync('style.css','utf8').includes('.hero{display:none;');",
    "const duplicate=report.findings.find(item=>item.ruleId==='D02');",
    "const findings=duplicate?[{ruleId:'D02',anchor:duplicate.location.anchor,path:'index.html',severity:'low',confidence:'supported',evidence:'The fixture header repeats the same heading label.',recommendation:'Remove the repeated label while keeping the introduction.'}]:[];",
    "if(hidden)findings.push({ruleId:'D31',anchor:'preferred-hero',path:'style.css',line:1,severity:'medium',confidence:'supported',evidence:'Source fixture only: the protected hero is hidden with display:none. No rendered taste judgment is claimed.',recommendation:'Restore the preferred product introduction and retain the requested local refinements.'});",
    "fs.writeFileSync(process.env.SLOPPYAI_REVIEW,JSON.stringify({inputDigest:request.inputDigest,reviewer:{name:'source-fixture reviewer',kind:'agent'},assessments:[{domain:'design',score:hidden?2:4,rationale:'This fixture tests preservation of an explicit direction separately from rental calculations.',evidence:hidden?'Source fixture: protected introduction is hidden; no pixels inspected.':'Source fixture: introduction and product stage remain; no pixels inspected.'}],findings}));"
  ].join('\n');
  const fixer = preamble + '\n' + contractChecks + '\n' + [
    "assert.ok(request.preservation.some(item=>item.contains.includes('coral-stage')));",
    "fs.writeFileSync('index.html',fs.readFileSync('index.html','utf8').replace('<span>Instruments</span>',''));",
    "let css=fs.readFileSync('style.css','utf8').replace('border-radius:4px','border-radius:12px');",
    regress ? "css=css.replace('.hero{','.hero{display:none;');" : '',
    "fs.writeFileSync('style.css',css);"
  ].join('\n');
  const f = await fixture(t, {
    'index.html': original, 'style.css': style,
    'rental.cjs': 'module.exports=days=>({3:24,7:45,14:75})[days];',
    'review.mjs': reviewer, 'fix.mjs': fixer
  });
  const config = {
    designBrief,
    preserve: [{ path: 'index.html', contains: ['coral-stage', 'Play preview'] }],
    checks: [{ name: 'rental rates', command: [process.execPath, '-e', "const assert=require('node:assert/strict');const fee=require('./rental.cjs');assert.equal(fee(3),24);assert.equal(fee(7),45);assert.equal(fee(14),75);"] }],
    reviewer: { name: 'source-fixture reviewer', command: [process.execPath, 'review.mjs'] },
    fixer: { name: 'local refinement fixture', command: [process.execPath, 'fix.mjs'] }
  };
  const result = await improveLoop(f.target, { config, output: f.output, apply: true, allowExec: true });
  return { f, result, original, style };
}

test('reviewer and fixer receive the same focused change contract and preserve the preferred introduction', async t => {
  const { f, result, original, style } = await refinementCase(t, false);
  assert.equal(result.summary.stopReason, 'target_met_assessed_scope');
  assert.equal(result.summary.repairRounds, 1);
  assert.ok(result.report.checksExecution.every(check => check.status === 'passed'));
  assert.equal(await readFile(path.join(f.target, 'index.html'), 'utf8'), original.replace('<span>Instruments</span>', ''));
  assert.equal(await readFile(path.join(f.target, 'style.css'), 'utf8'), style.replace('border-radius:4px', 'border-radius:12px'));
  assert.equal(result.report.comparison.regression, false);
  assert.equal(result.summary.fullArtifactVerified, false);
});

test('a reported identity regression stops the loop even when rental checks and literal preservation anchors pass', async t => {
  const { f, result } = await refinementCase(t, true);
  assert.equal(result.summary.stopReason, 'regression');
  assert.equal(result.summary.repairRounds, 1);
  assert.ok(result.report.checksExecution.every(check => check.status === 'passed'));
  assert.equal(result.report.findings.some(finding => finding.ruleId === 'E03'), false);
  assert.ok(result.report.findings.some(finding => finding.ruleId === 'D31' && finding.origin === 'review'));
  assert.equal(result.report.comparison.reviewerChanges.find(change => change.domain === 'design').delta, -2);
  assert.equal(result.report.comparison.regression, true);
  assert.ok((await readFile(path.join(f.target, 'style.css'), 'utf8')).includes('.hero{display:none;'));
  assert.equal(result.summary.fullArtifactVerified, false);
});
