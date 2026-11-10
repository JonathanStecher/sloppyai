import { parse, parseFragment } from 'parse5';
import { parse as parseCss } from 'postcss';
import { short } from '../util.mjs';

const attr = (node, name) => node.attrs?.find(item => item.name === name)?.value;
const has = (node, name) => node.attrs?.some(item => item.name === name);
const descendants = (node, limit = 10001) => {
  const result = [], pending = [node];
  while (pending.length && result.length < limit) { const next = pending.pop(); result.push(next); if (next.childNodes) for (let i = next.childNodes.length - 1; i >= 0; i--) pending.push(next.childNodes[i]); }
  return result;
};
const text = node => {
  const pending = [node], result = [];
  let length = 0;
  while (pending.length && length < 8000) {
    const next = pending.pop();
    if (['script', 'style', 'template'].includes(next.tagName) || has(next, 'hidden') || attr(next, 'aria-hidden') === 'true') continue;
    if (next.nodeName === '#text') { result.push(next.value); length += next.value.length; }
    else if (next.childNodes) for (let i = next.childNodes.length - 1; i >= 0; i--) pending.push(next.childNodes[i]);
  }
  return result.join(' ');
};
function hidden(node) {
  let current = node;
  while (current) { if (has(current, 'hidden') || has(current, 'inert') || attr(current, 'aria-hidden') === 'true') return true; current = current.parentNode; }
  return false;
}
function inForm(node) { let current = node.parentNode; while (current) { if (current.tagName === 'form') return true; current = current.parentNode; } return false; }
const line = node => node.sourceCodeLocation?.startLine || 1;

function anchor(node) {
  const name = attr(node, 'id');
  if (name) return `${node.tagName}#${short(name, 120)}`;
  const parts = [];
  let current = node;
  while (current?.tagName) {
    const siblings = current.parentNode?.childNodes?.filter(item => item.tagName === current.tagName) || [];
    parts.unshift(`${current.tagName}:${siblings.indexOf(current) + 1}`);
    current = current.parentNode;
  }
  return parts.join('/');
}

function style(node) {
  const properties = new Map();
  try { parseCss('x{' + (attr(node, 'style') || '') + '}').first?.nodes?.forEach(decl => { if (decl.type === 'decl') properties.set(decl.prop.toLowerCase(), decl.value.trim()); }); }
  catch (_error) { /* Invalid or dynamic inline CSS is not a computed-style observation. */ }
  return properties;
}

function rgb(value) {
  if (!value) return null;
  const named = { black: '#000000', white: '#ffffff', red: '#ff0000', blue: '#0000ff', green: '#008000', gray: '#808080', grey: '#808080' };
  value = named[value.toLowerCase()] || value;
  const hex = /^#([a-f\d]{3}|[a-f\d]{6})$/i.exec(value);
  if (hex) { const h = hex[1].length === 3 ? [...hex[1]].map(c => c + c).join('') : hex[1]; return [0, 2, 4].map(i => parseInt(h.slice(i, i + 2), 16)); }
  const match = /^rgb\(\s*(\d{1,3})\s*[, ]\s*(\d{1,3})\s*[, ]\s*(\d{1,3})\s*\)$/i.exec(value);
  if (match && match.slice(1).every(c => +c <= 255)) return match.slice(1).map(Number);
  return null;
}

function luminance(colour) {
  const values = colour.map(c => { const v = c / 255; return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; });
  return values[0] * 0.2126 + values[1] * 0.7152 + values[2] * 0.0722;
}

export function contrastRatio(foreground, background) {
  const fg = rgb(foreground), bg = rgb(background);
  if (!fg || !bg) return null;
  const a = luminance(fg), b = luminance(bg);
  return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
}

export function checkHtml(file, ctx) {
  const document = ctx.config.htmlMode === 'document' || (ctx.config.htmlMode === 'auto' && /<!doctype\s+html|<html(?:\s|>)/i.test(file.text));
  const tree = (document ? parse : parseFragment)(file.text, { sourceCodeLocationInfo: true });
  const all = descendants(tree);
  if (all.length >= 10001) { ctx.capped = true; ctx.limitations.push('An HTML tree exceeded the 10000-node static analysis bound. Its element checks were not run.'); return { visible: [], nodes: [] }; }
  const nodes = all.filter(node => node.tagName);
  const byId = new Map();
  for (const node of nodes) { const key = attr(node, 'id'); if (key && !byId.has(key)) byId.set(key, node); }
  const labels = nodes.filter(node => node.tagName === 'label');
  function accessibleName(node, seen = new Set()) {
    if (!node || seen.has(node)) return '';
    seen.add(node);
    const explicit = attr(node, 'aria-label');
    if (explicit?.trim()) return explicit.trim();
    const references = attr(node, 'aria-labelledby');
    if (references) return references.split(/\s+/).map(key => accessibleName(byId.get(key), seen)).join(' ').trim();
    const identifier = attr(node, 'id');
    const external = identifier ? labels.filter(label => attr(label, 'for') === identifier).map(text).join(' ').trim() : '';
    if (external) return external;
    let parent = node.parentNode;
    while (parent) { if (parent.tagName === 'label') return text(parent).trim(); parent = parent.parentNode; }
    if (node.tagName === 'img') return attr(node, 'alt') || '';
    if (node.tagName === 'input' && ['submit', 'reset', 'button'].includes(attr(node, 'type'))) return attr(node, 'value') || (attr(node, 'type') === 'submit' ? 'Submit' : attr(node, 'type') === 'reset' ? 'Reset' : '');
    if (node.tagName === 'input' && attr(node, 'type') === 'image') return attr(node, 'alt') || '';
    return [text(node), ...descendants(node).filter(child => child.tagName === 'img' && !hidden(child)).map(child => attr(child, 'alt') || '')].join(' ').trim() || attr(node, 'title') || '';
  }
  const applicability = {
    A02: nodes.some(n => n.tagName === 'img'), A03: nodes.some(n => ['input', 'select', 'textarea'].includes(n.tagName)),
    A04: nodes.some(n => n.tagName === 'button'), A05: nodes.some(n => n.tagName === 'meta' && attr(n, 'name') === 'viewport'),
    A06: nodes.some(n => /^h[1-6]$/.test(n.tagName)), A07: nodes.some(n => { const s = style(n); return contrastRatio(s.get('color'), s.get('background-color')) !== null; }),
    A09: nodes.some(n => n.tagName === 'a' && has(n, 'href')), A10: nodes.some(n => has(n, 'id')),
    UX01: nodes.some(n => n.tagName === 'a'), UX03: nodes.some(n => n.tagName === 'form'),
    C03: nodes.some(n => n.tagName === 'a'), F01: nodes.some(n => n.tagName === 'img'),
    S21: nodes.some(n => n.tagName === 'a' && attr(n, 'target')?.toLowerCase() === '_blank')
  };
  for (const [rule, applicable] of Object.entries(applicability)) ctx.check(rule, file, applicable, 'No applicable static element in this file');
  ctx.check('A01', file, document, 'HTML fragment has no document-level language contract');
  const html = nodes.find(node => node.tagName === 'html');
  if (document && !attr(html || {}, 'lang')?.trim()) {
    const location = html?.sourceCodeLocation?.startTag;
    const langLocation = html?.sourceCodeLocation?.attrs?.lang;
    const patch = location && ctx.config.language ? langLocation ? { start: langLocation.startOffset, end: langLocation.endOffset, replacement: `lang="${ctx.config.language}"` } : { start: location.endOffset - 1, end: location.endOffset - 1, replacement: ` lang="${ctx.config.language}"` } : null;
    ctx.finding('A01', file, { anchor: 'html-language', line: line(html || {}), evidence: 'The authored HTML document has no non-empty lang attribute.', patch, ...(ctx.config.language ? {} : { recommendation: 'Specify the actual language in the document or set language in Craftcheck configuration to enable a bounded fix.' }) });
  }
  let lastHeading = 0;
  const seenIds = new Set();
  const duplicateCounts = new Map();
  for (const node of nodes) {
    const where = { anchor: anchor(node), line: line(node) };
    const identifier = attr(node, 'id');
    if (identifier) {
      const count = (duplicateCounts.get(identifier) || 0) + 1;
      duplicateCounts.set(identifier, count);
      if (seenIds.has(identifier)) ctx.finding('A10', file, { ...where, anchor: where.anchor + ':duplicate:' + count, evidence: `Duplicate id ${short(identifier)} occurs in this document.` });
      seenIds.add(identifier);
    }
    if (hidden(node)) continue;
    if (node.tagName === 'img' && !has(node, 'alt') && !['presentation', 'none'].includes(attr(node, 'role')) && attr(node, 'aria-hidden') !== 'true') ctx.finding('A02', file, { ...where, evidence: 'Image has neither alt nor an explicit decorative role.', recommendation: 'Provide an appropriate alternative. Use alt="" only when the image is genuinely decorative.' });
    if (['input', 'textarea', 'select'].includes(node.tagName) && attr(node, 'type') !== 'hidden' && !accessibleName(node)) ctx.finding('A03', file, { ...where, evidence: `${node.tagName} has no static accessible name. Placeholder text is not a persistent label.` });
    if (node.tagName === 'button' && !accessibleName(node)) ctx.finding('A04', file, { ...where, evidence: 'Button has no static text or accessible name. Dynamic rendering and external naming still require runtime verification.' });
    if (node.tagName === 'a' && has(node, 'href') && !accessibleName(node)) ctx.finding('A09', file, { ...where, evidence: 'Link has no static text or accessible name.' });
    if (node.tagName === 'meta' && attr(node, 'name')?.toLowerCase() === 'viewport') {
      const content = attr(node, 'content') || '';
      const restrictive = /(?:^|,)\s*user-scalable\s*=\s*(?:no|0)\b/i.test(content) || /(?:^|,)\s*maximum-scale\s*=\s*(?:0(?:\.\d+)?|1(?:\.0+)?)\s*(?:,|$)/i.test(content);
      if (restrictive) {
        const valueLocation = node.sourceCodeLocation?.attrs?.content;
        const cleaned = content.split(',').map(x => x.trim()).filter(x => !/^user-scalable\s*=\s*(no|0)$/i.test(x) && !/^maximum-scale\s*=\s*(0(?:\.\d+)?|1(?:\.0+)?)$/i.test(x)).join(', ');
        ctx.finding('A05', file, { ...where, evidence: 'Viewport metadata explicitly restricts zoom.', patch: valueLocation ? { start: valueLocation.startOffset, end: valueLocation.endOffset, replacement: 'content="' + cleaned.replace(/&/g, '&amp;').replace(/"/g, '&quot;') + '"' } : null });
      }
    }
    if (/^h[1-6]$/.test(node.tagName)) {
      const level = Number(node.tagName[1]);
      if (lastHeading && level > lastHeading + 1) ctx.finding('A06', file, { ...where, confidence: 'tentative', evidence: `Static heading order jumps from h${lastHeading} to h${level}; check component and page context.` });
      lastHeading = level;
    }
    if (node.tagName === 'a') {
      const href = attr(node, 'href');
      if (href !== undefined && (!href.trim() || href.trim() === '#')) ctx.finding('UX01', file, { ...where, confidence: 'tentative', evidence: 'Link points to an empty or placeholder fragment. It may instead be an intentional script-controlled interaction.' });
      if (has(node, 'href') && ['get started', 'learn more', 'click here', 'continue'].includes(accessibleName(node).toLowerCase().replace(/[.!]$/, ''))) ctx.finding('C03', file, { ...where, confidence: 'tentative', evidence: `Action label '${short(accessibleName(node), 60)}' may need surrounding context to explain its destination.` });
      if (attr(node, 'target')?.toLowerCase() === '_blank') {
        const rel = (attr(node, 'rel') || '').toLowerCase().split(/\s+/);
        if (!rel.includes('noopener') && !rel.includes('noreferrer')) {
          const relLocation = node.sourceCodeLocation?.attrs?.rel;
          const tagLocation = node.sourceCodeLocation?.startTag;
          const replacement = 'rel="' + [...new Set([...rel.filter(Boolean).filter(x => x !== 'opener'), 'noopener'])].join(' ') + '"';
          const patch = relLocation ? { start: relLocation.startOffset, end: relLocation.endOffset, replacement } : tagLocation ? { start: tagLocation.endOffset - 1, end: tagLocation.endOffset - 1, replacement: ' ' + replacement } : null;
          ctx.finding('S21', file, { ...where, confidence: rel.includes('opener') ? 'tentative' : 'supported', evidence: 'New-tab link has no explicit noopener/noreferrer. Modern browsers often imply noopener. An explicit opener relationship requires contextual review.', severity: 'low', patch: rel.includes('opener') ? null : patch });
        }
      }
    }
    if (node.tagName === 'button' && !has(node, 'type') && inForm(node)) ctx.finding('UX03', file, { ...where, confidence: 'tentative', evidence: 'A button inside a form has implicit submit behaviour; verify that this is intended.' });
    if (node.tagName === 'img' && !(has(node, 'width') && has(node, 'height')) && !style(node).has('aspect-ratio')) ctx.finding('F01', file, { ...where, confidence: 'tentative', evidence: 'No static width/height pair or inline aspect-ratio reserves image space; external CSS may already reserve it.' });
    if (has(node, 'style') && text(node).trim()) {
      const s = style(node);
      const ratio = contrastRatio(s.get('color'), s.get('background-color'));
      if (ratio !== null && ratio < 4.5) {
        const size = /^(\d+(?:\.\d+)?)px$/.exec(s.get('font-size') || '');
        const weight = s.get('font-weight');
        const large = size && (+size[1] >= 24 || (+size[1] >= 18.6667 && (weight === 'bold' || Number(weight) >= 700)));
        if (ratio < (large ? 3 : 4.5)) ctx.finding('A07', file, { ...where, confidence: 'tentative', evidence: `Literal inline colours have contrast ${ratio.toFixed(2)}:1. Cascade, backgrounds, text-size and incidental-content exceptions need rendered verification.`, severity: 'high' });
      }
    }
  }
  const visible = nodes.filter(node => ['p', 'h1', 'h2', 'h3', 'li', 'button', 'a'].includes(node.tagName)).map(node => ({ text: text(node).trim(), line: line(node), anchor: anchor(node) }));
  return { visible, nodes };
}
