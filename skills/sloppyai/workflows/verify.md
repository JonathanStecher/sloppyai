# Verify the actual result

1. Resolve the current source revision, artifact and relevant previous report.
2. Reproduce the original observation on the baseline when available, then check the
   changed artifact against the same meaningful assertion and legitimate controls.
3. Rerun appropriate existing tests. Add a test only if it protects useful behaviour
   and would catch a real regression not already covered. Avoid production seams
   used solely to make a test mirror the implementation.
4. Check preserved behaviour and related paths. Visual-only changes can still affect
   focus, contrast, reading order, navigation, data visibility or rendering cost.
5. Run `verify TARGET --baseline BASELINE_JSON --out REPORT_DIR`. Configured command
   execution additionally requires `--allow-exec`. Inspect the configured commands.
6. Reinspect meaningful visual, runtime and factual concerns. Import a fresh review
   against the new inputDigest; never carry an old score onto changed inputs.
7. Compare compatible ratings, confirmed failures, review prompts, and new issues.
   A disappearing static warning is only 'not observed', not independent runtime closure.

Report exactly what ran and what green establishes. Distinguish local, mocked,
staging, physical-device and production evidence. Missing inputs and unavailable
tools remain gaps. Failed setup cannot certify an artifact. Keep reviewer scores
attributed and separate from automated check scores.
