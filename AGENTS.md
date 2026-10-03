# AutoFlow Engineering Instructions

This repository is part of AutoFlow, a small-business online presence and automation platform. Follow the cross-repository workflow and safety gates in `docs/ENGINEERING-RULES.md`, `docs/SECURITY-MODEL.md`, `docs/ARCHITECTURE.md`, and `docs/RELEASE-GATES.md`. The canonical product plan is maintained in the dashboard repository at `docs/AUTOFLOW-MAIN-PRODUCT-PLAN.md`.

## Mandatory workflow
For every story: STORY → plan → implementation → automated tests → Code Review → Security review → independent verification → human approval → merge. Keep stage evidence current and never claim unrun checks passed. Independent verification is performed by a non-implementer against current heads and does not make fixes or merge.

## Cross-project gates
- STORY-002 must not start until the current independent verification issue #27 passes.
- Do not merge or deploy without all applicable gates and explicit human approval.
- For cross-repo changes, identify affected contracts and repos, coordinate scoped PRs, and preserve compatibility/rollout order.
- Preserve unrelated and uncommitted work. Stage only files belonging to this task.
- Report changed files, exact checks and results, PR/commit references, and remaining manual steps.

## Repository-specific notes
This is the public marketing website. Keep product, security, pricing, and capability claims accurate and consistent with shipped behavior and the canonical product plan. Do not include customer secrets or authenticated business data. Review links, responsive behavior, accessibility, security headers, and production hosting configuration when relevant.
