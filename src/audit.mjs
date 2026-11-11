import path from 'node:path';
import { VERSION } from './assets.mjs';
import { loadConfig } from './config.mjs';
import { collectFiles, targetInfo } from './files.mjs';
import { loadCatalog } from './catalog.mjs';
import { createContext } from './checks/context.mjs';
import { checkHtml } from './checks/html.mjs';
import { checkText, checkCode } from './checks/text.mjs';
import { checkCss } from './checks/css.mjs';
import { isTestFixture } from './checks/scope.mjs';
import { hash, id, stable, readJson, short } from './util.mjs';
import { lstat } from 'node:fs/promises';
import { rate, completion } from './ratings.mjs';
import { validate } from './schema.mjs';
import { fail } from './errors.mjs';

export async function audit(target, options = {}) {
  const info = await targetInfo(target);
  const settings = await loadConfig(info.root, options);
  const catalog = await loadCatalog();
  const collected = await collectFiles(info, settings.config, options);
  const inputDigest = hash(stable({ manifest: collected.manifest, config: settings.digest, catalog: catalog.digest, engine: VERSION }));
  const ctx = createContext(catalog, settings.config);
  const excludedFixtures = [];
  for (const file of collected.files) {
    if (!info.isFile && isTestFixture(file.path)) {
      excludedFixtures.push({ path: file.path, reason: 'test or fixture excluded from product checks' });
      continue;
    }
    const extension = path.extname(file.path).toLowerCase();
    if (['.html', '.htm'].includes(extension)) {
      const result = checkHtml(file, ctx);
      checkText(file, ctx, result.visible);
      // Embedded style elements need their own extraction, not parsing the whole HTML as CSS.
      const expression = /<style(?:\s[^>]*)?>([\s\S]*?)<\/style\s*>/gi;
      let styleIndex = 0;
      for (const match of file.text.matchAll(expression)) checkCss(file, ctx, match[1], match.index + match[0].indexOf('>') + 1, 'embedded-' + ++styleIndex);
    } else if (extension === '.css') checkCss(file, ctx);
    else if (['.md', '.txt'].includes(extension)) checkText(file, ctx);
    else if (['.js', '.mjs', '.cjs', '.jsx', '.ts', '.tsx', '.py', '.sql'].includes(extension)) checkCode(file, ctx);
  }
  const excludedPaths = new Set(excludedFixtures.map(item => item.path));
  for (const preservation of settings.config.preserve) {
    const file = collected.files.find(item => item.path === preservation.path.split(path.sep).join('/'));
    const location = file || { path: preservation.path };
    let missing = false;
    if (!file) {
      try { await lstat(path.join(info.root, preservation.path)); }
      catch (error) { missing = error.code === 'ENOENT'; }
      if (!missing) { ctx.check('E03', location, false, 'Preserved file was not included in readable bounded source inputs'); continue; }
    }
    ctx.check('E03', location);
    for (let i = 0; i < preservation.contains.length; i++) {
      if (missing || !file.text.includes(preservation.contains[i])) ctx.finding('E03', location, { anchor: 'preserve:' + i, confidence: 'supported', severity: 'high', evidence: 'A required preservation anchor is absent. Its literal value is withheld from the report.', recommendation: 'Restore the agreed behaviour/content and verify the actual user journey in addition to this literal anchor.' });
    }
  }
  const patches = ctx.findings.filter(item => item.patch).map(item => ({ ...item.patch, findingId: item.id, ruleId: item.ruleId }));
  const findings = ctx.findings.map(({ patch: _patch, ...item }) => item);
  const checks = ctx.finish();
  const report = {
    schemaVersion: 1, engineVersion: VERSION, id: id(), createdAt: new Date().toISOString(),
    target: info.label, targetId: hash(info.target), inputDigest, artifactDigest: collected.digest, configDigest: settings.digest, catalogDigest: catalog.digest,
    manifest: collected.manifest, findings, checks,
    coverage: {
      kind: 'partial static assessment', fullArtifactVerified: false, assessedFiles: collected.files.length - excludedFixtures.length,
      assessedBytes: collected.files.filter(file => !excludedPaths.has(file.path)).reduce((sum, file) => sum + file.bytes, 0), capped: collected.capped || ctx.capped || collected.skipped.length + excludedFixtures.length > 200, skipped: [...collected.skipped, ...excludedFixtures].slice(0, 200),
      limitations: [
        'Static UTF-8 source checks only. No browser, network, provider or production operations ran.',
        ...(excludedFixtures.length ? ['Test and fixture files are excluded from project checks but remain in the input manifest. Audit a specific file directly to include it.'] : []),
        'Computed CSS, dynamic accessible names, full journeys, authorization and factual claims require contextual or runtime evidence.',
        'A high check score describes assessed checks only and does not certify security, accessibility, originality or legal compliance.',
        'Finding identifiers use source anchors; major structural changes can change identity.',
        'The input digest covers the listed static manifest and configuration. Unlisted binary assets, external resources and excluded files are outside that binding.',
        ...ctx.limitations
      ],
      manualRules: catalog.entries.filter(item => settings.config.domains.includes(item.domain) && item.kind !== 'definition' && item.kind !== 'option' && item.automation === 'none').map(item => item.id)
    },
    checksExecution: [], reviewerAssessments: [], sourceIds: [...new Set(findings.flatMap(item => catalog.byId.get(item.ruleId)?.sourceIds || []))]
  };
  if (options.reviewFile || options.review) {
    const review = options.review || await readJson(options.reviewFile);
    await validate('review', review);
    if (review.inputDigest !== inputDigest) fail('STALE_REVIEW', 'The review does not match the current artifact, configuration and catalogue.', 'Audit the current inputs and create a new review bound to its inputDigest.');
    if (new Set(review.assessments.map(item => item.domain)).size !== review.assessments.length) fail('DUPLICATE_ASSESSMENT', 'Each review domain may be rated once.', 'Combine duplicate domain assessments.');
    if (review.assessments.some(item => !settings.config.domains.includes(item.domain))) fail('REVIEW_SCOPE', 'A review rating is outside the selected domains.', 'Include the domain deliberately or narrow the review.');
    for (const supplied of review.findings) {
      const rule = catalog.byId.get(supplied.ruleId);
      if (!rule || ['option', 'definition'].includes(rule.kind)) fail('INVALID_REVIEW_RULE', 'A review finding must reference a known evaluative rule.', 'Use a requirement or heuristic rule identifier.');
      if (!settings.config.domains.includes(rule.domain)) fail('REVIEW_SCOPE', 'A review finding is outside the selected domains.', 'Include the domain deliberately or narrow the review.');
      if (supplied.path !== '<artifact>' && !collected.manifest.some(file => file.path === supplied.path)) fail('REVIEW_PATH', 'A review finding names a file outside the assessed manifest.', 'Use a current manifest path or <artifact> for an artifact-wide observation.');
      const accepted = settings.config.acceptedHeuristics.find(item => item.ruleId === rule.id);
      const proposed = {
        id: hash([supplied.ruleId, supplied.path, supplied.anchor].join('\0')).slice(0, 24),
        ruleId: rule.id, title: rule.title, domain: rule.domain, kind: rule.kind, severity: supplied.severity,
        confidence: supplied.confidence, location: { path: supplied.path, anchor: short(supplied.anchor, 500), line: supplied.line || 1 },
        evidence: short(supplied.evidence, 3000), recommendation: short(supplied.recommendation, 2000),
        origin: 'review', assurance: `Self-reported ${review.reviewer.kind} review; not an independently witnessed reproduction.`, disposition: accepted ? 'accepted' : 'open',
        ...(accepted ? { acceptanceReason: short(accepted.reason, 1000) } : {})
      };
      const existing = report.findings.find(item => item.id === proposed.id);
      if (existing) existing.evidence = short(existing.evidence + ' Reviewer note: ' + proposed.evidence, 3000);
      else report.findings.push(proposed);
    }
    report.reviewerAssessments = review.assessments.map(item => ({ ...item, rationale: short(item.rationale, 2000), evidence: short(item.evidence, 2000), reviewer: { name: short(review.reviewer.name), kind: review.reviewer.kind }, scale: '0-5 reviewer-assessed; separate from automated scores', assurance: 'self-reported' }));
  }
  report.sourceIds = [...new Set(report.findings.flatMap(item => catalog.byId.get(item.ruleId)?.sourceIds || []))];
  report.ratings = rate(report.findings, report.checks, settings.config.domains);
  report.status = completion(report);
  return { report, patches, info, config: settings.config, files: collected.files };
}

export async function assertStableInputs(result, options = {}) {
  const current = await collectFiles(result.info, result.config, options);
  if (current.digest !== result.report.artifactDigest) fail('INPUT_CHANGED_DURING_CHECKS', 'Source inputs changed while project checks were running.', 'Re-audit current inputs and rerun checks without changing the assessed source. Previous reviewer ratings do not apply to the new digest.');
}
