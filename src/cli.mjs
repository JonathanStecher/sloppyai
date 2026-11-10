import { parseArgs } from 'node:util';
import path from 'node:path';
import { open } from 'node:fs/promises';
import { audit, assertStableInputs } from './audit.mjs';
import { targetInfo } from './files.mjs';
import { saveReport, prepareOutput } from './state.mjs';
import { improveLoop, watchTarget } from './loop.mjs';
import { loadCatalog, selectCatalog } from './catalog.mjs';
import { undoTransaction } from './repair.mjs';
import { installSkill, uninstallSkill } from './install.mjs';
import { readJson, withLock, short, sanitize } from './util.mjs';
import { runChecks, attachChecks } from './commands.mjs';
import { markdownReport, htmlReport } from './report.mjs';
import { compareReports } from './ratings.mjs';
import { VERSION, SEVERITIES } from './assets.mjs';
import { CraftcheckError, fail } from './errors.mjs';
import { validate } from './schema.mjs';

const HELP = `Craftcheck ${VERSION}
Bring an existing artifact → understand the findings → choose a concrete improvement → make the change → verify the result.

Usage: craftcheck <command> [target] [options]

  audit TARGET       Read UTF-8 source; save an evidence-bound report and ratings.
  plan TARGET        Audit and print a concrete, prioritized improvement plan.
  verify TARGET      Re-audit; optionally run authorized checks and compare a baseline.
  loop TARGET        Check → narrow fix → recheck with bounded attempts and history.
  watch TARGET       Recheck changed inputs, within cycle and duration limits.
  init TARGET        Create a safe .craftcheck.json without overwriting an existing one.
  catalog            Browse the complete rule, technique and glossary catalogue.
  history            Show issue and rating history from --out.
  undo TARGET        Restore --transaction if repaired files have no later changes.
  install            Copy the self-contained skill into a selected host or --dest.
  uninstall          Remove only an unchanged Craftcheck-managed installation.

Options:
  --out DIRECTORY           Local report/state directory (default: TARGET/.craftcheck).
  --format summary|json|markdown|html  Output format (default: summary).
  --json                    Alias for --format json.
  --no-save                 Audit without writing reports (audit/plan/verify).
  --domains LIST            Comma-separated review domains.
  --config FILE             Explicit JSON configuration.
  --language TAG            Actual document language; enables the missing-lang fix.
  --review FILE             Import a current-digest human/agent review.
  --baseline FILE           Compare verify output with an earlier report.
  --apply                   Authorize writes to the selected artifact in loop/watch.
  --allow-exec              Authorize configured commands and repair hooks (no sandbox).
  --include-check-output    Include redacted, bounded failure output; off by default.
  --max-rounds N            Repair rounds, 1–20 (default: 3).
  --target-score N          Target for assessed automated checks, 0–100 (default: 100).
  --max-duration-ms N       Loop duration bound (default: 300000).
  --interval-ms N           Watch polling interval (default: 1000).
  --max-cycles N            Watch changed-input cycles (default: 30).
  --duration-ms N           Total watch duration bound (default: 300000).
  --events                  Emit loop progress as NDJSON.
  --fail-on LEVEL           Confirmed-issue exit threshold; default medium, or none.
  --domain NAME --kind TYPE --query TEXT   Catalogue filters.
  --transaction ID          Undo transaction from the report history.
  --host codex|claude|cursor --scope user|project --project DIR
  --dest DIRECTORY          Explicit parent directory for skill installation.
  --help --version

No network calls, paid API calls, project execution or source changes occur during audit.
Reports are private local artifacts. A check score is not whole-product verification.
`;

function number(value, name) {
  if (value === undefined) return undefined;
  if (!/^\d+(?:\.\d+)?$/.test(value)) fail('INVALID_ARGUMENT', `${name} must be a non-negative number.`, 'Use the documented numeric bounds.');
  return Number(value);
}

function exitFor(report, threshold = 'medium') {
  if (report.loop?.stopReason === 'cancelled') return 130;
  if (report.loop?.stopReason === 'regression') return 1;
  if (report.status === 'partial' || ['coverage_reduced', 'fixer_timeout', 'fixer_failed', 'operational_error', 'deadline'].includes(report.loop?.stopReason) || report.coverage.assessedFiles === 0 || report.coverage.capped || report.checksExecution.some(item => ['not_run', 'deadline', 'cancelled'].includes(item.status))) return 2;
  if (threshold === 'none') return 0;
  const limit = SEVERITIES.indexOf(threshold);
  if (limit < 0) fail('INVALID_THRESHOLD', 'Unknown issue threshold.', 'Use critical, high, medium, low, suggestion or none.');
  return report.findings.some(item => item.disposition === 'open' && item.kind === 'requirement' && item.confidence === 'supported' && item.origin !== 'review' && SEVERITIES.indexOf(item.severity) <= limit) ? 1 : 0;
}

function outputReport(report, values, output) {
  const format = values.json ? 'json' : values.format || 'summary';
  if (!['summary', 'json', 'markdown', 'html'].includes(format)) fail('INVALID_FORMAT', 'Unknown output format.', 'Use summary, json, markdown or html.');
  if (format === 'json') console.log(JSON.stringify(report, null, 2));
  else if (format === 'markdown') console.log(markdownReport(report, report.comparison));
  else if (format === 'html') console.log(htmlReport(report, report.comparison));
  else {
    console.log(`${short(report.target)}: ${report.status}; ${report.findings.length} finding(s), ${report.coverage.assessedFiles} file(s).`);
    for (const item of report.ratings.filter(item => item.score !== null)) console.log(`  ${item.domain}: ${item.score}/100 assessed-check score; ${item.confirmedIssues} confirmed, ${item.reviewPrompts} to review`);
    if (report.loop) console.log(`  Loop stopped: ${report.loop.stopReason}; ${report.loop.repairRounds} repair round(s).`);
    if (output) console.log(`  Reports: ${output}`);
    console.log('  Partial static scope. Full behaviour, security and accessibility remain subject to applicable verification.');
  }
}

export async function main(args = process.argv.slice(2)) {
  let parsed;
  try {
    parsed = parseArgs({ args, allowPositionals: true, strict: true, options: {
      help: { type: 'boolean' }, version: { type: 'boolean' }, json: { type: 'boolean' },
      out: { type: 'string' }, format: { type: 'string' }, 'no-save': { type: 'boolean' },
      domains: { type: 'string' }, config: { type: 'string' }, language: { type: 'string' },
      review: { type: 'string' }, baseline: { type: 'string' }, apply: { type: 'boolean' },
      'allow-exec': { type: 'boolean' }, 'include-check-output': { type: 'boolean' },
      'max-rounds': { type: 'string' }, 'target-score': { type: 'string' }, 'max-duration-ms': { type: 'string' },
      'interval-ms': { type: 'string' }, 'max-cycles': { type: 'string' }, 'duration-ms': { type: 'string' },
      events: { type: 'boolean' }, 'fail-on': { type: 'string' }, domain: { type: 'string' }, kind: { type: 'string' }, query: { type: 'string' },
      transaction: { type: 'string' }, host: { type: 'string' }, scope: { type: 'string' }, project: { type: 'string' }, dest: { type: 'string' }
    } });
  } catch (error) { fail('INVALID_ARGUMENT', short(error.message), 'Run craftcheck --help.'); }
  const { values, positionals } = parsed;
  if (values.help || !positionals.length && !values.version) { console.log(HELP); return 0; }
  if (values.version) { console.log(VERSION); return 0; }
  const [command, target, ...extra] = positionals;
  if (extra.length) fail('INVALID_ARGUMENT', 'Too many positional arguments.', 'Run craftcheck --help.');
  if (values.events && (values.json || values.format)) fail('INVALID_ARGUMENT', 'NDJSON events cannot be combined with another output format.', 'Use --events alone for streaming output.');
  if (values.format && !['summary', 'json', 'markdown', 'html'].includes(values.format)) fail('INVALID_FORMAT', 'Unknown output format.', 'Use summary, json, markdown or html.');
  if (values['fail-on'] && ![...SEVERITIES, 'none'].includes(values['fail-on'])) fail('INVALID_THRESHOLD', 'Unknown issue threshold.', 'Use critical, high, medium, low, suggestion or none.');
  const options = {
    output: values.out ? path.resolve(values.out) : undefined,
    configFile: values.config, language: values.language,
    domains: values.domains?.split(',').map(value => value.trim()), reviewFile: values.review,
    apply: Boolean(values.apply), allowExec: Boolean(values['allow-exec']), includeOutput: Boolean(values['include-check-output']),
    maxRounds: number(values['max-rounds'], '--max-rounds'), targetScore: number(values['target-score'], '--target-score'),
    maxDurationMs: number(values['max-duration-ms'], '--max-duration-ms'),
    intervalMs: number(values['interval-ms'], '--interval-ms'), maxCycles: number(values['max-cycles'], '--max-cycles'), durationMs: number(values['duration-ms'], '--duration-ms')
  };
  await validate('config', { ...(options.language ? { language: options.language } : {}), ...(options.domains ? { domains: options.domains } : {}) });
  const controller = new AbortController();
  const cancel = () => controller.abort();
  process.once('SIGINT', cancel);
  process.once('SIGTERM', cancel);
  options.signal = controller.signal;
  try {
    if (command === 'catalog') {
      const catalog = await loadCatalog();
      const entries = selectCatalog(catalog, { domain: values.domain, kind: values.kind, query: values.query });
      if (values.json || values.format === 'json') console.log(JSON.stringify(entries, null, 2));
      else for (const entry of entries) console.log(`${entry.id} [${entry.kind}; ${entry.domain}] ${entry.title}\n  ${entry.description}\n  ${entry.guidance}`);
      return 0;
    }
    if (command === 'install' || command === 'uninstall') {
      const result = await (command === 'install' ? installSkill : uninstallSkill)({ host: values.host, scope: values.scope, project: values.project, destination: values.dest });
      console.log(JSON.stringify(result, null, 2)); return 0;
    }
    if (command === 'history') {
      if (!options.output) fail('OUTPUT_REQUIRED', 'History requires --out.', 'Select an existing report directory.');
      console.log(JSON.stringify(sanitize(await readJson(path.join(options.output, 'history.json'), 20_000_000)), null, 2)); return 0;
    }
    if (!['audit', 'plan', 'verify', 'loop', 'watch', 'init', 'undo'].includes(command)) fail('UNKNOWN_COMMAND', 'Unknown command: ' + short(command), 'Run craftcheck --help.');
    if (!target) fail('TARGET_REQUIRED', 'This command requires a target.', 'Select an existing artifact file or directory.');
    const info = await targetInfo(target);
    if (!options.output) options.output = path.join(info.root, '.craftcheck');
    if (command === 'init') {
      const destination = path.join(info.root, '.craftcheck.json');
      let handle;
      try { handle = await open(destination, 'wx', 0o600); }
      catch (error) { if (error.code === 'EEXIST') fail('CONFIG_EXISTS', 'Configuration already exists.', 'Edit the existing .craftcheck.json; it was not overwritten.'); throw error; }
      try { await handle.writeFile(JSON.stringify({ ...(values.language ? { language: values.language } : {}), preserve: [], checks: [], loop: { maxRounds: 3, targetScore: 100, stallRounds: 2, maxDurationMs: 300000 } }, null, 2) + '\n'); }
      finally { await handle.close(); }
      console.log('Created ' + destination); return 0;
    }
    if (command === 'undo') {
      if (!values.transaction) fail('TRANSACTION_REQUIRED', 'Undo requires --transaction.', 'Use an applied transaction identifier from the loop history.');
      const output = await prepareOutput(options.output);
      console.log(JSON.stringify(await withLock(output, () => undoTransaction(info, output, values.transaction)), null, 2)); return 0;
    }
    if (command === 'loop' || command === 'watch') {
      if (values['no-save'] || values.review) fail('INVALID_ARGUMENT', 'Loop/watch require durable state and fresh review after each changed input.', 'Omit --no-save and --review. Import a review separately against the latest inputDigest.');
      options.onProgress = event => {
        if (values.events) console.log(JSON.stringify(event));
        else if (!values.json && values.format !== 'json') console.error(event.type === 'assessment' ? `Round ${event.round}: ${event.report.findings.length} finding(s); ${event.report.status}` : event.type === 'repair' ? `Applied ${event.transaction.changes.length} narrow file repair(s).` : event.type === 'stopped' ? `Stopped: ${event.summary.stopReason}` : `Repair hook round ${event.round} completed.`);
      };
      const result = await (command === 'loop' ? improveLoop : watchTarget)(target, options);
      if (command === 'watch' && values.events) console.log(JSON.stringify({ type: 'watch_stopped', stopReason: result.stopReason, cycles: result.cycles, elapsedMs: result.elapsedMs }));
      if (result.report && !values.events) outputReport(result.report, values, result.output);
      if (command === 'watch' && !values.events && !values.json) console.error(`Watch stopped: ${result.stopReason}; ${result.cycles} changed-input cycle(s).`);
      return result.stopReason === 'cancelled' ? 130 : result.report ? exitFor(result.report, values['fail-on']) : 2;
    }
    const result = await audit(target, options);
    if (command === 'verify') {
      const executions = await runChecks(result.config.checks, { cwd: info.root, allowExec: options.allowExec, signal: options.signal, deadline: Date.now() + result.config.loop.maxDurationMs, includeOutput: options.includeOutput });
      if (executions.some(item => item.attempts.length)) await assertStableInputs(result, { output: options.output, signal: options.signal });
      attachChecks(result.report, executions, result.config.domains);
    }
    const baseline = values.baseline ? await validate('report', await readJson(values.baseline, 20_000_000)) : null;
    if (baseline) result.report.comparison = compareReports(baseline, result.report);
    let saved;
    if (!values['no-save']) saved = await saveReport(options.output, result.report, { ...(baseline ? { baseline } : {}) });
    if (command === 'plan') {
      const actionable = result.report.findings.filter(item => item.disposition === 'open');
      const plan = ['# Improvement plan', '', `Target: ${short(result.report.target)}. Input digest: ${result.report.inputDigest}.`, '', 'Preserve required features, useful statuses, actual costs, navigation, accessibility and accepted style.', '', ...actionable.flatMap((item, i) => [`## ${i + 1}. ${short(item.title)}`, '', `Evidence (${item.confidence}): ${short(item.evidence, 1000)}`, '', `Change: ${short(item.recommendation, 1000)}`, '', 'Verify the original issue and the relevant preserved behaviour. Record unassessed runtime or contextual work.', '']), ...(actionable.length ? [] : ['No supported static findings. Select relevant contextual review domains before claiming full verification.']), ''].join('\n');
      console.log(values.json ? JSON.stringify({ inputDigest: result.report.inputDigest, findings: actionable, plan }, null, 2) : plan);
    } else outputReport(saved?.report || result.report, values, saved?.output);
    return exitFor(result.report, values['fail-on']);
  } finally {
    process.removeListener('SIGINT', cancel);
    process.removeListener('SIGTERM', cancel);
  }
}

main().then(code => { process.exitCode = code; }).catch(error => {
  const known = error instanceof CraftcheckError;
  const detail = known ? error.toJSON() : { code: 'OPERATION_FAILED', message: short(error.message), fix: 'Inspect file permissions and the selected inputs. Existing reports and backups are retained.' };
  console.error(JSON.stringify(sanitize(detail), null, 2));
  process.exitCode = error.code === 'CANCELLED' ? 130 : 2;
});
