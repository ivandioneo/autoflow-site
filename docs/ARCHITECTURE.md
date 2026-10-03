# AutoFlow Architecture

## Product shape
AutoFlow combines a small-business public presence, customer interactions, and automation in one platform. The intended journey is: business setup → generated/customized page → publish → booking/lead interaction → automation → observable result.

## Repositories and responsibilities
- **autoflow-site** — public marketing and acquisition experience. It does not own authenticated business data or enforce platform authorization.
- **autoflow-dashboard** — authenticated React application for onboarding, business/page configuration, bookings/leads, automation configuration, integrations, run history, and settings. It calls the API and treats API authorization as authoritative.
- **autoflow-api** — FastAPI backend and security boundary: authentication, tenant authorization, business/page and booking data, automation execution, integration executors, persistence, audit, and logging.
- **PostgreSQL** — persistence for tenant-owned and platform data.
- **Transactional email provider** — account and business notifications, subject to current implementation and product behavior.

## Request and execution flow
Dashboard or public page → API validation/authentication → tenant ownership checks → persistence or automation engine → constrained executor/integration → persisted run result/log. Public submissions enter through explicitly public endpoints with abuse controls; they do not gain tenant privileges. Credentials are stored encrypted and revealed only to authorized execution paths.

## Change coordination
Cross-repo contracts (routes, schemas, auth/session behavior, public copy, deployment settings) must be identified in the STORY plan. Update consumers and producers together where needed, and document rollout/compatibility order. Keep architecture claims tied to code that exists; planned capabilities in the canonical product plan are not assertions that they are shipped.
