import path from 'node:path';
import { SEVERITIES, SKILL_ROOT } from './assets.mjs';

const referenceFor = {
  accessibility: 'accessibility.md',
  ux: 'ux.md',
  copy: 'copy.md',
  performance: 'performance.md',
  security: 'security.md',
  engineering: 'engineering.md',
  design: 'design.md',
  media: 'media.md',
  rights: 'media.md',
  devex: 'engineering.md'
};

export function improvementGuidance(result) {
  const { report, config, catalog, patches, confirmedReviewFindings } = result;
  const reference = filename => path.join(SKILL_ROOT, 'references', filename);
  const builtInFindings = new Set(patches.map(patch => patch.findingId));
  const findings = report.findings.filter(item => item.disposition === 'open').sort((a, b) =>
    SEVERITIES.indexOf(a.severity) - SEVERITIES.indexOf(b.severity) ||
    Number(b.confidence === 'supported') - Number(a.confidence === 'supported'));
  const steps = findings.map(finding => ({
    findingId: finding.id,
    ruleId: finding.ruleId,
    method: builtInFindings.has(finding.id) ? 'built_in' : 'contextual',
    reviewerConfirmed: confirmedReviewFindings.has(finding.id),
    verification: catalog.byId.get(finding.ruleId)?.verification || []
  }));
  return {
    checklistFile: reference('release-review.md'),
    checklistTemplateFile: path.join(SKILL_ROOT, 'checklists', 'release.json'),
    repairGuideFile: reference('repairs.md'),
    rubricFile: reference('ratings.md'),
    reviewSchemaFile: path.join(SKILL_ROOT, 'schemas', 'review.schema.json'),
    domains: config.domains,
    domainReferences: Object.fromEntries(config.domains.map(domain => [domain, reference(referenceFor[domain])])),
    steps
  };
}
