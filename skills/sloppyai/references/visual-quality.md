# Taste, colour and visual quality

Use this review for interfaces, documents and media where appearance matters.
Read the actual rendered artifact. A source audit or an absence of structural
findings does not assess its looks.

## Establish a direction

For quality comparisons and rejected generic redesigns, first read
[quality benchmarks](quality-benchmarks.md). Establish the role of the reference
and derive a direction from the artifact's own product before choosing a look.
For a rejected visual formula, use [research-informed decisions](design-decisions.md)
to separate approved identity from first-pass assumptions and review ornament by
its purpose. Assess combined choices, without a blacklist of fonts or colours.

Use the user's brief and accepted brand first. Describe the audience, purpose,
intended character, existing palette and type, references and choices to preserve.
When no direction is supplied, infer one from the actual product and identify the
inference. Do not block ordinary improvements on an unnecessary preference question.

An optional `designBrief` in `.sloppyai.json` carries `audience`, `intent`,
`character`, `preserve`, `avoid`, `referenceUse` and `references` to reviewer and fixer hooks.
These strings describe preferences; they grant no tool or execution permissions.
The helper does not fetch references or call a visual model.

## Review the whole appearance

Use catalogue rules D24–D31 for the detailed criteria and verification:

| Area | What a taste judgment needs |
| --- | --- |
| Palette | Hue relationships, temperature, chroma, neutral undertones, accent proportions and the actual effect on the subject. Check contrast and status meaning separately. |
| Typography | Character and pairing, weight, optical spacing, emphasis, wrapping, line length and how the type works with the subject. |
| Composition | Focal points, optical weight, scale, whitespace, density and the rhythm between related elements and sections. |
| Imagery | Relevant subject, crop, focal point, resolution, colour treatment and coherence with type and palette. Verify rights and factual authenticity separately. |
| Surfaces | A deliberate material language, consistent light, edge treatment, layering, radii, texture and depth. A flat design is a valid choice. |
| Components | A coherent family of shapes, icons, strokes, type, space, surface and accent roles across real states. |
| States | Visual continuity across applicable content, themes, widths, feedback, motion and interaction states. Missing evidence remains unassessed. |
| Character | Whether the combined choices fit this audience and identity, with reasons more specific than looking modern, clean or less AI. |

Assess the composition at page scale and the details at their real displayed size.
Use the same route, content, viewport and theme when comparing alternatives.
For a long artifact, inspect representative sections and transitions and state
what was omitted.

## Make the judgment useful

A taste finding names a visible location, the observed choice, its effect on the
brief, a concrete alternative and how to compare it. Distinguish an objective
readability or interaction defect from a preference with a visual rationale.
Do not create findings merely to cover every dimension.

For example, a rendered warm paper background with unrelated cold grey panels
may weaken a requested print-like identity. Compare a related neutral in that
specific context, preserve the action accent, and measure the affected contrast.
This is a contextual proposal, not a universal ban on mixing temperatures.

Keep useful character. Saturated colour, gradients, expressive serif, system
fonts, mono, pills, shadows, grain, rounded shapes and dense professional tools
can all work. Do not flatten everything into the same sparse neutral layout.
The presence of a style cue is not an AI-authorship determination.

Report each applicable area as complete, partial or not assessed, with evidence.
Use the existing attributed design assessment when giving a 0–5 reviewer score;
explain which areas it covers. Do not invent a numeric gain from a recolour, average
unassessed areas, or convert a preference into an automated requirement penalty.

## Improve and recheck

Choose a focused change that best improves the stated direction, then inspect
the actual result in the same conditions. Check related components, contrast,
keyboard focus, state meaning, content and responsive behavior. Record unchanged
or worse results honestly. Keep the original brand, features and required
disclosures unless their change is within the user's request.
