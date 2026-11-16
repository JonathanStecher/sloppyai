import { hash } from '../util.mjs';

const sentenceSegmenter = new Intl.Segmenter('en', { granularity: 'sentence' });
const shortPhrase = /^\p{Lu}[\p{L}\p{M}\p{Pd}'’ ]+$/u;
const instructionOrStatus = /^(?:click|tap|press|select|type|sign in|log in|try again|klicke|drücke|wähle|öffne|versuche es erneut)\b|\b(?:failed|timed out|not found|fehlgeschlagen|nicht gefunden)\b/i;
const abbreviation = /(?:^| )(?:Mr|Mrs|Ms|Dr|Prof|Sr|Jr|St|etc|vs|No)\.$/;

function paragraphs(text) {
  let line = 1;
  return text.split(/(\n(?:[\t ]*\n)+)/).flatMap((part, index) => {
    const start = line;
    line += part.split('\n').length - 1;
    if (index % 2 !== 0 || !part.trim()) return [];
    const leadingLines = part.match(/^\s*/)[0].split('\n').length - 1;
    return [{ text: part.trim(), line: start + leadingLines, anchor: 'paragraph:' + index / 2 }];
  });
}

export function checkSentenceRhythm(file, ctx, blocks) {
  if (!ctx.enabled.has('copy')) return;
  const copy = blocks.filter(block => block.text && !block.skipRhythm
    && (!block.tagName || /^(?:h[1-6]|p)$/.test(block.tagName))
    && !/^\s*(?:[>|]|[*+-]\s|\d+[.)]\s)/m.test(block.text));
  if (!ctx.check('C08', file, copy.length > 0, 'No applicable heading or prose block')) return;

  for (const block of copy) {
    const heading = /^h[1-6]$/.test(block.tagName ?? '') || /^#{1,6}\s/.test(block.text);
    const content = block.text.replace(/^#{1,6}[\t ]+/, '').replace(/\s+/g, ' ').trim();
    if (!/\. \p{Lu}/u.test(content)) continue;
    let consecutive = 0;
    let longest = 0;
    let sentences = 0;
    for (const { segment, index } of sentenceSegmenter.segment(content)) {
      const sentence = segment.trim();
      const hasPeriod = sentence.endsWith('.');
      const finalHeadlinePhrase = heading && index + segment.length === content.length;
      const phrase = hasPeriod ? sentence.slice(0, -1) : sentence;
      sentences++;
      if ((hasPeriod || finalHeadlinePhrase) && shortPhrase.test(phrase) && phrase.split(' ').length <= 6
          && !instructionOrStatus.test(sentence) && !abbreviation.test(sentence)) {
        longest = Math.max(longest, ++consecutive);
      } else {
        consecutive = 0;
      }
    }
    if (longest >= (heading || sentences === 2 ? 2 : 3)) {
      ctx.finding('C08', file, {
        anchor: block.anchor,
        line: block.line,
        evidence: `This copy uses ${longest} consecutive short phrases separated by full stops, which can make it read as a series of clipped beats.`,
        recommendation: 'Read the passage in context and join related ideas so they flow in one natural headline or sentence.'
      });
    }
  }
}

export function checkText(file, ctx, suppliedBlocks) {
  const blocks = suppliedBlocks ?? paragraphs(file.text.replace(/\r\n/g, '\n')
    .replace(/(```|~~~)[^\n]*\n[\s\S]*?\1/g, match => '\n'.repeat((match.match(/\n/g) || []).length)));
  checkSentenceRhythm(file, ctx, blocks);
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
