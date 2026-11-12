# Operational interface density review

This is a task-specific workflow, not a rule that cards, eyebrows, descriptions,
icons, borders, colors or gradients indicate AI authorship. In a marketing page an
eyebrow or subtitle may orient a visitor; in a repetitive internal dashboard the
same text can delay access to real decisions. Respect the user's accepted style.

## Evidence inventory

Trace the first complete task before changing presentation. For each repeated
element, record its location, role and consequence.

| Element | Keep when it does | Candidate for change when it |
| --- | --- | --- |
| Page heading | Names the current work context | Repeats a breadcrumb and title with no added meaning |
| Subtitle | Explains scope or a financial definition | Restates "all in one place" on every screen |
| Eyebrow | Establishes meaningful category or status | Repeats the company name on every page |
| Badge | Shows *actual* state, warning or provenance | Repeats "demo" on every row and card |
| Icon | Accelerates recognition of a real action or domain | Is decorative beside every KPI without extra meaning |
| Divider / card border | Clarifies grouping or interactive boundaries | Creates visual noise through every row |
| Color | Distinguishes risk, source, action or series | Adds arbitrary product-colored decoration |
| Empty state | Explains missing data and a recovery path | Pretends to report real incidents for demo fixtures |

Confirm whether repeated text is truly redundant at desktop *and* mobile widths,
in all available languages and when a panel is isolated from the rest of the page.
Remove repetitions only when the page still answers: What am I viewing? What is
the value and unit? Is it live, stale or simulated? What action follows?

## Before → after example (internal operations workspace)

- **Before:** An eyebrow repeats the parent-company name, a promotional slogan
  appears above the section title, and a subtitle repeats the dashboard purpose.
  **After:** A single localized page heading identifies the current module.
- **Before:** Each card repeats a demo badge and a neutral icon. **After:** A
  persistent, visibly labeled simulated-data marker, metric names and units,
  with status markers retained where the state varies.
- **Before:** Every card and table row uses a border, separate accent and shadow.
  **After:** Shared Scenvy-style neutral surfaces, restrained separators only
  where grouping requires them, and one navigation icon set with consistent geometry.
- **Before:** Fictitious "recent alerts" suggest incidents occurred.
  **After:** An accurate "monitoring unavailable" empty state until a provider is connected.

These are examples of a *user-requested* repair in a private financial dashboard.
They are not a global styling preference and do not authorize deleting real alerts,
cost details, privacy controls, error recovery or required descriptions.

## Preservation contract

Keep actionable financial labels and units, product names, filter options, chart
series keys, legitimate status, accessible names, browser focus, responsive
reflow, localization, and factual data-provenance. If samples are shown, make the
sample status unambiguous without labeling every number individually.

Keep UI primitives and sizing tokens in the shared design system. Change the
source of truth (for example the existing Card, Table or NavItem), rather than
adding page-specific overrides or a parallel component library.

## Verification

1. Capture baseline source and screenshots at representative widths.
2. Record specific observed problems, severity and confidence; do not use
   "looks AI-generated" as evidence or a score.
3. Implement a reversible change in the shared components and page composition.
4. Run source checks *and* browser checks: keyboard paths, mobile navigation,
   horizontal overflow, controls, meaningful empty states and language variants.
5. Check contrast and icon accessible names (e.g. axe). Manually inspect
   legibility, the scan path, and any legitimate density or terminology concerns.
6. Rerun the same checks. Keep old findings, newly observed issues, and coverage
   gaps. State which tests ran and never treat a static pass as pixel-level proof.

Further worked context: [operational UI case study](../../../docs/operational-ui-case-study.md).
