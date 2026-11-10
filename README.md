# Craftcheck

Bring an existing artifact → understand the findings → choose a concrete improvement → make the change → verify the result.

Craftcheck gives coding agents a repeatable way to improve interfaces, writing,
code and other artifacts while preserving useful behaviour and accepted style.
It combines a portable Agent Skill with a local CLI, an evidence catalogue,
issue history and bounded check → repair → recheck loops.

## Start here

Requires Node.js 22.13 or later. Clone the source and build the portable helpers:

```sh
git clone https://github.com/JonathanStecher/craftcheck.git
cd craftcheck
npm ci --ignore-scripts
npm run check
node skills/craftcheck/scripts/craftcheck.mjs --help
```

Install the skill for your chosen host, or copy the complete
`skills/craftcheck` folder to a supported skill location:

```sh
node skills/craftcheck/scripts/craftcheck.mjs install --host codex
node skills/craftcheck/scripts/craftcheck.mjs install --host claude
node skills/craftcheck/scripts/craftcheck.mjs install --host cursor
```

Choose one host command. The installer changes only the Craftcheck skill folder;
it does not edit project instructions, register hooks or change model settings.
Use `--scope project --project /path/to/project` for a project installation or
`--dest /path/to/skills` for an explicit skill-parent directory. The copied skill
includes its CLI, library, references, schemas, catalogue and bundled licences.

Then ask your agent:

> Use Craftcheck to audit this artifact, fix concrete issues while preserving its useful features, and verify the result. Keep ratings and remaining concerns visible after each round.

Host syntax differs: Codex can use `$craftcheck`; Claude Code can use
`/craftcheck`. The core workflow also works through an agent that reads SKILL.md.

## Audit an artifact

```sh
node skills/craftcheck/scripts/craftcheck.mjs audit /path/to/artifact
node skills/craftcheck/scripts/craftcheck.mjs plan /path/to/artifact --no-save
node skills/craftcheck/scripts/craftcheck.mjs catalog --domain accessibility
```

Reports are written locally to `.craftcheck` beneath the selected directory, or
beside a selected file. `--out` selects another directory; `--no-save` produces
stdout-only audit/plan/verify output. Formats include JSON, Markdown and HTML.

## Continuous improvement

```sh
node skills/craftcheck/scripts/craftcheck.mjs init /path/to/artifact --language en
node skills/craftcheck/scripts/craftcheck.mjs loop /path/to/artifact --apply
node skills/craftcheck/scripts/craftcheck.mjs watch /path/to/artifact --max-cycles 10 --duration-ms 300000
```

Configure the artifact's actual language. Each loop records a baseline, makes an
authorized repair, runs another assessment, compares ratings and keeps the issue
history. It stops when the assessed targets are met, a regression appears, progress
stalls, a bound is exhausted, or the user cancels. Watch rechecks changed inputs
and has separate total-duration and changed-input-cycle limits. It installs no daemon.

Default loop bounds are three repair rounds, two stalled rounds and five minutes.
The default automated target is 100 within assessed checks. If a reviewer hook is
configured, it also needs fresh evidence and a reviewer score of at least 4/5.
These thresholds describe scoped checks; reaching them is not full-product approval.

The built-in fixer is deliberately narrow: it can add a configured missing HTML
language, remove restrictive viewport zoom settings and add ordinary new-tab
opener protection. Other issues are improved by the coding agent or an explicitly
configured repair hook. Intentional `rel=opener` relationships require review.

### Integrate tests, reviewers and repair tools

Project commands are inert until `--allow-exec` is supplied. Configure command
arrays in `.craftcheck.json` after inspecting them:

```json
{
  "language": "en",
  "preserve": [{ "path": "index.html", "contains": ["Save", "Cancel"] }],
  "checks": [{ "name": "project tests", "command": ["npm", "test"], "attempts": 2, "timeoutMs": 30000 }],
  "reviewer": { "name": "my reviewer", "command": ["node", "tools/review-artifact.mjs"], "timeoutMs": 60000 },
  "fixer": { "name": "my repair tool", "command": ["node", "tools/improve-artifact.mjs"], "timeoutMs": 60000 },
  "loop": { "maxRounds": 3, "targetScore": 100, "reviewTarget": 4, "stallRounds": 2, "maxDurationMs": 300000 }
}
```

The hook filenames above are your tools, not bundled model services. Their
[protocol](docs/hooks.md) is provider-neutral. A reviewer receives the current
observation and writes schema-validated review JSON bound to its input digest.
It runs again after changes so ratings are fresh. A fixer receives findings and
the preservation contract, then the controller reruns its own checks.

```sh
node skills/craftcheck/scripts/craftcheck.mjs loop /path/to/artifact --apply --allow-exec
node skills/craftcheck/scripts/craftcheck.mjs verify /path/to/artifact --allow-exec --baseline /path/to/baseline.json
```

Commands run with your user permissions, not in a security sandbox. They may use
network or paid services if your command does; authorize those costs separately.
The helper itself contains no network calls, AI API client, telemetry or updater.
It pins the initial configuration during a loop/watch so a repair cannot add new
executable hooks mid-run. Check retries preserve every attempt; a later pass is
labelled `passed_after_retry`.

## Ratings and history

- **Automated check scores, 0–100:** only supported requirement findings in the
  assessed implemented scope reduce the score. Unassessed domains are null.
- **Reviewer scores, 0–5:** attributed human/agent judgments with rationale and
  current evidence. They are separate from automated scores.
- **Issue history:** first/last observation, severity, confidence, accepted
  heuristic exceptions, regressions and checks where an issue is no longer observed.
- **Coverage:** skipped inputs, limits, manual work and unavailable evidence remain
  visible. A static warning disappearing does not establish runtime closure.

The score formulas and rubric are in [methodology](docs/methodology.md).
No score estimates AI authorship or certifies security, accessibility or legal compliance.
Styles such as gradients, serif type, dense tools, cards and monochrome layouts
can all be appropriate.

Each output directory contains:

```text
report.json       Latest machine-readable assessment
report.md         Human-readable findings and comparisons
report.html       Self-contained, script-free HTML report
history.json      Issue observations and rating changes
snapshots/        Earlier assessment records
loops/            Stop reasons and repair-round metadata
backups/          Private source backups for built-in repairs
checkpoint.json   Latest persisted input/report identity
```

Backups may contain sensitive source. Keep `.craftcheck/` out of version control.
Undo refuses to overwrite later edits:

```sh
node skills/craftcheck/scripts/craftcheck.mjs history --out /path/to/.craftcheck
node skills/craftcheck/scripts/craftcheck.mjs undo /path/to/artifact --out /path/to/.craftcheck --transaction TRANSACTION_ID
```

## What is implemented

- A self-contained skill with plan, audit, improve and verify workflows.
- 194 canonical entries, retaining all 102 original research labels: requirements,
  contextual heuristics, optional visual techniques and definitions.
- Static HTML naming, language, zoom, duplicate-ID and link checks; contextual
  heading, contrast, image-space, CSS, copy and source-code prompts.
- Bounded loops, change-triggered watch, optional command checks and review/fix hooks.
- Fresh-review binding, separate ratings, issue comparisons, backups and undo.
- JSON schemas, generated catalogue documentation, examples and behavioural tests.
- Local installation/removal and portable bundled helpers.

The catalogue is broader than the automated scanner. The CLI does not run browser
journeys, inspect binary media, prove authorization, check asset rights or establish
factual claims. The agent workflows explain how to assess these with suitable
available tools. Input digests bind the listed static manifest, not excluded media
or remote resources. See [compatibility](docs/compatibility.md) and
[evaluation](docs/evaluation.md) for exact assurance boundaries.

## Try a reversible demonstration

```sh
npm run demo
```

The demo copies an authored fixture into `.craftcheck/demo` before improving it.
It retains baseline scores, fixes, subsequent scores and undo metadata. The source
fixture is preserved. Examples are synthetic and contain no customer data.

## Develop and contribute

```sh
npm run check
npm audit
npm pack
npm run package:smoke
```

Edit `src/` and canonical catalogue JSON. The build generates the portable helpers,
bundled licence notices and [catalogue](docs/catalog.md). See
[CONTRIBUTING.md](CONTRIBUTING.md), [architecture](docs/architecture.md) and
[SECURITY.md](SECURITY.md).

Craftcheck is an independent project. Workflow inspiration includes
[gstack](https://github.com/garrytan/gstack); it is not required at runtime.
Our original code and writing are MIT licensed. Bundled libraries retain their
own [licence notices](skills/craftcheck/scripts/THIRD_PARTY_LICENSES.md).
Source images and third-party article text are not distributed. See [NOTICE.md](NOTICE.md).
