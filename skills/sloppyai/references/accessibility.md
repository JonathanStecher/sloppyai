# Accessibility and responsive behaviour

Choose the applicable platform guidance and conformance target. Check semantics,
accessible names, reading order, keyboard operation, focus management, live updates,
errors, zoom/reflow, colour use, target size, captions and relevant alternatives.

For WCAG AA text contrast, normal text generally needs 4.5:1 and large text 3:1.
Large means at least 18pt (24 CSS px), or 14pt (about 18.67 CSS px) when bold.
Exceptions apply; arbitrary 18 CSS px text is not automatically large text.
WCAG 2.2 AA target size is 24 by 24 CSS px with defined exceptions, including
spacing. The enhanced target-size criterion uses 44 by 44 CSS px. Platform
recommendations can choose larger targets. Keep these different requirements clear.

Inspect real focus and interaction. An outline:none declaration might have a valid
replacement elsewhere. An img can be decorative. A fragment may obtain language
and hierarchy from its containing document. Never infer complete conformance from
an automated scan or one screen-reader observation.

The CLI checks a subset of authored HTML and literal CSS. It cannot fully resolve
the cascade, background compositing, JavaScript rendering or assistive technology.
Its contrast observations remain tentative until rendered context is verified.

Sources: https://www.w3.org/TR/WCAG22/ and
https://www.w3.org/WAI/ARIA/apg/.
