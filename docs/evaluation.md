# Evaluation and assurance

The automated suite verifies executable contracts: detection/counterexamples,
source preservation, fresh-review binding, score comparison, loop termination,
command authorization/retries/timeouts, private state, undo conflicts and packaging.
These tests are not an empirical claim that an LLM makes better design decisions.

## Behavioural cases

- Weak source with demonstrable naming, zoom and language issues.
- Legitimate gradient/serif/rounded-card design that should remain unchanged.
- Correct labels, decorative images and image links.
- HTML fragments and source with external/dynamic context.
- Stale versus fresh reviewer output.
- Repair, preserved behaviour and conflict-aware undo.
- No-op fixers, regressions, timeouts, cancellation and bounded retries.
- Per-iteration reviewer scores and rating deltas.
- Managed install/remove and an installed package without source dependencies.

## Future comparative study

To evaluate judgment quality, use representative tasks with hidden counterexamples
and compare an agent without guidance, a short checklist and Craftcheck under
comparable models, tools and budgets. Blind reviewers to the producing approach
where practical. Measure correct findings, false positives, preserved behaviour,
task completion, factual accuracy, accessibility changes, unnecessary edits and cost.

Use holdout cases and publish methods and limitations. Independent agreement does
not replace evidence. No paid cross-model benchmark or independent human study has
been represented as completed in this release.
