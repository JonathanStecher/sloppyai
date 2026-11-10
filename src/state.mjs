import path from 'node:path';
import { lstat, mkdir, realpath } from 'node:fs/promises';
import { readJson, writeJson, atomicWrite, withLock, hash, stable, sanitize } from './util.mjs';
import { validate } from './schema.mjs';
import { markdownReport, htmlReport } from './report.mjs';
import { compareReports, findingAssessed } from './ratings.mjs';
import { fail } from './errors.mjs';

export async function prepareOutput(output) {
  const absolute = path.resolve(output);
  try {
    const stat = await lstat(absolute);
    if (!stat.isDirectory() || stat.isSymbolicLink()) fail('UNSAFE_OUTPUT', 'Output must be a regular directory, not a link.', 'Select a dedicated local report directory.');
  } catch (error) { if (error.code !== 'ENOENT') throw error; await mkdir(absolute, { recursive: true, mode: 0o700 }); }
  return realpath(absolute);
}

function validatePrevious(value) {
  if (value.schemaVersion !== 1 || !Array.isArray(value.findings) || !Array.isArray(value.ratings) || !value.inputDigest) fail('INVALID_STATE', 'The previous report has an unsupported shape.', 'Preserve the existing directory and select a fresh output directory.');
  return value;
}

export async function writeReportUnlocked(output, report, options = {}) {
  report = sanitize(report);
  await validate('report', report);
  try { await lstat(path.join(output, 'snapshots', report.id + '.json')); fail('DUPLICATE_REPORT', 'This report ID already has a saved snapshot.', 'Use a new assessment ID rather than overwriting prior evidence.'); }
  catch (error) { if (error.code !== 'ENOENT') throw error; }
  let previous = null;
  let ledger = { schemaVersion: 1, issues: {}, runs: [] };
  try { previous = validatePrevious(await validate('report', await readJson(path.join(output, 'report.json'), 20_000_000))); }
  catch (error) { if (error.code !== 'ENOENT') throw error; }
  try { ledger = await readJson(path.join(output, 'history.json'), 20_000_000); }
  catch (error) { if (error.code !== 'ENOENT') throw error; }
  if (ledger.schemaVersion !== 1 || !ledger.issues || typeof ledger.issues !== 'object' || !Array.isArray(ledger.runs)) fail('INVALID_STATE', 'The issue ledger has an unsupported shape.', 'Preserve the ledger and choose a fresh output directory.');
  const { baseline, ...metadata } = options;
  const comparison = baseline ? compareReports(await validate('report', baseline), report) : previous ? compareReports(previous, report) : null;
  const currentIds = new Set(report.findings.map(item => item.id));
  if (comparison?.compatible) {
    for (const issue of Object.values(ledger.issues)) if (issue.targetId === report.targetId && !currentIds.has(issue.id)) {
      issue.status = findingAssessed(issue, report) ? 'not_observed' : 'not_assessed';
      issue.lastAssessment = report.createdAt;
    }
  }
  for (const finding of report.findings) {
    const previousIssue = ledger.issues[finding.id];
    const status = finding.disposition === 'accepted' ? 'accepted' : previousIssue?.status === 'not_observed' && comparison?.compatible ? 'regressed' : finding.confidence === 'tentative' ? 'needs_review' : 'open';
    const issue = previousIssue || { id: finding.id, ruleId: finding.ruleId, targetId: report.targetId, firstSeen: report.createdAt, observations: [] };
    issue.status = status;
    issue.lastSeen = report.createdAt;
    issue.lastAssessment = report.createdAt;
    issue.currentSeverity = finding.severity;
    issue.domain = finding.domain;
    issue.origin = finding.origin;
    issue.location = finding.location;
    issue.observations.push({ reportId: report.id, at: report.createdAt, severity: finding.severity, confidence: finding.confidence, status });
    ledger.issues[finding.id] = issue;
  }
  const run = { reportId: report.id, at: report.createdAt, inputDigest: report.inputDigest, targetId: report.targetId, status: report.status, ratings: report.ratings.map(({ domain, score }) => ({ domain, score })), reviewerAssessments: report.reviewerAssessments.map(({ domain, score, reviewer }) => ({ domain, score, reviewer })), comparison, ...metadata };
  ledger.runs.push(run);
  if (ledger.runs.length > 500 || JSON.stringify(ledger).length > 18_000_000) fail('HISTORY_LIMIT', 'This report directory reached its history limit.', 'Archive the existing directory and start a new run directory; history is not silently discarded.');
  const snapshot = { ...report, comparison };
  await writeJson(path.join(output, 'snapshots', report.id + '.json'), snapshot);
  await writeJson(path.join(output, 'history.json'), ledger);
  await writeJson(path.join(output, 'report.json'), snapshot);
  await atomicWrite(path.join(output, 'report.md'), markdownReport(report, comparison));
  await atomicWrite(path.join(output, 'report.html'), htmlReport(report, comparison));
  await writeJson(path.join(output, 'checkpoint.json'), { schemaVersion: 1, reportId: report.id, inputDigest: report.inputDigest, ledgerDigest: hash(stable(ledger)), status: report.status });
  return { output, comparison, report: snapshot, history: ledger };
}

export async function saveReport(output, report, options = {}) {
  const prepared = await prepareOutput(output);
  return withLock(prepared, () => writeReportUnlocked(prepared, report, options));
}

export async function finalizeLoopUnlocked(output, report, summary) {
  const previous = await readJson(path.join(output, 'report.json'), 20_000_000);
  if (previous.id !== report.id) fail('STATE_CHANGED', 'The latest report changed during finalization.', 'Use the retained snapshots and restart in a dedicated output directory.');
  const saved = sanitize({ ...previous, ...report, comparison: previous.comparison });
  saved.loop = summary;
  await validate('report', saved);
  const ledger = await readJson(path.join(output, 'history.json'), 20_000_000);
  const last = ledger.runs.at(-1);
  if (last?.reportId === report.id) { last.loop = summary; last.status = saved.status; }
  await writeJson(path.join(output, 'snapshots', report.id + '.json'), saved);
  await writeJson(path.join(output, 'history.json'), ledger);
  await writeJson(path.join(output, 'report.json'), saved);
  await atomicWrite(path.join(output, 'report.md'), markdownReport(saved, saved.comparison));
  await atomicWrite(path.join(output, 'report.html'), htmlReport(saved, saved.comparison));
  await writeJson(path.join(output, 'checkpoint.json'), { schemaVersion: 1, reportId: report.id, inputDigest: report.inputDigest, ledgerDigest: hash(stable(ledger)), status: report.status, loop: summary });
}
