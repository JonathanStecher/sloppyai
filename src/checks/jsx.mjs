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

function attributeValue(attribute) {
  return attribute.value?.type === 'JSXExpressionContainer' ? attribute.value.expression.value : attribute.value?.value;
}

function hidesContent(attribute) {
  if (attribute.type !== 'JSXAttribute') return false;
  const name = attribute.name.name;
  const value = attributeValue(attribute);
  if (name === 'hidden' || name === 'inert') return value !== false;
  return name === 'aria-hidden' && (value === true || value === 'true');
}

function skipCopy(element) {
  if (excludedTags.has(tagName(element))) return true;
  return element.openingElement.attributes.some(attribute => {
    if (hidesContent(attribute)) return true;
    if (attribute.type !== 'JSXAttribute') return false;
    const name = attribute.name.name;
    const value = attributeValue(attribute);
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

function checkNativeImage(element, file, ctx, index) {
  const attributes = element.openingElement.attributes;
  if (attributes.some(attribute => attribute.type === 'JSXSpreadAttribute')) {
    ctx.check('A02', file, false, 'Spread props can supply or override JSX image alternatives');
    return;
  }
  ctx.check('A02', file);
  const hasAlternative = attributes.some(attribute => {
    const name = attribute.name.name;
    if (name === 'alt') return attribute.value !== null;
    return name === 'role' && ['none', 'presentation'].includes(attributeValue(attribute));
  });
  if (!hasAlternative) ctx.finding('A02', file, {
    anchor: 'jsx-image:' + index, line: element.loc.start.line, confidence: 'tentative',
    evidence: 'Native JSX image has no explicit alt value or decorative role.',
    recommendation: 'Add a meaningful alt value. Use alt="" for a decorative image with equivalent nearby content. Verify the rendered image and its context.'
  });
}

export function checkJsx(file, ctx, extension) {
  const reviewCopy = ctx.enabled.has('copy') && /<(?:p|h[1-6])[\s>]/.test(file.text);
  const reviewImages = ctx.enabled.has('accessibility') && /<img(?=[\s/>])/.test(file.text);
  if (!reviewCopy && !reviewImages) return;
  let program;
  try {
    program = parse(file.text, { sourceType: 'unambiguous', plugins: extension === '.tsx' ? ['jsx', 'typescript'] : ['jsx'] }).program;
  } catch (_error) {
    if (reviewCopy) ctx.check('C08', file, false, 'JSX syntax could not be parsed for literal copy');
    if (reviewImages) ctx.check('A02', file, false, 'JSX syntax could not be parsed for native images');
    return;
  }
  const blocks = [];
  const images = [];
  const pending = [{ node: program, copy: reviewCopy }];
  while (pending.length) {
    const entry = pending.pop();
    const node = entry.node;
    let copy = entry.copy;
    if (node.type === 'JSXElement') {
      if (node.openingElement.attributes.some(hidesContent)) continue;
      if (copy) copy = !skipCopy(node);
      const tag = tagName(node);
      if (reviewImages && tag === 'img') images.push(node);
      if (copy && copyTag.test(tag)) blocks.push({
        text: literalText(node.children), tagName: tag, line: node.loc.start.line, offset: node.start
      });
    }
    if (!copy && !reviewImages) continue;
    for (const value of Object.values(node)) {
      if (Array.isArray(value)) {
        for (const item of value) if (item?.type) pending.push({ node: item, copy });
      } else if (value?.type) pending.push({ node: value, copy });
    }
  }
  blocks.sort((a, b) => a.offset - b.offset);
  if (reviewCopy) checkSentenceRhythm(file, ctx, blocks.map((block, index) => ({ ...block, anchor: 'jsx:' + index })));
  images.sort((a, b) => a.start - b.start);
  for (const [index, element] of images.entries()) checkNativeImage(element, file, ctx, index);
}
