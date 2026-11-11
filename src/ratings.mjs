import { DOMAINS, PENALTIES } from './assets.mjs';

export function rate(findings, checks, enabledDomains = DOMAINS) {
  return enabledDomains.map(domain => {
    const relevant = findings.filter(item => item.domain === domain && item.disposition !== 'accepted');
    const assessed = checks.filter(item => item.domain === domain && item.assessedFiles > 0);
    const confirmed = relevant.filter(item => item.kind === 'requirement' && item.confidence === 'supported' && item.origin !== 'review');
    const penalty = confirmed.reduce((sum, item) => sum + PENALTIES[item.severity], 0);
    return {
      domain, score: assessed.length ? Math.max(0, 100 - penalty) : null,
      scale: '0-100 automated check score within assessed static scope',
      assessedChecks: assessed.length, confirmedIssues: confirmed.length,
      reviewPrompts: relevant.length - confirmed.length,
      accepted: findings.filter(item => item.domain === domain && item.disposition === 'accepted').length,
      fullDomainVerified: false
    };
  });
}

function skippedPath(path, report) {
  return (report.coverage.skipped || []).some(item => item.path === path || path.startsWith(item.path + '/'));
}

export function findingAssessed(finding, report) {
  if (report.coverage.capped || report.coverage.assessedFiles === 0 || report.status === 'partial') return false;
  if (finding.origin === 'review') return report.reviewerAssessments.some(item => item.domain === finding.domain);
  if (finding.origin === 'static' && skippedPath(finding.location.path, report)) return false;
  if (!report.checks.some(item => item.ruleId === finding.ruleId && item.assessedFiles > 0)) return false;
  return finding.origin === 'command' || finding.ruleId === 'E03' || report.manifest.some(item => item.path === finding.location.path);
}

export function compareReports(before, after) {
  const previous = new Map(before.findings.map(item => [item.id, item]));
  const current = new Map(after.findings.map(item => [item.id, item]));
  const compatible = before.configDigest === after.configDigest && before.catalogDigest === after.catalogDigest && before.engineVersion === after.engineVersion && before.targetId === after.targetId;
  const absent = [...previous.values()].filter(item => !current.has(item.id));
  const resolved = absent.filter(item => findingAssessed(item, after));
  const unassessed = absent.filter(item => !findingAssessed(item, after));
  const scoreComparable = compatible && !after.coverage.capped && before.manifest.every(file => after.manifest.some(item => item.path === file.path) && !skippedPath(file.path, after));
  const added = [...current.values()].filter(item => !previous.has(item.id));
  const changed = [...current.values()].filter(item => {
    const old = previous.get(item.id);
    return old && (old.severity !== item.severity || old.confidence !== item.confidence || old.disposition !== item.disposition);
  }).map(item => ({ id: item.id, before: previous.get(item.id).severity, after: item.severity, confidenceBefore: previous.get(item.id).confidence, confidenceAfter: item.confidence }));
  const scoreChanges = after.ratings.map(item => {
    const old = before.ratings.find(rating => rating.domain === item.domain);
    return { domain: item.domain, before: old?.score ?? null, after: item.score, delta: scoreComparable && old?.score !== null && item.score !== null && old ? item.score - old.score : null };
  });
  const reviewerChanges = (after.reviewerAssessments || []).map(item => {
    const old = (before.reviewerAssessments || []).find(previous => previous.domain === item.domain && previous.reviewer.name === item.reviewer.name && previous.reviewer.kind === item.reviewer.kind);
    return { domain: item.domain, reviewer: item.reviewer.name, before: old?.score ?? null, after: item.score, delta: scoreComparable && old ? item.score - old.score : null, assurance: 'self-reported reviewer scores; not automated verification' };
  });
  return {
    compatible,
    note: !compatible ? 'Scope or version changed; numeric deltas are withheld.' : !scoreComparable ? 'Inputs left the assessed manifest or coverage was capped; numeric deltas are withheld. Unassessed issues remain open.' : 'Rule/configuration scope matches. Absence means no longer observed by these checks, not independent runtime verification.',
    resolved: resolved.map(item => item.id), unassessed: unassessed.map(item => item.id), added: added.map(item => item.id), changed, scoreChanges, reviewerChanges,
    regression: compatible && (scoreChanges.some(item => item.delta !== null && item.delta < 0) || reviewerChanges.some(item => item.delta !== null && item.delta < 0) || added.some(item => item.kind === 'requirement' && ['supported', 'reproduced'].includes(item.confidence)) || changed.some(item => ['critical', 'high', 'medium', 'low', 'suggestion'].indexOf(item.after) < ['critical', 'high', 'medium', 'low', 'suggestion'].indexOf(item.before)))
  };
}

export function completion(report) {
  const confirmed = report.findings.filter(item => item.disposition === 'open' && item.kind === 'requirement' && item.confidence === 'supported' && item.origin !== 'review');
  if (confirmed.length) return 'issues_found';
  if (report.findings.some(item => item.disposition === 'open')) return 'needs_review';
  if (report.coverage.assessedFiles === 0 || report.coverage.capped || !report.checks.some(item => item.assessedFiles > 0) && !report.reviewerAssessments.length) return 'partial';
  return 'no_supported_static_findings';
}
