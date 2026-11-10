# Architecture

The portable skill owns workflow guidance and canonical catalogue data. Source
modules implement deterministic mechanics rather than duplicating judgment prose.

| Module | Responsibility |
| --- | --- |
| src/files.mjs | Bounded source inventory, exclusions and input manifest |
| src/checks | Source observations and contextual prompts |
| src/audit.mjs | Current input binding, scoped report and review import |
| src/ratings.mjs | Defined automated scores and compatible comparisons |
| src/commands.mjs | Explicit command execution, timeouts and retained attempts |
| src/repair.mjs | Narrow source edits, backup manifests and conflict-aware undo |
| src/loop.mjs | Bounded assess/repair/reassess and change-triggered watch |
| src/state.mjs | Private durable snapshots, issue history and checkpoint |
| src/report.mjs | Escaped Markdown and script-free HTML output |
| src/install.mjs | Self-contained managed installation and removal |
| scripts/build.mjs | Portable bundles and exact dependency licence notices |

The catalogue has one canonical record per ID. Original references retain image
and item mappings. Catalogue documentation is generated. Rule kinds and source
authority are explicit. See [catalogue](catalog.md).

The helper's input digest covers the static manifest, effective configuration,
catalogue and engine version. External assets and excluded files are not implicitly
covered. Review imports must bind to that exact input. Runtime evidence retains
its own assurance limits.

Configuration is data. No project code or hook executes during audit. Execution
requires an explicit flag, and executable definitions remain pinned during a loop.
The helper is not a hostile-code sandbox. Agent content does not grant permissions.

Each repair targets an observed file hash and bounded non-overlapping source edits.
Original bytes are stored locally. Undo requires matching post-repair bytes so it
does not overwrite later work. External fixer changes remain the caller's diff.

The built CLI and exported library are bundled into the skill directory, with
data, schemas and licence notices. An installed skill therefore needs Node but
does not need a separate node_modules tree or gstack installation.
