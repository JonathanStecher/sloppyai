# Plan an improvement

Use this mode when the user requests a plan or has not authorized changes.

1. Identify the artifact, intended audience, success condition, existing constraints
   and actual available evidence. Read relevant project instructions first.
   For visual work, record the [preferred direction and change scope](../references/design-decisions.md#scope-the-next-visual-change)
   before choosing a refinement, redesign or restoration. Name the requested
   changes and what should survive; keep unknown preferences unknown.
2. Capture the current state. Use source, the actual rendered artifact or supplied
   evidence as appropriate; clearly mark inaccessible states.
3. Identify requirements and preservation constraints before aesthetics. Do not
   invent product capabilities, controls, customers, metrics or policies.
4. Select relevant domain references. Use `catalog --domain NAME` for detail and
   `plan TARGET --json --no-save` for actionable findings and verification.
   Include [visual quality](../references/visual-quality.md) for taste, colour,
   typography and overall looks. Name the accepted or inferred direction and
   the rendered evidence needed, even when source checks find no problems.
5. Name each supported issue, its location, user/system impact and smallest useful
   repair. Label contextual suggestions and hypotheses separately.
6. Compare a materially different approach when introducing an important new module
   or responsibility. Reuse a suitable established path before adding another.
7. Order work by harm and dependency. Specify states, failure recovery, verification,
   relevant regression coverage and any real unresolved decisions.

Output a concrete plan with accepted constraints and a way to assess each change.
No automatic fixes, installations, hooks, external publication or deployment in plan mode.
