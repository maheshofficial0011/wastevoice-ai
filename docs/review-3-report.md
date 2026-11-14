# WASTEVOICE AI — PROJECT BETTER TOMORROW
## C29 Semester 3 — Review 3 Final Progress & Prototype Validation Report
**Pathway:** A — Continuation Track  
**Audit/report date:** 14 November 2026  
**Repository:** https://github.com/maheshofficial0011/wastevoice-ai  
**Review status:** Review 3 pending; this report does not claim a score or approval.

## 1. Executive summary
WasteVoice AI is a student-built, AI-assisted campus waste reporting and resolution-tracking prototype. It addresses the observed gap between noticing unmanaged waste and getting it reported, assigned, cleaned, evidenced and verified. The system supports Reporter, Authority and Staff roles through **Report → AI Assist → Confirm → Review → Assign → Clean → Evidence → Verify → Resolve**.

This is the continuation of the earlier Empathize and Define work under Pathway A. Review 1 and Review 2 each received 92% from QBee. Review 3 is the final 30% phase and remains pending.

## 2. Problem and evidence carried forward
The project continues the campus-park waste problem documented during the earlier field investigation. The carried-forward notes record approximately four accumulation points, waste estimated to have remained for about one week during the observation, approximately 8–10 people passing during the observed period, and stakeholder feedback that removal could take around 2–3 weeks. These are bounded observations/estimates and stakeholder statements—not campus-wide statistics, an official service-level agreement, or proof of causation.

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

The latest recorded automated baseline (04 October 2026) is:
- `npm test`: 29/29 passed (11 AI safety, 8 form validation, 10 workflow/regression tests).
- `npm run build`: passed; TypeScript and Vite production build.
- `npm run lint`: 0 errors; historical report notes 16 non-blocking React Hook dependency warnings.
- `npm audit`: 0 known package vulnerabilities at that audit.
- GitHub Actions Quality Check run #185: success on commit `646f91d`.

These are dated results, not a fresh execution on 14 November. A new run is required after the Review 3 changes. The repository also documents remaining Supabase advisor items: SECURITY DEFINER helper-function exposure warnings and leaked-password protection disabled. No claim of complete security certification is made.

## 6. Prototype testing and validation status
The repository contains controlled internal end-to-end test records for Reporter → Authority → Staff → evidence → verification, live Gemini response checks, role/security probes, Error Boundary recovery and selected accessibility/usability checks. The before/after image fixture was the same controlled test image; it demonstrates evidence workflow only, not actual cleaning.

**Required Review 3 validation gate:** collect feedback from at least three genuine new testers or re-engage original users, as permitted by Pathway A. The repository currently contains a validation kit/template, but no new tester sessions or feedback are claimed in this report. Complete those sessions, record anonymised observations, prioritise a real friction point, implement a proportionate change, and retest it before treating validation as complete.

## 7. Iteration and improvements in this Review 3 preparation
The repository audit identified that the last main-branch commit and CI run are dated 04 October 2026, while the current report date is 14 November 2026. Review 3 preparation therefore adds:
1. A dated Review 3 plan, acceptance gates and risk register.
2. A repeatable three-person validation protocol and anonymised feedback template.
3. A final report that separates implemented capability, dated test evidence, pending user validation and external submission work.
4. A dedicated evidence index to prevent planned evidence being mistaken for completed evidence.
5. A branch-based update so the existing `main` branch is preserved pending review.

## 8. Outcomes, limitations and next steps
Expected outcome is improved report completeness, clearer ownership/status visibility and more accountable evidence-based closure. These outcomes must be measured during real user testing; no reduction in waste, faster cleanup, adoption rate or AI accuracy percentage is claimed.

**Remaining actions before final submission:**
1. Run the three genuine tester sessions and retain consented, anonymised notes.
2. Record baseline task completion, time/friction points and user-reported clarity; label sample size and method.
3. Make one or more changes based on observed feedback and retain before/after evidence.
4. Re-run `npm ci`, `npm test`, `npm run lint`, `npm run build` and `npm audit`; capture the new GitHub Actions run.
5. Recheck live AI, role boundaries and permitted evidence access; record any unresolved Supabase advisor warnings.
6. Prepare the required final presentation/demo and submit the repository/report links in the prescribed portal.

## 9. Integrity declaration
Field observations and stakeholder statements are carried forward with their limitations. Controlled software tests are not represented as real-world impact. No tester feedback, new deployment, fresh test result or environmental benefit is invented. AI supported ideation and development, but field evidence, implementation decisions and final conclusions remain the student's responsibility.

**Current conclusion:** WasteVoice AI has a substantial working prototype and a documented Review 2 technical baseline. Review 3 readiness depends on genuine user validation, feedback-driven retesting, a fresh quality run and completion of the institution's final submission requirements.
