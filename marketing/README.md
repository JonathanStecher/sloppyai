# sloppyai: product and website copy

Ready-to-use product copy for the repository, an About section, or a future website.
For announcements and shorter variants, see [launch copy](launch-copy.md).

## Product description

Remove AI slop, improve design and writing, and fix bugs and security issues in
websites and apps built with AI.

## Landing-page hero

### Remove the slop from your AI project

Make your interface easier to use, replace vague writing with clear copy, and
repair bugs and security issues. Start with what you have and keep the useful
features that make it yours.

**Primary action:** [Use sloppyai on your project](../blog/how-to-use-sloppyai.md)

**Secondary action:** [See the worked example](../blog/how-to-use-sloppyai.md#try-the-example)

## Benefits

### Give people a clearer path

Make the main action easy to find. Repair confusing forms, unclear states and
navigation that makes people work too hard to finish a task.

### Say what your product actually does

Replace empty promises and repeated explanations with specific headlines,
helpful labels and writing that answers the reader's next question.

### Fix the problems behind the page

Use your coding agent to investigate bugs and security findings in the relevant
code. Verify the behaviour after a repair, including the features people already use.

### See what improved

Keep findings, rating changes, checks and remaining issues together. Each round
should leave you with a concrete change you can understand and review.

## Who it is for

- Builders improving a first version made with AI.
- Developers reviewing generated code before relying on it.
- Designers and writers refining an existing interface or page.
- Teams making their AI-assisted review process easier to repeat.

## How to start

Install the skill, open your project in your coding agent, and ask it to use
sloppyai. Begin with an audit or authorize improvements while preserving existing
features. The [usage guide](../blog/how-to-use-sloppyai.md) includes commands,
copyable prompts and a demonstration you can run.

## Frequently asked questions

### Does it work on an existing project?

Yes. Existing source, interfaces, writing and other artifacts are the starting
point. Choose the area you want to improve and state what should be preserved.

### Which coding agents can use it?

It is a portable Agent Skill, with local installers for Codex, Claude Code and
Cursor. Other agents can follow its SKILL.md and supporting resources. The work
available in a session depends on the host's tools and permissions.

### What handles the design and security changes?

Your coding agent handles the broader investigation and repairs. The CLI performs
implemented static checks and a few narrow HTML repairs, and can connect to your
chosen reviewer, fixer and project checks. Read [coverage](../docs/compatibility.md)
for the current boundaries.

### What does a rating tell me?

An automated rating describes implemented checks in the assessed scope. Reviewer
ratings describe an attributed assessment with reasons and evidence. Remaining
issues and unassessed areas stay visible alongside the numbers.

### What does it cost?

sloppyai is MIT-licensed open-source software. Your coding agent and any external
services you choose retain their own usage costs. The built-in helper makes no
AI API calls or network requests.

## Product facts for reuse

- **Name:** sloppyai, written in lowercase.
- **Source:** [JonathanStecher/sloppyai](https://github.com/JonathanStecher/sloppyai).
- **Getting started:** [how to use sloppyai](../blog/how-to-use-sloppyai.md).
- **Background:** [About sloppyai](../ABOUT.md).
- **Demonstration:** the repository's authored landing-page fixture.
- **Reference material:** catalogue entries include requirements, contextual
  heuristics, optional techniques and definitions; coverage varies by entry.
- **Evidence:** distinguish a static observation, a reviewer judgment and an
  observed runtime result when describing a repair.
