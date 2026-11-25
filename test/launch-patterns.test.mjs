import test from 'node:test';
import assert from 'node:assert/strict';
import { audit } from '../src/audit.mjs';
import { fixture } from './helpers.mjs';

test('action decoration and hero blur remain contextual observations', async t => {
  const f = await fixture(t, { 'screen.css': '.app-button:hover{opacity:.6}.cta{background:linear-gradient(blue,purple)}.hero-backdrop{filter:blur(40px)}' });
  const { report } = await audit(f.target);
  for (const id of ['D22', 'D23']) assert.ok(report.findings.some(item => item.ruleId === id), id);
  assert.ok(report.findings.every(item => item.confidence === 'tentative'));
  assert.equal(report.findings.some(item => item.kind === 'requirement'), false);
  assert.equal(report.status, 'needs_review');
});
test('intentional art gradients, loading opacity and image blur are not action warnings', async t => {
  const f = await fixture(t, { 'art.css': '.landscape{background:linear-gradient(blue,purple)}.photo{filter:blur(4px)}.button[disabled]{opacity:.5}.button:hover{opacity:1}' });
  const { report } = await audit(f.target);
  assert.equal(report.findings.filter(item => ['D22', 'D23'].includes(item.ruleId)).length, 0);
});
test('native JSX placeholder-only fields get a contextual persistent-label prompt', async t => {
  const f = await fixture(t, { 'form.tsx': 'export default () => <input aria-label="Email" placeholder="you@example.com" />;' });
  const { report } = await audit(f.target);
  assert.ok(report.findings.some(item => item.ruleId === 'UX14' && item.confidence === 'tentative'));
});
test('associated labels and wrapping labels are preserved', async t => {
  const f = await fixture(t, { 'form.tsx': 'export default () => <><label htmlFor="email">Email</label><input id="email" placeholder="you@example.com" /><label>Password<input type="password" placeholder="Password" /></label></>;' });
  const { report } = await audit(f.target);
  assert.equal(report.findings.filter(item => item.ruleId === 'UX14').length, 0);
});
test('component labels and spread props are marked unassessed', async t => {
  const f = await fixture(t, { 'form.tsx': 'export default () => <><Label htmlFor="a">Email</Label><input id="a" placeholder="Email" /><input {...props} placeholder="Name" /></>;' });
  const { report } = await audit(f.target);
  assert.equal(report.findings.filter(item => item.ruleId === 'UX14').length, 0);
  assert.equal(report.checks.find(item => item.ruleId === 'UX14').status, 'not_assessed');
});
test('disabled token verification is not mistaken for a proven authorization bypass', async t => {
  const f = await fixture(t, { 'identity.py': 'claims = jwt.decode(token, options={"verify_signature": False})\n' });
  const { report } = await audit(f.target);
  const finding = report.findings.find(item => item.ruleId === 'S37');
  assert.equal(finding.confidence, 'tentative');
  assert.equal(report.checks.find(item => item.ruleId === 'S37').status, 'needs_review');
});
test('verified decoding and fixture exclusions avoid spurious auth findings', async t => {
  const f = await fixture(t, { 'identity.py': 'claims = jwt.decode(token, key, algorithms=["RS256"])\n', 'tests/identity.py': 'claims = jwt.decode(token, options={"verify_signature": False})' });
  const { report } = await audit(f.target);
  assert.equal(report.findings.filter(item => item.ruleId === 'S37').length, 0);
});

test('false hidden props do not suppress visible-field review and boolean aria-hidden stays excluded', async t => {
  const f = await fixture(t, { 'form.tsx': 'export default () => <><input hidden={false} inert={false} placeholder="Visible" /><div aria-hidden={true}><input placeholder="Hidden" /></div></>;' });
  const { report } = await audit(f.target);
  assert.equal(report.findings.filter(item => item.ruleId === 'UX14').length, 1);
});
