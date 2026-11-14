# WASTEVOICE AI — PROJECT BETTER TOMORROW
## C29 Semester 3 — Review 3 Final Progress & Prototype Validation Report

**Pathway:** A — Continuation Track  
**Report date:** 14 November 2026  
**Repository:** https://github.com/maheshofficial0011/wastevoice-ai  
**Review weighting:** 30% (Project Better Tomorrow portal)  
**Status:** Technical/CI work complete; genuine tester validation remains pending. No Review 3 score is claimed.

## 1. Executive summary

WasteVoice AI is an AI-assisted campus waste reporting and resolution-tracking prototype. It addresses the gap between noticing unmanaged waste and getting it reported, assigned, cleaned, evidenced and verified. Its roles are Reporter, Authority and Staff; its workflow is **Report → AI Assist → Confirm → Review → Assign → Clean → Evidence → Verify → Resolve**.

The submitted QBee records show **Review 1: 92%** and **Review 2: 92%**. Each was labelled 35% in the portal. Review 3 is the final 30% review.

## 2. Problem and evidence carried forward

Earlier campus-park field notes record approximately four accumulation points, waste estimated to have remained for about one week during observation, approximately 8–10 passers during the observed period, and stakeholder feedback that removal could take around 2–3 weeks. These are bounded observations/estimates and stakeholder statements—not campus-wide statistics or an official service-level agreement.

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

- **Reporter:** authentication, report details/location, before evidence, AI Assist review/correction, submission and status tracking.
- **Authority:** report/evidence review, Staff assignment, monitoring, after-evidence review and final verification/correction.
- **Staff:** assigned tasks, cleaning progress and after evidence.
- **Human control:** AI cannot assign Staff, change cleaning status, approve evidence or resolve reports. Reporter confirmation and Authority verification remain required.

**Stack:** React 19, TypeScript, Vite, Tailwind, React Router; Supabase Auth, PostgreSQL, Storage, RLS, protected RPCs and Edge Function.

**AI path:** reporter text → authenticated `structure-report` Edge Function → Gemini (`gemini-3.5-flash-lite`) → structured response → server validation/fallback → reporter review. AI structures language; it is not a trained waste detector or predictor. Unknown facts remain unknown; output is advisory.

## 5. Review 3 quality and dependency security

The fresh audit initially found **12 advisories: 3 high and 9 moderate**. A non-breaking lockfile update was tested and committed as `ad52d27`. It updates affected dependencies including Vite 8.3.8, source-map-js 1.2.2, Zod 4.6.7, and related ESLint/TypeScript tooling. Application source, database schema and API contracts were not changed.

**Latest verified CI:**
- Branch: `review-3-upgrade-2026-11-14`
- Report commit: `6f4b8512533278fe1bb1f5b4ea1685b96037b25a`
- Lockfile update commit: `ad52d27abcced94d87b365ec55b695c8698b7ed1`
- Quality Check **#205: success**.
- `npm ci`, `npm audit --audit-level=high`, lint and production build: passed.
- `npm test`: **29/29 passed**, 0 failed.
- Build: Vite 8.3.8, 82 modules transformed.
- Run: https://github.com/maheshofficial0011/wastevoice-ai/actions/runs/43608822799

**Remaining dependency risk:** the full audit reports **7 moderate advisories** in nested `minimatch` used by TypeScript-ESLint; no high or critical advisories remain after the update. npm suggests a major downgrade to `typescript-eslint@8.36.0` for full remediation. That breaking downgrade was not forced. The build also has a non-blocking large-chunk warning (about 713 kB).

Supabase advisor warnings remain documented for SECURITY DEFINER helper-function exposure and disabled leaked-password protection. No complete security certification is claimed.

## 6. Prototype validation

Existing internal evidence covers the Reporter → Authority → Staff → evidence → verification workflow, live Gemini response, role/security probes, Error Boundary recovery and selected accessibility/usability checks. The before/after fixture reused one controlled test image; it proves evidence handling only, not real cleaning.

**Required Review 3 gate:** collect feedback from at least three genuine new testers or re-engage original users. The repository includes a consent-aware protocol and anonymised feedback ledger, but no new sessions or feedback are claimed. After sessions, choose a real friction point, implement a proportionate improvement, add regression coverage and retest the same task.

## 7. Work completed in this update

1. Corrected repository review history using the submitted QBee records.
2. Mapped repeated QBee feedback to test, Error Boundary, API and database documentation.
3. Updated the Review 3 report, plan, tester protocol, evidence index, README and project status.
4. Added a dependency audit to CI and committed non-breaking lockfile security updates.
5. Verified current CI: high-severity audit threshold, lint, all 29 tests and production build passed.

No new product feature or schema migration is claimed. User-feedback-led product changes remain pending genuine sessions.

## 8. Remaining before final submission

1. Run at least three genuine tester sessions with permission and anonymised notes.
2. Record actual task outcomes, confusion and AI corrections; invent no quotes, timings or success rates.
3. Complete the feedback decision ledger.
4. Implement an evidence-backed improvement, add a regression test and retest.
5. Recheck live role, storage and AI edge cases; document Supabase advisor warnings.
6. Review the 7 moderate dependency advisories without an untested breaking downgrade.
7. Add genuine session, code, test and retest artifacts to the evidence index.
8. Prepare the final demo and submit the portal deliverables.

## 9. Integrity declaration

Field observations and stakeholder statements retain their limitations. Controlled tests are not real-world impact. Review 1 and Review 2 scores are the QBee outcomes in the submitted records. No new tester feedback, environmental benefit or Review 3 score is invented. AI supported development, but field evidence, implementation decisions and conclusions remain the student's responsibility.

**Conclusion:** WasteVoice AI has a working prototype, two previous QBee outcomes of 92%, documented responses to repeated technical feedback, a patched dependency lockfile and a successful CI run with 29/29 tests. Review 3 remains incomplete until genuine user validation, feedback-led iteration/retesting and remaining security review are evidenced.
