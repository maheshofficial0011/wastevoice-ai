# WASTEVOICE AI — PROJECT BETTER TOMORROW
## C29 Semester 3 — Review 3 Final Progress & Prototype Validation Report
**Pathway:** A — Continuation Track  
**Report update:** 14 November 2026  
**Repository:** https://github.com/maheshofficial0011/wastevoice-ai  
**Review status:** Technical preparation checks passed; required user validation remains incomplete. No Review 3 score or approval is claimed.

## 1. Executive summary
WasteVoice AI is a student-built, AI-assisted campus waste reporting and resolution-tracking prototype. It addresses the observed gap between noticing unmanaged waste and getting it reported, assigned, cleaned, evidenced and verified. The system supports Reporter, Authority and Staff roles through **Report → AI Assist → Confirm → Review → Assign → Clean → Evidence → Verify → Resolve**.

This continues the earlier Empathize and Define work under Pathway A. Review 1 and Review 2 each received 92% from QBee. Review 3 is the final 30% phase. The current work has completed repository documentation preparation and a fresh automated CI run, but the required genuine user-validation gate has not yet been completed.

## 2. Problem and evidence carried forward
The project continues the campus-park waste problem documented during the earlier field investigation. Carried-forward notes record approximately four accumulation points, waste estimated to have remained for about one week during the observation, approximately 8–10 people passing during the observed period, and stakeholder feedback that removal could take around 2–3 weeks. These are bounded observations/estimates and stakeholder statements—not campus-wide statistics, an official service-level agreement, or proof of causation.

**Refined problem:** Campus waste issues are easy to notice but can be difficult to report, assign, track and verify through a clear, accountable workflow.

## 3. Solution and implemented prototype
- **Reporter:** signs in, enters location and description, uploads before evidence, uses AI Assist, reviews/corrects suggestions, submits and tracks a report.
- **Authority:** reviews reports and evidence, assigns Staff, monitors progress, reviews after evidence and makes the final verification/correction decision.
- **Staff:** views assigned work, updates cleaning progress and uploads after-cleaning evidence.
- **Human control:** AI does not assign staff, change cleaning status, approve evidence or resolve reports. The reporter confirms AI suggestions; the Authority makes the final decision.

## 4. Technical architecture and AI
Frontend: React 19, TypeScript, Vite, Tailwind CSS and React Router. Platform: Supabase Auth, PostgreSQL, Storage, Row-Level Security (RLS), protected workflow RPCs and a Supabase Edge Function. CI/quality: GitHub Actions, ESLint, TypeScript/Vite build and Node test runner.

**AI path:** Reporter text → authenticated `structure-report` Edge Function → Gemini (`gemini-3.5-flash-lite`) → structured response → server-side validation/safe fallback → reporter review and correction. The provider key is configured as a server-side secret, not a frontend value. The model performs language-based extraction/structuring; it is not a custom-trained waste detector or a prediction model. Missing facts must remain unknown. AI output is advisory.

## 5. Security, reliability and quality evidence
The repository records private evidence storage with signed URL access, protected role-aware routes, protected workflow RPCs, role-negative database probes, input/image validation, an application Error Boundary, and a fix/retest for Staff access to assigned before-evidence.

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

This CI result verifies the code at the listed documentation-preparation commit. It does not constitute a fresh standalone `npm audit`, live Supabase security review, live AI adversarial test, or real-user validation. The repository still documents Supabase advisor items: SECURITY DEFINER helper-function exposure warnings and leaked-password protection disabled. No claim of complete security certification is made.

## 6. Prototype testing and Review 3 user validation
The repository contains controlled internal end-to-end test records for Reporter → Authority → Staff → evidence → verification, live Gemini response checks, role/security probes, Error Boundary recovery and selected accessibility/usability checks. The before/after image fixture was the same controlled test image; it demonstrates evidence workflow only, not actual cleaning.

**Mandatory validation requirement:** collect feedback from at least three genuine new testers or re-engage original users, as permitted by Pathway A. A protocol and anonymised feedback template have been added, but no new tester sessions or feedback are claimed. The sessions must be run by the student with real participants, permission and controlled test accounts. Until then, the prototype has not passed the Review 3 user-validation gate.

## 7. Review 3 work completed in this update
1. Added a Review 3 execution plan with acceptance gates, risk controls and scope boundaries.
2. Added a repeatable three-tester protocol and anonymised feedback/change ledger.
3. Added an evidence index that marks missing artifacts as pending rather than implying completion.
4. Updated the README with the Review 3 status and document links.
5. Opened PR #4 to preserve the existing `main` branch pending review.
6. Ran fresh GitHub Actions Quality Check #188 on the PR head; lint, automated tests and production build passed.

These changes are repository documentation and CI/readiness improvements. No application feature code, database schema, API contract, deployment or workflow behavior was changed in this Review 3 preparation. No speculative AI feature was added without user evidence.

## 8. Remaining actions before Review 3 can be called complete
1. Conduct at least three genuine tester sessions using the validation kit; obtain permission and anonymise notes.
2. Record what each tester completed, where they hesitated, and their actual feedback. Do not invent quotes, timings or success rates.
3. Complete the feedback ledger and select a proportionate improvement supported by observed findings.
4. Implement the selected change additively, add a regression test, and retest the same task.
5. Execute and document the live role/storage and AI edge-case checks in the plan; record unresolved Supabase advisor findings.
6. Run a fresh `npm audit` separately and save its output; CI #188 did not run this command.
7. Update the evidence index and report with the real session artifacts, code commit and retest result.
8. Prepare the institution-required presentation/demo and submit through the prescribed portal.

## 9. Integrity declaration
Field observations and stakeholder statements are carried forward with their limitations. Controlled software tests are not represented as real-world impact. No new tester feedback, deployment, standalone audit result, environmental benefit or Review 3 score is invented. AI supported ideation and development, but field evidence, implementation decisions and final conclusions remain the student's responsibility.

**Current conclusion:** WasteVoice AI has a substantial working prototype, a documented Review 2 baseline and a fresh successful automated CI run for the Review 3 preparation commit. The remaining decisive work is genuine user validation, evidence-led iteration and retesting. Therefore, this is an updated final-phase progress report, not a claim that every Review 3 submission gate is complete.
