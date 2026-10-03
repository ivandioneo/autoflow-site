# AutoFlow Security Model

## Assets and boundaries
AutoFlow handles tenant accounts, business/customer data, booking and lead submissions, automation configurations, integration credentials, authentication sessions, and execution logs. The API is the enforcement boundary for identity, authorization, tenant ownership, validation, persistence, and executor policy. The dashboard and public site are untrusted clients; client-side checks are usability controls, never authorization.

## Security invariants
- Every tenant-owned read/write is authorized server-side against the authenticated tenant. Cross-tenant access must fail closed.
- Administrative enumeration and actions require explicit admin authorization and audit where appropriate.
- Access tokens remain in memory in the dashboard; refresh credentials use the configured secure HttpOnly cookie flow. Never place tokens or secrets in URLs, browser storage, logs, screenshots, or committed files.
- Tenant integration credentials are encrypted at rest where supported, masked in API/UI responses, and decrypted only at the execution boundary that needs them. Preserve legacy compatibility only with explicit tests and a migration plan.
- Validate and constrain outbound requests (including DNS resolution/pinning, redirects, proxies, timeouts, response sizes, and allowed schemes/addresses) to mitigate SSRF and resource abuse. Production egress policy remains an operational control and must be independently evidenced.
- Validate public inputs, rate-limit abuse-sensitive actions, avoid account enumeration, and keep errors from disclosing secrets or internal details.
- Apply security headers and HTTPS configuration at the hosting edge; verify production behavior rather than infer it from source configuration.

## Review checklist
For each relevant change, examine authentication and authorization, tenant isolation, secret lifecycle, injection/SSRF, public abuse, data exposure, dependency/configuration changes, migrations and rollback, logging/audit, and deployment/egress assumptions. Add regression tests for security fixes. Record each finding with severity and direct file/line evidence. A security review is distinct from code review and from independent verification.

## Current release-blocking gate
**STORY-002 must not start until the current independent verification issue #27 passes.** A pass must apply to the current heads under review, include the required evidence, and resolve the listed verification scope; a stale or partial result does not pass. FAIL or NOT VERIFIED keeps STORY-002 blocked. Do not treat remediation, targeted tests, or a security-site score as a substitute for issue #27.
