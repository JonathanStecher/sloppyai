# Research-informed decisions for a design that feels generic

Use this when a user rejects the overall look, including repeated overlines,
familiar font treatments, stock palettes, button shapes or ornamental icons.
It supplements [visual quality](visual-quality.md) and
[quality benchmarks](quality-benchmarks.md). It is agent guidance, not a font
classifier, an automatic taste score or model-weight training.

For taste and character, continue with [real-product identity studies](product-identity.md).
A useful purpose can be expressive as well as operational. Removing unsupported
ornament does not supply a positive identity; do not stop at a generic neutral page.

## Start with what the user actually accepted

An AI-generated first pass is a baseline, not an approved brand system. Separate
required content and behavior, explicitly accepted identity, inferred choices and
rejected choices. Keep the first two. Reconsider the latter two when they caused
the rejection. Record rejected choices in the existing `designBrief.avoid` when
useful; do not silently remove a conflicting preservation requirement.

When a user names a bundle of unwanted choices, review that bundle together.
Do not preserve the same silhouette while changing a few sizes, or call the
result successful because it became more readable. Readability, usability and
the user's visual judgment are separate outcomes. A visual pass can fail while
the booking flow passes.

## Start with direct, familiar interface defaults

For a fresh or rejected clean interface, start with readable familiar type,
comfortable text sizes and line heights, ordinary controls and a consistent,
comfortable corner radius. Strengthen identity through the actual content,
imagery and relationships rather than stretching type or inventing controls.
Honor the user's explicit typography, shape and copy preferences.

- Do not add an overline above a heading or a subtitle beneath every heading by
  habit. Keep real information where it helps a decision.
- Do not scaffold a FAQ, numbered sections, repeated explanatory strips or
  feature boxes without content that needs them. Put costs and necessary
  disclosures in context instead of using them to justify filler sections.
- Avoid decorative separators and icons by default. Use spacing and surface
  contrast; preserve meaningful input boundaries, focus, selection and states.
- Give buttons clear action labels and familiar behavior. Keep corners coherent
  across buttons, images and panels; do not use shape novelty as the identity.
- Write the actual offer and behavior in plain language. Replace vague creative
  promises with useful facts, not clipped slogans or repeated short beats.

These are starting points, not automatic style violations. Preserve an accepted
expressive brand, a useful FAQ in a help centre, real form labels, meaningful
numbers and appropriate control symbols. A user-requested change takes precedence
over an earlier generated default. Do not infer AI authorship from any of these
features or remove required information merely to obtain a cleaner screenshot.

## What the research supports

The table records source findings separately from the proposed design practice.
These are bounded references, not evidence that a specific font or colour is AI.

| Source and scope | Supported finding | Application in this guide |
| --- | --- | --- |
| [Google Research: first impressions](https://research.google/blog/users-love-simple-and-familiar-designs-why-websites-need-to-make-a-great-first-impression/) | Complexity and resemblance to a recognisable website category influence early aesthetic judgments. | Keep familiar task conventions; pursue a product-specific composition rather than novelty everywhere. |
| [Google Design: choosing web fonts](https://design.google/library/choosing-web-fonts-beginners-guide) | Font selection depends on content, text length, displayed size, language and project needs. | Test actual service names, prices, headings and labels; give a reason beyond a font being fashionable or unfamiliar. |
| [NN/g: good visual design](https://www.nngroup.com/articles/good-visual-design/) | Alignment, a typographic system, intentional colour and useful imagery contribute to coherent design. | Review relationships across the whole page; a font swap alone cannot repair an unchanged visual formula. |
| [NN/g: bad icons](https://www.nngroup.com/articles/bad-icons/) | Repetitive, obscure or misleading icon sets can add clutter and interpretation cost. | Ask what a symbol adds to its label; retain useful recognised controls and state indicators. |
| [GOV.UK: buttons](https://design-system.service.gov.uk/components/button/) | Action-specific labels and a clear primary action support the next decision. | Distinguish a navigation link, a form action and a secondary choice before giving them visual emphasis. Do not transplant government branding. |
| [European Commission: button usage](https://ec.europa.eu/component-library/eu/components/button/usage/) | Button variants express action hierarchy; icons should be relevant to the action. | Inspect repeated button treatments and arrows against their actual destination and behavior. |
| [Pentagram: Garden Museum](https://www.pentagram.com/work/garden-museum) | The designers explain a gardening identity through its cultural purpose and organic forms, rather than literal plant motifs alone. | A subject does not prescribe a palette, font or icon set. Borrow the reasoning method, not the identity or assets. This is a designer's case study, not an efficacy experiment. |
| [Doshi and Hauser: creativity and diversity](https://arxiv.org/abs/2312.00506), published in [Science Advances](https://doi.org/10.1126/sciadv.adn5290) | In a short-story experiment, AI ideas improved some individual evaluations while increasing similarity among outputs. | Treat anchoring on the first generated direction as a risk worth checking. Extending this result to website design is an inference, not a demonstrated causal finding or a universal claim about AI. |

Sources were checked on 2026-11-26. The journal landing page was access-restricted
on direct retrieval; its indexed abstract and the authors' preprint were available.
No source establishes a universal list of AI fonts, colours, radii or layouts.

## Audit decisions instead of collecting style offences

For each repeated treatment, write its location, job, evidence, proposed action
and recheck. Keep this short enough to guide the implementation.

| Treatment | Ask in the actual product | Possible response, if supported |
| --- | --- | --- |
| Overline above a title | Does it add a category, location, date, status or hierarchy the title cannot supply? | Remove an empty or duplicated label. Keep a useful section category, article date or service-area fact; place it where the reader needs it. |
| Display font and emphasis | Do the letter shapes, weight, line endings and italic or mono accents serve this content and audience? | Compare real words in a materially different typographic treatment. Keep an accepted expressive face or a practical system font when it works. |
| Palette | Which colours carry identity, content, actions and states? Is the combination inferred only from a subject stereotype? | Derive a restrained set of roles from the product and supplied material; compare the whole composition. Retain a relevant green, purple, cream or vivid palette when justified. |
| Buttons and links | What changes on activation? Which decision is primary here? | Use clear labels, appropriate semantics and a coherent hierarchy. Remove unnecessary button chrome or repeated decorative arrows without hiding the action. |
| Icons and badges | Does each communicate an action, status, difference or relationship faster than its label? | Remove unsupported decoration. Keep selected-state dots, disclosure chevrons, transport controls and status symbols when useful; preserve text, labels and focus. |
| Cards and picture frames | What requires a separate surface or this particular crop? | Let content relationships determine grouping and image size. Compare a list, shared surface or unframed photo when repeated boxes or ornamental masks dominate. |
| Section rhythm | Does every section repeat an overline, slogan, paragraph and three boxes regardless of content? | Rebuild the reading sequence around actual decisions, evidence and useful content. Do not remove needed steps or scan structure merely to be different. |

Do not count these treatments to infer authorship or assign a penalty. Their
combination can feel generic in one brief and be deliberate in another.

## Choose and test a different assumption

1. Name the failed assumption: for example, treating every home service as a
   lifestyle journal, or giving every link the same large button and arrow.
2. Compare two materially different approaches using the same facts and assets.
   The rejected current design may be one of them. A short sketch or small
   prototype is enough before a complete implementation. Vary the reading order,
   typographic voice, image role and action hierarchy, not just token values.
3. Choose from the product's task and the user's feedback. Write a small decision
   ledger: fact or preference → decision → expected benefit → rendered check.
   "Premium", "calm", "clean" and "less AI" alone are insufficient explanations.
4. Implement the accepted or best-supported direction while preserving required
   features, prices, disclosures, keyboard access and meaningful states. A change
   to a rejected visual system can be substantial without replacing the product.
5. Compare current desktop and narrow screenshots at equal viewports, both as a
   whole page and at readable detail size. Inspect the exact rejected treatments.
   Recheck the real journey; maintain error and selected-state meaning after
   deleting decoration.

Record separate outcomes for functional preservation and visual response. If
the unwanted bundle is still recognisable, mark that visual repair unchanged or
failed and revisit the assumption within the existing retry bounds. Do not use a
passing static scan or self-awarded score to override the user's rejection.

## Counterexamples that must survive

- A publication can need a serif headline, an overline for its subject and a warm
  reading surface. A known publication identity is evidence to preserve it.
- A plant nursery can legitimately use green. A financial app can legitimately
  use purple. Colour alone does not justify replacing either palette.
- A dashboard's repeated rows, cards and small status icons can support comparison.
  Removing them may make the task harder.
- A transport player needs recognisable play and pause controls. A form needs a
  visible selected state and error feedback even when its ornamental icons go.
- A conventional form and a familiar system font can be the right result.
  Originality is neither a usability requirement nor proof of good taste.

This guide supplies research-informed instructions and evaluation examples.
Reading or installing it does not fine-tune a language model. Validate its effect
with honest examples, current rendered evidence and user feedback.
