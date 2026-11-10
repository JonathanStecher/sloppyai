# Reviewer, fixer and check hooks

Hooks let the controller use a caller-chosen agent or project tool. Craftcheck does
not implement a model service or require an additional API key. The host/command
decides whether it uses a subscription, network or paid provider.

## Authorization

Command arrays in .craftcheck.json are inert without --allow-exec. Source changes
also require --apply. Inspect the commands and authorized scope first. The process
inherits the caller's environment and permissions. It is not a sandbox.

The initial effective configuration is pinned during a loop/watch. A hook cannot
silently expand the commands by editing configuration mid-run. Stop on regression,
timeout, no progress or exhaustion; do not turn a failed attempt into an approval.

## Reviewer

The reviewer receives these environment variables:

| Name | Value |
| --- | --- |
| CRAFTCHECK_REQUEST | JSON request with target, inputDigest, observation path and review output path |
| CRAFTCHECK_TARGET | The selected artifact |
| CRAFTCHECK_REPORT | Current static observation JSON |
| CRAFTCHECK_REVIEW | Write a review-schema JSON document here |

The hook should inspect applicable evidence, leave the artifact unchanged, write
its review and exit zero. Review JSON has inputDigest, reviewer, assessments and
findings. See [the schema](../skills/craftcheck/schemas/review.schema.json).
Only rate assessed domains, with rationale and evidence. Ratings use the
[0–5 rubric](../skills/craftcheck/references/ratings.md).

A fresh reviewer runs for each assessment, including after repairs. The controller
rejects a digest mismatch. Scores remain self-reported and distinct from automated
checks; they do not certify independent runtime behaviour.

## Fixer

The fixer receives CRAFTCHECK_REQUEST, CRAFTCHECK_TARGET and CRAFTCHECK_REPORT.
The request includes the current inputDigest, report and preservation constraints.
Repair only authorized source, preserve required behaviour, and exit zero.

After the hook, the controller re-audits source and reruns the pinned checks.
It stops when new objective failures or passing-to-failing checks appear. External
changes are retained for inspection, not automatically reverted. Use your normal
reviewable diff or an isolated checkout. Built-in fixes have separate private backups.

If a hook fails or a run is interrupted, the controller captures current static
inputs without invoking more hooks, marks the result partial, and records the stop
reason. Old reviewer ratings are not reused. If the final input cannot be read,
the retained report explicitly says its snapshot predates the interruption.

## Checks and retries

Each check defines name, command, optional timeoutMs and attempts (1–3). The
controller records every attempt's exit, timeout, duration and output digest.
Passing after retry is explicitly reported. Raw output is omitted by default;
--include-check-output retains only bounded recognizable-secret-redacted failure text.

A child exit is observed evidence; a target-controlled test runner's reported test
completion remains self-reported. Missing execution authorization stays visible.
If a check mutates the assessed source, verification stops with an input-change
error. Re-audit and repeat against stable inputs; old reviewer scores are not
treated as assessments of the changed artifact.

## Minimal hook integration test

The examples/hooks directory contains a deterministic fixture reviewer and fixer.
They demonstrate the protocol on the authored example only. They are not an LLM,
an independent judge or a general quality evaluator.
