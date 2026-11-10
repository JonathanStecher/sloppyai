# Evidence and ratings

sloppyai separates requirements, contextual heuristics, optional techniques and
definitions. It reports what was actually assessed and allows a clean scoped result.

## Automated scores

For a domain with applicable implemented checks, start at 100 and subtract the
penalties for unique supported requirement findings: critical 25, high 12,
medium 6, low 2, suggestion 0. Clamp at zero. Tentative patterns, heuristics and
review-origin findings do not lower this automated score. Unassessed domains use null.

The number describes the implemented checks in partial scope. A score of 100 does
not establish complete quality, accessibility, security or legal compliance.
Reports keep review prompts, limits and coverage next to the number.

## Reviewer scores

Human or agent reviewers supply 0–5 ratings with identity, rationale and evidence.
The [rubric](../skills/sloppyai/references/ratings.md) measures the assessed goal.
Reviewer output is schema-validated, bound to current static inputs and labelled
self-reported. It remains separate from automated scores.

Compatible deltas require the same target identity, engine, catalogue and effective
configuration. Reviewer deltas also require the same identity and domain. Changed
scope produces no numeric delta. A score change alone does not close a finding.

## Issue history

Stable IDs combine rule, relative path and a source anchor. Line shifts alone do
not define identity, but major structure changes can produce new anchors. History
records first/last observations, severity, confidence and disposition. A previously
absent issue that reappears is marked regressed. An absent static finding is
not_observed, not independently verified. Limited/empty inputs cannot close issues.

## Loop decisions

The loop checks source and authorized commands, optionally obtains a fresh review,
makes a narrow fix or calls an authorized fixer, and repeats the assessment.
It retains snapshots, rating changes, failed attempts and stop reasons. New
objective failures, worsened requirement severity or a passing-to-failing command
stop the loop. A lack of useful progress reaches the stall bound.

Only the assessed automated and configured reviewer targets determine the target
stop. Outstanding review prompts and unassessed domains remain visible. Deadlines,
attempt limits and target scores are never approval to publish or spend more.
