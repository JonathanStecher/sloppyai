import { hash, short } from '../util.mjs';
import { fail } from '../errors.mjs';

export function createContext(catalog, config) {
  const findings = [];
  const checks = new Map();
  const enabled = new Set(config.domains);
  const accepted = new Map(config.acceptedHeuristics.map(item => [item.ruleId, item.reason]));
  for (const [ruleId] of accepted) {
    const rule = catalog.byId.get(ruleId);
    if (!rule || rule.kind !== 'heuristic') fail('INVALID_EXCEPTION', 'Only known heuristic rules can be accepted as preferences.', 'Fix objective failures directly; record a reason for a genuine contextual heuristic exception.', { ruleId });
  }
  function check(ruleId, file, applicable = true, reason = '') {
    const rule = catalog.byId.get(ruleId);
    if (!rule) fail('UNKNOWN_RULE', 'The scanner referenced an unknown rule.', 'Rebuild with a matching catalogue.', { ruleId });
    if (!enabled.has(rule.domain)) return false;
    if (!checks.has(ruleId)) checks.set(ruleId, { ruleId, domain: rule.domain, method: 'static', files: new Set(), skipped: new Set(), reasons: new Set() });
    const record = checks.get(ruleId);
    if (applicable) record.files.add(file.path);
    else { record.skipped.add(file.path); if (reason) record.reasons.add(reason); }
    return applicable;
  }
  function finding(ruleId, file, details) {
    if (!check(ruleId, file)) return;
    const rule = catalog.byId.get(ruleId);
    const anchor = details.anchor || 'document';
    const fingerprint = hash([ruleId, file.path, anchor].join('\0')).slice(0, 24);
    if (findings.some(item => item.id === fingerprint)) return;
    const confidence = details.confidence || (rule.kind === 'requirement' ? 'supported' : 'tentative');
    findings.push({
      id: fingerprint, ruleId, title: rule.title, domain: rule.domain, kind: rule.kind,
      severity: details.severity || rule.defaultSeverity || 'low', confidence,
      location: { path: file.path, line: details.line || 1, anchor },
      evidence: short(details.evidence || rule.description, 1200),
      recommendation: short(details.recommendation || rule.guidance, 1200),
      origin: 'static', assurance: 'static observation; contextual and runtime checks may remain',
      disposition: accepted.has(ruleId) ? 'accepted' : 'open',
      ...(accepted.has(ruleId) ? { acceptanceReason: short(accepted.get(ruleId), 1000) } : {}),
      ...(details.patch && !accepted.has(ruleId) ? { patch: { ...details.patch, path: file.path, fileHash: file.hash } } : {})
    });
  }
  function finish() {
    return [...checks.values()].map(record => {
      const matches = findings.filter(item => item.ruleId === record.ruleId && item.disposition !== 'accepted');
      return {
        ruleId: record.ruleId, domain: record.domain, method: record.method,
        status: record.files.size === 0 ? 'not_assessed' : matches.some(item => item.confidence === 'supported' && item.kind === 'requirement') ? 'failed' : matches.length ? 'needs_review' : 'passed',
        assessedFiles: record.files.size, skippedFiles: record.skipped.size, reasons: [...record.reasons]
      };
    });
  }
  return { findings, check, finding, finish, enabled, config, capped: false, limitations: [] };
}
