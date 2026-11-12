# Case study: removing redundant presentation from an operations dashboard

This case is based on a private multi-product company command center. Specific
business identifiers, screenshots, customer data and repository files are not
republished. The relevant pattern is generalizable; the visual preference is
specific to an *internal operational workspace*, not a universal design mandate.

## Baseline and goal

The owner wanted the interface to follow an established software product's
component system and to stop displaying generic promotional framing. The baseline
contained repeated page eyebrows, a slogan-like title and subtitle, tutorial
content in the overview, example-data labels on multiple panels, decorative
KPI icons, repeated product descriptions, and numerous card/row dividers.

The goal was faster scanning of **metrics, products, providers and development
status**, retaining navigation, explanatory labels where necessary and data
provenance. The first source audit found a separate component/CSS path; this was
migrated to existing shared primitives before the density pass. A successful build
alone did not prove visual equivalence or WCAG compliance.

## Before / after observations

| Screen area | Source observation before | Focused change | Protection against regression |
| --- | --- | --- | --- |
| Module header | Company-name eyebrow, slogan and repeated subtitle | One localized module title | Unit test: no redundant marketing strings; browser asserts heading |
| Example data | Repeated badges and captions competed with metrics | Single persistent "Sample data" marker | Unit and browser assert marker exists exactly once |
| KPI cards | Similar decorative icon and caption on every value | Label + numeric value, no redundant icon | Source test on shared metric primitive |
| Overview | Generic setup-roadmap card under operational metrics | Remove tutorial block, retain real provider status | Browser tests for filters and status table |
| Product cards | Fictitious logo tiles and repeated project descriptions | Name and the four useful quantities | Browser checks across product filters |
| Tables | Heavy repeated row borders | Shared TableRow uses subtler/no row rule and accessible scroll region | Source and axe keyboard checks |
| Alerts | Synthetic incidents appeared even before monitoring existed | Truthful unavailable-monitoring state | Alert drawer navigation test |
| Icons / colors | Product-by-product decorative accents beyond existing design system | Consistent navigation icons and shared neutral tokens | Shared-component contract and geometry tests |

This is a user preference and source-level evidence, not proof the previous UI
was AI-authored. If the product were a marketing landing page, retaining a
headline, explanation, imagery and CTA could be necessary.

## What we learned for sloppy.ai

**The valuable unit of inspection is not an aesthetic token but an element's
job in a user task.** A badge is harmful when it repeats an already conspicuous
status without adding information; it is essential when it distinguishes
live from simulated financial data. A border can be useful to isolate controls
and unhelpful between every item in a simple list. Icon deletion is appropriate
when decorative, but not when an icon is a recognizable affordance with an
accessible label.

A reviewer should record an evidence table with location, observed duplication,
task consequence, change, check and coverage gap. Apply fixes at shared component
or design-token boundaries. Verify all states, not just the most polished screenshot.

## Verification boundaries

For this case, source transformations can establish that named elements were
removed, and tests can establish that navigation, forecasts and labels persist.
Playwright and axe can cover key responsive and accessibility interactions.
Manual side-by-side visual checks remain required before claiming full pixel
identity with the source product. The static CLI has no evidence that an eyebrow,
gradient, card or icon alone is an AI-authorship signal.

Use the [operational interface review](../skills/sloppyai/references/operational-ui.md)
for a repeatable review sequence. No new automated blanket "slop" rule is added.

## Follow-up: compact finance layout on a phone

A subsequent phone screenshot showed one very wide card per short financial
value and product/time filters stacked vertically. This consumed multiple
screenfuls before the user reached detailed numbers.

The repair used **two equal-width metric columns at phone sizes**, capped
desktop card width, allowed long amounts to occupy both mobile columns, and
placed two Scenvy-based Select controls in the same row. The user also required
real decision-useful financial dimensions: product/direct/shared expenses,
MRR, ARR, cost categories and contribution margins. This requires internally
reconcilable example fixtures before live API integrations are ready.

Verification should compare narrow mobile screenshot and computed card bounds,
check both languages and long currency strings, and assert that category
expenses plus shared overhead equal the headline expense total. The benefit
is reduced scrolling while keeping readable numbers and tap targets. This does
not justify shrinking every card in dashboards with more complex content.

**Data caveat:** synthetic metrics and projected annual run rates must be
visibly identified; they are not evidence of live bookings, real bank movements
or actual audited financial statements.
