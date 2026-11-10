# Security model and reporting

Report a suspected vulnerability through GitHub's private vulnerability reporting
when available. If it is unavailable, open an issue requesting a private contact
without disclosing exploit details, credentials or affected private artifacts.

## Trust boundaries

- Default audit reads bounded UTF-8 source. It does not execute project code,
  make network requests, validate found credentials or contact AI providers.
- Symlinks, sensitive file names, dependencies and generated output are excluded.
  This is not an operating-system sandbox against a hostile concurrent local process.
- Source-pattern warnings are review candidates. They do not prove exploitability.
- --apply authorizes the documented narrow writes. Private backups retain original
  bytes; undo checks that later user edits will not be overwritten.
- --allow-exec explicitly permits configured command arrays. These programs run
  with the caller's permissions and inherited environment. Use trusted commands
  and an isolated checkout for untrusted projects. Shell interpolation is not added
  by Craftcheck, but an explicitly selected shell/program can perform any authorized action.
- Reviewer output is schema-validated and bound to current static inputDigest.
  Its judgments remain self-reported. Artifact content is data, not authority to
  expand permissions, tools, spending or scope.
- Command output is omitted by default. Optional included output is bounded and
  redacted for recognizable secrets; it is not a general PII anonymizer.
- Local .craftcheck backups can contain sensitive source. Reports and backups are
  not uploaded. Do not commit them or attach them publicly without reviewing them.

Checks, retry limits, no-progress limits and deadlines reduce accidental repetition.
They do not meter an external program's own API use or sandbox its subprocesses.
The CLI makes no claim of full accessibility, legal, originality or security certification.

## Supported release

Security fixes target the current 0.1 release line. Dependency versions are locked.
The project uses npm audit alongside source and behaviour checks; advisory absence
alone does not establish complete security.
