# AutoFlow Release Gates

## Required workflow
`STORY → plan → implementation → automated tests → Code Review → Security review → independent verification → human approval → merge`

Record evidence at each stage. Do not mark an unrun check as passed. Independent verification must be performed by someone/worker other than the implementer, against current heads, and return PASS / FAIL / NOT VERIFIED with severity and direct file/line evidence. It does not make changes or merge.

## Gate criteria
- **Story and plan:** acceptance criteria are testable; affected repositories, data/API/UI contracts, risks, migration/rollout, and verification are identified.
- **Implementation:** changes meet acceptance criteria; docs, tests, and compatibility notes are updated; unrelated work is excluded.
- **Automated tests:** relevant automated suites pass, including regression coverage. If environment constraints prevent a suite, mark NOT VERIFIED and name the exact missing check.
- **Code review:** current diff reviewed for correctness, regressions, maintainability, and scope; findings resolved or explicitly dispositioned.
- **Security review:** applicable security checklist completed; findings resolved or explicitly dispositioned; operational assumptions have evidence.
- **Independent verification:** current PR heads reviewed independently; PASS required for release. FAIL and NOT VERIFIED block.
- **Human approval:** explicit approval from an authorized human after reviewing current evidence.
- **Merge:** only after all applicable gates pass and human approval. Do not merge on behalf of a human unless explicitly instructed.

## Current hard gate
**Do not start STORY-002 until independent verification issue #27 passes.** The pass must cover the current API/dashboard/security PR heads and verification scope recorded on #27. Remediation or passing targeted tests alone does not satisfy this gate. Any new finding or changed head requires re-verification as applicable. Until then, STORY-002 is BLOCKED and security PRs remain unmerged.

## Release record
For each release, record story/PRs and exact heads, test commands/results, code and security review status, independent verifier and verdict, human approval, deployment/rollback steps, and unresolved risks/manual actions.
