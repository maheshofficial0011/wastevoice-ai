# WASTEVOICE AI — PROJECT BETTER TOMORROW
## C29 Semester 3 — Review 3 Final Progress & Prototype Validation Report

**Pathway:** A — Continuation Track  
**Report date:** 14 November 2026  
**Repository:** https://github.com/maheshofficial0011/wastevoice-ai  
**Review weighting:** 30% (as labelled by the Project Better Tomorrow portal)  
**Status:** Technical/documentation work and current CI are complete; genuine tester validation and field evidence remain outstanding. No score or full-marks outcome is claimed.

## 1. Executive summary

WasteVoice AI is a student-built, AI-assisted campus waste reporting and resolution-tracking prototype. It addresses the gap between noticing unmanaged waste and getting it reported, assigned, cleaned, evidenced and verified. The system supports Reporter, Authority and Staff roles through **Report → AI Assist → Confirm → Review → Assign → Clean → Evidence → Verify → Resolve**.

The submitted QBee records show **Review 1: 92%** and **Review 2: 92%**. Review 3 is the final 30% review in the portal. This report consolidates the two previous review outcomes, the feedback repeated by QBee, the improvements recorded in Review 2, and the latest repository/CI evidence.

## 2. Problem and evidence carried forward

The project continues the campus-park waste problem documented during the earlier field investigation. Carried-forward notes record approximately four accumulation points, waste estimated to have remained for about one week during the observation, approximately 8–10 people passing during the observed period, and stakeholder feedback that removal could take around 2–3 weeks. These are bounded observations/estimates and stakeholder statements—not campus-wide statistics, an official service-level agreement, or proof of causation.

**Refined problem:** Campus waste issues are easy to notice but can be difficult to report, assign, track and verify through a clear, accountable workflow.

## 3. Previous review outcomes and QBee feedback

| Review | Portal result | Weight shown by portal |
|---|---:|---:|
| Review 1 | **92%** | 35% |
| Review 2 | **92%** | 35% |
| Review 3 | Pending | 30% |

QBee repeated these improvement requests in the Review 1 and Review 2 feedback:

1. Provide more granular technical documentation on unit testing and Error Boundaries.
2. Expand code comments.
3. Document API endpoints and database schema in the README for subsequent reviews.

The Review 2 submission explicitly reported these items as addressed. The repository now contains detailed test documentation, a dedicated Error Boundary runtime test record, an API/workflow operation summary and a database contract document. The Review 2 report and project-status record also document expanded implementation comments. The feedback-to-evidence mapping is recorded in `docs/review-feedback-closure.md`.

**Score versus validation:** the Review 2 score of 92% is the submitted QBee result. The repository's older status ledger separately noted that three external tester sessions had not been retained. A score does not replace missing validation artifacts; Review 3 therefore still requires genuine user sessions and feedback-led retesting.

## 4. Solution and implemented prototype

- **Reporter:** signs in, enters location and description, uploads before evidence, uses AI Assist, reviews/corrects suggestions, submits and tracks a report.
- **Authority:** reviews reports and evidence, assigns Staff, monitors progress, reviews after-cleaning evidence and makes the final verification/correction decision.
- **Staff:** views assigned work, updates cleaning progress and uploads after-cleaning evidence.
- **Human control:** AI does not assign Staff, change cleaning status, approve evidence or resolve reports. The reporter confirms suggestions; the Authority makes the final decision.

## 5. Technical architecture and AI

**Stack:** React 19, TypeScript, Vite, Tailwind, React Router; Supabase Auth, PostgreSQL, Storage, RLS, protected RPCs and Edge Function; GitHub Actions, ESLint, TypeScript/Vite build and Node tests.

**AI path:** Reporter text → authenticated `structure-report` Edge Function → Gemini (`gemini-3.5-flash-lite`) → structured response → server-side validation/safe fallback → reporter review and correction. The provider key is server-side. The model performs natural-language extraction/structuring; it is not a custom-trained waste detector or predictor. Unknown facts remain unknown; output is advisory.

## 6. Security, testing and quality evidence

Recorded controls include private signed-URL evidence, role-aware routes, protected workflow RPCs, role-negative probes, input/image validation, an application Error Boundary and a fix/retest for Staff access to assigned before-evidence.

**Historical Review 2 baseline (04 October 2026):**
- `npm test`: 29/29 passed (11 AI safety, 8 form validation, 10 workflow/regression tests).
- `npm run build`: passed.
- `npm run lint`: 0 errors; the Review 2 report recorded 16 non-blocking React Hook dependency warnings.
- `npm audit`: 0 known package vulnerabilities at that audit.
- Historical GitHub Actions Quality Check: successful.

**Latest Review 3 branch CI:**
- Branch: `review-3-upgrade-2026-11-14`
- Commit: `6ad0b082e571eefc97897f062a2a6c5b2b927224`
- GitHub Actions Quality Check **#192: success** (14 November 2026).
- CI completed dependency installation, lint, the automated test suite and TypeScript/production build.
- Run: https://github.com/maheshofficial0011/wastevoice-ai/actions/runs/43607183155

The current CI workflow does not yet run a standalone dependency audit. The historical zero-vulnerability result is dated and is not presented as a current audit. Supabase advisor warnings for SECURITY DEFINER helper-function exposure and disabled leaked-password protection remain documented; no complete security certification is claimed.

## 7. Review 3 validation and iteration

Existing internal evidence covers Reporter → Authority → Staff → evidence → verification, live Gemini response, role/security probes, Error Boundary recovery and selected accessibility/usability checks. The before/after fixture reused the same controlled test image; it demonstrates evidence workflow only, not real cleaning.

**Required Review 3 gate:** collect feedback from at least three genuine new testers or re-engage original users, as permitted by Pathway A. The repository includes a consent-aware protocol, anonymised session template and feedback-to-change ledger. No new tester sessions or feedback are claimed in this report. After sessions, select a real friction point, implement a proportionate change, add a regression test and retest the same task.

## 8. Work completed for this Review 3 update

1. Audited the two submitted review reports and corrected the Review 2 score discrepancy in project documentation.
2. Mapped QBee's repeated feedback to the existing testing, Error Boundary, API and database documentation.
3. Added/maintained a Review 3 execution plan, three-tester protocol and evidence index.
4. Verified the current PR head and confirmed Quality Check #192 succeeded.
5. Preserved the existing application architecture, role contracts, database schema, workflow and human-approval boundaries.

No new application feature or schema migration is claimed in this update. User-facing product changes must be driven by genuine tester findings rather than invented feedback.

## 9. Remaining evidence required before final submission

1. Complete at least three genuine tester sessions with permission and anonymised notes.
2. Record actual task completion, observed confusion, AI corrections and user comments; do not invent quotes or timings.
3. Complete the feedback ledger and explain each adopt/reject/defer decision.
4. Implement an evidence-backed improvement, add regression coverage and record retest results.
5. Recheck live role, storage and AI edge cases; record unresolved Supabase advisor warnings.
6. Run a current standalone `npm audit` and record the result.
7. Update the evidence index with actual session, code, test and retest artifacts.
8. Prepare and submit the required final presentation/demo in the format requested by the current portal.

## 10. Integrity declaration

Field observations and stakeholder statements are carried forward with their limitations. Controlled software tests are not represented as real-world impact. Review 1 and Review 2 scores are stated as the QBee outcomes in the submitted records. No new tester feedback, environmental benefit, current audit result or Review 3 score is invented. AI supported ideation and development, but field evidence, implementation decisions and final conclusions remain the student's responsibility.

**Current conclusion:** WasteVoice AI has a substantial working prototype, two previous QBee review outcomes of 92%, documented responses to the repeated technical-documentation feedback, and a successful latest CI run. Review 3 is not honestly complete until the genuine tester validation, feedback-led improvement/retest and remaining evidence checks are performed.
