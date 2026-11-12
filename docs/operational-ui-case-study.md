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

## Second follow-up: restoring purposeful icons and cost visualizations

After removing generic ornament, the user requested more icons, larger
container titles and small accent colors, because distinct financial values
still needed clearer recognition. The repair added *semantic*, standardized
KPI and section icons and increased title size across shared components,
rather than restoring the original promotional decoration.

Three task-linked visualizations were added: a cost-composition donut,
a revenue/direct-cost comparison by product, and an AI/GPU spending chart.
Colors were limited to shared theme tokens. Tables remain readable for exact
amounts. No gradient or glass card background was required.

The first added donut chart triggered an automated accessibility failure
because its SVG segments were exposed as images without accessible labels.
The relevant fix attached accessible category/amount labels to the segments.
This illustrates a useful rule: **visual enrichment is not complete until
data accessibility and the underlying values are preserved**.

The before/after lesson is iterative, not contradictory: remove redundant
ornament, then add back intentional recognition and comparison cues where
task evidence supports them. Do not convert either request into a universal
aesthetic ban or an algorithmic "AI-slop" score.

## Third follow-up: from card grid to a recognizable finance application

Further owner-provided finance-app references revealed that the compact
dashboard still needed a **stronger reading order**, not simply more metrics
or colored icons. The source-level repair changed the Overview from eight
equal-priority KPI cards at the top into a primary value+trend panel, paired
cost/contribution figures, four smaller supporting metrics, category rows
and an explicitly synthetic budget. Frequent modules gained a solid mobile
quick-navigation dock, while the full sidebar and product filters remained.

The mini spending chart was changed from hardcoded decorative bars to values
derived from the same example cost trend used elsewhere. The first browser
test found duplicate accessible chart names after switching from revenue to
costs. Giving the compact bar chart a different accessible name fixed the
ambiguity; hiding the chart from tests would not have improved users' access.

This exemplifies an additional dimension of visual review: **functional
hierarchy before ornament**. The material change is the position and
relationship of important data, not adoption of a fashionable gradient,
glass effect or color palette. The same approach may be wrong for
dense professional applications where equal-priority scanning is the
primary task.
