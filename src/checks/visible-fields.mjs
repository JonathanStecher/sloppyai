function name(element) {
  return element.openingElement.name.type === 'JSXIdentifier' ? element.openingElement.name.name : '';
}
function value(attribute) {
  return attribute?.value?.type === 'JSXExpressionContainer' ? attribute.value.expression.value : attribute?.value?.value;
}
function attributes(element) {
  return new Map(element.openingElement.attributes.filter(item => item.type === 'JSXAttribute').map(item => [item.name.name, item]));
}
function labelText(children) {
  return children.some(child => child.type === 'JSXText' && child.value.trim() ||
    child.type === 'JSXExpressionContainer' && child.expression.type === 'StringLiteral' && child.expression.value.trim());
}

export function checkVisibleJsxFields(file, ctx, program) {
  if (!ctx.enabled.has('ux')) return;
  const fields = [], labels = new Set(), customLabels = new Set();
  const pending = [{ node: program, wrappingLabel: false }];
  while (pending.length) {
    const { node, wrappingLabel } = pending.pop();
    let wrapped = wrappingLabel;
    if (node.type === 'JSXElement') {
      const tag = name(node), props = attributes(node);
      const hidden = key => props.has(key) && value(props.get(key)) !== false;
      if (hidden('hidden') || hidden('inert') || [true, 'true'].includes(value(props.get('aria-hidden')))) continue;
      if (tag === 'label') {
        wrapped = wrapped || labelText(node.children);
        const id = value(props.get('htmlFor'));
        if (typeof id === 'string' && labelText(node.children)) labels.add(id);
      } else if (tag && /^[A-Z]/.test(tag) && props.has('htmlFor')) {
        const id = value(props.get('htmlFor'));
        if (typeof id === 'string') customLabels.add(id);
      }
      if (['input', 'textarea', 'select'].includes(tag)) fields.push({ node, props, wrapped });
    }
    for (const child of Object.values(node)) {
      if (Array.isArray(child)) for (const item of child) { if (item?.type) pending.push({ node: item, wrappingLabel: wrapped }); }
      else if (child?.type) pending.push({ node: child, wrappingLabel: wrapped });
    }
  }
  for (const { node, props, wrapped } of fields) {
    if (['hidden', 'submit', 'reset', 'button', 'image'].includes(value(props.get('type')))) continue;
    const id = value(props.get('id'));
    if (node.openingElement.attributes.some(item => item.type === 'JSXSpreadAttribute') ||
        (props.has('id') && typeof id !== 'string') || customLabels.has(id)) {
      ctx.check('UX14', file, false, 'A field uses computed or component-supplied label information');
      continue;
    }
    ctx.check('UX14', file);
    if (props.has('placeholder') && !wrapped && !labels.has(id)) ctx.finding('UX14', file, {
      anchor: 'jsx-visible-label:' + node.start, line: node.loc.start.line, confidence: 'tentative',
      evidence: 'A native JSX field has a placeholder but no associated literal native label in this source unit. Accessible names and labels provided elsewhere require rendered review.'
    });
  }
}
