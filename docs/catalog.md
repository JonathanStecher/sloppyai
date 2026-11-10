# sloppyai catalogue

Generated from the canonical JSON records. Edit skills/sloppyai/catalog, then run npm run catalog.

194 entries, including all 102 original screenshot labels.

Kinds: requirement, heuristic, option, definition. An entry is not necessarily an implemented automated check.

## Entries

### A01: Document language

Domain: accessibility. Kind: requirement. Automation: static.

A document needs a correctly identified human language.

Set the actual language; do not infer it from a filename.

Verification: Run the supported static check and inspect its evidence; perform contextual or runtime verification where noted.

Counterexample: A synthetic fixture, explicitly public asset or effective control may change applicability; record the evidence.

Sources: [w3c-wcag22](#source-w3c-wcag22), [w3c-apg](#source-w3c-apg)

### A02: Image alternatives

Domain: accessibility. Kind: requirement. Automation: static.

Images need appropriate text alternatives or an intentional decorative treatment.

Describe the image's function; decorative images can use an empty alt attribute.

Verification: Run the supported static check and inspect its evidence; perform contextual or runtime verification where noted.

Counterexample: A synthetic fixture, explicitly public asset or effective control may change applicability; record the evidence.

Sources: [w3c-wcag22](#source-w3c-wcag22), [w3c-apg](#source-w3c-apg)

### A03: Form control names

Domain: accessibility. Kind: requirement. Automation: static.

Inputs, selects and text areas need accessible names.

Use associated labels or an appropriate accessible naming mechanism.

Verification: Run the supported static check and inspect its evidence; perform contextual or runtime verification where noted.

Counterexample: A synthetic fixture, explicitly public asset or effective control may change applicability; record the evidence.

Sources: [w3c-wcag22](#source-w3c-wcag22), [w3c-apg](#source-w3c-apg)

### A04: Button names

Domain: accessibility. Kind: requirement. Automation: static.

An actionable button needs an understandable accessible name.

Use meaningful visible text or a justified accessible label.

Verification: Run the supported static check and inspect its evidence; perform contextual or runtime verification where noted.

Counterexample: A synthetic fixture, explicitly public asset or effective control may change applicability; record the evidence.

Sources: [w3c-wcag22](#source-w3c-wcag22), [w3c-apg](#source-w3c-apg)

### A05: Zoom restrictions

Domain: accessibility. Kind: requirement. Automation: static.

Viewport metadata should not disable user zoom.

Remove restrictive user-scalable and maximum-scale values while preserving layout settings.

Verification: Run the supported static check and inspect its evidence; perform contextual or runtime verification where noted.

Counterexample: A synthetic fixture, explicitly public asset or effective control may change applicability; record the evidence.

Sources: [w3c-wcag22](#source-w3c-wcag22), [w3c-apg](#source-w3c-apg)

### A06: Heading structure

Domain: accessibility. Kind: requirement. Automation: partial.

Heading levels should communicate meaningful hierarchy.

Review jumps in context; components and fragments may have external structure.

Verification: Run the supported static check and inspect its evidence; perform contextual or runtime verification where noted.

Counterexample: A synthetic fixture, explicitly public asset or effective control may change applicability; record the evidence.

Sources: [w3c-wcag22](#source-w3c-wcag22), [w3c-apg](#source-w3c-apg)

### A07: Literal text contrast

Domain: accessibility. Kind: requirement. Automation: partial.

Known literal foreground/background colours can reveal insufficient contrast.

Verify actual computed colours and text size when styles or transparency are unresolved.

Verification: Run the supported static check and inspect its evidence; perform contextual or runtime verification where noted.

Counterexample: A synthetic fixture, explicitly public asset or effective control may change applicability; record the evidence.

Sources: [w3c-wcag22](#source-w3c-wcag22), [w3c-apg](#source-w3c-apg)

### A08: Focus visibility

Domain: accessibility. Kind: requirement. Automation: partial.

Keyboard focus needs an identifiable treatment.

Check the cascade and actual keyboard operation before concluding an outline rule removes focus.

Verification: Run the supported static check and inspect its evidence; perform contextual or runtime verification where noted.

Counterexample: A synthetic fixture, explicitly public asset or effective control may change applicability; record the evidence.

Sources: [w3c-wcag22](#source-w3c-wcag22), [w3c-apg](#source-w3c-apg)

### A09: Link names

Domain: accessibility. Kind: requirement. Automation: static.

Navigational links need understandable accessible names.

Preserve meaningful image alternatives and accessible naming references.

Verification: Run the supported static check and inspect its evidence; perform contextual or runtime verification where noted.

Counterexample: A synthetic fixture, explicitly public asset or effective control may change applicability; record the evidence.

Sources: [w3c-wcag22](#source-w3c-wcag22), [w3c-apg](#source-w3c-apg)

### A10: Unique DOM identifiers

Domain: accessibility. Kind: requirement. Automation: static.

Duplicate IDs can break labels, anchors and scripting.

Use unique identifiers and update their callers together.

Verification: Run the supported static check and inspect its evidence; perform contextual or runtime verification where noted.

Counterexample: A synthetic fixture, explicitly public asset or effective control may change applicability; record the evidence.

Sources: [w3c-wcag22](#source-w3c-wcag22), [w3c-apg](#source-w3c-apg)

### A11: Reduced motion and dynamic updates

Domain: accessibility. Kind: requirement. Automation: none.

Motion and asynchronous changes need appropriate accessible alternatives and announcements.

Test relevant preferences and assistive-technology behaviour.

Verification: Obtain direct source, visual or runtime evidence for this artifact and record assessment gaps.

Counterexample: A synthetic fixture, explicitly public asset or effective control may change applicability; record the evidence.

Sources: [w3c-wcag22](#source-w3c-wcag22), [w3c-apg](#source-w3c-apg)

### B01: Felt texture

Domain: design. Kind: option. Automation: none.

Fine fibres and soft shading evoke warm, tactile fabric.

Use subtle detail where it supports identity; preserve text contrast.

Verification: Inspect the actual composition, contrast, cost and rights before choosing the treatment.

Sources: [image-2](#source-image-2), [google-design](#source-google-design)

### B02: Fluted glass

Domain: design. Kind: option. Automation: none.

Parallel ridges refract or partially conceal imagery.

Use optical depth without hiding useful information or destabilizing controls.

Verification: Inspect the actual composition, contrast, cost and rights before choosing the treatment.

Sources: [image-2](#source-image-2), [google-design](#source-google-design)

### B03: Thermal gradients

Domain: design. Kind: option. Automation: none.

Heat-map-like colour transitions suggest energy and experimentation.

Keep decorative colour distinct from real measurements and semantic status.

Verification: Inspect the actual composition, contrast, cost and rights before choosing the treatment.

Sources: [image-2](#source-image-2), [google-design](#source-google-design)

### B04: Water ripples

Domain: design. Kind: option. Automation: none.

Wave patterns suggest fluidity, calm or movement.

Control animation intensity and provide an appropriate reduced-motion treatment.

Verification: Inspect the actual composition, contrast, cost and rights before choosing the treatment.

Sources: [image-2](#source-image-2), [google-design](#source-google-design)

### B05: Speckled graphite

Domain: design. Kind: option. Automation: none.

Irregular particles resemble graphite or rough drawing material.

Add texture without allowing grain to compete with small content.

Verification: Inspect the actual composition, contrast, cost and rights before choosing the treatment.

Sources: [image-2](#source-image-2), [google-design](#source-google-design)

### B06: Single-hue landscapes

Domain: design. Kind: option. Automation: none.

Layered scenery uses tonal differences to create depth.

Select scenery related to the subject or deliberate brand direction.

Verification: Inspect the actual composition, contrast, cost and rights before choosing the treatment.

Sources: [image-2](#source-image-2), [google-design](#source-google-design)

### B07: Blueprint grids

Domain: design. Kind: option. Automation: none.

Drafting grids and technical lines suggest precision.

Avoid implying real diagrams or functionality with meaningless technical decoration.

Verification: Inspect the actual composition, contrast, cost and rights before choosing the treatment.

Sources: [image-2](#source-image-2), [google-design](#source-google-design)

### B08: Halftone

Domain: design. Kind: option. Automation: none.

Regular dots simulate tones through size or density.

Use intentionally for print-inspired, editorial or retro imagery.

Verification: Inspect the actual composition, contrast, cost and rights before choosing the treatment.

Sources: [image-2](#source-image-2), [google-design](#source-google-design)

### B09: Grainy gradients

Domain: design. Kind: option. Automation: none.

Noise adds texture to smooth colour transitions.

Inspect banding, readability and exported resolution rather than adding noise by default.

Verification: Inspect the actual composition, contrast, cost and rights before choosing the treatment.

Sources: [image-2](#source-image-2), [google-design](#source-google-design)

### B10: Grass texture

Domain: design. Kind: option. Automation: none.

Directional blades or fibres evoke organic outdoor surfaces.

Keep dense detail away from foreground tasks and meaningful labels.

Verification: Inspect the actual composition, contrast, cost and rights before choosing the treatment.

Sources: [image-2](#source-image-2), [google-design](#source-google-design)

### B11: Dithered images

Domain: design. Kind: option. Automation: none.

Pixel patterns simulate tones in a restricted palette.

Preserve subject recognition and use limited-palette aesthetics deliberately.

Verification: Inspect the actual composition, contrast, cost and rights before choosing the treatment.

Sources: [image-2](#source-image-2), [google-design](#source-google-design)

### B12: Paper texture

Domain: design. Kind: option. Automation: none.

Fibres, grain and folds evoke editorial or handmade materials.

Match texture to the identity and keep it consistent across surfaces.

Verification: Inspect the actual composition, contrast, cost and rights before choosing the treatment.

Sources: [image-2](#source-image-2), [google-design](#source-google-design)

### B13: Contour lines

Domain: design. Kind: option. Automation: none.

Topographic-style curves suggest terrain and flow.

Distinguish decorative contours from actual geographic data.

Verification: Inspect the actual composition, contrast, cost and rights before choosing the treatment.

Sources: [image-2](#source-image-2), [google-design](#source-google-design)

### B14: Cloud sky

Domain: design. Kind: option. Automation: none.

Atmospheric imagery provides openness, colour and mood.

Choose stable text placement and appropriate image rights.

Verification: Inspect the actual composition, contrast, cost and rights before choosing the treatment.

Sources: [image-2](#source-image-2), [google-design](#source-google-design)

### B15: Pixel mosaics

Domain: design. Kind: option. Automation: none.

Coloured cells reduce imagery into geometric patterns.

Preserve important detail and use abstraction where the subject allows it.

Verification: Inspect the actual composition, contrast, cost and rights before choosing the treatment.

Sources: [image-2](#source-image-2), [google-design](#source-google-design)

### B16: Lens distortion

Domain: design. Kind: option. Automation: none.

Localized refraction or magnification creates optical depth.

Keep essential text and interactive targets stable and recognizable.

Verification: Inspect the actual composition, contrast, cost and rights before choosing the treatment.

Sources: [image-2](#source-image-2), [google-design](#source-google-design)

### B17: Stippled gradients

Domain: design. Kind: option. Automation: none.

Irregular dot density creates tonal transitions.

Use for organic drawing-like texture without overwhelming detail.

Verification: Inspect the actual composition, contrast, cost and rights before choosing the treatment.

Sources: [image-2](#source-image-2), [google-design](#source-google-design)

### B18: Square-dot grids

Domain: design. Kind: option. Automation: none.

Repeated small squares establish a technical structure.

Keep repetition subordinate to foreground information.

Verification: Inspect the actual composition, contrast, cost and rights before choosing the treatment.

Sources: [image-2](#source-image-2), [google-design](#source-google-design)

### B19: Blurred photos

Domain: design. Kind: option. Automation: none.

Blur preserves atmosphere while reducing photographic detail.

Do not conceal product evidence or rely on unpredictable background contrast.

Verification: Inspect the actual composition, contrast, cost and rights before choosing the treatment.

Sources: [image-2](#source-image-2), [google-design](#source-google-design)

### B20: Iridescent shapes

Domain: design. Kind: option. Automation: none.

Pearlescent colour shifts imitate reflective materials.

Use expressive material effects with clear hierarchy and controlled rendering cost.

Verification: Inspect the actual composition, contrast, cost and rights before choosing the treatment.

Sources: [image-2](#source-image-2), [google-design](#source-google-design)

### B21: Impressionist paintings

Domain: design. Kind: option. Automation: none.

Loose brushwork and colour patches provide atmosphere.

Prefer more precise imagery when identification or factual detail matters.

Verification: Inspect the actual composition, contrast, cost and rights before choosing the treatment.

Sources: [image-2](#source-image-2), [google-design](#source-google-design)

### B22: ASCII and pixels

Domain: design. Kind: option. Automation: none.

Character art and low-resolution graphics evoke computing or games.

Preserve legibility, appropriate semantics and meaningful text alternatives.

Verification: Inspect the actual composition, contrast, cost and rights before choosing the treatment.

Sources: [image-2](#source-image-2), [google-design](#source-google-design)

### C01: Vague marketing phrases

Domain: copy. Kind: heuristic. Automation: partial.

Common promotional phrases can replace a concrete explanation.

Name the audience, task and actual result; a deliberate phrase is not an authorship signal.

Verification: Run the supported static check and inspect its evidence; perform contextual or runtime verification where noted.

Counterexample: An intentional, appropriate project choice or existing verified control can make this concern inapplicable.

Sources: [govuk-ui](#source-govuk-ui), [copyhackers-research](#source-copyhackers-research), [wikipedia-aisigns](#source-wikipedia-aisigns)

### C02: Unsupported absolute claims

Domain: copy. Kind: heuristic. Automation: partial.

Perfect, guaranteed, unlimited and similar claims can misrepresent capability.

Request evidence and conditions or replace the claim with an accurate statement.

Verification: Run the supported static check and inspect its evidence; perform contextual or runtime verification where noted.

Counterexample: An intentional, appropriate project choice or existing verified control can make this concern inapplicable.

Sources: [govuk-ui](#source-govuk-ui), [copyhackers-research](#source-copyhackers-research), [wikipedia-aisigns](#source-wikipedia-aisigns)

### C03: Vague action labels

Domain: copy. Kind: heuristic. Automation: partial.

Generic CTA labels may conceal the next action.

Evaluate the surrounding context before replacing labels such as Continue.

Verification: Run the supported static check and inspect its evidence; perform contextual or runtime verification where noted.

Counterexample: An intentional, appropriate project choice or existing verified control can make this concern inapplicable.

Sources: [govuk-ui](#source-govuk-ui), [copyhackers-research](#source-copyhackers-research), [wikipedia-aisigns](#source-wikipedia-aisigns)

### C04: Repeated paragraphs

Domain: copy. Kind: heuristic. Automation: partial.

Duplicate substantial paragraphs can add reading effort without information.

Give each passage a distinct job and preserve intentional repeated notices.

Verification: Run the supported static check and inspect its evidence; perform contextual or runtime verification where noted.

Counterexample: An intentional, appropriate project choice or existing verified control can make this concern inapplicable.

Sources: [govuk-ui](#source-govuk-ui), [copyhackers-research](#source-copyhackers-research), [wikipedia-aisigns](#source-wikipedia-aisigns)

### C05: Customer vocabulary

Domain: copy. Kind: heuristic. Automation: none.

Copy should match how the audience describes its task and objections.

Use supplied research rather than invented customer quotes.

Verification: Obtain direct source, visual or runtime evidence for this artifact and record assessment gaps.

Counterexample: An intentional, appropriate project choice or existing verified control can make this concern inapplicable.

Sources: [govuk-ui](#source-govuk-ui), [copyhackers-research](#source-copyhackers-research), [wikipedia-aisigns](#source-wikipedia-aisigns)

### C06: Claim and proof alignment

Domain: copy. Kind: heuristic. Automation: none.

Material factual claims need supporting evidence.

Associate each claim with its actual source, scope and limitations.

Verification: Obtain direct source, visual or runtime evidence for this artifact and record assessment gaps.

Counterexample: An intentional, appropriate project choice or existing verified control can make this concern inapplicable.

Sources: [govuk-ui](#source-govuk-ui), [copyhackers-research](#source-copyhackers-research), [wikipedia-aisigns](#source-wikipedia-aisigns)

### C07: Useful error messages

Domain: copy. Kind: heuristic. Automation: none.

Errors should identify the problem and a safe recovery path.

State retained or lost work accurately and avoid unnecessary blame.

Verification: Obtain direct source, visual or runtime evidence for this artifact and record assessment gaps.

Counterexample: An intentional, appropriate project choice or existing verified control can make this concern inapplicable.

Sources: [govuk-ui](#source-govuk-ui), [copyhackers-research](#source-copyhackers-research), [wikipedia-aisigns](#source-wikipedia-aisigns)

### C08: Terminology and tone

Domain: copy. Kind: heuristic. Automation: none.

Terms and tone need to fit the task and remain consistent.

Preserve the established product vocabulary and emotional context.

Verification: Obtain direct source, visual or runtime evidence for this artifact and record assessment gaps.

Counterexample: An intentional, appropriate project choice or existing verified control can make this concern inapplicable.

Sources: [govuk-ui](#source-govuk-ui), [copyhackers-research](#source-copyhackers-research), [wikipedia-aisigns](#source-wikipedia-aisigns)

### C09: Localization

Domain: copy. Kind: heuristic. Automation: none.

Translation affects meaning, layout, number formats, currencies and pluralization.

Test supported languages and avoid translating legal or product terms mechanically.

Verification: Obtain direct source, visual or runtime evidence for this artifact and record assessment gaps.

Counterexample: An intentional, appropriate project choice or existing verified control can make this concern inapplicable.

Sources: [govuk-ui](#source-govuk-ui), [copyhackers-research](#source-copyhackers-research), [wikipedia-aisigns](#source-wikipedia-aisigns)

### C10: Material information

Domain: copy. Kind: heuristic. Automation: none.

Costs, renewal terms and prerequisites affect user decisions.

Present them before consequential actions; never invent a refund or trial policy.

Verification: Obtain direct source, visual or runtime evidence for this artifact and record assessment gaps.

Counterexample: An intentional, appropriate project choice or existing verified control can make this concern inapplicable.

Sources: [govuk-ui](#source-govuk-ui), [copyhackers-research](#source-copyhackers-research), [wikipedia-aisigns](#source-wikipedia-aisigns)

### K01: Useful first run

Domain: devex. Kind: heuristic. Automation: none.

A new user should obtain meaningful output through a documented short path.

Test the documented clean installation and first command.

Verification: Obtain direct source, visual or runtime evidence for this artifact and record assessment gaps.

Counterexample: An intentional, appropriate project choice or existing verified control can make this concern inapplicable.

Sources: [gstack-devex](#source-gstack-devex), [skills-spec](#source-skills-spec)

### K02: Actionable errors

Domain: devex. Kind: heuristic. Automation: none.

Failures need stable codes, explanations and safe next steps.

Include actual context without secrets and signal failure through the native channel.

Verification: Obtain direct source, visual or runtime evidence for this artifact and record assessment gaps.

Counterexample: An intentional, appropriate project choice or existing verified control can make this concern inapplicable.

Sources: [gstack-devex](#source-gstack-devex), [skills-spec](#source-skills-spec)

### K03: Capability-aware coverage

Domain: devex. Kind: heuristic. Automation: none.

Missing tools or inputs leave assessment gaps.

Report not assessed or blocked rather than inventing verification.

Verification: Obtain direct source, visual or runtime evidence for this artifact and record assessment gaps.

Counterexample: An intentional, appropriate project choice or existing verified control can make this concern inapplicable.

Sources: [gstack-devex](#source-gstack-devex), [skills-spec](#source-skills-spec)

### K04: Bounded retries

Domain: devex. Kind: heuristic. Automation: none.

Repeated attempts need deadlines, limits and no-progress stops.

Preserve attempts and stop on regression, cancellation or exhaustion.

Verification: Obtain direct source, visual or runtime evidence for this artifact and record assessment gaps.

Counterexample: An intentional, appropriate project choice or existing verified control can make this concern inapplicable.

Sources: [gstack-devex](#source-gstack-devex), [skills-spec](#source-skills-spec)

### K05: Evidence freshness

Domain: devex. Kind: heuristic. Automation: none.

Observations bind to specific source inputs and versions.

Invalidate stale reviews when their input digest differs.

Verification: Obtain direct source, visual or runtime evidence for this artifact and record assessment gaps.

Counterexample: An intentional, appropriate project choice or existing verified control can make this concern inapplicable.

Sources: [gstack-devex](#source-gstack-devex), [skills-spec](#source-skills-spec)

### K06: Contextual exceptions

Domain: devex. Kind: heuristic. Automation: none.

Accepted local choices need a clear scope and reason.

Retain justified preferences without waiving objective failures silently.

Verification: Obtain direct source, visual or runtime evidence for this artifact and record assessment gaps.

Counterexample: An intentional, appropriate project choice or existing verified control can make this concern inapplicable.

Sources: [gstack-devex](#source-gstack-devex), [skills-spec](#source-skills-spec)

### K07: Private reports

Domain: devex. Kind: heuristic. Automation: none.

Reports and execution hooks can expose sensitive context.

Keep local state private, redact evidence and avoid automatic uploads.

Verification: Obtain direct source, visual or runtime evidence for this artifact and record assessment gaps.

Counterexample: An intentional, appropriate project choice or existing verified control can make this concern inapplicable.

Sources: [gstack-devex](#source-gstack-devex), [skills-spec](#source-skills-spec)

### K08: Honest clean results

Domain: devex. Kind: heuristic. Automation: none.

An audit may legitimately have no supported findings.

State assessed scope and remaining gaps alongside the result.

Verification: Obtain direct source, visual or runtime evidence for this artifact and record assessment gaps.

Counterexample: An intentional, appropriate project choice or existing verified control can make this concern inapplicable.

Sources: [gstack-devex](#source-gstack-devex), [skills-spec](#source-skills-spec)

### E01: Silent catch blocks

Domain: engineering. Kind: requirement. Automation: partial.

An empty catch may discard a failure without explaining intended recovery.

Inspect whether ignoring the failure is deliberate and whether users or operators need feedback.

Verification: Run the supported static check and inspect its evidence; perform contextual or runtime verification where noted.

Counterexample: A synthetic fixture, explicitly public asset or effective control may change applicability; record the evidence.

Sources: [gstack-engineering](#source-gstack-engineering), [gstack-qa](#source-gstack-qa), [gstack-devex](#source-gstack-devex)

### E02: Executable project checks

Domain: engineering. Kind: requirement. Automation: static.

An authorized project check reports failure or timeout.

Use the actual exit result and preserve failed attempts; a later retry does not erase flakiness.

Verification: Run the supported static check and inspect its evidence; perform contextual or runtime verification where noted.

Counterexample: A synthetic fixture, explicitly public asset or effective control may change applicability; record the evidence.

Sources: [gstack-engineering](#source-gstack-engineering), [gstack-qa](#source-gstack-qa), [gstack-devex](#source-gstack-devex)

### E03: Preservation contract

Domain: engineering. Kind: requirement. Automation: static.

A required file or literal feature anchor is missing or has changed.

Check the agreed contract; literal anchors supplement semantic review rather than proving it.

Verification: Run the supported static check and inspect its evidence; perform contextual or runtime verification where noted.

Counterexample: A synthetic fixture, explicitly public asset or effective control may change applicability; record the evidence.

Sources: [gstack-engineering](#source-gstack-engineering), [gstack-qa](#source-gstack-qa), [gstack-devex](#source-gstack-devex)

### E04: State ownership

Domain: engineering. Kind: requirement. Automation: none.

Split ownership can create inconsistent updates and duplicated policy.

Prefer one clear owner and trace all relevant writers.

Verification: Obtain direct source, visual or runtime evidence for this artifact and record assessment gaps.

Counterexample: A synthetic fixture, explicitly public asset or effective control may change applicability; record the evidence.

Sources: [gstack-engineering](#source-gstack-engineering), [gstack-qa](#source-gstack-qa), [gstack-devex](#source-gstack-devex)

### E05: Module boundaries

Domain: engineering. Kind: requirement. Automation: none.

Interfaces should hide useful complexity and keep responsibilities coherent.

Compare alternatives when introducing a substantial new public boundary.

Verification: Obtain direct source, visual or runtime evidence for this artifact and record assessment gaps.

Counterexample: A synthetic fixture, explicitly public asset or effective control may change applicability; record the evidence.

Sources: [gstack-engineering](#source-gstack-engineering), [gstack-qa](#source-gstack-qa), [gstack-devex](#source-gstack-devex)

### E06: Reuse and duplication

Domain: engineering. Kind: requirement. Automation: none.

Similar-looking code does not establish equivalent behaviour.

Verify actual callers and contracts before extracting or replacing shared code.

Verification: Obtain direct source, visual or runtime evidence for this artifact and record assessment gaps.

Counterexample: A synthetic fixture, explicitly public asset or effective control may change applicability; record the evidence.

Sources: [gstack-engineering](#source-gstack-engineering), [gstack-qa](#source-gstack-qa), [gstack-devex](#source-gstack-devex)

### E07: Trust-boundary validation

Domain: engineering. Kind: requirement. Automation: none.

External data needs validation before internal use.

Inspect values, errors, side effects and downstream assumptions.

Verification: Obtain direct source, visual or runtime evidence for this artifact and record assessment gaps.

Counterexample: A synthetic fixture, explicitly public asset or effective control may change applicability; record the evidence.

Sources: [gstack-engineering](#source-gstack-engineering), [gstack-qa](#source-gstack-qa), [gstack-devex](#source-gstack-devex)

### E08: Meaningful regression tests

Domain: engineering. Kind: requirement. Automation: none.

Tests should fail when the real protected behaviour breaks.

Prefer real boundaries and record what mocks or fixtures leave unverified.

Verification: Obtain direct source, visual or runtime evidence for this artifact and record assessment gaps.

Counterexample: A synthetic fixture, explicitly public asset or effective control may change applicability; record the evidence.

Sources: [gstack-engineering](#source-gstack-engineering), [gstack-qa](#source-gstack-qa), [gstack-devex](#source-gstack-devex)

### E09: Dead and speculative code

Domain: engineering. Kind: requirement. Automation: none.

Unused helpers and premature extensibility increase maintenance work.

Remove only after checking actual callers and supported uses.

Verification: Obtain direct source, visual or runtime evidence for this artifact and record assessment gaps.

Counterexample: A synthetic fixture, explicitly public asset or effective control may change applicability; record the evidence.

Sources: [gstack-engineering](#source-gstack-engineering), [gstack-qa](#source-gstack-qa), [gstack-devex](#source-gstack-devex)

### E10: Documentation accuracy

Domain: engineering. Kind: requirement. Automation: none.

Examples, commands and diagrams need to match the implementation.

Run relevant examples and maintain documentation with changed contracts.

Verification: Obtain direct source, visual or runtime evidence for this artifact and record assessment gaps.

Counterexample: A synthetic fixture, explicitly public asset or effective control may change applicability; record the evidence.

Sources: [gstack-engineering](#source-gstack-engineering), [gstack-qa](#source-gstack-qa), [gstack-devex](#source-gstack-devex)

### E11: Operational recovery

Domain: engineering. Kind: requirement. Automation: none.

Partial failures, migrations and restoration need deliberate handling.

Test recovery against real invariants, not merely successful backup creation.

Verification: Obtain direct source, visual or runtime evidence for this artifact and record assessment gaps.

Counterexample: A synthetic fixture, explicitly public asset or effective control may change applicability; record the evidence.

Sources: [gstack-engineering](#source-gstack-engineering), [gstack-qa](#source-gstack-qa), [gstack-devex](#source-gstack-devex)

### T01: Kerning

Domain: design. Kind: definition. Automation: none.

Spacing adjustment between individual letter pairs.

Distinguish pair adjustments from tracking across a range of text.

Verification: Use this definition to interpret related findings.

Sources: [image-4](#source-image-4)

### T02: Optical centre

Domain: design. Kind: definition. Automation: none.

The location that appears visually centred.

Inspect asymmetric icons and shapes in their intended container.

Verification: Use this definition to interpret related findings.

Sources: [image-4](#source-image-4)

### T03: Tabular numbers

Domain: design. Kind: definition. Automation: none.

Digits that occupy equal horizontal widths.

Use to align numeric columns and prevent changing digits from shifting content.

Verification: Use this definition to interpret related findings.

Sources: [image-4](#source-image-4)

### T04: Layout shift

Domain: design. Kind: definition. Automation: none.

Visible content changes position after appearing.

Investigate delayed assets, fonts and unreserved space.

Verification: Use this definition to interpret related findings.

Sources: [image-4](#source-image-4), [google-vitals](#source-google-vitals)

### T05: Tracking

Domain: design. Kind: definition. Automation: none.

Uniform letter-spacing adjustment across text.

Apply in context rather than confusing it with pair-specific kerning.

Verification: Use this definition to interpret related findings.

Sources: [image-4](#source-image-4)

### T06: Optimistic update

Domain: design. Kind: definition. Automation: none.

The interface shows an expected result before server confirmation.

Plan reconciliation, reversal or recovery when the operation fails.

Verification: Use this definition to interpret related findings.

Sources: [image-4](#source-image-4)

### T07: x-height

Domain: design. Kind: definition. Automation: none.

The main lowercase body height represented by the letter x.

Compare apparent size and readability rather than nominal font size alone.

Verification: Use this definition to interpret related findings.

Sources: [image-4](#source-image-4)

### T08: Touch target

Domain: design. Kind: definition. Automation: none.

The area responding to pointer or touch activation.

Remember that the interactive region can exceed the visible icon.

Verification: Use this definition to interpret related findings.

Sources: [image-4](#source-image-4), [w3c-wcag22](#source-w3c-wcag22)

### T09: Leading

Domain: design. Kind: definition. Automation: none.

Distance between consecutive text baselines.

Set line height for reading conditions and content density.

Verification: Use this definition to interpret related findings.

Sources: [image-4](#source-image-4)

### T10: Origin-aware animation

Domain: design. Kind: definition. Automation: none.

Informal term for motion beginning from its initiating element.

Use the relationship to make a transition understandable.

Verification: Use this definition to interpret related findings.

Sources: [image-4](#source-image-4)

### T11: OKLCH

Domain: design. Kind: definition. Automation: none.

A colour model using lightness, chroma and hue.

Use perceptual palette adjustments and verify contrast separately.

Verification: Use this definition to interpret related findings.

Sources: [image-4](#source-image-4)

### T12: Widow

Domain: design. Kind: definition. Automation: none.

Traditionally a paragraph's final line stranded atop the next page or column.

In UI discussions clarify whether an isolated final word is meant instead.

Verification: Use this definition to interpret related findings.

Sources: [image-4](#source-image-4)

### T13: Safe area

Domain: design. Kind: definition. Automation: none.

Space avoiding obstruction by device features and system controls.

Keep essential controls and information within an appropriate usable region.

Verification: Use this definition to interpret related findings.

Sources: [image-4](#source-image-4)

### T14: Stagger

Domain: design. Kind: definition. Automation: none.

Small timing offsets between related animations.

Use sequence to communicate relationships without delaying essential content.

Verification: Use this definition to interpret related findings.

Sources: [image-4](#source-image-4)

### T15: Line length

Domain: design. Kind: definition. Automation: none.

Horizontal length of a text line.

Choose a measure suited to font, reading task, language and viewport.

Verification: Use this definition to interpret related findings.

Sources: [image-4](#source-image-4)

### T16: Affordance

Domain: design. Kind: definition. Automation: none.

An action an object or control allows.

Use signifiers to help users discover the available action.

Verification: Use this definition to interpret related findings.

Sources: [image-4](#source-image-4)

### T17: Combobox

Domain: design. Kind: definition. Automation: none.

An input associated with a popup of choices.

Distinguish editable and selection-only behaviours and implement their interaction model.

Verification: Use this definition to interpret related findings.

Sources: [image-4](#source-image-4), [w3c-apg](#source-w3c-apg)

### T18: Interruptible animation

Domain: design. Kind: definition. Automation: none.

Motion that responds before its prior transition completes.

Reverse or retarget smoothly when the user provides new input.

Verification: Use this definition to interpret related findings.

Sources: [image-4](#source-image-4)

### T19: Progressive disclosure

Domain: design. Kind: definition. Automation: none.

Additional detail becomes available when needed.

Keep essential actions and material information readily available.

Verification: Use this definition to interpret related findings.

Sources: [image-4](#source-image-4)

### T20: Shared element transition

Domain: design. Kind: definition. Automation: none.

An identifiable element changes size or position across views.

Preserve continuity without obscuring navigation or blocking interaction.

Verification: Use this definition to interpret related findings.

Sources: [image-4](#source-image-4)

### D01: Delete filler badges

Domain: design. Kind: heuristic. Automation: none.

Decorative labels can repeat nearby information and consume attention.

Remove only redundant labels; preserve useful status, prices, permissions and availability.

Verification: Inspect the relevant artifact and establish the concrete impact before recommending a change.

Counterexample: A deliberate choice serving the audience or an accepted project requirement is not a defect.

Sources: [image-3](#source-image-3), [nngroup-heuristics](#source-nngroup-heuristics)

### D02: Drop redundant labels

Domain: design. Kind: heuristic. Automation: none.

Repeated words can increase scanning effort.

Simplify repetition while preserving visible context and accessible control names.

Verification: Inspect the relevant artifact and establish the concrete impact before recommending a change.

Counterexample: A deliberate choice serving the audience or an accepted project requirement is not a defect.

Sources: [image-3](#source-image-3), [nngroup-heuristics](#source-nngroup-heuristics)

### D03: Unitalicize random words

Domain: design. Kind: heuristic. Automation: none.

Arbitrary emphasis creates inconsistent focal points.

Use an explicit typographic role and retain meaningful emphasis.

Verification: Inspect the relevant artifact and establish the concrete impact before recommending a change.

Counterexample: A deliberate choice serving the audience or an accepted project requirement is not a defect.

Sources: [image-3](#source-image-3), [nngroup-heuristics](#source-nngroup-heuristics)

### D04: Mono only where needed

Domain: design. Kind: heuristic. Automation: none.

Equal-width lettering adds a technical character and affects reading.

Choose it deliberately; use tabular digits separately where only numeric alignment is needed.

Verification: Inspect the relevant artifact and establish the concrete impact before recommending a change.

Counterexample: A deliberate choice serving the audience or an accepted project requirement is not a defect.

Sources: [image-3](#source-image-3), [nngroup-heuristics](#source-nngroup-heuristics)

### D05: Use a design system

Domain: design. Kind: heuristic. Automation: none.

Shared component and token decisions reduce drift.

Reuse the established system and specify states, terminology and behaviour.

Verification: Inspect the relevant artifact and establish the concrete impact before recommending a change.

Counterexample: A deliberate choice serving the audience or an accepted project requirement is not a defect.

Sources: [image-3](#source-image-3), [nngroup-heuristics](#source-nngroup-heuristics)

### D06: Show the actual product

Domain: design. Kind: heuristic. Automation: none.

Credible demonstrations help people evaluate capabilities.

Show genuine screens or outputs and label illustrative material accurately.

Verification: Inspect the relevant artifact and establish the concrete impact before recommending a change.

Counterexample: A deliberate choice serving the audience or an accepted project requirement is not a defect.

Sources: [image-3](#source-image-3), [nngroup-heuristics](#source-nngroup-heuristics)

### D07: Enlarge the main feature

Domain: design. Kind: heuristic. Automation: none.

Space and visual priority should follow user task importance.

Increase prominence selectively rather than enlarging everything.

Verification: Inspect the relevant artifact and establish the concrete impact before recommending a change.

Counterexample: A deliberate choice serving the audience or an accepted project requirement is not a defect.

Sources: [image-3](#source-image-3), [nngroup-heuristics](#source-nngroup-heuristics)

### D08: Group with spacing

Domain: design. Kind: heuristic. Automation: none.

Proximity communicates relationships.

Keep related items closer and distinct groups farther apart when appropriate.

Verification: Inspect the relevant artifact and establish the concrete impact before recommending a change.

Counterexample: A deliberate choice serving the audience or an accepted project requirement is not a defect.

Sources: [image-3](#source-image-3), [nngroup-heuristics](#source-nngroup-heuristics)

### D09: Make headlines specific

Domain: design. Kind: heuristic. Automation: none.

Concrete headings explain tasks and outcomes.

Replace vague aspiration with audience-relevant language supported by actual capability.

Verification: Inspect the relevant artifact and establish the concrete impact before recommending a change.

Counterexample: A deliberate choice serving the audience or an accepted project requirement is not a defect.

Sources: [image-3](#source-image-3), [nngroup-heuristics](#source-nngroup-heuristics)

### D10: Emphasize the CTA

Domain: design. Kind: heuristic. Automation: none.

The primary action needs recognizable priority.

Use clear labels, appropriate contrast and accurate consequences.

Verification: Inspect the relevant artifact and establish the concrete impact before recommending a change.

Counterexample: A deliberate choice serving the audience or an accepted project requirement is not a defect.

Sources: [image-3](#source-image-3), [nngroup-heuristics](#source-nngroup-heuristics)

### D11: Add an accent colour

Domain: design. Kind: heuristic. Automation: none.

A deliberate highlight can establish emphasis.

Assign consistent roles; retain effective monochrome designs when they work.

Verification: Inspect the relevant artifact and establish the concrete impact before recommending a change.

Counterexample: A deliberate choice serving the audience or an accepted project requirement is not a defect.

Sources: [image-3](#source-image-3), [nngroup-heuristics](#source-nngroup-heuristics)

### D12: Keep icons consistent

Domain: design. Kind: heuristic. Automation: none.

Icon style and meaning should remain coherent.

Match weight and sizing, and label unfamiliar essential actions.

Verification: Inspect the relevant artifact and establish the concrete impact before recommending a change.

Counterexample: A deliberate choice serving the audience or an accepted project requirement is not a defect.

Sources: [image-3](#source-image-3), [nngroup-heuristics](#source-nngroup-heuristics)

### D13: Remove embellishments

Domain: design. Kind: heuristic. Automation: none.

Ornaments can compete with useful information.

Retain decoration that contributes to identity, meaning or feedback.

Verification: Inspect the relevant artifact and establish the concrete impact before recommending a change.

Counterexample: A deliberate choice serving the audience or an accepted project requirement is not a defect.

Sources: [image-3](#source-image-3), [nngroup-heuristics](#source-nngroup-heuristics)

### D14: Inner radius = outer minus padding

Domain: design. Kind: heuristic. Automation: none.

Evenly inset rounded shapes usually need related corner geometry.

Account for actual total inset and borders; inspect the rendered result.

Verification: Inspect the relevant artifact and establish the concrete impact before recommending a change.

Counterexample: A deliberate choice serving the audience or an accepted project requirement is not a defect.

Sources: [image-3](#source-image-3), [nngroup-heuristics](#source-nngroup-heuristics)

### D15: Improve text contrast

Domain: design. Kind: heuristic. Automation: none.

Text needs sufficient contrast in its actual state and background.

Apply the relevant standard including images, gradients, themes and disabled-state exceptions.

Verification: Inspect the relevant artifact and establish the concrete impact before recommending a change.

Counterexample: A deliberate choice serving the audience or an accepted project requirement is not a defect.

Sources: [image-3](#source-image-3), [nngroup-heuristics](#source-nngroup-heuristics)

### D16: Wrap headlines properly

Domain: design. Kind: heuristic. Automation: none.

Awkward line breaks disrupt meaning and rhythm.

Check supported widths and languages while keeping phrases coherent.

Verification: Inspect the relevant artifact and establish the concrete impact before recommending a change.

Counterexample: A deliberate choice serving the audience or an accepted project requirement is not a defect.

Sources: [image-3](#source-image-3), [nngroup-heuristics](#source-nngroup-heuristics)

### D17: Align by eye

Domain: design. Kind: heuristic. Automation: none.

Mathematically aligned asymmetric forms can appear off-centre.

Make small optical corrections without breaking the structural grid.

Verification: Inspect the relevant artifact and establish the concrete impact before recommending a change.

Counterexample: A deliberate choice serving the audience or an accepted project requirement is not a defect.

Sources: [image-3](#source-image-3), [nngroup-heuristics](#source-nngroup-heuristics)

### D18: Use tabular numbers

Domain: design. Kind: heuristic. Automation: none.

Equal-width digits stabilize columns and changing values.

Apply the font feature when needed without replacing all text with monospace.

Verification: Inspect the relevant artifact and establish the concrete impact before recommending a change.

Counterexample: A deliberate choice serving the audience or an accepted project requirement is not a defect.

Sources: [image-3](#source-image-3), [nngroup-heuristics](#source-nngroup-heuristics)

### D19: Add loading states

Domain: design. Kind: heuristic. Automation: none.

Pending work needs truthful feedback and appropriate recovery.

Preserve layout space and prevent accidental duplicate operations.

Verification: Inspect the relevant artifact and establish the concrete impact before recommending a change.

Counterexample: A deliberate choice serving the audience or an accepted project requirement is not a defect.

Sources: [image-3](#source-image-3), [nngroup-heuristics](#source-nngroup-heuristics)

### D20: Animate useful feedback

Domain: design. Kind: heuristic. Automation: none.

Motion can clarify changes and relationships.

Use it only where useful and support static or reduced-motion alternatives.

Verification: Inspect the relevant artifact and establish the concrete impact before recommending a change.

Counterexample: A deliberate choice serving the audience or an accepted project requirement is not a defect.

Sources: [image-3](#source-image-3), [nngroup-heuristics](#source-nngroup-heuristics)

### M01: Grounded imagery

Domain: media. Kind: heuristic. Automation: none.

Imagery should support the subject rather than merely resemble its theme.

Verify identity, context, geography and the intended claim.

Verification: Obtain direct source, visual or runtime evidence for this artifact and record assessment gaps.

Counterexample: An intentional, appropriate project choice or existing verified control can make this concern inapplicable.

Sources: [youtube-monetization](#source-youtube-monetization), [youtube-disclosure](#source-youtube-disclosure), [google-design](#source-google-design)

### M02: Readable visual text

Domain: media. Kind: heuristic. Automation: none.

Text in images and video can contain spelling errors, clipping and weak contrast.

Inspect exported frames at their actual viewing size.

Verification: Obtain direct source, visual or runtime evidence for this artifact and record assessment gaps.

Counterexample: An intentional, appropriate project choice or existing verified control can make this concern inapplicable.

Sources: [youtube-monetization](#source-youtube-monetization), [youtube-disclosure](#source-youtube-disclosure), [google-design](#source-google-design)

### M03: Truthful diagrams and charts

Domain: media. Kind: heuristic. Automation: none.

Visual encodings must reflect real data and relationships.

Check values, axes, labels, arrows, categories and scales.

Verification: Obtain direct source, visual or runtime evidence for this artifact and record assessment gaps.

Counterexample: An intentional, appropriate project choice or existing verified control can make this concern inapplicable.

Sources: [youtube-monetization](#source-youtube-monetization), [youtube-disclosure](#source-youtube-disclosure), [google-design](#source-google-design)

### M04: Temporal consistency

Domain: media. Kind: heuristic. Automation: none.

Scenes should preserve relevant objects, identities and continuity.

Inspect changes across frames and cuts.

Verification: Obtain direct source, visual or runtime evidence for this artifact and record assessment gaps.

Counterexample: An intentional, appropriate project choice or existing verified control can make this concern inapplicable.

Sources: [youtube-monetization](#source-youtube-monetization), [youtube-disclosure](#source-youtube-disclosure), [google-design](#source-google-design)

### M05: Narration alignment

Domain: media. Kind: heuristic. Automation: none.

Spoken content, visible words, images and timing need to agree.

Use measured audio timing and verify the final render.

Verification: Obtain direct source, visual or runtime evidence for this artifact and record assessment gaps.

Counterexample: An intentional, appropriate project choice or existing verified control can make this concern inapplicable.

Sources: [youtube-monetization](#source-youtube-monetization), [youtube-disclosure](#source-youtube-disclosure), [google-design](#source-google-design)

### M06: Audio intelligibility

Domain: media. Kind: heuristic. Automation: none.

Pronunciation, pacing, clipping and background music affect understanding.

Listen to representative and difficult passages in the final output.

Verification: Obtain direct source, visual or runtime evidence for this artifact and record assessment gaps.

Counterexample: An intentional, appropriate project choice or existing verified control can make this concern inapplicable.

Sources: [youtube-monetization](#source-youtube-monetization), [youtube-disclosure](#source-youtube-disclosure), [google-design](#source-google-design)

### M07: Editorial contribution

Domain: media. Kind: heuristic. Automation: none.

Repeated scenes or sections may add no new value.

Check how each part advances information, narrative or the intended experience.

Verification: Obtain direct source, visual or runtime evidence for this artifact and record assessment gaps.

Counterexample: An intentional, appropriate project choice or existing verified control can make this concern inapplicable.

Sources: [youtube-monetization](#source-youtube-monetization), [youtube-disclosure](#source-youtube-disclosure), [google-design](#source-google-design)

### M08: Export integrity

Domain: media. Kind: heuristic. Automation: none.

Dimensions, codecs, cropping and embedded resources affect delivery.

Open the exported artifact in an appropriate viewer and verify actual playback or rendering.

Verification: Obtain direct source, visual or runtime evidence for this artifact and record assessment gaps.

Counterexample: An intentional, appropriate project choice or existing verified control can make this concern inapplicable.

Sources: [youtube-monetization](#source-youtube-monetization), [youtube-disclosure](#source-youtube-disclosure), [google-design](#source-google-design)

### F01: Image space reservation

Domain: performance. Kind: heuristic. Automation: partial.

Images without dimensions or an equivalent reserved aspect ratio may cause shifts.

Inspect the actual layout; do not blindly lazy-load a prominent hero image.

Verification: Run the supported static check and inspect its evidence; perform contextual or runtime verification where noted.

Counterexample: An intentional, appropriate project choice or existing verified control can make this concern inapplicable.

Sources: [google-vitals](#source-google-vitals), [openai-design](#source-openai-design)

### F02: Font loading strategy

Domain: performance. Kind: heuristic. Automation: partial.

Web-font loading can delay content or cause shifts.

Choose font-display and preloading in the context of real loading behaviour.

Verification: Run the supported static check and inspect its evidence; perform contextual or runtime verification where noted.

Counterexample: An intentional, appropriate project choice or existing verified control can make this concern inapplicable.

Sources: [google-vitals](#source-google-vitals), [openai-design](#source-openai-design)

### F03: Broad CSS transitions

Domain: performance. Kind: heuristic. Automation: partial.

Transitioning all properties can animate unintended changes.

Name only properties whose transitions serve the interaction.

Verification: Run the supported static check and inspect its evidence; perform contextual or runtime verification where noted.

Counterexample: An intentional, appropriate project choice or existing verified control can make this concern inapplicable.

Sources: [google-vitals](#source-google-vitals), [openai-design](#source-openai-design)

### F04: Layout-property animation

Domain: performance. Kind: heuristic. Automation: partial.

Animating layout properties may add rendering work.

Measure the actual effect and prefer transforms where they preserve intended behaviour.

Verification: Run the supported static check and inspect its evidence; perform contextual or runtime verification where noted.

Counterexample: An intentional, appropriate project choice or existing verified control can make this concern inapplicable.

Sources: [google-vitals](#source-google-vitals), [openai-design](#source-openai-design)

### F05: Asset and script cost

Domain: performance. Kind: heuristic. Automation: none.

Unnecessary images, scripts and third-party dependencies can slow useful content.

Measure actual transfer, execution and rendering costs.

Verification: Obtain direct source, visual or runtime evidence for this artifact and record assessment gaps.

Counterexample: An intentional, appropriate project choice or existing verified control can make this concern inapplicable.

Sources: [google-vitals](#source-google-vitals), [openai-design](#source-openai-design)

### F06: Field performance

Domain: performance. Kind: heuristic. Automation: none.

Real user loading, interaction and stability need measurement.

Assess LCP, INP and CLS with appropriate field coverage and percentile reporting.

Verification: Obtain direct source, visual or runtime evidence for this artifact and record assessment gaps.

Counterexample: An intentional, appropriate project choice or existing verified control can make this concern inapplicable.

Sources: [google-vitals](#source-google-vitals), [openai-design](#source-openai-design)

### P01: Audience and purpose

Domain: ux. Kind: heuristic. Automation: none.

A design needs a known audience, immediate goal and context.

State the user's intended outcome before selecting patterns.

Verification: Obtain direct source, visual or runtime evidence for this artifact and record assessment gaps.

Counterexample: An intentional, appropriate project choice or existing verified control can make this concern inapplicable.

Sources: [gstack-product](#source-gstack-product), [nngroup-heuristics](#source-nngroup-heuristics)

### P02: Surface classification

Domain: ux. Kind: heuristic. Automation: none.

Marketing, operational, reading and showcase surfaces have different priorities.

Classify mixed artifacts by relevant area, rather than by industry alone.

Verification: Obtain direct source, visual or runtime evidence for this artifact and record assessment gaps.

Counterexample: An intentional, appropriate project choice or existing verified control can make this concern inapplicable.

Sources: [gstack-product](#source-gstack-product), [nngroup-heuristics](#source-nngroup-heuristics)

### P03: Page orientation

Domain: ux. Kind: heuristic. Automation: none.

Users need to understand their location, options and next step.

Check the first impression and navigational structure with little prior context.

Verification: Obtain direct source, visual or runtime evidence for this artifact and record assessment gaps.

Counterexample: An intentional, appropriate project choice or existing verified control can make this concern inapplicable.

Sources: [gstack-product](#source-gstack-product), [nngroup-heuristics](#source-nngroup-heuristics)

### P04: One job per section

Domain: ux. Kind: heuristic. Automation: none.

Repeated mood statements can conceal missing information.

Assign a concrete contribution to each section or scene.

Verification: Obtain direct source, visual or runtime evidence for this artifact and record assessment gaps.

Counterexample: An intentional, appropriate project choice or existing verified control can make this concern inapplicable.

Sources: [gstack-product](#source-gstack-product), [nngroup-heuristics](#source-nngroup-heuristics)

### P05: Objections and evidence

Domain: ux. Kind: heuristic. Automation: none.

Visitors have real concerns about suitability, effort, cost and reliability.

Answer known concerns with supplied facts and genuine proof.

Verification: Obtain direct source, visual or runtime evidence for this artifact and record assessment gaps.

Counterexample: An intentional, appropriate project choice or existing verified control can make this concern inapplicable.

Sources: [gstack-product](#source-gstack-product), [nngroup-heuristics](#source-nngroup-heuristics)

### P06: Brand relevance

Domain: ux. Kind: heuristic. Automation: none.

Interchangeable composition and language can weaken recognition.

Identify choices tied to the actual organization and audience.

Verification: Obtain direct source, visual or runtime evidence for this artifact and record assessment gaps.

Counterexample: An intentional, appropriate project choice or existing verified control can make this concern inapplicable.

Sources: [gstack-product](#source-gstack-product), [nngroup-heuristics](#source-nngroup-heuristics)

### P07: Appropriate density

Domain: ux. Kind: heuristic. Automation: none.

Professional tools and onboarding need different information density.

Preserve useful complexity and evaluate task completion.

Verification: Obtain direct source, visual or runtime evidence for this artifact and record assessment gaps.

Counterexample: An intentional, appropriate project choice or existing verified control can make this concern inapplicable.

Sources: [gstack-product](#source-gstack-product), [nngroup-heuristics](#source-nngroup-heuristics)

### P08: Existing-system preservation

Domain: ux. Kind: heuristic. Automation: none.

Unnecessary redesign can break coherent established behaviour.

Inspect components, accepted decisions and project instructions first.

Verification: Obtain direct source, visual or runtime evidence for this artifact and record assessment gaps.

Counterexample: An intentional, appropriate project choice or existing verified control can make this concern inapplicable.

Sources: [gstack-product](#source-gstack-product), [nngroup-heuristics](#source-nngroup-heuristics)

### R01: Asset provenance

Domain: rights. Kind: requirement. Automation: none.

Photos, footage, music, fonts and code can carry separate terms.

Record the actual source, permission, attribution and applicable restrictions.

Verification: Obtain direct source, visual or runtime evidence for this artifact and record assessment gaps.

Counterexample: A synthetic fixture, explicitly public asset or effective control may change applicability; record the evidence.

Sources: [dpma-ai](#source-dpma-ai), [usco-ai](#source-usco-ai), [ftc-reviews](#source-ftc-reviews), [google-spam](#source-google-spam)

### R02: Human creative contribution

Domain: rights. Kind: requirement. Automation: none.

Protection of AI-assisted output depends on applicable law and human expression.

Preserve relevant authorship records and identify unresolved jurisdiction-specific questions.

Verification: Obtain direct source, visual or runtime evidence for this artifact and record assessment gaps.

Counterexample: A synthetic fixture, explicitly public asset or effective control may change applicability; record the evidence.

Sources: [dpma-ai](#source-dpma-ai), [usco-ai](#source-usco-ai), [ftc-reviews](#source-ftc-reviews), [google-spam](#source-google-spam)

### R03: Authentic testimonials

Domain: rights. Kind: requirement. Automation: none.

Invented customer experiences and endorsements misrepresent evidence.

Publish only accurate, appropriately authorized claims.

Verification: Obtain direct source, visual or runtime evidence for this artifact and record assessment gaps.

Counterexample: A synthetic fixture, explicitly public asset or effective control may change applicability; record the evidence.

Sources: [dpma-ai](#source-dpma-ai), [usco-ai](#source-usco-ai), [ftc-reviews](#source-ftc-reviews), [google-spam](#source-google-spam)

### R04: Platform disclosure

Domain: rights. Kind: requirement. Automation: none.

Realistic synthetic media may require disclosure on the distribution platform.

Check current requirements for the actual output and context.

Verification: Obtain direct source, visual or runtime evidence for this artifact and record assessment gaps.

Counterexample: A synthetic fixture, explicitly public asset or effective control may change applicability; record the evidence.

Sources: [dpma-ai](#source-dpma-ai), [usco-ai](#source-usco-ai), [ftc-reviews](#source-ftc-reviews), [google-spam](#source-google-spam)

### R05: Scaled content quality

Domain: rights. Kind: requirement. Automation: none.

Mass publishing without added user value can violate distribution policies.

Assess original contribution, repetition and the platform's current rules.

Verification: Obtain direct source, visual or runtime evidence for this artifact and record assessment gaps.

Counterexample: A synthetic fixture, explicitly public asset or effective control may change applicability; record the evidence.

Sources: [dpma-ai](#source-dpma-ai), [usco-ai](#source-usco-ai), [ftc-reviews](#source-ftc-reviews), [google-spam](#source-google-spam)

### R06: Privacy and retention

Domain: rights. Kind: requirement. Automation: none.

Personal information needs deliberate collection, access, retention and deletion handling.

Minimize data and investigate applicable requirements without claiming legal certification.

Verification: Obtain direct source, visual or runtime evidence for this artifact and record assessment gaps.

Counterexample: A synthetic fixture, explicitly public asset or effective control may change applicability; record the evidence.

Sources: [dpma-ai](#source-dpma-ai), [usco-ai](#source-usco-ai), [ftc-reviews](#source-ftc-reviews), [google-spam](#source-google-spam)

### S21: New-tab opener boundary

Domain: security. Kind: requirement. Automation: static.

A target=_blank link may retain an opener in some environments.

Use an appropriate rel value while preserving existing relationship tokens.

Verification: Run the supported static check and inspect its evidence; perform contextual or runtime verification where noted.

Counterexample: A synthetic fixture, explicitly public asset or effective control may change applicability; record the evidence.

Sources: [owasp-asvs](#source-owasp-asvs), [owasp-api](#source-owasp-api), [owasp-logic](#source-owasp-logic), [owasp-webhook](#source-owasp-webhook)

### S22: Raw HTML sink

Domain: security. Kind: requirement. Automation: partial.

Assigning HTML from dynamic input can cross an output-encoding boundary.

Trace input trust and sanitization before claiming exploitable XSS.

Verification: Run the supported static check and inspect its evidence; perform contextual or runtime verification where noted.

Counterexample: A synthetic fixture, explicitly public asset or effective control may change applicability; record the evidence.

Sources: [owasp-asvs](#source-owasp-asvs), [owasp-api](#source-owasp-api), [owasp-logic](#source-owasp-logic), [owasp-webhook](#source-owasp-webhook)

### S23: Hardcoded privileged credential

Domain: security. Kind: requirement. Automation: partial.

Secret-shaped material in source may confer unintended authority.

Redact evidence, assess exposure and validity, and recommend rotation when appropriate.

Verification: Run the supported static check and inspect its evidence; perform contextual or runtime verification where noted.

Counterexample: A synthetic fixture, explicitly public asset or effective control may change applicability; record the evidence.

Sources: [owasp-asvs](#source-owasp-asvs), [owasp-api](#source-owasp-api), [owasp-logic](#source-owasp-logic), [owasp-webhook](#source-owasp-webhook)

### S24: Shell execution boundary

Domain: security. Kind: requirement. Automation: partial.

shell=True or dynamic shell commands may interpret untrusted input.

Trace attacker control and actual execution context; avoid automatic code rewriting.

Verification: Run the supported static check and inspect its evidence; perform contextual or runtime verification where noted.

Counterexample: A synthetic fixture, explicitly public asset or effective control may change applicability; record the evidence.

Sources: [owasp-asvs](#source-owasp-asvs), [owasp-api](#source-owasp-api), [owasp-logic](#source-owasp-logic), [owasp-webhook](#source-owasp-webhook)

### S25: Dynamic database query

Domain: security. Kind: requirement. Automation: partial.

Interpolated SQL may mix data with query structure.

Inspect parameter binding and the actual driver contract.

Verification: Run the supported static check and inspect its evidence; perform contextual or runtime verification where noted.

Counterexample: A synthetic fixture, explicitly public asset or effective control may change applicability; record the evidence.

Sources: [owasp-asvs](#source-owasp-asvs), [owasp-api](#source-owasp-api), [owasp-logic](#source-owasp-logic), [owasp-webhook](#source-owasp-webhook)

### S26: TLS verification disabled

Domain: security. Kind: requirement. Automation: partial.

Disabling certificate verification may remove a network trust check.

Check the actual environment and legitimate testing exceptions.

Verification: Run the supported static check and inspect its evidence; perform contextual or runtime verification where noted.

Counterexample: A synthetic fixture, explicitly public asset or effective control may change applicability; record the evidence.

Sources: [owasp-asvs](#source-owasp-asvs), [owasp-api](#source-owasp-api), [owasp-logic](#source-owasp-logic), [owasp-webhook](#source-owasp-webhook)

### S27: Object and tenant authorization

Domain: security. Kind: requirement. Automation: none.

Knowing an identifier must not grant access to another user's object.

Test legitimate and unauthorized actors at each relevant operation.

Verification: Obtain direct source, visual or runtime evidence for this artifact and record assessment gaps.

Counterexample: A synthetic fixture, explicitly public asset or effective control may change applicability; record the evidence.

Sources: [owasp-asvs](#source-owasp-asvs), [owasp-api](#source-owasp-api), [owasp-logic](#source-owasp-logic), [owasp-webhook](#source-owasp-webhook)

### S28: Session and account lifecycle

Domain: security. Kind: requirement. Automation: none.

Recovery, logout and sensitive changes affect previously issued authority.

Verify invalidation, validation and account-linking behaviour.

Verification: Obtain direct source, visual or runtime evidence for this artifact and record assessment gaps.

Counterexample: A synthetic fixture, explicitly public asset or effective control may change applicability; record the evidence.

Sources: [owasp-asvs](#source-owasp-asvs), [owasp-api](#source-owasp-api), [owasp-logic](#source-owasp-logic), [owasp-webhook](#source-owasp-webhook)

### S29: Webhook authentication and replay

Domain: security. Kind: requirement. Automation: none.

Callbacks can be forged, duplicated or delayed.

Check signatures, timestamps, idempotency and durable state transitions.

Verification: Obtain direct source, visual or runtime evidence for this artifact and record assessment gaps.

Counterexample: A synthetic fixture, explicitly public asset or effective control may change applicability; record the evidence.

Sources: [owasp-asvs](#source-owasp-asvs), [owasp-api](#source-owasp-api), [owasp-logic](#source-owasp-logic), [owasp-webhook](#source-owasp-webhook)

### S30: Resource and spending limits

Domain: security. Kind: requirement. Automation: none.

Abusive or accidental work can exhaust availability or paid budgets.

Bound volume, size, concurrency, retries and duration.

Verification: Obtain direct source, visual or runtime evidence for this artifact and record assessment gaps.

Counterexample: A synthetic fixture, explicitly public asset or effective control may change applicability; record the evidence.

Sources: [owasp-asvs](#source-owasp-asvs), [owasp-api](#source-owasp-api), [owasp-logic](#source-owasp-logic), [owasp-webhook](#source-owasp-webhook)

### S31: Dependency and build provenance

Domain: security. Kind: requirement. Automation: none.

Code and build dependencies execute with different capabilities.

Establish identity, affected version, reachability and credential exposure.

Verification: Obtain direct source, visual or runtime evidence for this artifact and record assessment gaps.

Counterexample: A synthetic fixture, explicitly public asset or effective control may change applicability; record the evidence.

Sources: [owasp-asvs](#source-owasp-asvs), [owasp-api](#source-owasp-api), [owasp-logic](#source-owasp-logic), [owasp-webhook](#source-owasp-webhook)

### S32: Logging and deletion

Domain: security. Kind: requirement. Automation: none.

Credentials or private content can leak through diagnostics and retained artifacts.

Inspect actual data flow, access and retention.

Verification: Obtain direct source, visual or runtime evidence for this artifact and record assessment gaps.

Counterexample: A synthetic fixture, explicitly public asset or effective control may change applicability; record the evidence.

Sources: [owasp-asvs](#source-owasp-asvs), [owasp-api](#source-owasp-api), [owasp-logic](#source-owasp-logic), [owasp-webhook](#source-owasp-webhook)

### S01: Next.js header

Domain: security. Kind: requirement. Automation: none.

A framework-specific header may bypass authorization in affected versions; the screenshot likely refers to CVE-2025-29927.

Determine the exact framework, affected version and authorization boundary before reporting an advisory.

Verification: Inspect the relevant artifact and establish the concrete impact before recommending a change.

Counterexample: An intentionally public resource, non-sensitive example or already enforced boundary may make the suspected issue inapplicable.

Sources: [image-1](#source-image-1), [owasp-asvs](#source-owasp-asvs)

### S02: Exposed .git folder

Domain: security. Kind: requirement. Automation: none.

A publicly served Git directory may expose source, history and previously committed credentials.

Exclude repository internals from deployment and handle exposed credentials separately through revocation.

Verification: Inspect the relevant artifact and establish the concrete impact before recommending a change.

Counterexample: An intentionally public resource, non-sensitive example or already enforced boundary may make the suspected issue inapplicable.

Sources: [image-1](#source-image-1), [owasp-asvs](#source-owasp-asvs)

### S03: Supabase storage

Domain: security. Kind: requirement. Automation: none.

Bucket visibility and object policies determine who can read, upload, modify or delete media.

Compare the intended public/private model with actual operation-specific authorization.

Verification: Inspect the relevant artifact and establish the concrete impact before recommending a change.

Counterexample: An intentionally public resource, non-sensitive example or already enforced boundary may make the suspected issue inapplicable.

Sources: [image-1](#source-image-1), [owasp-asvs](#source-owasp-asvs)

### S04: Price from the browser

Domain: security. Kind: requirement. Automation: none.

Client-supplied prices, discounts and entitlements can be manipulated.

Re-derive authoritative amounts and permissions on the server using trusted records.

Verification: Inspect the relevant artifact and establish the concrete impact before recommending a change.

Counterexample: An intentionally public resource, non-sensitive example or already enforced boundary may make the suspected issue inapplicable.

Sources: [image-1](#source-image-1), [owasp-asvs](#source-owasp-asvs)

### S05: Credential stuffing

Domain: security. Kind: requirement. Automation: none.

Stolen username-password pairs from other services are reused in automated login attempts.

Review layered authentication, abuse limits, monitoring and recovery without exposing account existence.

Verification: Inspect the relevant artifact and establish the concrete impact before recommending a change.

Counterexample: An intentionally public resource, non-sensitive example or already enforced boundary may make the suspected issue inapplicable.

Sources: [image-1](#source-image-1), [owasp-asvs](#source-owasp-asvs)

### S06: Open database

Domain: security. Kind: requirement. Automation: none.

Missing or broad data permissions may allow unauthorized reads and writes.

Test the relevant actors and operations; network reachability alone is insufficient evidence.

Verification: Inspect the relevant artifact and establish the concrete impact before recommending a change.

Counterexample: An intentionally public resource, non-sensitive example or already enforced boundary may make the suspected issue inapplicable.

Sources: [image-1](#source-image-1), [owasp-asvs](#source-owasp-asvs)

### S07: Polyfill.io

Domain: security. Kind: requirement. Automation: none.

A previously trusted externally loaded script became a supply-chain risk.

Review current external-code provenance and exposure; distinguish the incident from polyfills in general.

Verification: Inspect the relevant artifact and establish the concrete impact before recommending a change.

Counterexample: An intentionally public resource, non-sensitive example or already enforced boundary may make the suspected issue inapplicable.

Sources: [image-1](#source-image-1), [owasp-asvs](#source-owasp-asvs)

### S08: SMS pumping

Domain: security. Kind: requirement. Automation: none.

Repeated requests trigger billable SMS and can generate fraudulent revenue for destination operators.

Bound destinations, per-user volume, retries and spending exposure.

Verification: Inspect the relevant artifact and establish the concrete impact before recommending a change.

Counterexample: An intentionally public resource, non-sensitive example or already enforced boundary may make the suspected issue inapplicable.

Sources: [image-1](#source-image-1), [owasp-asvs](#source-owasp-asvs)

### S09: Prompt injection

Domain: security. Kind: requirement. Automation: none.

Untrusted content attempts to redirect an AI that can read data or use tools.

Enforce permissions and action validation outside the model, and treat retrieved instructions as data.

Verification: Inspect the relevant artifact and establish the concrete impact before recommending a change.

Counterexample: An intentionally public resource, non-sensitive example or already enforced boundary may make the suspected issue inapplicable.

Sources: [image-1](#source-image-1), [owasp-asvs](#source-owasp-asvs)

### S10: Weak JWT secret

Domain: security. Kind: requirement. Automation: none.

Guessable shared signing secrets can enable token forgery.

Review strong random keys, permitted algorithms, claims and session lifecycle.

Verification: Inspect the relevant artifact and establish the concrete impact before recommending a change.

Counterexample: An intentionally public resource, non-sensitive example or already enforced boundary may make the suspected issue inapplicable.

Sources: [image-1](#source-image-1), [owasp-asvs](#source-owasp-asvs)

### S11: Race condition

Domain: security. Kind: requirement. Automation: none.

Concurrent requests can exploit a gap between checking and updating shared state.

Use atomic updates, constraints and appropriate idempotency at the real boundary.

Verification: Inspect the relevant artifact and establish the concrete impact before recommending a change.

Counterexample: An intentionally public resource, non-sensitive example or already enforced boundary may make the suspected issue inapplicable.

Sources: [image-1](#source-image-1), [owasp-asvs](#source-owasp-asvs)

### S12: Account pre-hijacking

Domain: security. Kind: requirement. Automation: none.

An attacker prepares an account under a victim's identifier and may retain access after legitimate registration.

Inspect identifier verification, linking, recovery and surviving sessions.

Verification: Inspect the relevant artifact and establish the concrete impact before recommending a change.

Counterexample: An intentionally public resource, non-sensitive example or already enforced boundary may make the suspected issue inapplicable.

Sources: [image-1](#source-image-1), [owasp-asvs](#source-owasp-asvs)

### S13: Subdomain takeover

Domain: security. Kind: requirement. Automation: none.

Dangling DNS points to a claimable abandoned external resource.

Establish actual claimability and organizational exposure before assigning severity.

Verification: Inspect the relevant artifact and establish the concrete impact before recommending a change.

Counterexample: An intentionally public resource, non-sensitive example or already enforced boundary may make the suspected issue inapplicable.

Sources: [image-1](#source-image-1), [owasp-asvs](#source-owasp-asvs)

### S14: SSRF

Domain: security. Kind: requirement. Automation: none.

A server fetches attacker-influenced destinations and may reach private services.

Constrain protocols, destinations, redirects and network permissions.

Verification: Inspect the relevant artifact and establish the concrete impact before recommending a change.

Counterexample: An intentionally public resource, non-sensitive example or already enforced boundary may make the suspected issue inapplicable.

Sources: [image-1](#source-image-1), [owasp-asvs](#source-owasp-asvs)

### S15: Path traversal

Domain: security. Kind: requirement. Automation: none.

User-influenced paths escape an intended file boundary.

Use constrained identifiers and enforce containment for reads, writes and archive extraction.

Verification: Inspect the relevant artifact and establish the concrete impact before recommending a change.

Counterexample: An intentionally public resource, non-sensitive example or already enforced boundary may make the suspected issue inapplicable.

Sources: [image-1](#source-image-1), [owasp-asvs](#source-owasp-asvs)

### S16: Reset poisoning

Domain: security. Kind: requirement. Automation: none.

A password reset link includes attacker-influenced origins or mishandled tokens.

Build recovery links from trusted configuration and protect token handling.

Verification: Inspect the relevant artifact and establish the concrete impact before recommending a change.

Counterexample: An intentionally public resource, non-sensitive example or already enforced boundary may make the suspected issue inapplicable.

Sources: [image-1](#source-image-1), [owasp-asvs](#source-owasp-asvs)

### S17: Source maps

Domain: security. Kind: requirement. Automation: none.

Debug maps expose readable client source and implementation details.

Assess what becomes public; never ship privileged secrets in client code.

Verification: Inspect the relevant artifact and establish the concrete impact before recommending a change.

Counterexample: An intentionally public resource, non-sensitive example or already enforced boundary may make the suspected issue inapplicable.

Sources: [image-1](#source-image-1), [owasp-asvs](#source-owasp-asvs)

### S18: Clickjacking

Domain: security. Kind: requirement. Automation: none.

Deceptive framing can make users activate sensitive controls unknowingly.

Check framing policy against the sensitive operation and legitimate embedding needs.

Verification: Inspect the relevant artifact and establish the concrete impact before recommending a change.

Counterexample: An intentionally public resource, non-sensitive example or already enforced boundary may make the suspected issue inapplicable.

Sources: [image-1](#source-image-1), [owasp-asvs](#source-owasp-asvs)

### S19: Open redirect

Domain: security. Kind: requirement. Automation: none.

An application redirects to an unvalidated user-selected destination.

Use approved destinations or mapped identifiers and validate the parsed destination.

Verification: Inspect the relevant artifact and establish the concrete impact before recommending a change.

Counterexample: An intentionally public resource, non-sensitive example or already enforced boundary may make the suspected issue inapplicable.

Sources: [image-1](#source-image-1), [owasp-asvs](#source-owasp-asvs)

### S20: User enumeration

Domain: security. Kind: requirement. Automation: none.

Messages, codes or timing reveal whether a user account exists.

Compare login, registration and recovery responses using controlled identities.

Verification: Inspect the relevant artifact and establish the concrete impact before recommending a change.

Counterexample: An intentionally public resource, non-sensitive example or already enforced boundary may make the suspected issue inapplicable.

Sources: [image-1](#source-image-1), [owasp-asvs](#source-owasp-asvs)

### H01: Tags and pills

Domain: design. Kind: heuristic. Automation: none.

Rounded labels can be meaningful controls or redundant decoration.

Check information value and preserve real filters and statuses.

Verification: Inspect the relevant artifact and establish the concrete impact before recommending a change.

Counterexample: A deliberate choice serving the audience or an accepted project requirement is not a defect.

Sources: [image-5](#source-image-5), [anthropic-design](#source-anthropic-design), [openai-design](#source-openai-design)

### H02: Excessive italics

Domain: design. Kind: heuristic. Automation: none.

Too much italic emphasis competes for attention.

Evaluate the emphasis system, length and readability.

Verification: Inspect the relevant artifact and establish the concrete impact before recommending a change.

Counterexample: A deliberate choice serving the audience or an accepted project requirement is not a defect.

Sources: [image-5](#source-image-5), [anthropic-design](#source-anthropic-design), [openai-design](#source-openai-design)

### H03: Instrument Serif

Domain: design. Kind: heuristic. Automation: none.

A specific expressive serif typeface.

Judge fit, readable sizing and identity; the font alone is not a defect.

Verification: Inspect the relevant artifact and establish the concrete impact before recommending a change.

Counterexample: A deliberate choice serving the audience or an accepted project requirement is not a defect.

Sources: [image-5](#source-image-5), [anthropic-design](#source-anthropic-design), [openai-design](#source-openai-design)

### H04: Negative kerning

Domain: design. Kind: heuristic. Automation: none.

Tightened pair spacing or negative tracking can crowd text.

Inspect collisions and tone; tightened headings can be intentional.

Verification: Inspect the relevant artifact and establish the concrete impact before recommending a change.

Counterexample: A deliberate choice serving the audience or an accepted project requirement is not a defect.

Sources: [image-5](#source-image-5), [anthropic-design](#source-anthropic-design), [openai-design](#source-openai-design)

### H05: Over-the-top detailed UI

Domain: design. Kind: heuristic. Automation: none.

Complex controls or decoration can obscure the primary task.

Preserve complexity that supports real professional workflows.

Verification: Inspect the relevant artifact and establish the concrete impact before recommending a change.

Counterexample: A deliberate choice serving the audience or an accepted project requirement is not a defect.

Sources: [image-5](#source-image-5), [anthropic-design](#source-anthropic-design), [openai-design](#source-openai-design)

### H06: Overusing dividers

Domain: design. Kind: heuristic. Automation: none.

Too many separators can fragment a page.

Use separators where boundaries matter and spacing where sufficient.

Verification: Inspect the relevant artifact and establish the concrete impact before recommending a change.

Counterexample: A deliberate choice serving the audience or an accepted project requirement is not a defect.

Sources: [image-5](#source-image-5), [anthropic-design](#source-anthropic-design), [openai-design](#source-openai-design)

### H07: Colour shades and opacities

Domain: design. Kind: heuristic. Automation: none.

Uncontrolled shade and transparency variation can weaken hierarchy.

Review actual semantic roles, consistency and contrast.

Verification: Inspect the relevant artifact and establish the concrete impact before recommending a change.

Counterexample: A deliberate choice serving the audience or an accepted project requirement is not a defect.

Sources: [image-5](#source-image-5), [anthropic-design](#source-anthropic-design), [openai-design](#source-openai-design)

### H08: Containers with borders

Domain: design. Kind: heuristic. Automation: none.

Nested boxes can make unrelated elements look equally important.

Retain boundaries that clarify structure or interaction.

Verification: Inspect the relevant artifact and establish the concrete impact before recommending a change.

Counterexample: A deliberate choice serving the audience or an accepted project requirement is not a defect.

Sources: [image-5](#source-image-5), [anthropic-design](#source-anthropic-design), [openai-design](#source-openai-design)

### H09: Overly detailed diagrams

Domain: design. Kind: heuristic. Automation: none.

Excess nodes, arrows and annotations can hide the main relationship.

Match detail to the reader's question and expertise.

Verification: Inspect the relevant artifact and establish the concrete impact before recommending a change.

Counterexample: A deliberate choice serving the audience or an accepted project requirement is not a defect.

Sources: [image-5](#source-image-5), [anthropic-design](#source-anthropic-design), [openai-design](#source-openai-design)

### H10: Verbose redundant text

Domain: design. Kind: heuristic. Automation: none.

Repeated statements increase reading effort.

Retain necessary conditions, costs, evidence and recovery instructions.

Verification: Inspect the relevant artifact and establish the concrete impact before recommending a change.

Counterexample: A deliberate choice serving the audience or an accepted project requirement is not a defect.

Sources: [image-5](#source-image-5), [anthropic-design](#source-anthropic-design), [openai-design](#source-openai-design)

### H11: Code breadcrumbs

Domain: design. Kind: heuristic. Automation: none.

Code-like paths may provide real navigation or merely technical decoration.

Clarify the function before proposing removal.

Verification: Inspect the relevant artifact and establish the concrete impact before recommending a change.

Counterexample: A deliberate choice serving the audience or an accepted project requirement is not a defect.

Sources: [image-5](#source-image-5), [anthropic-design](#source-anthropic-design), [openai-design](#source-openai-design)

### H12: Section numbering

Domain: design. Kind: heuristic. Automation: none.

Numbering can support sequence and cross-reference.

Treat decorative numbering as a contextual preference.

Verification: Inspect the relevant artifact and establish the concrete impact before recommending a change.

Counterexample: A deliberate choice serving the audience or an accepted project requirement is not a defect.

Sources: [image-5](#source-image-5), [anthropic-design](#source-anthropic-design), [openai-design](#source-openai-design)

### H13: Eyebrows

Domain: design. Kind: heuristic. Automation: none.

Short labels above headlines may orient or duplicate.

Keep labels that provide information the headline does not.

Verification: Inspect the relevant artifact and establish the concrete impact before recommending a change.

Counterexample: A deliberate choice serving the audience or an accepted project requirement is not a defect.

Sources: [image-5](#source-image-5), [anthropic-design](#source-anthropic-design), [openai-design](#source-openai-design)

### H14: Dithering

Domain: design. Kind: heuristic. Automation: none.

Pixel pattern treatment creates limited-palette tone.

Judge image detail and intentional identity rather than rejecting the technique.

Verification: Inspect the relevant artifact and establish the concrete impact before recommending a change.

Counterexample: A deliberate choice serving the audience or an accepted project requirement is not a defect.

Sources: [image-5](#source-image-5), [anthropic-design](#source-anthropic-design), [openai-design](#source-openai-design)

### H15: ASCII images

Domain: design. Kind: heuristic. Automation: none.

Character art can suit computing-related or playful contexts.

Check legibility and whether the audience understands the representation.

Verification: Inspect the relevant artifact and establish the concrete impact before recommending a change.

Counterexample: A deliberate choice serving the audience or an accepted project requirement is not a defect.

Sources: [image-5](#source-image-5), [anthropic-design](#source-anthropic-design), [openai-design](#source-openai-design)

### H16: Squircles

Domain: design. Kind: heuristic. Automation: none.

Smoothly curved square-circle forms establish shape language.

Review consistency, platform expectations and component purpose.

Verification: Inspect the relevant artifact and establish the concrete impact before recommending a change.

Counterexample: A deliberate choice serving the audience or an accepted project requirement is not a defect.

Sources: [image-5](#source-image-5), [anthropic-design](#source-anthropic-design), [openai-design](#source-openai-design)

### H17: Excessive mono fonts

Domain: design. Kind: heuristic. Automation: none.

Technical styling throughout can flatten typographic roles.

Preserve deliberate identity while maintaining readable hierarchy.

Verification: Inspect the relevant artifact and establish the concrete impact before recommending a change.

Counterexample: A deliberate choice serving the audience or an accepted project requirement is not a defect.

Sources: [image-5](#source-image-5), [anthropic-design](#source-anthropic-design), [openai-design](#source-openai-design)

### H18: ALL CAPS subtitles

Domain: design. Kind: heuristic. Automation: none.

Uppercase supporting text becomes dense at length.

Evaluate length, size, spacing and hierarchy.

Verification: Inspect the relevant artifact and establish the concrete impact before recommending a change.

Counterexample: A deliberate choice serving the audience or an accepted project requirement is not a defect.

Sources: [image-5](#source-image-5), [anthropic-design](#source-anthropic-design), [openai-design](#source-openai-design)

### H19: Gradient backgrounds

Domain: design. Kind: heuristic. Automation: none.

Colour transitions can provide mood or undermine contrast.

Judge actual background-content interaction and brand purpose.

Verification: Inspect the relevant artifact and establish the concrete impact before recommending a change.

Counterexample: A deliberate choice serving the audience or an accepted project requirement is not a defect.

Sources: [image-5](#source-image-5), [anthropic-design](#source-anthropic-design), [openai-design](#source-openai-design)

### H20: Periods in titles

Domain: design. Kind: heuristic. Automation: none.

Title punctuation is an editorial choice.

Preserve accepted style unless a concrete inconsistency needs correction.

Verification: Inspect the relevant artifact and establish the concrete impact before recommending a change.

Counterexample: A deliberate choice serving the audience or an accepted project requirement is not a defect.

Sources: [image-5](#source-image-5), [anthropic-design](#source-anthropic-design), [openai-design](#source-openai-design)

### UX01: Placeholder navigation

Domain: ux. Kind: heuristic. Automation: partial.

Empty or fragment-only links may stand in for unfinished actions.

Verify the intended interaction and wire it to a real destination or appropriate control.

Verification: Run the supported static check and inspect its evidence; perform contextual or runtime verification where noted.

Counterexample: An intentional, appropriate project choice or existing verified control can make this concern inapplicable.

Sources: [nngroup-heuristics](#source-nngroup-heuristics), [nngroup-aiprototyping](#source-nngroup-aiprototyping)

### UX02: Production placeholders

Domain: ux. Kind: heuristic. Automation: partial.

Lorem ipsum, unresolved template tokens and example filler can conceal missing content.

Replace filler with truthful content and preserve deliberately labelled examples.

Verification: Run the supported static check and inspect its evidence; perform contextual or runtime verification where noted.

Counterexample: An intentional, appropriate project choice or existing verified control can make this concern inapplicable.

Sources: [nngroup-heuristics](#source-nngroup-heuristics), [nngroup-aiprototyping](#source-nngroup-aiprototyping)

### UX03: Form submission semantics

Domain: ux. Kind: heuristic. Automation: partial.

Buttons inside forms can submit unexpectedly when their type is ambiguous.

Determine whether the button submits, resets or performs another action before changing its type.

Verification: Run the supported static check and inspect its evidence; perform contextual or runtime verification where noted.

Counterexample: An intentional, appropriate project choice or existing verified control can make this concern inapplicable.

Sources: [nngroup-heuristics](#source-nngroup-heuristics), [nngroup-aiprototyping](#source-nngroup-aiprototyping)

### UX04: Interaction-state coverage

Domain: ux. Kind: heuristic. Automation: none.

Loading, empty, error, success, partial and unavailable states need deliberate treatment.

Specify what users see and how they can recover.

Verification: Obtain direct source, visual or runtime evidence for this artifact and record assessment gaps.

Counterexample: An intentional, appropriate project choice or existing verified control can make this concern inapplicable.

Sources: [nngroup-heuristics](#source-nngroup-heuristics), [nngroup-aiprototyping](#source-nngroup-aiprototyping)

### UX05: Session and permission transitions

Domain: ux. Kind: heuristic. Automation: none.

Authentication and permissions may change during work.

Handle expiry and insufficient access without losing usable work or disclosing private data.

Verification: Obtain direct source, visual or runtime evidence for this artifact and record assessment gaps.

Counterexample: An intentional, appropriate project choice or existing verified control can make this concern inapplicable.

Sources: [nngroup-heuristics](#source-nngroup-heuristics), [nngroup-aiprototyping](#source-nngroup-aiprototyping)

### UX06: Cancellation and retries

Domain: ux. Kind: heuristic. Automation: none.

Cancellation and retries have consequences for partial work and charges.

Reconcile unknown outcomes and make repeat operations safe.

Verification: Obtain direct source, visual or runtime evidence for this artifact and record assessment gaps.

Counterexample: An intentional, appropriate project choice or existing verified control can make this concern inapplicable.

Sources: [nngroup-heuristics](#source-nngroup-heuristics), [nngroup-aiprototyping](#source-nngroup-aiprototyping)

### UX07: Navigation and deep links

Domain: ux. Kind: heuristic. Automation: none.

Back, forward, refresh and shared links should preserve relevant state.

Test actual journeys and avoid hiding essential state only in memory.

Verification: Obtain direct source, visual or runtime evidence for this artifact and record assessment gaps.

Counterexample: An intentional, appropriate project choice or existing verified control can make this concern inapplicable.

Sources: [nngroup-heuristics](#source-nngroup-heuristics), [nngroup-aiprototyping](#source-nngroup-aiprototyping)

### UX08: Unsaved work

Domain: ux. Kind: heuristic. Automation: none.

Users need truthful save state and reasonable protection from accidental loss.

Inspect navigation, interruption, autosave failure and recovery.

Verification: Obtain direct source, visual or runtime evidence for this artifact and record assessment gaps.

Counterexample: An intentional, appropriate project choice or existing verified control can make this concern inapplicable.

Sources: [nngroup-heuristics](#source-nngroup-heuristics), [nngroup-aiprototyping](#source-nngroup-aiprototyping)

### UX09: Real-data resilience

Domain: ux. Kind: heuristic. Automation: none.

Layouts and workflows need to handle realistic lengths, counts and missing values.

Use long names, empty collections, unusual values and large result sets.

Verification: Obtain direct source, visual or runtime evidence for this artifact and record assessment gaps.

Counterexample: An intentional, appropriate project choice or existing verified control can make this concern inapplicable.

Sources: [nngroup-heuristics](#source-nngroup-heuristics), [nngroup-aiprototyping](#source-nngroup-aiprototyping)

### UX10: Lifecycle completeness

Domain: ux. Kind: heuristic. Automation: none.

Registration, recovery, billing changes, cancellation, export and deletion can be essential.

Trace the complete applicable lifecycle rather than only onboarding.

Verification: Obtain direct source, visual or runtime evidence for this artifact and record assessment gaps.

Counterexample: An intentional, appropriate project choice or existing verified control can make this concern inapplicable.

Sources: [nngroup-heuristics](#source-nngroup-heuristics), [nngroup-aiprototyping](#source-nngroup-aiprototyping)

### UX11: Primary task and hierarchy

Domain: ux. Kind: heuristic. Automation: none.

Secondary information can displace the task users came to perform.

Identify the user's success condition and organize around it.

Verification: Obtain direct source, visual or runtime evidence for this artifact and record assessment gaps.

Counterexample: An intentional, appropriate project choice or existing verified control can make this concern inapplicable.

Sources: [nngroup-heuristics](#source-nngroup-heuristics), [nngroup-aiprototyping](#source-nngroup-aiprototyping)

### UX12: Discoverable controls

Domain: ux. Kind: heuristic. Automation: none.

Essential actions should be discoverable with the supported input methods.

Check hover-only, icon-only, gesture-only and hidden actions.

Verification: Obtain direct source, visual or runtime evidence for this artifact and record assessment gaps.

Counterexample: An intentional, appropriate project choice or existing verified control can make this concern inapplicable.

Sources: [nngroup-heuristics](#source-nngroup-heuristics), [nngroup-aiprototyping](#source-nngroup-aiprototyping)

## Sources

Sources include normative standards, guidance, workflow inspiration and qualitative community observations. They do not all establish an empirical claim or a universal rule.

<a id="source-owasp-asvs"></a>
### OWASP Application Security Verification Standard

Type: standard. Reviewed 2026-11-10.

[Original source](https://asvs.owasp.org/)

Reference or workflow influence; check current applicability before consequential use.

<a id="source-owasp-api"></a>
### OWASP API Security Top 10

Type: standard. Reviewed 2026-11-10.

[Original source](https://api-security.owasp.org/editions/2023/en/0x00-header/)

Reference or workflow influence; check current applicability before consequential use.

<a id="source-owasp-logic"></a>
### OWASP Business Logic Security

Type: standard. Reviewed 2026-11-10.

[Original source](https://cheatsheetseries.owasp.org/cheatsheets/Business_Logic_Security_Cheat_Sheet.html)

Reference or workflow influence; check current applicability before consequential use.

<a id="source-owasp-webhook"></a>
### OWASP Webhook Security

Type: standard. Reviewed 2026-11-10.

[Original source](https://cheatsheetseries.owasp.org/cheatsheets/Webhook_Security_Cheat_Sheet.html)

Reference or workflow influence; check current applicability before consequential use.

<a id="source-w3c-wcag22"></a>
### Web Content Accessibility Guidelines 2.2

Type: standard. Reviewed 2026-11-10.

[Original source](https://www.w3.org/TR/WCAG22/)

Reference or workflow influence; check current applicability before consequential use.

<a id="source-w3c-apg"></a>
### WAI-ARIA Authoring Practices

Type: standard. Reviewed 2026-11-10.

[Original source](https://www.w3.org/WAI/ARIA/apg/)

Reference or workflow influence; check current applicability before consequential use.

<a id="source-anthropic-design"></a>
### Improving frontend design through Skills

Type: provider. Reviewed 2026-11-10.

[Original source](https://claude.com/resources/articles/improving-frontend-design-through-skills)

Reference or workflow influence; check current applicability before consequential use.

<a id="source-openai-design"></a>
### Designing delightful frontends with GPT-5.4

Type: provider. Reviewed 2026-11-10.

[Original source](https://developers.openai.com/blog/designing-delightful-frontends-with-gpt-5-4)

Reference or workflow influence; check current applicability before consequential use.

<a id="source-google-design"></a>
### Gemini AI Visual Design

Type: provider. Reviewed 2026-11-10.

[Original source](https://design.google/library/gemini-ai-visual-design)

Reference or workflow influence; check current applicability before consequential use.

<a id="source-govuk-ui"></a>
### Writing for user interfaces

Type: guidance. Reviewed 2026-11-10.

[Original source](https://www.gov.uk/service-manual/design/writing-for-user-interfaces)

Reference or workflow influence; check current applicability before consequential use.

<a id="source-copyhackers-research"></a>
### Copywriting research techniques

Type: practitioner. Reviewed 2026-11-10.

[Original source](https://copyhackers.com/2022/06/copywriting-research/)

Reference or workflow influence; check current applicability before consequential use.

<a id="source-nngroup-heuristics"></a>
### Ten usability heuristics

Type: guidance. Reviewed 2026-11-10.

[Original source](https://www.nngroup.com/articles/ten-usability-heuristics/)

Reference or workflow influence; check current applicability before consequential use.

<a id="source-nngroup-aiprototyping"></a>
### AI prototyping in real design contexts

Type: study. Reviewed 2026-11-10.

[Original source](https://www.nngroup.com/articles/ai-prototyping/)

Reference or workflow influence; check current applicability before consequential use.

<a id="source-nngroup-uxdebt"></a>
### The custodial era of UX

Type: guidance. Reviewed 2026-11-10.

[Original source](https://www.nngroup.com/articles/ai-ux-debt/)

Reference or workflow influence; check current applicability before consequential use.

<a id="source-google-vitals"></a>
### Web Vitals

Type: guidance. Reviewed 2026-11-10.

[Original source](https://web.dev/articles/vitals)

Reference or workflow influence; check current applicability before consequential use.

<a id="source-gstack"></a>
### gstack

Type: workflow-inspiration. Reviewed 2026-11-10.

[Original source](https://github.com/garrytan/gstack)

Reference or workflow influence; check current applicability before consequential use.

<a id="source-gstack-product"></a>
### gstack product planning workflow

Type: workflow-inspiration. Reviewed 2026-11-10.

[Original source](https://github.com/garrytan/gstack/tree/main/plan-ceo-review)

Reference or workflow influence; check current applicability before consequential use.

<a id="source-gstack-engineering"></a>
### gstack engineering review workflow

Type: workflow-inspiration. Reviewed 2026-11-10.

[Original source](https://github.com/garrytan/gstack/tree/main/plan-eng-review)

Reference or workflow influence; check current applicability before consequential use.

<a id="source-gstack-qa"></a>
### gstack QA workflow

Type: workflow-inspiration. Reviewed 2026-11-10.

[Original source](https://github.com/garrytan/gstack/tree/main/qa-only)

Reference or workflow influence; check current applicability before consequential use.

<a id="source-gstack-devex"></a>
### gstack developer experience workflow

Type: workflow-inspiration. Reviewed 2026-11-10.

[Original source](https://github.com/garrytan/gstack/tree/main/plan-devex-review)

Reference or workflow influence; check current applicability before consequential use.

<a id="source-gstack-notice"></a>
### gstack third-party notices

Type: provenance. Reviewed 2026-11-10.

[Original source](https://github.com/garrytan/gstack/blob/main/NOTICE.md)

Reference or workflow influence; check current applicability before consequential use.

<a id="source-skills-spec"></a>
### Agent Skills specification

Type: standard. Reviewed 2026-11-10.

[Original source](https://agentskills.io/specification)

Reference or workflow influence; check current applicability before consequential use.

<a id="source-dpma-ai"></a>
### DPMA: intellectual property in the digital world

Type: authority. Reviewed 2026-11-10.

[Original source](https://www.dpma.de/service/schutzrechte_kurz_erklaert/geistigeseigentumdigital/index.html)

Reference or workflow influence; check current applicability before consequential use.

<a id="source-usco-ai"></a>
### US Copyright Office: AI copyrightability

Type: authority. Reviewed 2026-11-10.

[Original source](https://www.copyright.gov/newsnet/2025/1060.html)

Reference or workflow influence; check current applicability before consequential use.

<a id="source-youtube-monetization"></a>
### YouTube channel monetization policies

Type: platform-policy. Reviewed 2026-11-10.

[Original source](https://support.google.com/youtube/answer/1311392?hl=en)

Reference or workflow influence; check current applicability before consequential use.

<a id="source-youtube-disclosure"></a>
### YouTube synthetic-content disclosure

Type: platform-policy. Reviewed 2026-11-10.

[Original source](https://support.google.com/youtube/answer/14328491?hl=en)

Reference or workflow influence; check current applicability before consequential use.

<a id="source-google-spam"></a>
### Google Search spam policies

Type: platform-policy. Reviewed 2026-11-10.

[Original source](https://developers.google.com/search/docs/essentials/spam-policies)

Reference or workflow influence; check current applicability before consequential use.

<a id="source-ftc-reviews"></a>
### FTC fake review and testimonial rule

Type: authority. Reviewed 2026-11-10.

[Original source](https://www.ftc.gov/news-events/news/press-releases/2024/08/federal-trade-commission-announces-final-rule-banning-fake-reviews-testimonials)

Reference or workflow influence; check current applicability before consequential use.

<a id="source-ftc-darkpatterns"></a>
### FTC Bringing Dark Patterns to Light

Type: authority. Reviewed 2026-11-10.

[Original source](https://www.ftc.gov/system/files/ftc_gov/pdf/P214800%20Dark%20Patterns%20Report%209.14.2022%20-%20FINAL.pdf)

Reference or workflow influence; check current applicability before consequential use.

<a id="source-wikipedia-aislop"></a>
### AI slop terminology

Type: community. Reviewed 2026-11-10.

[Original source](https://en.wikipedia.org/wiki/AI_slop)

Qualitative observation, not prevalence or authorship evidence.

<a id="source-wikipedia-aisigns"></a>
### Signs of AI writing

Type: community. Reviewed 2026-11-10.

[Original source](https://en.wikipedia.org/wiki/Wikipedia:Signs_of_AI_writing)

Qualitative observation, not prevalence or authorship evidence.

<a id="source-reddit-ui"></a>
### UI Design discussion of generic AI styling

Type: community. Reviewed 2026-11-10.

[Original source](https://www.reddit.com/r/UI_Design/comments/1w70kqb/question_about_websites_looking_like_ai_slop/)

Qualitative observation, not prevalence or authorship evidence.

<a id="source-reddit-webdesign"></a>
### Webdesign discussion of AI aesthetics

Type: community. Reviewed 2026-11-10.

[Original source](https://www.reddit.com/r/webdesign/comments/1uhuovu/preventing_the_ai_slop_look/)

Qualitative observation, not prevalence or authorship evidence.

<a id="source-x-defaults"></a>
### Practitioner example of common modern-site defaults

Type: community. Reviewed 2026-11-10.

[Original source](https://x.com/ishaan_builds/status/2111491929334780132)

Qualitative observation, not prevalence or authorship evidence.

<a id="source-youtube-workflow"></a>
### Stop Building AI Slop Websites

Type: community. Reviewed 2026-11-10.

[Original source](https://www.youtube.com/watch?v=uPIIJDmq5OU)

Qualitative observation, not prevalence or authorship evidence.

<a id="source-hn-design"></a>
### Hacker News design-pattern detector discussion

Type: community. Reviewed 2026-11-10.

[Original source](https://news.ycombinator.com/item?id=48821493)

Qualitative observation, not prevalence or authorship evidence.

<a id="source-uxse-minimalism"></a>
### UX Stack Exchange: minimal design tradeoffs

Type: community. Reviewed 2026-11-10.

[Original source](https://ux.stackexchange.com/questions/29683/what-are-the-advantages-and-disadvantages-of-minimal-design/70018)

Qualitative observation, not prevalence or authorship evidence.

<a id="source-research-ai-security"></a>
### Do Users Write More Insecure Code with AI Assistants?

Type: study. Reviewed 2026-11-10.

[Original source](https://arxiv.org/abs/2211.03622)

Reference or workflow influence; check current applicability before consequential use.

<a id="source-research-diversity"></a>
### Generative AI and collective creative diversity

Type: study. Reviewed 2026-11-10.

[Original source](https://doi.org/10.1126/sciadv.adn5290)

Reference or workflow influence; check current applicability before consequential use.

<a id="source-research-packages"></a>
### Package hallucinations in generated code

Type: study. Reviewed 2026-11-10.

[Original source](https://www.usenix.org/system/files/usenixsecurity25-spracklen.pdf)

Reference or workflow influence; check current applicability before consequential use.

<a id="source-image-1"></a>
### User-supplied screenshot 1

Type: user-reference.

Labels supplied during the original research. No screenshot, portrait or source-file path is distributed. Explanations are independently authored.

<a id="source-image-2"></a>
### User-supplied screenshot 2

Type: user-reference.

Labels supplied during the original research. No screenshot, portrait or source-file path is distributed. Explanations are independently authored.

<a id="source-image-3"></a>
### User-supplied screenshot 3

Type: user-reference.

Labels supplied during the original research. No screenshot, portrait or source-file path is distributed. Explanations are independently authored.

<a id="source-image-4"></a>
### User-supplied screenshot 4

Type: user-reference.

Labels supplied during the original research. No screenshot, portrait or source-file path is distributed. Explanations are independently authored.

<a id="source-image-5"></a>
### User-supplied screenshot 5

Type: user-reference.

Labels supplied during the original research. No screenshot, portrait or source-file path is distributed. Explanations are independently authored.
