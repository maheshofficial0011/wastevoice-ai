# WASTEVOICE AI — PROJECT BETTER TOMORROW
## C29 Semester 3 — Review 3 Final Progress & Prototype Validation Report
**Pathway:** A — Continuation Track  
**Report update:** 14 November 2026  
**Repository:** https://github.com/maheshofficial0011/wastevoice-ai  
**Review status:** Technical preparation checks passed; required user validation remains incomplete. No Review 3 score or approval is claimed.

## 1. Executive summary
WasteVoice AI is a student-built, AI-assisted campus waste reporting and resolution-tracking prototype. It addresses the observed gap between noticing unmanaged waste and getting it reported, assigned, cleaned, evidenced and verified. The system supports Reporter, Authority and Staff roles through **Report → AI Assist → Confirm → Review → Assign → Clean → Evidence → Verify → Resolve**.

This continues the earlier Empathize and Define work under Pathway A. The repository's project-status record confirms Review 1 received 32.2/35 (92%). Review 2 remains technically advanced but its external validation gate is still recorded as pending; no Review 2 score is claimed here. Review 3 is the final 30% phase. The current work has completed repository documentation preparation and a fresh automated CI run, but the required genuine user-validation gate has not yet been completed.

## 2. Problem and evidence carried forward
The project continues the campus-park waste problem documented during the earlier field investigation. Carried-forward notes record approximately four accumulation points, waste estimated to have remained for about one week during the observation, approximately 8–10 people passing during the observed period, and stakeholder feedback that removal could take around 2–3 weeks. These are bounded observations/estimates and stakeholder statements—not campus-wide statistics, an official service-level agreement, or proof of causation.

**Refined problem:** Campus waste issues are easy to notice but can be difficult to report, assign, track and verify through a clear, accountable workflow.

## 3. Solution and implemented prototype
- **Reporter:** signs in, enters location and description, uploads before evidence, uses AI Assist, reviews/corrects suggestions, submits and tracks a report.
- **Authority:** reviews reports and evidence, assigns Staff, monitors progress, reviews after evidence and makes the final verification/correction decision.
- **Staff:** views assigned work, updates cleaning progress and uploads after-cleaning evidence.
- **Human control:** AI does not assign staff, change cleaning status, approve evidence or resolve reports. The reporter confirms AI suggestions; the Authority makes the final decision.

## 4. Technical architecture and AI
**Stack:** React 19, TypeScript, Vite, Tailwind, React Router; Supabase Auth, PostgreSQL, Storage, RLS, protected RPCs and Edge Function; GitHub Actions, ESLint, TypeScript/Vite build and Node tests.

**AI path:** Reporter text → authenticated `structure-report` Edge Function → Gemini (`gemini-3.5-flash-lite`) → structured response → server-side validation/safe fallback → reporter review and correction. The provider key is configured as a server-side secret, not a frontend value. The model extracts/structures language; it is not a trained waste detector or predictor. Unknown facts stay unknown; output is advisory.

## 5. Security, reliability and quality evidence
Recorded controls include private signed-URL evidence, role-aware routes, protected RPCs, negative role probes, input/image validation, Error Boundary and a fix/retest for Staff access to assigned before-evidence.

**Historical baseline (04 October 2026, main commit `646f91d`):**
- `npm test`: 29/29 passed (11 AI safety, 8 form validation, 10 workflow/regression tests).
- `npm run build`: passed.
- `npm run lint`: 0 errors; historical report notes 16 non-blocking React Hook dependency warnings.
- `npm audit`: 0 known package vulnerabilities at that audit.
- GitHub Actions Quality Check run #185: success.

**Fresh Review 3 preparation CI (14 November 2026):**
- Branch: `review-3-upgrade-2026-11-14`
- Commit tested: `375f675e17432dd100e6706e9a6340adf93d2d97`
- GitHub Actions Quality Check run #188: **success**.
- The job completed dependency installation, lint, automated tests, and TypeScript/production build successfully.
- Run: https://github.com/maheshofficial0011/wastevoice-ai/actions/runs/43606829217

CI verifies the listed commit, but is not a standalone `npm audit`, live Supabase review, live AI adversarial test or user validation. The repository still documents Supabase advisor items: SECURITY DEFINER helper-function exposure warnings and leaked-password protection disabled. No claim of complete security certification is made.

## 6. Prototype testing and Review 3 user validation
Existing internal evidence covers the Reporter → Authority → Staff → evidence → verification workflow, Gemini response, role/security probes, Error Boundary and selected accessibility/usability checks. The before/after fixture reused one test image; it proves workflow only, not real cleaning.

**Mandatory validation requirement:** collect feedback from at least three genuine new testers or re-engage original users, as permitted by Pathway A. A protocol and anonymised feedback template have been added, but no new tester sessions or feedback are claimed. The sessions must be run by the student with real participants, permission and controlled test accounts. Until then, the prototype has not passed the Review 3 user-validation gate.

## 7. Review 3 work completed in this update
1. Added an execution plan, risk controls and acceptance gates.
2. Added a three-tester protocol and anonymised feedback/change ledger.
3. Added an evidence index that marks missing artifacts pending.
4. Updated README and opened PR #4, preserving `main`.
5. Quality Check #188 passed lint, automated tests and production build on the PR head.

These are documentation/CI-readiness changes only. No app feature code, schema, API contract, deployment or workflow behavior changed; no speculative AI feature was added.

## 8. Remaining actions before Review 3 can be called complete
1. Run at least three genuine tester sessions; obtain permission and anonymise notes.
2. Record actual task outcomes and feedback; invent no quotes, timings or success rates.
3. Complete the feedback ledger and choose an evidence-backed improvement.
4. Implement it additively, add a regression test and retest.
5. Run/document live role, storage and AI edge-case checks; record Supabase advisor warnings.
6. Run `npm audit` separately; CI #188 did not include it.
7. Add real session/code/retest evidence to the index and report.
8. Prepare the required demo and submit through the portal.

## 9. Integrity declaration
Field observations and stakeholder statements are carried forward with their limitations. Controlled software tests are not represented as real-world impact. No new tester feedback, deployment, standalone audit result, environmental benefit or Review 3 score is invented. AI supported ideation and development, but field evidence, implementation decisions and final conclusions remain the student's responsibility.

**Current conclusion:** WasteVoice AI has a substantial working prototype, a documented Review 2 baseline and a fresh successful automated CI run for the Review 3 preparation commit. The remaining decisive work is genuine user validation, evidence-led iteration and retesting. Therefore, this is an updated final-phase progress report, not a claim that every Review 3 submission gate is complete.
