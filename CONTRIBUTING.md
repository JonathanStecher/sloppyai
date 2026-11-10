# Contributing

Use Node.js 22.13 or later. Run npm ci --ignore-scripts, then npm run check.
Read AGENTS.md and the relevant module before changing code.

## Rules and references

Canonical entries live in skills/sloppyai/catalog. Each entry needs a stable ID,
kind, domain, applicability, rationale, guidance, verification, source references
and counterexamples where contextual judgment matters. Preserve all original
image/item mappings. Keep rules, options and glossary definitions distinct.

For a new check include a real failing case and a legitimate counterexample.
Show the consequence and why available evidence supports the precise finding.
Do not infer AI authorship from design or prose. Do not promote a social-media
opinion into a universal requirement. Map standards to the actual version and
correct units; preserve exceptions and platform differences.

## Code and tests

Edit src rather than generated helper bundles. Run npm run build to regenerate
portable helpers, licence notices and docs/catalog.md. Keep the installed skill
self-contained. Test behavioural invariants and actual failure modes; avoid tests
that only match wording, private implementation or arbitrary counts.

Relevant checks include source preservation, stale-review rejection, rating
comparability, unassessed coverage, command authorization, timeouts/retries,
no-progress and regression stops, redaction, undo conflicts and package portability.
Changes to packaging need a real npm pack/install/remove exercise in a temporary directory.

## Proposals and pull requests

Explain the problem, resulting behaviour, relevant validation and remaining limits.
Keep demonstrations synthetic or appropriately licensed. Include provenance and
required notices for adapted code or text; rewriting is not a licence exemption.
Do not submit credentials, private paths, customer records or unreviewed raw reports.

Small improvements are welcome. A useful result can also be removing a noisy check
or demonstrating that an existing pattern is appropriate in context.
