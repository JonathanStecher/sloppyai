# How to use sloppyai on your existing project

You already have a website, app or piece of content made with AI. sloppyai helps
you improve it: clearer design and writing, fewer broken flows, and repairs for
bugs and supported security findings.

This guide takes you from a runnable example to a prompt you can use on your own
project. The example is authored for this repository and contains no customer data.

[About sloppyai](../ABOUT.md) · [Product overview](../marketing/README.md)

## Get the project

You need Git and Node.js 22.13 or later. Run these commands in a terminal:

```sh
git clone https://github.com/JonathanStecher/sloppyai.git
cd sloppyai
npm ci --ignore-scripts
```

If you already have the checkout, open a terminal in that folder. The remaining
CLI commands in this guide run from the sloppyai checkout.

## Try the example

```sh
npm run demo:hooks
```

The demo copies the included landing page to a new local demo folder, then improves
the copied page. The original example remains available for another run.

The assessment lines from the included example are:

```text
Round 0: 4 findings; copy 2/5
Round 1: 1 findings; copy 2/5
Round 2: 0 findings; copy 4/5
Stopped: target_met_assessed_scope; 2 repair rounds.
```

Open the `report.html` path printed by the command. It contains the latest
findings, rating changes and coverage. The adjacent `history.json` keeps earlier
assessments.

### What changed?

| Part of the example | Before | After |
| --- | --- | --- |
| Document language | Missing | `lang="en"`, using the example's configured language |
| Browser zoom | Restrictive viewport settings | Those restrictions removed |
| Reference link | `rel="external"` with a new-tab target | `rel="external noopener"` |
| Main headline | “Unlock your potential” | “Export a report” |
| Preserved controls and content | Save, Cancel, reference link | Retained in the source |

Modern browsers often imply `noopener`; this example makes the relationship
explicit. The buttons are static demonstration controls. Checking a real export
journey requires the actual application and its tests.

The demo's reviewer and fixer handle this particular heading task. Its 2/5 → 4/5
rating illustrates fresh assessment after a change. It is not an independent
evaluation of general design or writing quality.

## Install the skill

Choose the command for your coding agent. Installation copies the complete skill,
including its references and bundled helper.

For Codex, use its documented user skill directory:

```sh
node skills/sloppyai/scripts/sloppyai.mjs install --dest "$HOME/.agents/skills"
```

Codex detects local skill changes automatically. Restart it if the skill does not
appear. See [OpenAI's skill documentation](https://learn.chatgpt.com/docs/build-skills).

For Claude Code or Cursor, choose one of:

```sh
node skills/sloppyai/scripts/sloppyai.mjs install --host claude
node skills/sloppyai/scripts/sloppyai.mjs install --host cursor
```

These installers copy files to the selected host's skill location. Tool availability
and skill discovery depend on your host; see [compatibility](../docs/compatibility.md).

## Use it on your own project

Open the project you want to improve in your coding agent and select or mention
sloppyai. You can use this prompt:

```text
Use sloppyai on this project.

Remove AI slop, improve design and writing, and fix bugs
and security issues. Preserve existing features and the
brand choices that serve the product.

Verify findings before repairing them. Recheck after each
improvement. Show before/after ratings, verified fixes,
and remaining issues. Stop after three repair rounds or
if a change introduces a regression.
```

The agent should inspect the project, identify concrete issues, make authorized
changes and verify the relevant behaviour. Tell it which flows and design choices
matter to you, such as checkout, account permissions or a particular visual identity.

### Start with an audit

Use this when you want findings before deciding what to change:

```text
Use sloppyai to audit this project for AI slop, usability
problems, unclear writing, bugs and security issues.
Prioritize the findings and explain the concrete impact.
Do not change files yet.
```

### Focus on security

```text
Use sloppyai to review authorization, data access and
server-side validation in this project. Trace each finding
to the relevant code and available evidence. Fix supported
issues and verify the intended permissions still work.
Keep unverified concerns separate from demonstrated bugs.
```

The coding agent handles broader investigation and repairs with the tools available
to it. The standalone CLI currently applies a few narrow HTML fixes. Its static
checks do not establish complete backend or application security.

## Run checks from the terminal

From the sloppyai checkout, replace the target below with your project's actual path:

```sh
node skills/sloppyai/scripts/sloppyai.mjs audit "/path/to/your-project"
```

The default report directory is `.sloppyai/` inside the selected project, or beside
a selected file. Open `report.html` to read the result. An audit can exit with code
1 when it finds a supported issue; the report is still saved.

For the supported automatic repairs, configure the project's actual document
language, then run a bounded loop. This example uses English:

```sh
node skills/sloppyai/scripts/sloppyai.mjs init "/path/to/your-project" --language en
node skills/sloppyai/scripts/sloppyai.mjs loop "/path/to/your-project" --apply --max-rounds 3
```

If `.sloppyai.json` already exists, edit it instead of running `init` again. Broader
automatic repairs use your chosen coding agent or configured review/fix hooks.

To recheck changed source while you work:

```sh
node skills/sloppyai/scripts/sloppyai.mjs watch "/path/to/your-project" --max-cycles 10 --duration-ms 300000
```

That command watches for up to five minutes or ten changed-input cycles. Add
`--apply` to authorize the supported repairs. To connect actual project tests or
review/fix tools, follow the [hook guide](../docs/hooks.md); their execution also
requires `--allow-exec`.

## Read the result

| Output | What to use it for |
| --- | --- |
| `report.html` or `report.md` | Read findings, suggested actions, coverage and rating changes. |
| `report.json` | Inspect the current machine-readable assessment. |
| `history.json` | Follow earlier issue observations and rating changes. |
| `backups/` | Inspect private backups from built-in repairs; external agent changes remain in your normal diff. |

Automated scores cover implemented checks in the assessed scope. Reviewer scores
are attributed judgments with reasons and evidence. An unassessed domain stays
unassessed. Use the relevant user journey and code checks to decide whether a
particular repair worked. The [ratings guide](../docs/methodology.md) explains this
in more detail.

## If something does not work

| What you see | What to do |
| --- | --- |
| Node is missing or too old | Install Node.js 22.13 or later, then repeat setup. |
| The skill does not appear | Check the destination folder contains the complete skill and restart the host if needed. |
| Installation reports an existing skill | Preserve local changes. The installer refuses to overwrite an existing copy; see [install/remove behaviour](../docs/compatibility.md). |
| The loop fixes only a few HTML issues | Use the skill through your coding agent for broader changes, or configure actual reviewer/fixer hooks. |
| A configured check is marked not run | Inspect the command, then rerun with `--allow-exec` when you authorize it. |
| A score is high but work remains | Read the review prompts and coverage, then verify the remaining user flows or findings. |

[Full command guide](../README.md) · [Hook configuration](../docs/hooks.md) ·
[Contributing](../CONTRIBUTING.md)
