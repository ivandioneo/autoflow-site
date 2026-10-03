# AutoFlow Engineering Rules

## Product and scope
AutoFlow helps small businesses get online, receive customer activity, and automate what happens next. Keep work aligned with the canonical product direction in `autoflow-dashboard/docs/AUTOFLOW-MAIN-PRODUCT-PLAN.md`. Do not turn the product into a generic site builder or automation toolkit detached from the business journey.

## Required delivery sequence
Every change follows this order:

1. **STORY** — define customer/problem, outcome, acceptance criteria, scope, and risks.
2. **Plan** — identify affected repos, data/API/UI changes, rollout, security/privacy considerations, and verification.
3. **Implementation** — make the smallest coherent change; update docs and migration/compatibility notes as needed.
4. **Automated tests** — add/update tests and run relevant suites; record exact commands and results. Do not claim unrun checks passed.
5. **Code Review** — review the complete diff for correctness, maintainability, regressions, and scope.
6. **Security review** — review trust boundaries, authz/tenant isolation, secrets, input/output handling, abuse controls, and deployment assumptions.
7. **Independent verification** — a worker who did not implement the change verifies the current commit/PR heads and reports PASS, FAIL, or NOT VERIFIED with severity and file/line evidence. It does not implement fixes or merge.
8. **Human approval** — an authorized human reviews the evidence and explicitly approves the merge.
9. **Merge** — merge only after every applicable gate passes and human approval is recorded.

A later stage cannot be used to imply an earlier stage passed. On FAIL or NOT VERIFIED, fix or gather evidence, then repeat the relevant review and independent verification.

## Cross-repository work
- Repositories: `autoflow-api` (backend), `autoflow-dashboard` (authenticated customer app), and `autoflow-site` (public marketing site).
- Identify all affected repositories in the STORY plan. Keep each PR scoped and link related PRs/issues.
- Preserve existing uncommitted work. Never stage unrelated files.
- Do not merge, deploy, or start follow-on stories without explicit authorization and satisfied gates.
- Report exact changed files, checks run (and not run), commit/PR references, and outstanding manual steps.

## Quality
- Prefer focused changes with regression coverage.
- Keep user-facing claims consistent with actual shipped behavior.
- Keep secrets out of source, logs, fixtures, and examples; use placeholders in documentation.
- Document operational requirements that code cannot enforce, including egress/firewall and production configuration.
