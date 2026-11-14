# WASTEVOICE AI — PROJECT BETTER TOMORROW
## C29 Semester 3 — Review 3 Final Progress & Prototype Validation Report

**Pathway:** A — Continuation Track  
**Report date:** 14 November 2026  
**Repository:** https://github.com/maheshofficial0011/wastevoice-ai  
**Review weighting:** 30% (Project Better Tomorrow portal)  
**Status:** AI validation hardening and CI complete; genuine tester validation remains pending. No Review 3 score is claimed.

## 1. Executive summary

WasteVoice AI is an AI-assisted campus waste reporting and resolution-tracking prototype. It addresses the gap between noticing unmanaged waste and getting it reported, assigned, cleaned, evidenced and verified. Its roles are Reporter, Authority and Staff; its workflow is **Report → AI Assist → Confirm → Review → Assign → Clean → Evidence → Verify → Resolve**.

The submitted QBee records show **Review 1: 92%** and **Review 2: 92%**. Each was labelled 35% in the portal. Review 3 is the final 30% review.

## 2. Problem and evidence carried forward

Field notes record about four campus-park accumulation points, waste observed for roughly a week, 8–10 passers during the observation, and stakeholder-estimated removal in 2–3 weeks. These are bounded observations, not campus-wide statistics or a service-level agreement.

**Refined problem:** Campus waste issues are easy to notice but can be difficult to report, assign, track and verify through a clear, accountable workflow.

## 3. Previous review outcomes and QBee feedback

| Review | QBee result | Portal weighting |
|---|---:|---:|
| Review 1 | **92%** | 35% |
| Review 2 | **92%** | 35% |
| Review 3 | Pending | 30% |

Both reviews repeated three recommendations:
1. More granular unit-testing and Error Boundary documentation.
2. Expanded code comments.
3. API endpoint and database-schema documentation in README.

The Review 2 submission stated these were addressed. The repository contains a test matrix, Error Boundary runtime-test record, API/workflow operation summary and database contract. The Review 2 report records the comment/documentation work. See `docs/review-feedback-closure.md` for the evidence mapping.

The Review 2 score is the submitted QBee result. An older repository status separately noted that three external tester sessions were not retained. That validation gap does not cancel the awarded score and remains a distinct Review 3 requirement.

## 4. Prototype and AI

- **Reporter:** creates reports, supplies before evidence, reviews/corrects AI suggestions and tracks status.
- **Authority:** reviews reports/evidence, assigns Staff and makes the final verification decision.
- **Staff:** handles assigned tasks, cleaning progress and after evidence.
- **Human control:** AI cannot assign Staff, change cleaning status, approve evidence or resolve reports. Reporter confirmation and Authority verification remain required.

**Stack:** React 19, TypeScript, Vite, Tailwind, React Router; Supabase Auth, PostgreSQL, Storage, RLS, protected RPCs and Edge Function.

**AI path:** reporter text → authenticated `structure-report` Edge Function → Gemini (`gemini-3.5-flash-lite`) → structured response → server validation/fallback → reporter review. AI structures language; it is not a trained waste detector or predictor. Unknown facts remain unknown; output is advisory.

## 5. Review 3 quality and dependency security

The initial audit found **12 advisories (3 high, 9 moderate)**. Non-breaking lockfile updates were committed as `ad52d27` (including Vite 8.3.8, source-map-js 1.2.2, Zod 4.6.7 and tooling). The AI validator/tests changed; database schema, API contracts and workflow states were preserved.

**Latest verified CI:**
- Branch: `review-3-upgrade-2026-11-14`
- Latest branch commit: `400d8afbb05625d9fa654a90cfdc9d60dd49d731`
- Quality Check **#217: success** on 14 November 2026.
- `npm ci`, `npm audit --audit-level=high`, lint and production build: passed.
- `npm test`: **32/32 passed**, 0 failed (14 AI + 8 form + 10 workflow/regression tests).
- Build: Vite 8.3.8, 82 modules transformed; non-blocking ~713 kB chunk warning.
- Run: https://github.com/maheshofficial0011/wastevoice-ai/actions/runs/43609633838
- Earlier Quality Check #205 passed the original 29-test suite on the dependency-update checkpoint.

**Remaining dependency risk:** the full audit reports **7 moderate advisories** in nested `minimatch` used by TypeScript-ESLint; no high or critical advisories remain after the update. npm suggests a major downgrade to `typescript-eslint@8.36.0` for full remediation. That breaking downgrade was not forced. The build also has a non-blocking large-chunk warning (about 713 kB).

Supabase advisor warnings remain documented for SECURITY DEFINER helper-function exposure and disabled leaked-password protection. No complete security certification is claimed.

## 6. Prototype validation

Existing evidence covers the Reporter → Authority → Staff workflow, live Gemini response, role/security probes, Error Boundary recovery and selected accessibility checks. Before/after used one controlled test image; it does not prove real cleaning.

**Required Review 3 gate:** collect feedback from at least three genuine new testers or re-engage original users. The repository includes a consent-aware protocol and anonymised feedback ledger, but no new sessions or feedback are claimed. After sessions, choose a real friction point, implement a proportionate improvement, add regression coverage and retest the same task.

## 7. Work completed in this update

1. Corrected review history from the submitted QBee records and mapped repeated feedback to repository evidence.
2. Updated the Review 3 report, plan, tester protocol, evidence index, README and project status.
3. Added the CI high-severity dependency audit and committed non-breaking lockfile updates.
4. Hardened `isSafeResult()` to enforce the exact five-field AI response contract; unexpected properties and whitespace-only summaries are rejected. The reporter-supplied location remains authoritative.
5. Added AI-12 to AI-14 regression tests for unexpected fields, provider-invented location and blank summaries.
6. Quality Check #217 passed install, high-severity audit, lint, **32/32 tests** and production build.

This is a targeted AI validation hardening change, not a new user-facing feature. A further usability change selected from genuine tester feedback and same-task participant retesting remain pending.

## 8. Remaining before final submission

1. Run at least three genuine tester sessions with permission and anonymised notes.
2. Record actual task outcomes, confusion and AI corrections; invent no quotes, timings or success rates.
3. Complete the feedback decision ledger.
4. Use genuine tester findings to choose any additional usability improvement and retest the same participant task.
5. Recheck live role, storage and AI edge cases; document Supabase advisor warnings.
6. Review the 7 moderate dependency advisories without an untested breaking downgrade.
7. Add genuine session, code, test and retest artifacts to the evidence index.
8. Prepare the final demo and submit the portal deliverables.

## 9. Integrity declaration

Field notes retain their limitations; controlled tests are not real-world impact. Review 1/2 scores come from the submitted QBee records. No tester feedback, environmental benefit or Review 3 score is invented. The student remains responsible for evidence, implementation decisions and conclusions.

**Conclusion:** WasteVoice AI has a working prototype, two previous QBee outcomes of 92%, documented responses to repeated technical feedback, a patched dependency lockfile and a successful CI run with 32/32 tests, including three new AI response-contract regression tests. Review 3 remains incomplete until genuine user validation, feedback-led iteration/retesting and remaining security review are evidenced.
