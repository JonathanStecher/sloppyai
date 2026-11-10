# CLI and hook contract

Run the actual scripts/craftcheck.mjs with Node 22.13 or later. It is bundled and
works when the complete skill folder is copied without node_modules.

Commands: audit, plan, verify, loop, watch, init, catalog, history, undo, install,
uninstall. Use --help for current flags. The root README and docs/quickstart.md in
the source repository contain complete runnable examples.

Audit reads supported UTF-8 source and saves report.json, report.md, report.html,
history.json, snapshots and a checkpoint in the selected output directory. Use
--no-save for stdout-only audit/plan/verify. Source changes require loop/watch
--apply. Built-in fixes have private backups and conflict-aware undo.

Configuration is .craftcheck.json or an explicit --config JSON file. Its schema is
schemas/config.schema.json. Configure actual language, domains, exclusions,
preservation anchors, command checks and loop limits. Exclusions are relative
file/directory prefixes, not globs. The helper does not read project commands from
package scripts automatically.

Commands are arrays, never implicitly shell-interpolated. Configured checks,
reviewer and fixer hooks run only with --allow-exec. They have the caller's
permissions and may use network or paid services if the caller's command does so.
Inspect commands and authorize budgets before using them. Craftcheck does not
meter or sandbox an external program's own spending or side effects.

Reviewer environment:

- CRAFTCHECK_REQUEST: JSON with target, current inputDigest, observation path and output path.
- CRAFTCHECK_REPORT: static observation for this assessment.
- CRAFTCHECK_TARGET: selected target.
- CRAFTCHECK_REVIEW: write review-schema JSON here, then exit zero.

Fixer environment includes CRAFTCHECK_REQUEST, CRAFTCHECK_REPORT and CRAFTCHECK_TARGET.
The request includes current evidence and the preservation contract. Repair the
selected artifact and exit zero. The controller independently reruns its pinned
checks and audit. External changes are not automatically rolled back; use a
reviewable diff and a caller-approved isolated checkout where appropriate.

A check may retry one to three times as configured. All attempts remain visible;
a pass after retry is recorded as such. Loop defaults: three repair rounds,
two stalled rounds, five minutes, 100 automated check score and 4/5 reviewer score
when a reviewer is configured. Watch has separate cycle and total duration limits.

No network, telemetry, model service, scheduler or automatic update mechanism is
embedded in the helper. Reports and backups are local; do not publish them by default.
