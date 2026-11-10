# About sloppyai

sloppyai helps you remove AI slop, improve design and writing, and fix bugs and
security issues in websites and apps built with AI.

Start with the project you already have. Bring it to your coding agent and ask
for concrete improvements: a page that explains the product, a form people can
finish, clearer writing, or a code change that closes a supported security issue.

[Use sloppyai on your project](blog/how-to-use-sloppyai.md) ·
[Browse the source](https://github.com/JonathanStecher/sloppyai)

## Why it exists

AI makes it easy to produce a first version. That version can still have vague
headlines, awkward navigation, inaccessible controls, broken states, or missing
authorization checks. A polished screenshot can hide an unfinished product.

sloppyai brings attention back to the person using what you built. What are they
trying to do? What makes that harder? Which change would actually help? What
evidence shows that the change worked?

## What you get

| Your project needs | The improvement to aim for |
| --- | --- |
| A clearer interface | People can find the main action and understand what happens next. |
| Better writing | Headlines, labels and explanations describe the actual product. |
| More reliable behaviour | Loading, errors, empty states and recovery support the real task. |
| Security repairs | Supported findings are traced to their cause, repaired and checked against the relevant permissions and data boundaries. |
| Confidence in a change | Findings, verification and remaining gaps stay visible between rounds. |

The coding agent makes the broader changes using the project and available tools.
The included CLI adds static checks, reports, issue history, bounded retries and
a small set of automatic HTML repairs.

## What we mean by AI slop

Here, AI slop means output that has been accepted without enough care for its
purpose: generic claims, unnecessary decoration, repeated text, confusing flows,
invented facts, or code that has not been checked at its important boundaries.

The appearance of a font, gradient, card or sentence does not prove AI authorship.
A dense dashboard may be appropriate. A gradient may support the brand. A status
badge may carry information someone needs. Judge each choice by what it does for
the product and its users.

## Improve the work without losing its purpose

Useful features, navigation, accessibility, actual costs and deliberate brand
choices should survive a cleanup. A simpler page should still let people finish
their task. A security repair should enforce the intended permissions.

Ratings help compare assessed work across rounds. They come with evidence and
coverage: a high static score is a result for those checks, and reviewer ratings
are attributed judgments. See [how ratings work](docs/methodology.md).

## An independent open-source project

sloppyai is MIT licensed. It includes original instructions, code, examples and
a reference catalogue covering design, UX, writing, accessibility, performance,
security, engineering, media and rights.

Workflow inspiration includes [gstack](https://github.com/garrytan/gstack).
sloppyai runs independently and includes its own
[attribution and licence notices](NOTICE.md).

Contributions can add a useful example, improve a guide, fix a bug, or demonstrate
that a noisy check should be changed. Read [the contribution guide](CONTRIBUTING.md)
or [start with the usage article](blog/how-to-use-sloppyai.md).
