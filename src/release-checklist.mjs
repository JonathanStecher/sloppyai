import path from 'node:path';
import { SKILL_ROOT } from './assets.mjs';
import { readJson } from './util.mjs';
import { loadCatalog } from './catalog.mjs';

// A template has no audit result. Never infer a pass from a matching source rule.
export async function releaseChecklist(options = {}) {
  const matrix = await readJson(path.join(SKILL_ROOT, 'checklists', 'release.json'));
  const catalog = await loadCatalog();
  const items = matrix.groups.flatMap(group => group.items.map(item => {
    const rules = item.ruleIds.map(ruleId => {
      const rule = catalog.byId.get(ruleId);
      if (!rule) throw new Error('Unknown release checklist rule: ' + ruleId);
      return rule;
    });
    return {
      ...item, group: group.id, groupTitle: group.title,
      domains: [...new Set(rules.map(rule => rule.domain))],
      applicability: 'unresolved', status: 'not_assessed', evidence: [],
      verification: [...new Set([...(item.scenario ? [item.scenario] : []), ...rules.flatMap(rule => rule.verification)])]
    };
  })).filter(item => (!options.domain || item.domains.includes(options.domain)) &&
    (!options.query || (item.id + ' ' + item.label + ' ' + item.groupTitle).toLowerCase().includes(options.query.toLowerCase())));
  return {
    schemaVersion: 1, kind: 'unassessed release checklist', title: matrix.title,
    policy: matrix.policy, summary: { total: items.length, notAssessed: items.length },
    items
  };
}

export function checklistMarkdown(checklist) {
  const lines = ['# ' + checklist.title, '', ...checklist.policy.map(text => '- ' + text), ''];
  for (const group of [...new Set(checklist.items.map(item => item.group))]) {
    const items = checklist.items.filter(item => item.group === group);
    lines.push('## ' + items[0].groupTitle, '', '| Prompt | Rules | Status |', '| --- | --- | --- |');
    for (const item of items) lines.push('| ' + item.label + ' | ' + item.ruleIds.join(', ') + ' | Not assessed |');
    lines.push('');
  }
  return lines.join('\n');
}
