# Compatibility and coverage

## Runtime and hosts

Node.js 22.13 or later is required. The source project uses npm and pinned build
dependencies. Portable bundles ship inside the complete skill folder.

The installer supports conventional user/project locations for Codex, Claude Code
and Cursor, plus an explicit destination. This is filesystem installation support;
it does not prove how every host version discovers skills or evaluates their prose.
It edits no host instructions, model settings or startup hooks.

## Renamed release

Version 0.2.0 uses sloppyai throughout: the skill is `$sloppyai` or `/sloppyai`,
the CLI is `scripts/sloppyai.mjs`, configuration is `.sloppyai.json`, report state
defaults to `.sloppyai/`, and hook variables use the `SLOPPYAI_` prefix.

For a configuration created with the original 0.1.0 release, copy
`.craftcheck.json` to `.sloppyai.json` and update hook variables and script paths.
Keep the original report history for reference; engine versions differ, so cross-version
numeric deltas are withheld. Existing `.craftcheck/` report and backup folders remain
excluded from scans and version control. The earlier tagged release remains available.

## Static inputs

Supported UTF-8 source includes HTML, CSS, JavaScript/TypeScript, Python, SQL,
Markdown, plain text and selected JSON/YAML files. Scan limits and exclusions are
documented by each report. Secret files, dependencies, generated output, symlinks,
binary media and unsupported formats are excluded. Configured exclusions are
relative prefixes, not gitignore patterns.

Authored HTML parsing and source patterns are partial evidence. Dynamic rendering,
computed styles, complete accessible names and runtime application state can differ.
The CLI makes no live network request or browser navigation.

## Contextual work

The skill includes guidance for browser journeys, source tracing, factual claims,
documents, media and rights. Use appropriate tools when available and authorized.
Record absent tools as coverage gaps. A static manifest does not bind ignored
binary or remote assets; use explicit file/evidence hashes for those observations.

## Process and storage

Commands use argument arrays with shell:false. On Unix the helper can terminate
the command's process group after timeout/cancellation. Windows child-process
termination has platform limitations; a detached descendant that outlives its
parent is not a sandbox-contained resource. Review external tools accordingly.
On Windows, .cmd/.bat launchers such as npm.cmd cannot be spawned through this
shell-free protocol. Select a real executable, or invoke Node with the tool's
JavaScript entrypoint and arguments. The helper never silently enables a shell.

Reports are private local state and should remain untracked. Filesystem locks
prevent two writers using the same output directory. They do not isolate concurrent
edits to the artifact by unrelated tools; source hashes and undo conflicts protect
against overwriting observed later changes within the supported repair contract.
