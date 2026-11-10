# Performance as part of the experience

Measure what delays useful content, interaction or stable layout. Inspect actual
assets, execution, rendering, fonts and third-party requests rather than counting
animation or assuming one library is always slow.

Good Core Web Vitals thresholds are LCP <= 2.5 seconds, INP <= 200 milliseconds,
and CLS <= 0.1, assessed at the 75th percentile of relevant visits. Field and lab
measurements serve different purposes; do not present a local lab score as field
performance. Compare like inputs, devices, cache states and network conditions.

Reserve appropriate asset space and use suitable dimensions, formats and loading
strategies. Avoid blindly lazy-loading the primary visual. Evaluate font loading
and preloading with the actual page. Respect reduced-motion needs and preserve
content that should be visible before script or animation runs.

The CLI finds candidate image-dimension, font-display and broad-transition issues.
External CSS and intentional animation may explain them. F catalogue entries
remain contextual unless a concrete measured failure is established.

Source: https://web.dev/articles/vitals.
