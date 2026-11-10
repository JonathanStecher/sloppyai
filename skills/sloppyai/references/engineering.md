# Engineering, tests and developer experience

Trace ownership and contracts. Compare useful module boundaries, dependency flow,
error behaviour, external-data validation and consistency across callers. Reuse a
suitable existing path before adding a second one or an option-heavy abstraction.
Similar names do not prove equivalent behaviour.

When a change introduces a meaningful new boundary, sketch a structurally different
alternative and explain the selected responsibility split. Look for split state
ownership, pass-through layers, importable internals and hand-maintained duplicate
lists. Preserve legitimate differences across callers.

For each test explain the behaviour protected, the regression that makes it fail,
why existing coverage is insufficient and what a passing result leaves unproven.
Prefer real boundaries and established fixtures. Avoid tests that merely echo the
implementation or add production hooks with no real caller.

Observe the actual command, exit, timeout and failed attempts. A target-controlled
test process can report its own success; do not call that independent proof. Mocked
providers do not establish provider acceptance, and local checks do not prove deployment.

Documentation, examples, installation, errors and removal are part of quality.
Errors need a stable code, useful context, safe recovery and redaction. Keep the
first documented run usable and preserve user changes during upgrades or uninstall.

Use E and K entries. Workflow inspiration:
https://github.com/garrytan/gstack; original sloppyai implementation and wording.
