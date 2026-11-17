import { parse } from '@babel/parser';

const privilegedName = /(?:^|_)(?:ACCESS_TOKEN|DATABASE_URL|DB_PASSWORD|PRIVATE_KEY|SECRET(?:_KEY)?|SERVICE_ROLE_KEY)(?:_|$)/i;
const propertyName = property => property.key.name ?? property.key.value;

function unwrapType(node) {
  while (['TSAsExpression', 'TSSatisfiesExpression'].includes(node?.type)) node = node.expression;
  return node;
}

function getConfig(statements) {
  const exported = statements.at(-1);
  if (exported?.type === 'ExportDefaultDeclaration') {
    const expression = unwrapType(exported.declaration);
    if (statements.length === 1) return expression;
    const binding = statements[0];
    if (statements.length === 2 && binding.type === 'VariableDeclaration' && binding.kind === 'const' && binding.declarations.length === 1) {
      const { id, init } = binding.declarations[0];
      if (expression.type === 'Identifier' && id.type === 'Identifier' && id.name === expression.name) return unwrapType(init);
    }
  }
  if (statements.length !== 1 || exported?.type !== 'ExpressionStatement') return null;
  const assignment = exported.expression;
  if (assignment.type !== 'AssignmentExpression' || assignment.operator !== '=') return null;
  const left = assignment.left;
  if (left.type === 'MemberExpression' && !left.computed && left.object.type === 'Identifier' &&
      left.object.name === 'module' && left.property.name === 'exports') return assignment.right;
  return null;
}

function environmentName(value) {
  const node = unwrapType(value);
  if (node?.type !== 'MemberExpression' || node.object.type !== 'MemberExpression') return '';
  const { object: base, property } = node.object;
  if (node.object.computed || base.type !== 'Identifier' || base.name !== 'process' || property.name !== 'env') return '';
  return node.computed ? (node.property.type === 'StringLiteral' ? node.property.value : '') : node.property.name;
}

function checkBundledEnvironment(file, ctx, env) {
  const value = unwrapType(env?.value);
  if (env && (value?.type !== 'ObjectExpression' || value.properties.some(prop => prop.type === 'SpreadElement' || prop.computed))) {
    ctx.check('S36', file, false, 'Environment substitutions depend on dynamic configuration');
    return;
  }
  ctx.check('S36', file);
  for (const [index, property] of (value?.properties || []).entries()) {
    if (property.type !== 'ObjectProperty' ||
        ![propertyName(property), environmentName(property.value)].some(name => privilegedName.test(name || ''))) continue;
    ctx.finding('S36', file, {
      anchor: 'next-config:bundled-environment:' + index, line: property.loc.start.line, confidence: 'tentative',
      evidence: 'The Next.js env option makes this substitution available to client code. Its key or source environment variable indicates a possible privileged value. The value is withheld.'
    });
  }
}

export function checkNextConfig(file, ctx) {
  const matching = /(?:^|\/)next\.config\.(js|mjs|ts)$/.exec(file.path);
  if (!matching || !ctx.enabled.has('security')) return;
  let object;
  try {
    const { program } = parse(file.text, { sourceType: 'unambiguous', plugins: matching[1] === 'ts' ? ['typescript'] : [] });
    object = getConfig(program.body.filter(node => !(node.type === 'ImportDeclaration' && node.importKind === 'type') &&
      !(node.type === 'ExportNamedDeclaration' && node.exportKind === 'type')));
  } catch (_error) {
    ctx.check('S35', file, false, 'Next.js configuration could not be parsed');
    ctx.check('S36', file, false, 'Next.js configuration could not be parsed');
    return;
  }
  if (object?.type !== 'ObjectExpression' || object.properties.some(prop => prop.type === 'SpreadElement' || prop.computed)) {
    ctx.check('S35', file, false, 'Next.js configuration depends on a wrapper, spread, or other expressions');
    ctx.check('S36', file, false, 'Next.js configuration depends on a wrapper, spread, or other expressions');
    return;
  }
  checkBundledEnvironment(file, ctx, object.properties.findLast(prop => propertyName(prop) === 'env'));
  const header = object.properties.findLast(prop => propertyName(prop) === 'poweredByHeader');
  if (header && header.value?.type !== 'BooleanLiteral') {
    ctx.check('S35', file, false, 'Header policy is computed at runtime');
    return;
  }
  ctx.check('S35', file);
  if (header?.value.value === false) return;
  const where = { anchor: 'next-config:powered-by-header', line: header?.loc.start.line ?? object.loc.start.line };
  if (header) {
    ctx.finding('S35', file, { ...where, evidence: 'The configuration explicitly enables the framework identification header.' });
    return;
  }
  const start = object.start + 1;
  const body = file.text.slice(start, object.end - 1);
  const indent = /^[\t ]*(\r?\n)([\t ]*)/.exec(body);
  const first = object.properties[0];
  const spacing = indent ? indent[1] + (first ? indent[2] : indent[2] + '  ') : ' ';
  const tail = !indent && !/^\s/.test(body) ? ' ' : '';
  ctx.finding('S35', file, {
    ...where, confidence: 'supported', evidence: 'This literal Next.js configuration leaves the optional framework identification header at its default.',
    patch: { start, end: start, replacement: spacing + 'poweredByHeader: false,' + tail }
  });
}
