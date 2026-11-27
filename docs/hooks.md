# Reviewer, fixer and check hooks

Hooks let the controller use a caller-chosen agent or project tool. sloppyai does
not implement a model service or require an additional API key. The host/command
decides whether it uses a subscription, network or paid provider.

## Authorization

Command arrays in .sloppyai.json are inert without --allow-exec. Source changes
also require --apply. Inspect the commands and authorized scope first. The process
inherits the caller's environment and permissions. It is not a sandbox.

The initial effective configuration is pinned during a loop/watch. A hook cannot
silently expand the commands by editing configuration mid-run. Stop on regression,
timeout, no progress or exhaustion; do not turn a failed attempt into an approval.

## Reviewer

The reviewer receives these environment variables:

| Name | Value |
| --- | --- |
| SLOPPYAI_REQUEST | JSON request with target, inputDigest, observation path and review output path |
| SLOPPYAI_TARGET | The selected artifact |
| SLOPPYAI_REPORT | Current static observation JSON |
| SLOPPYAI_REVIEW | Write a review-schema JSON document here |

Read `guidance.checklistFile` and the relevant `guidance.domainReferences` in
the request. Read `guidance.rubricFile` and `guidance.reviewSchemaFile` before
writing the review. Inspect applicable evidence, leave the artifact unchanged, write
its review and exit zero. Review JSON has inputDigest, reviewer, assessments and
findings. See [the schema](../skills/sloppyai/schemas/review.schema.json).
Only rate assessed domains, with rationale and evidence. Ratings use the
[0–5 rubric](../skills/sloppyai/references/ratings.md).

When design is enabled, `guidance.designReview` supplies the visual-quality
guide, the optional configured `designBrief`, and eight catalogue-backed criteria.
They start not assessed with no evidence or score. Review the rendered artifact
against the brief before attributing a design judgment; source checks do not
judge colour harmony, typography, imagery or taste. The same guidance reaches
the fixer. Changing the brief changes the input digest and invalidates old reviews.

The same `designReview` includes `referencePolicy` (quality by default, or an explicit
style preference) and `qualityWorkflow`, an unassessed set of product-direction and
rendered-critique prompts linked to the self-contained quality-benchmark guide.
Neither object supplies a visual verdict. `designBrief.referenceUse` changes are
bound to the input digest like the rest of the brief.

`designReview.changeContract` carries `designBrief.changeScope` (`refine`,
`redesign`, `restore`), `preferredDirection`, `requestedChanges`, `preserve` and
`avoid`, plus instructions and verification work. Missing scope starts with
`refine` and is marked `explicit: false`. It is a planning default, not automatic
scope enforcement or a rule against an explicitly requested redesign.

Resolve the named preferred baseline before making or reviewing changes; its
label does not load evidence. Review the requested improvement and preserved
direction separately, including matched rendered states when assessing visual
quality. A source-only contract remains `not_assessed` with empty evidence.
Changing these brief fields invalidates prior reviewer bindings.

When confirming an existing finding, reuse its rule ID, relative path and source
anchor. The controller retains the static observation and uses the review
confirmation to schedule contextual work.

A fresh reviewer runs for each assessment, including after repairs. The controller
rejects a digest mismatch. Scores remain self-reported and distinct from automated
checks; they do not certify independent runtime behaviour.

## Fixer

The fixer receives SLOPPYAI_REQUEST, SLOPPYAI_TARGET and SLOPPYAI_REPORT.
The request includes the current inputDigest, report and preservation constraints.
Read `guidance.repairGuideFile` and the installed checklist for the relevant
repair. Join `guidance.steps` to report findings by `findingId` to see the
method, reviewer confirmation and rule-specific verification. Repair only
authorized source, preserve required behaviour, and exit zero.
For visual work, follow the same `designReview.changeContract` that reached the
reviewer. Local type, control and copy refinements should retain the preferred
composition and character; broader redesign or restoration follows its selected scope.

After the hook, the controller re-audits source and reruns the pinned checks.
It stops when new objective failures, comparable reviewer rating declines or
passing-to-failing checks appear. A passing project check does not erase a
supported visual regression. External
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
