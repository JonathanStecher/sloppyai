import { parse } from 'postcss';

function duplicateDeclaration(cssText, declaration) {
  const previous = declaration.prev();
  if (declaration.parent?.type !== 'rule' || previous?.type !== 'decl') return null;
  const source = declaration.source;
  const start = source.start.offset;
  const end = source.end.offset;
  const currentText = cssText.slice(start, end).replace(/;$/, '');
  const previousText = cssText.slice(previous.source.start.offset, previous.source.end.offset).replace(/;$/, '');
  if (!currentText || currentText !== previousText || currentText.includes('/*')) return null;
  const whitespace = declaration.raws.before || '';
  const removalStart = start - whitespace.length;
  return { start: /^\s*$/.test(whitespace) && cssText.slice(removalStart, start) === whitespace ? removalStart : start, end };
}

export function checkCss(file, ctx, cssText = file.text, offset = 0, namespace = 'stylesheet') {
  const lineOffset = file.text.slice(0, offset).split('\n').length - 1;
  let root;
  try { root = parse(cssText); }
  catch (_error) {
    ['F02', 'F03', 'F04', 'A08', 'E12'].forEach(rule => ctx.check(rule, file, false, 'CSS parser could not assess this stylesheet'));
    return;
  }
  ['F02', 'F03', 'F04', 'A08', 'E12'].forEach(rule => ctx.check(rule, file));
  let occurrence = 0;
  root.walkDecls(decl => {
    const prop = decl.prop.toLowerCase();
    const where = { anchor: `css:${namespace}:${decl.parent?.selector || decl.parent?.name || 'rule'}:${prop}:${++occurrence}`, line: lineOffset + (decl.source?.start?.line || 1), confidence: 'tentative' };
    const duplicate = ctx.enabled.has('engineering') ? duplicateDeclaration(cssText, decl) : null;
    if (duplicate) ctx.finding('E12', file, {
      ...where, anchor: `duplicate-css:${namespace}:${occurrence}`,
      confidence: 'supported', evidence: 'Two adjacent declarations have the same authored property, value and priority.',
      patch: { start: offset + duplicate.start, end: offset + duplicate.end, replacement: '' }
    });
    if ((prop === 'transition' && /(?:^|,)\s*all\b/.test(decl.value)) || (prop === 'transition-property' && /\ball\b/.test(decl.value))) ctx.finding('F03', file, { ...where, evidence: 'CSS transitions all properties. Verify whether unintended layout or state changes can animate.' });
    if (prop === 'outline' && /^(?:none|0(?:px)?)\b/.test(decl.value) && /:focus\b/.test(decl.parent?.selector || '')) ctx.finding('A08', file, { ...where, evidence: 'A focus selector removes the outline. The full cascade and actual keyboard focus must be checked for a replacement.' });
    if (['width', 'height', 'top', 'left', 'right', 'bottom', 'margin', 'padding'].includes(prop)) {
      let parent = decl.parent;
      while (parent && parent.type !== 'atrule') parent = parent.parent;
      if (parent && /keyframes$/i.test(parent.name)) ctx.finding('F04', file, { ...where, evidence: 'Keyframes animate a layout-affecting property. Measure the actual cost and preserve intentional behaviour.' });
    }
  });
  root.walkAtRules('font-face', rule => {
    if (!rule.nodes?.some(node => node.type === 'decl' && node.prop.toLowerCase() === 'font-display')) ctx.finding('F02', file, { anchor: 'font-face:' + namespace + ':' + rule.source?.start?.line, line: lineOffset + (rule.source?.start?.line || 1), confidence: 'tentative', evidence: 'An authored font-face has no font-display declaration. Evaluate the font and real loading strategy before changing it.' });
  });
}
