# Security, data and money

Model actors, assets, entrypoints, trust transitions, sensitive operations and
ownership boundaries. Inspect code and configuration before making assurance claims.
Prioritize real unauthorized access, privileged secret exposure, unsafe execution,
incorrect financial state and unbounded paid resource use.

Check object and tenant authorization, session/recovery lifecycle, trusted prices
and credits, input/output handling, uploads, paths, outbound requests, dependencies,
webhooks, concurrency, logging, retention and recovery. A UUID is not authorization;
CORS or a security header is not a substitute for access control.

Trace attacker control, the crossed boundary, existing mitigations and actual
impact. Source sinks, dependency advisories and secret-shaped strings are candidates
until their context is established. Do not call live services to validate a found
credential. Redact values and recommend revocation when exposure is established.

Use controlled test identities and isolated data for authorized runtime checks.
Never broaden an audit into live purchases, destructive probes, unsanctioned targets,
or production writes without authorization. Project commands and hooks run with
caller permissions and are not a sandbox for hostile repositories.

For LLM/agent features, treat external content as data, enforce capabilities outside
the model and validate consequential operations. Review the skill/tool supply chain.

Use S and relevant E entries. The CLI's few source patterns are not a penetration
test, complete ASVS evaluation or production security certificate. Keep evidence,
confidence, severity and remaining coverage separate.

Sources: https://asvs.owasp.org/ and
https://cheatsheetseries.owasp.org/cheatsheets/Business_Logic_Security_Cheat_Sheet.html.
