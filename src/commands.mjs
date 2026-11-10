import { spawn } from 'node:child_process';
import { createHash } from 'node:crypto';
import { hash, short, stable, assertNotAborted } from './util.mjs';
import { rate, completion } from './ratings.mjs';

export async function executeCommand(definition, options) {
  assertNotAborted(options.signal);
  const started = Date.now();
  const timeoutMs = Math.max(1, Math.min(definition.timeoutMs || 30_000, options.deadline - started));
  if (options.deadline <= started) return { exitCode: null, timedOut: true, cancelled: false, durationMs: 0, outputDigest: hash(''), outputTruncated: false };
  return new Promise(resolve => {
    let outputBytes = 0;
    let tail = '';
    let timedOut = false;
    let cancelled = false;
    let spawnError = null;
    const digest = createHash('sha256');
    const child = spawn(definition.command[0], definition.command.slice(1), {
      cwd: options.cwd, shell: false, detached: process.platform !== 'win32',
      stdio: ['ignore', 'pipe', 'pipe'], windowsHide: true,
      env: { ...process.env, ...options.env }
    });
    const receive = data => { outputBytes += data.length; digest.update(data); tail = (tail + data.toString('utf8')).slice(-8000); };
    child.stdout?.on('data', receive);
    child.stderr?.on('data', receive);
    let escalation;
    const kill = signal => {
      try { if (process.platform !== 'win32' && child.pid) process.kill(-child.pid, signal); else child.kill(signal); }
      catch (_error) { /* A process may already have exited. */ }
    };
    const terminate = () => { kill('SIGTERM'); escalation = setTimeout(() => kill('SIGKILL'), 300); escalation.unref?.(); };
    const timer = setTimeout(() => { timedOut = true; terminate(); }, timeoutMs);
    const abort = () => { cancelled = true; terminate(); };
    options.signal?.addEventListener('abort', abort, { once: true });
    child.on('error', error => { spawnError = short(error.message); });
    child.on('close', code => {
      clearTimeout(timer); clearTimeout(escalation);
      options.signal?.removeEventListener('abort', abort);
      resolve({
        exitCode: code, timedOut, cancelled, durationMs: Date.now() - started,
        outputDigest: digest.digest('hex'), outputTruncated: outputBytes > 8000,
        ...(spawnError ? { error: spawnError } : {}),
        ...(options.includeOutput && (code !== 0 || timedOut) ? { output: short(tail, 2000) } : {})
      });
    });
  });
}

export async function runChecks(definitions, options) {
  const executions = [];
  for (const definition of definitions) {
    assertNotAborted(options.signal);
    const record = { name: short(definition.name, 80), commandDigest: hash(stable(definition.command)), status: 'not_run', attempts: [] };
    if (options.allowExec) {
      for (let attempt = 0; attempt < (definition.attempts || 1); attempt++) {
        if (Date.now() >= options.deadline) break;
        const result = await executeCommand(definition, options);
        record.attempts.push(result);
        if (result.exitCode === 0 && !result.timedOut && !result.cancelled) break;
        if (result.cancelled) break;
      }
      const last = record.attempts.at(-1);
      record.status = !last ? 'deadline' : last.cancelled ? 'cancelled' : last.timedOut ? 'timed_out' : last.exitCode === 0 ? record.attempts.length > 1 ? 'passed_after_retry' : 'passed' : 'failed';
    }
    executions.push(record);
  }
  return executions;
}

export function attachChecks(report, executions, domains) {
  report.checksExecution = executions;
  for (const execution of executions) {
    if (['passed', 'not_run'].includes(execution.status)) continue;
    const flaky = execution.status === 'passed_after_retry';
    report.findings.push({
      id: hash('E02\0' + execution.commandDigest + '\0' + execution.name).slice(0, 24),
      ruleId: 'E02', title: flaky ? 'Check passed only after retry' : 'Project check did not pass',
      domain: 'engineering', kind: 'requirement', severity: flaky ? 'low' : 'high', confidence: flaky ? 'tentative' : 'supported',
      location: { path: '<check:' + execution.name + '>', line: 1, anchor: 'command:' + execution.commandDigest },
      evidence: `${execution.name}: ${execution.status}; ${execution.attempts.length} attempt(s) retained.`,
      recommendation: flaky ? 'Investigate the failed attempt and retain its evidence; a retry is not proof of stable behaviour.' : 'Inspect the check privately, fix the root cause and rerun the identical command.',
      origin: 'command', assurance: 'Observed child-process exit and timeout; target-controlled output is self-reported.', disposition: 'open'
    });
  }
  if (executions.some(item => item.attempts.length)) report.checks.push({ ruleId: 'E02', domain: 'engineering', method: 'command', status: executions.some(item => ['failed', 'timed_out', 'deadline', 'cancelled'].includes(item.status)) ? 'failed' : 'passed', assessedFiles: 1, skippedFiles: 0, reasons: [] });
  const skipped = executions.filter(item => item.status === 'not_run').length;
  if (skipped) report.coverage.limitations.push(`${skipped} configured command check(s) were not run. Explicit --allow-exec is required.`);
  report.ratings = rate(report.findings, report.checks, domains);
  report.status = completion(report);
  if (skipped && report.status === 'no_supported_static_findings') report.status = 'partial';
  return report;
}
