# WASTEVOICE AI — PROJECT BETTER TOMORROW
## C29 Semester 3 — Review 3 Final Progress & Prototype Validation Report

**Pathway:** A — Continuation Track  
**Report date:** 14 November 2026  
**Repository:** https://github.com/maheshofficial0011/wastevoice-ai  
**Review weighting:** 30% (as labelled by the Project Better Tomorrow portal)  
**Status:** Technical and CI work completed; genuine tester validation remains outstanding. No Review 3 score or full-marks outcome is claimed.

## 1. Executive summary

WasteVoice AI is a student-built, AI-assisted campus waste reporting and resolution-tracking prototype. It addresses the gap between noticing unmanaged waste and getting it reported, assigned, cleaned, evidenced and verified. It supports Reporter, Authority and Staff roles through **Report → AI Assist → Confirm → Review → Assign → Clean → Evidence → Verify → Resolve**.

The submitted QBee records show **Review 1: 92%** and **Review 2: 92%**. Each was labelled 35% in the portal. Review 3 is the final 30% review. This report consolidates those outcomes, the repeated QBee feedback, the technical improvements and the latest repository evidence.

## 2. Problem and evidence carried forward

The project continues the campus-park waste problem documented during the earlier field investigation. Carried-forward notes record approximately four accumulation points, waste estimated to have remained for about one week during the observation, approximately 8–10 people passing during the observed period, and stakeholder feedback that removal could take around 2–3 weeks. These are bounded observations/estimates and stakeholder statements—not campus-wide statistics, an official service-level agreement, or proof of causation.

**Refined problem:** Campus waste issues are easy to notice but can be difficult to report, assign, track and verify through a clear, accountable workflow.

## 3. Previous review outcomes and QBee feedback

| Review | QBee result | Portal weighting |
|---|---:|---:|
| Review 1 | **92%** | 35% |
| Review 2 | **92%** | 35% |
| Review 3 | Pending | 30% |

Both QBee reviews repeated these recommendations:

1. Add granular technical documentation on unit testing and Error Boundaries.
2. Expand code comments.
3. Document API endpoints and database schema in README.

The Review 2 submission stated that these recommendations had been addressed. The repository contains the test matrix, Error Boundary runtime test record, API/workflow operation summary and database contract. Review 2's comment/documentation work is recorded in its report and project-status history. See `docs/review-feedback-closure.md` for the evidence mapping.

**Score versus validation:** the 92% Review 2 score is the submitted QBee result. The older repository status separately noted that three external tester sessions were not retained. The awarded score does not replace the new Review 3 user-validation gate.

## 4. Implemented prototype and AI

- **Reporter:** signs in, enters location and description, uploads before evidence, uses AI Assist, reviews/corrects suggestions, submits and tracks a report.
- **Authority:** reviews reports/evidence, assigns Staff, monitors progress, reviews after evidence and makes the final verification/correction decision.
- **Staff:** views assigned work, updates cleaning progress and uploads after-cleaning evidence.
- **Human control:** AI cannot assign Staff, change cleaning status, approve evidence or resolve reports. Reporter confirmation and Authority verification remain mandatory.

**Stack:** React 19, TypeScript, Vite, Tailwind, React Router; Supabase Auth, PostgreSQL, Storage, RLS, protected RPCs and Edge Function; GitHub Actions, ESLint and Node tests.

**AI path:** Reporter text → authenticated `structure-report` Edge Function → Gemini (`gemini-3.5-flash-lite`) → structured response → server-side validation/safe fallback → reporter review and correction. AI performs natural-language extraction/structuring; it is not a trained waste detector or predictor. Unknown facts remain unknown; output is advisory.

## 5. Review 3 quality and dependency-security work

The fresh dependency audit initially found **12 advisories: 3 high and 9 moderate**. A non-breaking lockfile update was generated and tested, then committed as `ad52d27`. It updates affected packages including Vite to 8.3.8, source-map-js to 1.2.2, Zod to 4.6.7, and related ESLint/TypeScript tooling. No application source, database schema or API contract was changed.

**Latest verified CI:**
- Branch: `review-3-upgrade-2026-11-14`
- Current report commit: `6f4b8512533278fe1bb1f5b4ea1685b96037b25a`
- Dependency lockfile update: `ad52d27abcced94d87b365ec55b695c8698b7ed1`
- GitHub Actions Quality Check **#205: success**.
- `npm ci`: passed.
- `npm audit --audit-level=high`: passed.
- `npm run lint`: passed.
- `npm test`: **29/29 passed**, 0 failed.
- `npm run build`: passed with Vite 8.3.8; 82 modules transformed.
- Run: https://github.com/maheshofficial0011/wastevoice-ai/actions/runs/43608822799

**Remaining dependency note:** the full audit still reports **7 moderate advisories** associated with nested `minimatch` in the TypeScript-ESLint dependency chain; it reports no high or critical advisories after the lockfile update. npm's suggested full remediation requires a major downgrade to `typescript-eslint@8.36.0`. That breaking downgrade was not forced. The Vite build also retains a non-blocking large-chunk warning (about 713 kB).

The repository still documents Supabase advisor warnings for SECURITY DEFINER helper-function exposure and disabled leaked-password protection. No complete security certification is claimed.

## 6. Prototype validation and limitations

Existing internal evidence covers Reporter → Authority → Staff → evidence → verification, live Gemini response, role/security probes, Error Boundary recovery and selected accessibility/usability checks. The before/after fixture reused the same controlled test image; it demonstrates software evidence handling only, not real cleaning.

**Required Review 3 gate:** collect feedback from at least three genuine new testers or re-engage original users, as permitted by Pathway A. A consent-aware protocol and anonymised feedback ledger are in the repository, but no new tester sessions or feedback are claimed here. After sessions, prioritise a real friction point, implement a proportionate improvement, add regression coverage and retest the same task.

## 7. Work completed in this Review 3 update

1. Corrected the repository's review history to show both submitted QBee scores accurately.
2. Mapped repeated QBee feedback to test, Error Boundary, API and database documentation.
3. Added/updated the Review 3 report, execution plan, tester protocol and evidence index.
4. Updated README and project status.
5. Added a current dependency audit to CI and committed non-breaking lockfile security updates.
6. Verified the latest CI run: audit threshold, lint, all 29 tests and production build passed.

No new product feature or schema migration is claimed. Product changes based on user feedback remain pending real tester sessions.

## 8. Remaining before final submission

1. Complete at least three genuine tester sessions with permission and anonymised notes.
2. Record actual task outcomes, observed confusion and AI corrections; invent no quotes, timings or success rates.
3. Complete the feedback decision ledger.
4. Implement an evidence-backed improvement, add a regression test and retest.
5. Recheck live role, storage and AI edge cases; document Supabase advisor warnings.
6. Review and resolve the 7 remaining moderate dependency advisories without an untested breaking downgrade.
7. Add genuine session, code, test and retest artifacts to the evidence index.
8. Prepare the final demo and submit the required portal deliverables.

## 9. Integrity declaration

Field observations and stakeholder statements are carried forward with their limitations. Controlled tests are not represented as real-world impact. Review 1 and Review 2 scores are stated as the QBee outcomes in the submitted records. No new tester feedback, environmental benefit or Review 3 score is invented. AI supported ideation and development, but field evidence, implementation decisions and final conclusions remain the student's responsibility.

**Conclusion:** WasteVoice AI has a substantial working prototype, two previous QBee outcomes of 92%, documented responses to the repeated technical feedback, a patched dependency lockfile, and a successful latest CI run with 29/29 tests. Review 3 is not honestly complete until genuine user validation, feedback-led iteration/retesting and remaining security review are evidenced.
