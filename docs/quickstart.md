# Quickstart

From a source checkout:

```sh
npm ci --ignore-scripts
npm run check
node skills/sloppyai/scripts/sloppyai.mjs audit examples/landing-page --out .sloppyai/first-report
npm run demo
```

An audit may exit 1 for supported requirement failures at the selected threshold;
the report is still written. Review prompts do not become confirmed failures.

The demonstration copies the fixture before editing it. Open
the report.html path printed by the demo to see current findings and score changes.
history.json retains earlier assessments and issues.

Run npm run demo:hooks to include the fixture-only reviewer and fixer and observe
fresh 2/5 → 4/5 heading-task ratings alongside static score changes.

For your artifact, create configuration with its actual language:

```sh
node skills/sloppyai/scripts/sloppyai.mjs init /path/to/artifact --language de
node skills/sloppyai/scripts/sloppyai.mjs loop /path/to/artifact --apply
```

The helper applies only narrow known fixes. Ask the coding agent to handle semantic
improvements through the installed skill, or configure your own review/fix hooks.
Read [hooks.md](hooks.md) before authorizing project execution.

Use watch for bounded recurring checks while you work:

```sh
node skills/sloppyai/scripts/sloppyai.mjs watch /path/to/artifact --max-cycles 10 --duration-ms 300000
```

It rechecks changed inputs and stops at a bound or Ctrl+C. Add --apply only when
you want the supported repairs. It creates no scheduler or background service.

Install a local skill copy with install --host codex, claude or cursor. Use
uninstall with the same location options to remove an unchanged managed copy.
Copying only SKILL.md is insufficient: keep the complete sloppyai folder.
