import { parse } from '@babel/parser';
import { checkSentenceRhythm } from './text.mjs';

const copyTag = /^(?:p|h[1-6])$/;
const excludedTags = new Set(['blockquote', 'button', 'code', 'li', 'pre', 'script', 'style', 'template']);
const inlineTags = new Set(['b', 'br', 'em', 'i', 'mark', 'small', 'span', 'strong', 'u']);
const liveRoles = new Set(['alert', 'log', 'status', 'timer']);

function tagName(element) {
  const name = element.openingElement.name;
  return name.type === 'JSXIdentifier' ? name.name : '';
}

function skipCopy(element) {
  if (excludedTags.has(tagName(element))) return true;
  return element.openingElement.attributes.some(attribute => {
    if (attribute.type !== 'JSXAttribute') return false;
    const name = attribute.name.name;
    const value = attribute.value?.type === 'JSXExpressionContainer' ? attribute.value.expression.value : attribute.value?.value;
    if (name === 'hidden' || name === 'inert') return value !== false;
    if (name === 'aria-hidden') return value === true || value === 'true';
    if (name === 'role') return liveRoles.has(value);
    return name === 'aria-live' && (value === 'polite' || value === 'assertive');
  });
}

function literalText(children) {
  const text = [];
  for (const child of children) {
    if (child.type === 'JSXText') text.push(child.value);
    else if (child.type === 'JSXExpressionContainer' && child.expression.type === 'StringLiteral') text.push(child.expression.value);
    else if (child.type === 'JSXExpressionContainer' && child.expression.type === 'JSXEmptyExpression') continue;
    else if (child.type === 'JSXElement' && skipCopy(child)) continue;
    else if (child.type === 'JSXFragment' || (child.type === 'JSXElement' && inlineTags.has(tagName(child)))) {
      const inner = literalText(child.children);
      if (inner === null) return null;
      text.push(inner);
    } else return null;
  }
  return text.join(' ').trim();
}

export function checkJsxCopy(file, ctx, extension) {
  if (!ctx.enabled.has('copy') || !/<(?:p|h[1-6])[\s>]/.test(file.text)) return;
  let program;
  try {
    program = parse(file.text, { sourceType: 'unambiguous', plugins: extension === '.tsx' ? ['jsx', 'typescript'] : ['jsx'] }).program;
  } catch (_error) {
    ctx.check('C08', file, false, 'JSX syntax could not be parsed for literal copy');
    return;
  }
  const blocks = [];
  const pending = [program];
  while (pending.length) {
    const node = pending.pop();
    if (node.type === 'JSXElement') {
      if (skipCopy(node)) continue;
      const tag = tagName(node);
      if (copyTag.test(tag)) blocks.push({
        text: literalText(node.children), tagName: tag, line: node.loc.start.line, offset: node.start
      });
    }
    for (const value of Object.values(node)) {
      if (Array.isArray(value)) for (const item of value) { if (item?.type) pending.push(item); }
      else if (value?.type) pending.push(value);
    }
  }
  blocks.sort((a, b) => a.offset - b.offset);
  checkSentenceRhythm(file, ctx, blocks.map((block, index) => ({ ...block, anchor: 'jsx:' + index })));
}
