import { hash } from '../util.mjs';

export function checkText(file, ctx, suppliedBlocks) {
  const cleaned = file.text.replace(/```[^\n]*\n[\s\S]*?```/g, match => '\n'.repeat((match.match(/\n/g) || []).length));
  const blocks = suppliedBlocks || cleaned.split(/\n\s*\n/).map((value, index) => ({ text: value.trim(), line: 1, anchor: 'paragraph:' + index }));
  ['C01', 'C02', 'C04', 'UX02'].forEach(rule => ctx.check(rule, file));
  const repetitions = new Map();
  for (const block of blocks) {
    if (!block.text || block.text.startsWith('|')) continue;
    const where = { anchor: block.anchor || 'text:' + hash(block.text).slice(0, 12), line: block.line || 1, confidence: 'tentative' };
    const phrase = /\b(?:unlock (?:the power|your potential)|revolutionary|seamless(?:ly)?|game[- ]changing|all[- ]in[- ]one solution)\b/i.exec(block.text);
    if (phrase) ctx.finding('C01', file, { ...where, evidence: `Phrase '${phrase[0]}' may substitute for a concrete explanation. Verify its actual role in the surrounding passage.` });
    const absolute = /\b(?:100% (?:accurate|secure|safe)|guaranteed results|completely secure|perfect results|unlimited (?:everything|generations|storage))\b/i.exec(block.text);
    if (absolute) ctx.finding('C02', file, { ...where, evidence: `Claim '${absolute[0]}' requires supporting evidence, relevant limits and conditions.` });
    if (/\blorem ipsum\b|\b(?:INSERT|YOUR)[_ ](?:COMPANY|HEADLINE|TESTIMONIAL)[_ ]?(?:HERE)?\b|\{\{\s*(?:company|headline|testimonial)\s*\}\}/i.test(block.text)) ctx.finding('UX02', file, { ...where, evidence: 'Visible content contains a likely production placeholder. Confirm whether it is an explicitly labelled example.' });
    const normalized = block.text.replace(/\s+/g, ' ').trim().toLowerCase();
    if (normalized.length >= 100) {
      if (repetitions.has(normalized)) ctx.finding('C04', file, { ...where, evidence: 'A substantial paragraph repeats earlier text exactly after whitespace normalization. Confirm whether repetition is useful or required.' });
      repetitions.set(normalized, true);
    }
  }
}

export function checkCode(file, ctx) {
  ['S22', 'S23', 'S24', 'S25', 'S26', 'E01'].forEach(rule => ctx.check(rule, file));
  const patterns = [
    ['S22', /(?:\.innerHTML\s*=\s*(?!["'])[^;\n]+|dangerouslySetInnerHTML\s*=)/g, 'A raw HTML sink needs input-trust and sanitization review. A sink alone does not demonstrate exploitable XSS.'],
    ['S24', /\bshell\s*=\s*True\b/g, 'Python shell interpretation is enabled. Trace actual input control and execution context.'],
    ['S25', /\b(?:execute|query)\s*\(\s*(?:f["']|`[^`\n]*\$\{)/g, 'A database call appears to interpolate a query string. Verify actual parameter binding and driver semantics.'],
    ['S26', /\brejectUnauthorized\s*:\s*false\b|\bverify\s*=\s*False\b/g, 'Certificate verification appears disabled. Establish whether this is a controlled test or an exposed production path.'],
    ['E01', /\bcatch(?:\s*\([^)]*\))?\s*\{\s*\}/g, 'An empty catch discards an error. Confirm intended recovery and required user/operator feedback.']
  ];
  for (const [ruleId, expression, evidence] of patterns) {
    let occurrence = 0;
    for (const match of file.text.matchAll(expression)) {
      occurrence++;
      ctx.finding(ruleId, file, { anchor: ruleId + ':occurrence:' + occurrence, line: file.text.slice(0, match.index).split('\n').length, evidence, confidence: 'tentative' });
      if (occurrence >= 50) break;
    }
  }
  const secrets = /-----BEGIN (?:[A-Z ]+ )?PRIVATE KEY-----|\b(?:sk-(?:proj-|ant-)?[A-Za-z0-9_-]{20,}|sk_live_[A-Za-z0-9]{16,}|gh[pousr]_[A-Za-z0-9_]{20,}|github_pat_[A-Za-z0-9_]{20,}|AKIA[A-Z0-9]{16})\b/g;
  let occurrence = 0;
  for (const match of file.text.matchAll(secrets)) {
    ctx.finding('S23', file, {
      anchor: 'credential-candidate:' + ++occurrence,
      line: file.text.slice(0, match.index).split('\n').length,
      evidence: 'Secret-shaped material occurs in source. The value is withheld; current validity and deployment exposure are unknown.',
      confidence: 'tentative', severity: 'high', recommendation: 'Inspect this location privately. If the credential is real and exposed, revoke or rotate it and investigate use; do not test it against a live provider.'
    });
    if (occurrence >= 50) break;
  }
}
