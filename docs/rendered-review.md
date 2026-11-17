# Rendered product review

Run `sloppyai review PROJECT --allow-exec` for the normal product assessment.
Add `--apply` to recheck after built-in or configured agent repairs. The
explicit `audit` command is the source-only entry point.

Use installed Playwright or playwright-core and Chromium. The browser can
come from Playwright, common Linux system paths, or the
`SLOPPYAI_CHROMIUM` executable path. Use the project's browser installation
or install Playwright next to the toolkit. Start a framework's normal preview
command separately and supply the preview origin.

```json
{
  "visual": {
    "url": "http://127.0.0.1:3000",
    "routes": ["/", "/pricing", "/sign-in"],
    "themes": ["light", "dark"]
  },
  "checks": [
    { "name": "UI and server tests", "command": ["npm", "test"] }
  ],
  "logs": ["logs/local-preview.log"]
}
```

For standalone HTML use a local index.html or select an HTML file.
The browser captures each route on desktop and mobile and records measured
overflow, unnamed buttons, page errors and resource failures. Capture
contexts start fresh and allow ordinary reads on the selected origin.
Use local preview data for review and representative authenticated journeys
through approved project tests. Incomplete captures stay visible. Review
the saved screenshots for actual hierarchy, copy, spacing and interaction
states. The metrics address only the measured properties.

For native UI, component catalogs, or signed-in fixture journeys, let a
project check generate PNGs and add their relative paths to `visual.artifacts`.
The assessment imports PNGs regenerated during the current check run,
records their dimensions and digest, and reports missing or stale files.
Add routes or a preview origin when browser captures are also needed.

The source inventory covers bounded UTF-8 files, including other languages
and component templates. Use each project's normal compiler, linter and
tests through `checks` for language and backend coverage. The report records
tests executed, available log samples and gaps. Use existing fixture-based
project tests for authenticated, stateful or native application journeys.

Use the private report directory for captures. Log summaries retain level
counts and sample digests. With `--include-check-output`, failing commands
may include a bounded redacted sample. External agents use the current
runtimeDigest and evidenceRoot from the hook request. Allow access to the
selected evidence only when the host and user authorize it.

Run the offline Workroom example from the repository:

```sh
node skills/sloppyai/scripts/sloppyai.mjs review examples/visual-review/before --allow-exec --out .sloppyai/workroom-before
node skills/sloppyai/scripts/sloppyai.mjs review examples/visual-review/after --allow-exec --out .sloppyai/workroom-after
```

The before example includes deliberate findings. Compare the two report
directories and their browser captures. Exercise the after booking control
with local demo data.
