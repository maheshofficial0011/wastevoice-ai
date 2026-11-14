# WasteVoice AI — Review 3 Execution Plan
**Prepared:** 14 November 2026  
**Track:** Project Better Tomorrow · C29 Semester 3 · Pathway A  
**Goal:** complete a defensible final 30% review without weakening the working prototype or overstating evidence.

## 1. Audit snapshot
- Public repository: `maheshofficial0011/wastevoice-ai`; default branch `main`.
- Current main HEAD: `646f91d6e516de0166aff051bbd6c3a30c5fdc22` (04 Oct 2026).
- Latest recorded CI: Quality Check #185, success (04 Oct 2026).
- Existing implementation: React/TypeScript/Vite, Supabase Auth/Postgres/Storage/RLS, protected workflow RPCs, Gemini Edge Function, Reporter/Authority/Staff flows.
- Existing quality baseline: 29/29 automated tests, production build passed, 0 ESLint errors (16 non-blocking hook warnings in the Review 2 report), npm audit 0 known vulnerabilities as of 04 Oct.
- No later commit/test execution was visible in the inspected repository at this audit. Treat all test numbers as dated baselines until rerun.

## 2. What to preserve
Do not redesign the application or replace the stack. Preserve existing role contracts, RPC signatures, table/storage contracts, workflow ordering, human approval boundaries, evidence privacy and existing tests. No database migration or production secret change is authorised by this plan. Use additive changes and a feature branch.

## 3. Review 3 workstreams and gates

### Gate A — Freeze and reproduce the baseline
1. Pull the latest main and create a clean working branch.
2. Install from lockfile with `npm ci`.
3. Run `npm test`, `npm run lint`, `npm run build`, `npm audit`.
4. Save command output, date, commit SHA and CI URL.
5. Investigate failures before feature work; do not weaken or delete tests to obtain green status.
**Exit:** all baseline checks pass or every failure is recorded with a fix plan.

### Gate B — Genuine user validation (mandatory)
Use `review-3-validation-kit.md`. Recruit at least three genuine users: preferably people who could plausibly report campus issues, oversee them or carry out assigned work. Re-engaging original participants is allowed by Pathway A. Obtain permission before taking notes/recordings; do not collect passwords, private identifiers or unnecessary personal data. Do not film or publish a participant's face/voice without explicit permission.
- Tester 1: Reporter creates a sample report and finds its status.
- Tester 2: Reporter uses AI Assist, checks/corrects the suggestions and submits.
- Tester 3: Authority/Staff workflow is demonstrated using controlled test accounts and data.
- Observe without coaching first; record completion, confusion, time only if measured, and exact user feedback.
- Ask what was unclear, what they expected next, and what would make them trust the status/evidence.
**Exit:** three dated, anonymised session records; no invented feedback. If fewer than three are completed, mark validation incomplete.

### Gate C — Prioritise and implement feedback
1. Group findings into usability, trust/AI, workflow, accessibility and performance.
2. Rank by frequency, severity and feasibility; cite the tester IDs (T1–T3).
3. Select the highest-value low-risk improvement.
4. Implement additively; preserve APIs, RLS, role guards and workflow states.
5. Add regression tests for the defect/change.
6. Re-run the same tester task or an equivalent retest and record outcome.
**Exit:** traceable chain: observation → finding → decision → code change → test → retest.

### Gate D — Security and AI boundary recheck
- Verify Reporter cannot assign/verify/resolve.
- Verify Staff can access only assigned work/evidence and cannot resolve.
- Verify Authority-only assignment and final verification.
- Confirm private bucket and signed URLs; never add public evidence URLs.
- Test missing, vague and contradictory descriptions; prompt-injection text; oversized input; provider failure; malformed response.
- Confirm AI does not invent unknown fields or mutate operational state.
- Record unresolved Supabase advisor warnings; do not call the app fully secure or production-certified.
**Exit:** dated evidence for each executed check and explicit status for unexecuted checks.

### Gate E — Final package
- Update the Review 3 report with actual tester findings and fresh test evidence.
- Update README status/date and link Review 3 docs.
- Keep the Review 1/2 reports as historical records.
- Prepare final demo/presentation only to the format required by the current portal/institution.
- Test all links and confirm the repository branch/PR is the intended version.
**Exit:** no placeholders, fabricated metrics or stale claims in the submitted report.

## 4. Acceptance checklist
- [ ] Three real tester sessions recorded (or validation explicitly marked incomplete).
- [ ] Consent/privacy respected; notes anonymised.
- [ ] Feedback matrix completed with T1/T2/T3 references.
- [ ] At least one evidence-backed improvement implemented where feedback warrants it.
- [ ] Regression test added for each code fix.
- [ ] Retest result recorded.
- [ ] Fresh test/lint/build/audit output captured.
- [ ] GitHub Actions green on the final commit.
- [ ] AI human-confirmation boundary and role boundaries rechecked.
- [ ] README and report synchronised.
- [ ] Final portal deliverables checked against current instructions.

## 5. Risks and controls
| Risk | Control |
|---|---|
| Invented or leading user feedback | Observe first; quote/paraphrase only what was actually said |
| Test fixture mistaken for impact | Label synthetic/controlled data and separate field evidence |
| AI hallucination | Preserve unknowns, validate schema, require user correction |
| Role/storage regression | Keep negative role tests and private signed evidence |
| Stale CI/test claims | Record date + commit SHA; rerun on final branch |
| Overbuilding before validation | No speculative prediction/image model; validate core workflow first |
| Security advisor warnings | Document and assess; do not claim certification |

## 6. Scope decision
Do not add waste-image detection, accumulation prediction, automated priority ranking, voice features or a new analytics model before Review 3 validation. The project lacks a demonstrated labelled image dataset and sufficient historical operational data for defensible model training/prediction. The highest-value final work is user validation, workflow clarity, reliable evidence handling and traceable iteration.
