import { checkVisibleJsxFields } from './visible-fields.mjs';
import { parse } from '@babel/parser';
import { checkHeadingLabel, checkText, headingGroupTags, headingTag, precedingLabelTags } from './text.mjs';

const copyTag = /^(?:p|h[1-6])$/;
const excludedTags = new Set(['blockquote', 'button', 'code', 'li', 'pre', 'script', 'style', 'template']);
const inlineTags = new Set(['b', 'br', 'em', 'i', 'mark', 'small', 'span', 'strong', 'u']);
const liveRoles = new Set(['alert', 'log', 'status', 'timer']);

function tagName(element) {
  const name = element.openingElement.name;
  return name.type === 'JSXIdentifier' ? name.name : '';
}

function attributeValue(attribute) {
  return attribute?.value?.type === 'JSXExpressionContainer' ? attribute.value.expression.value : attribute?.value?.value;
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

function checkNativeLink(element, file, ctx, index) {
  const attributes = element.openingElement.attributes;
  if (attributes.some(attribute => attribute.type === 'JSXSpreadAttribute') ||
      new Set(attributes.map(attribute => attribute.name.name)).size !== attributes.length) {
    ctx.check('S21', file, false, 'Spread or duplicate props can override the JSX link policy');
    ctx.check('UX01', file, false, 'Spread or duplicate props can override the JSX link destination');
    return;
  }
  const attributesByName = new Map(attributes.map(attribute => [attribute.name.name, attribute]));
  const href = attributesByName.get('href');
  const destination = attributeValue(href);
  const where = { anchor: 'jsx-link:' + index, line: element.loc.start.line, confidence: 'tentative' };
  if (typeof destination === 'string' && ctx.check('UX01', file) && ['', '#'].includes(destination.trim())) {
    ctx.finding('UX01', file, { ...where, evidence: 'Native JSX link has an empty or placeholder destination. Check its interaction and route in context.' });
  }
  const target = attributeValue(attributesByName.get('target'));
  if (!href || typeof target !== 'string' || target.toLowerCase() !== '_blank') return;
  const rel = attributesByName.get('rel');
  const relation = attributeValue(rel);
  if (rel && typeof relation !== 'string') {
    ctx.check('S21', file, false, 'JSX link relation is computed at runtime');
    return;
  }
  ctx.check('S21', file);
  const tokens = (relation || '').trim().toLowerCase().split(/\s+/);
  if (tokens.includes('noopener') || tokens.includes('noreferrer')) return;
  const intentionalOpener = tokens.includes('opener');
  const literal = rel?.value?.type === 'JSXExpressionContainer' ? rel.value.expression : rel?.value;
  const start = literal ? literal.end - 1 : element.openingElement.name.end;
  const replacement = literal ? (relation ? ' noopener' : 'noopener') : ' rel="noopener"';
  ctx.finding('S21', file, {
    ...where, confidence: intentionalOpener ? 'tentative' : 'supported', severity: 'low',
    evidence: 'Native JSX new-tab link has no explicit opener isolation. Modern browsers commonly imply it. An authored opener relationship needs contextual review.',
    patch: intentionalOpener ? null : { start, end: start, replacement }
  });
}

function collectGroupLabels(element, labels) {
  const children = element.children.filter(child => !(child.type === 'JSXText' && !child.value.trim()) &&
    !(child.type === 'JSXExpressionContainer' && child.expression.type === 'JSXEmptyExpression'));
  for (let index = 1; index < children.length; index++) {
    const label = children[index - 1];
    const heading = children[index];
    if (label.type !== 'JSXElement' || heading.type !== 'JSXElement' ||
        !precedingLabelTags.has(tagName(label)) || !headingTag.test(tagName(heading)) || skipCopy(label) || skipCopy(heading)) continue;
    if (label.openingElement.attributes.some(attribute => attribute.type === 'JSXSpreadAttribute' ||
        ['id', 'role'].includes(attribute.name.name)) ||
        label.children.some(child => child.type !== 'JSXText' &&
          !(child.type === 'JSXExpressionContainer' && child.expression.type === 'StringLiteral'))) continue;
    labels.push({ label, heading });
  }
}

export function checkJsx(file, ctx, extension) {
  const reviewCopy = (ctx.enabled.has('copy') || ctx.enabled.has('ux')) && /<(?:p|h[1-6])[\s>]/.test(file.text);
  const reviewDesign = ctx.enabled.has('design') && /<h[1-6][\s>]/.test(file.text);
  const reviewImages = ctx.enabled.has('accessibility') && /<img(?=[\s/>])/.test(file.text);
  const reviewLinks = (ctx.enabled.has('security') || ctx.enabled.has('ux')) && /<a(?=[\s/>])/.test(file.text);
  const reviewFields = ctx.enabled.has('ux') && /<(?:input|textarea|select)(?=[\s/>])/.test(file.text);
  if (!reviewCopy && !reviewDesign && !reviewImages && !reviewLinks && !reviewFields) return;
  let program;
  try {
    program = parse(file.text, { sourceType: 'unambiguous', plugins: extension === '.tsx' ? ['jsx', 'typescript'] : ['jsx'] }).program;
  } catch (_error) {
    if (reviewFields) ctx.check('UX14', file, false, 'JSX could not be parsed for persistent labels');
    if (reviewCopy) ctx.check('C08', file, false, 'JSX syntax could not be parsed for literal copy');
    if (reviewDesign) ctx.check('D02', file, false, 'JSX syntax could not be parsed for heading labels');
    if (reviewImages) ctx.check('A02', file, false, 'JSX syntax could not be parsed for native images');
    if (reviewLinks) {
      ctx.check('S21', file, false, 'JSX syntax could not be parsed for link policies');
      ctx.check('UX01', file, false, 'JSX syntax could not be parsed for link destinations');
    }
    return;
  }
  if (reviewFields) checkVisibleJsxFields(file, ctx, program);
  const blocks = [];
  const images = [];
  const links = [];
  const labels = [];
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
      if (reviewLinks && tag === 'a') links.push(node);
      if (reviewDesign && headingGroupTags.has(tag) && !skipCopy(node)) collectGroupLabels(node, labels);
      if (copy && copyTag.test(tag)) blocks.push({
        text: literalText(node.children), tagName: tag, line: node.loc.start.line, offset: node.start
      });
    }
    if (!copy && !reviewDesign && !reviewImages && !reviewLinks) continue;
    for (const value of Object.values(node)) {
      if (Array.isArray(value)) {
        for (const item of value) if (item?.type) pending.push({ node: item, copy });
      } else if (value?.type) pending.push({ node: value, copy });
    }
  }
  blocks.sort((a, b) => a.offset - b.offset);
  if (reviewCopy) checkText(file, ctx, blocks.map((block, index) => ({ ...block, anchor: 'jsx:' + index })));
  images.sort((a, b) => a.start - b.start);
  for (const [index, element] of images.entries()) checkNativeImage(element, file, ctx, index);
  links.sort((a, b) => a.start - b.start);
  for (const [index, element] of links.entries()) checkNativeLink(element, file, ctx, index);
  labels.sort((a, b) => a.label.start - b.label.start);
  for (const [index, { label, heading }] of labels.entries()) {
    checkHeadingLabel(file, ctx, literalText(label.children), literalText(heading.children),
      { anchor: 'jsx-heading-label:' + index, line: label.loc.start.line });
  }
}
