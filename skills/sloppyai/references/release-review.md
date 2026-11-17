# Product and release review checklist

Choose the routes, workflows and artifacts relevant to the release. Run the
static audit, then inspect the rendered states and approved test fixtures
needed for each applicable item. Report one finding per observed problem.
Use the most specific catalogue ID and include the location, consequence,
proposed fix and a verification step. Record missing evidence in coverage.

## Design and writing

| Check | What to inspect | Catalogue |
| --- | --- | --- |
| Visual hierarchy and proof | Give the main task, headline, CTA or metric the most prominence. Show a real product state, useful example or verified result. Preserve needed controls and make the first action easy to find. | P01–P08, UX11, D06–D10 |
| Copy and labels | Use concrete product language, meaningful action names, consistent terminology and natural sentences. Remove repeated titles and descriptions, filler badges, unnecessary eyebrows, section numbers, all-caps subtitles, ornamental code paths, unnecessary emoji and stacked slogans. Review repeated em dashes and fragmented titles in context. | C01–C10, H01, H10–H13, H18, H20, D01–D04 |
| Component consistency | Compare buttons, fields, menus, sheets, cards and close controls across states. Reuse spacing, radii, icon size and stroke, surface tones and accent roles. Group by spacing before adding borders and dividers. Keep purposeful Lucide icons, shadcn primitives, pills and soft square shapes where they fit the system. | D05, D08, D11–D14, H05–H08, H16 |
| Typeface and fit | Check kerning, tracking, x-height, leading, line length, headline wrapping, widows and orphans. Use fluid size, reserved bold width, text-box trim, underline offset and superscript spacing where useful. Use tabular numerals for changing values, typographic quotes in prose, small caps where legible, and language-aware hyphenation, middle truncation or title clamping where the full value remains available. Review repetitive Inter, Instrument Serif, Space Grotesk and serif-italic pairings, and excessive monospacing in context. | D03, D04, D16–D18, D21, H02–H04, H17, T01–T12 |
| Colour, depth and contrast | Check text, icons and controls on actual light, dark and system-theme surfaces. Use accent colours, restrained opacity and consistent layers. Inspect OKLCH palettes and gradient interpolation where used. Compare optical alignment and concentric radii (inner radius equals outer radius minus the inset). A hairline, inset top highlight, alpha border, masked edge or multiply blend can show depth when it supports the component. | A07, D11, D14, D15, D17, H07, H08, T11 |
| Decorative treatments | Review generic purple-blue or dark hero gradients, gradient headline text, grain over gradients, glass cards, cursor-following light, repetitive three-card rows, sparkles, marquees, dithering, ASCII and decorative diagrams against the product's hierarchy. Test any effects on readability, performance and motion preferences. | H05, H09, H14–H16, H19, D13, F05, A11 |
| Optional art and backgrounds | Consider felt, fluted glass, thermal gradients, water ripples, graphite speckles, single-hue landscapes, blueprint grids, halftones, grainy gradients, grass, dithering, paper, contour lines, sky, pixel mosaics, lens distortion, stippling, square-dot grids, blurred photos, iridescence, Impressionist or Monet-like art and ASCII/pixels. Other reference options include cream, disco-like marks, Renaissance artwork and Pretext text wrapping around objects. Choose an intentional treatment and check text contrast and rights on the rendered surface. | B01–B22, A07, R01 |

## Interaction, motion and accessibility

| Check | What to inspect | Catalogue |
| --- | --- | --- |
| Task flow and choice | Put frequent actions where people expect them. Apply familiar conventions (Jakob’s law), recognition over recall, chunking (Miller’s law) and progressive disclosure. Limit choice burden (Hick’s law). Use working breadcrumbs for deep navigation, a searchable combobox for long option lists and an infinite canvas where open spatial navigation serves the task. Check empty, long and localized data. | P03, P04, UX07, UX09, UX11, UX12, T15–T20 |
| Action feedback and recovery | Inspect loading, pending, empty, success, error, partial, disabled, permission and session-expired states. Give visible confirmation, useful errors, retry, cancellation and undo as applicable. Verify saved state and handle failed optimistic updates. A pixel loader or pulsing live dot should reflect actual status. | D19, D20, UX04–UX06, UX08, UX10, C07, T06 |
| Touch and keyboard | Check target size and placement (Fitts’s law), names and text alternatives, keyboard operation, focus visibility and return, meaningful order, announcements and alternatives to dragging. Test font zoom and reduced motion. | A01–A12, T08 |
| Responsive geometry | Compare real narrow, short and wide viewports, safe areas and mobile keyboard states. Check sticky actions, menu/dialog layers, clipping, overflow, viewport units, title reflow and layout shift. | UX13, F01, F02, F06, T04, T13 |
| Motion timing | Match ease-out entrances and ease-in-out moves to the state. Review shorter exits, trigger-origin popovers, controlled scale on press, row stagger, useful success pulses, icon crossfades and brief blur. Treat demo values such as 150–250 ms dropdowns, 30 ms stagger, 0.97 press, 0.95 popover, 12% knob stretch and 20% shorter exits as examples to test in context. | D20, A11, F03, F04, T10, T14 |
| Direct manipulation and continuity | Track the pointer while held. Use edge resistance, interruptible motion, overlapping old and new states, shared elements, masks, spatial continuity and a coordinated stagger when they clarify the result. Evaluate scrolling fades, hover opacity and bounce by their effect on clarity and responsiveness. | D20, A11, T10, T14, T18, T20 |
| Illustrative animation and responsiveness | Stage the focal action. Where useful, use pose-to-pose moves, anticipation, easing, arcs, squash and stretch, follow-through, secondary motion, snappy timing, exaggeration, coherent 3D volume and visual appeal. Give prompt feedback (Doherty threshold) and accept harmless input variations (Postel’s law) while validating protected boundaries. | D20, A12, UX11, UX12, E07, M04, M05 |

## Public website, customer journeys and publication

| Check | What to inspect | Catalogue |
| --- | --- | --- |
| Public route metadata | Check distinct page titles, specific descriptions, social images, matching canonical URLs, robots.txt, index directives, applicable structured data, internal links and a useful 404 response. Verify the rendered head and actual status. | P09, UX07 |
| Public identity and support | Show accurate business and contact details, relevant FAQs and realistic response expectations. Use genuine reviews, case studies and team photos where available. For place-based businesses, verify directions, map and local structured data. | P05, P10, R03, C06 |
| Conversion and subscriptions | Check the CTA on the first screen and any sticky mobile control. Verify the confirmation or thank-you state, complete prices and fees, trial and renewal messaging, refunds and discoverable cancellation wherever applicable. Check whether any step pressures or obstructs the user. | D10, C10, UX04, UX06, UX10, R07 |
| Privacy, consent and rights | Verify what is collected, retained, sent to named providers or SDKs, and deleted from active stores and uploads. Check privacy/cookie notices, terms, consent and withdrawal flows, marketing unsubscribe, children’s data conditions and GDPR rights where applicable. Check tools such as Google Analytics and their tags against the choices actually offered. | R06, R07, S32 |
| AI features and media rights | Match AI use, vendor and media disclosures to the actual feature and market. Review safety responses where users can raise sensitive distress topics. Track permissions, provenance and required attribution for fonts, images, music and video. | R01–R04, R07, S09, M01 |

Use [WCAG 2.2](https://www.w3.org/TR/WCAG22/) for accessibility criteria.
Use [Search Central](https://developers.google.com/search/docs/fundamentals/seo-starter-guide)
for public search guidance and [European Commission guidance on data rights](https://commission.europa.eu/law/law-topic/data-protection/information-individuals_en)
for applicable GDPR rights. Check the actual product, market and use case before
concluding a legal obligation applies. See [AI use and the EU AI Act](eu-ai-act.md).

## Defensive security

| Check | What to inspect | Catalogue |
| --- | --- | --- |
| Secrets and deployment artifacts | Inspect source, client bundles, build settings, Git history and env separation for privileged API keys and signing material such as JWT secrets. Confirm remediation and rotation of exposed credentials through the owner. Check .git, debug pages, verbose errors, source maps, framework-identifying headers such as Next.js identification, and retired hostname mappings. | S01, S02, S10, S13, S17, S23, S35, S36 |
| Authentication and sessions | Trace server-side auth on API/admin operations, password hashing where hosted in the app, secure cookies, verified account linking, recovery and reset destinations, consistent account-facing errors, and login rate/bot controls. | S05, S10, S12, S16, S20, S28 |
| Data and storage boundaries | Verify restricted public client keys where designed, row-level and object/tenant authorization, private upload storage such as Supabase Storage, time-limited access, encryption where appropriate, minimum response fields and deletion. | S03, S06, S27, S32, S34 |
| Input and output boundaries | Validate request fields and mutation allowlists. Use parameterized queries, contextual output encoding and approved file/URL controls. Check upload type and size, file path isolation, outbound request restrictions and redirect destinations. | E07, S14, S15, S19, S22, S25, S34 |
| Money and abuse controls | Verify prices, currency and entitlements server-side. Check atomicity, duplicate requests, webhook verification, race conditions, and rate/spend caps for SMS, generation and other paid resources. Review AI input as untrusted data and enforce tool and account boundaries outside the model. | S04, S08, S09, S11, S29, S30 |
| Platform configuration | Review HTTPS, TLS verification, CORS and security headers including framing policy. Review live configuration through authorized admin evidence and verify dependencies, build scripts and third-party assets for provenance, advisories and unused packages. Treat hosted scripts such as Polyfill.io as dependencies. | S07, S18, S26, S31, S33 |

Use the applicable [OWASP ASVS](https://asvs.owasp.org/) requirements. Cite concrete
source, configuration and approved test evidence for a finding.

## Short-form explainers and demonstrations

| Check | What to inspect | Catalogue |
| --- | --- | --- |
| Explain one useful change per beat | Lead with a clear topic or outcome. Show working before/after states, actual product footage or a source-bound diagram and explain the relevant difference. Match the visual to the spoken point and leave time to read it. | M02–M07, M09 |
| On-screen hierarchy and export | Frame the important control, data, model or image as the dominant visual. Keep captions, numbers, source labels, timers and optional product callouts readable and clear of platform controls. Check audio intelligibility, legal asset rights and the actual export in the requested aspect ratio. | M01–M09, R01, R04 |
| Use specific demonstrations | A wheel can show a fixed indicator and moving scale. A boarding pass groups flight, route and seat information and gives the outcome a distinct final moment (peak-end rule). A schedule can display a chart, precise values, confirmation and undo together. A theme switch can preserve the same spatial layout while a lens-like control, origin-aware reveal and stagger explain the change. A prompt-led hero can show the actual composer, model choice, action and relevant import controls. | UX04, UX06, D18, D20, M03–M05, M09 |
