# Ratings, evidence and iteration

Keep two rating systems separate.

## Automated check score: 0–100

For each enabled domain with applicable implemented static checks, start at 100.
Deduct 25 for each critical, 12 high, 6 medium and 2 low supported requirement
finding; suggestions deduct zero. Clamp at zero. Count each stable finding once.
Tentative source patterns, review-origin findings and heuristic prompts are not
automated confirmed failures and do not lower this number. A domain with no
applicable implemented checks is null / Not assessed.

This is a defined check score within partial scope. It is not an authorship
probability, overall quality percentage, security rating or conformance certificate.
The report shows review prompts and coverage alongside it.

## Reviewer assessment: 0–5

Rate only a domain actually assessed and supply evidence and rationale:

- 0: The assessed goal fails or creates a demonstrated serious harmful outcome.
- 1: Major task or comprehension failures dominate the assessed experience.
- 2: Parts work, but substantial assessed problems remain.
- 3: The main task works with relevant gaps or rough edges.
- 4: The assessed task is clear and works; remaining concerns are limited.
- 5: The stated scope meets its criteria with strong current supporting evidence.

Do not award 5 for polish or a missing test. State who rated it and how. All imported
human/agent ratings are self-reported, not independent witnessed runtime verification.
Security and legal concerns still need individual findings and scoped evidence.

Reviews use schemas/review.schema.json and the current audit inputDigest. A changed
manifest, configuration, catalogue or engine invalidates the old binding. Reviewer
hooks run again on every assessment; the default reviewer target is 4/5. Do not
carry old scores into changed inputs or fabricate gains. Comparison requires the
same target, configuration and engine/catalogue; reviewer deltas also require the
same reviewer identity and domain.

## Issue history

An issue records first/last observation, current severity and each observation.
Statuses distinguish open, needs_review, accepted, not_observed, not_assessed and
regressed. Not observed means the current implemented checks no longer report it;
it is not independent runtime closure. Structural changes may change anchors.

The helper preserves each assessment, per-domain scores, reviewer scores, failed
command attempts, comparisons and stop reasons. It stops on regression, stalled
progress, configured limits, missing execution authorization or cancellation.
Never weaken an assertion or delete required content to improve a number.
