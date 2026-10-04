# WasteVoice AI — Master Review 2 Audit Report

**Audit date:** 04 October 2026
**Project:** WasteVoice AI
**Programme:** Project Better Tomorrow · C29 Semester 3
**Pathway:** A — Continuation Track
**Repository:** https://github.com/maheshofficial0011/wastevoice-ai

## Executive Summary

WasteVoice AI has moved from the Review 1 foundational prototype into a substantially stronger Review 2 engineering state. The core human-controlled workflow is implemented across Reporter, Authority and Staff roles, the evidence workflow is present, a server-side AI report-structuring Edge Function is deployed with JWT verification, evidence storage has been hardened to private signed access, workflow RPC execution permissions have been tightened, and automated AI safety tests are now part of CI.

The project is **technically strong but still has an external validation gate**: three genuine Review 2 tester sessions have not been claimed. Live Gemini inference, Reporter AI Assist, the full Reporter → Authority → Staff workflow, Error Boundary runtime behavior, selected accessibility checks, and the Staff before-evidence fix have all been manually validated. No external-user evidence is fabricated.

The current conclusion is therefore: **Strong technical foundation, verified live Gemini AI, verified workflow/security controls, strong internal validation, and incomplete external-user evidence.**

## Current Completion Assessment

No artificial percentage is assigned. The C29 standard requires evidence-backed maturity rather than source-code volume. The project is materially implemented and internally validated for Review 2. Final academic/evidence readiness still depends on genuine external tester sessions and any official submission artifacts required by C29.

| Area | Readiness |
|---|---|
| Product completeness | Strong |
| Technical implementation | Strong |
| AI implementation | Strong / verified live inference |
| Security | Strong |
| Testing | Strong |
| UX | Strong |
| Validation | Internal validation complete; external validation pending |
| Documentation | Strong |
| Evidence quality | Strong technical evidence; external-user evidence pending |

## Review 1 Baseline

Review 1 received **32.2/35 (92%)**. The evaluator highlighted clear functional component description, structured progress, a public repository, foundational implementation, and documented architecture/workflow.

The documented improvement requests were more granular technical documentation, unit testing, error boundaries, expanded code comments, and clearer API/database documentation.

Since Review 1, the repository is ahead by approximately forty commits relative to the retained Review 1 runtime-evidence commit used for comparison. The change history is organized into focused documentation, feature, test, security and CI commits.

## Review 1 Feedback Closure

| Feedback item | Closure state | Evidence status |
|---|---|---|
| More granular technical documentation | Fixed | ✅ database-schema, AI integration, architecture, testing and live-setup documentation exist |
 | Unit testing | Fixed for current Review 2 scope | ✅ 29 automated tests: 11 AI, 8 form-validation, 10 Review 2 regression/guard tests |
| Error boundaries | Verified | ✅ Controlled local runtime trigger displayed the fallback and recovery action; temporary trigger removed |
| Expanded code comments | Fixed | ✅ dashboard/workflow code contains substantial explanatory comments |
| API endpoint/database schema documentation | Fixed and externally checked | ✅ active RPC signatures and core Supabase tables were inspected on 04 October 2026 |

## Full Technical Audit

### Frontend

React 19 + TypeScript + Vite is the current frontend stack. Routes exist for Home, Login, Reporter, Reporter report creation, Reporter AI Assist, Authority and Staff workspaces.

Strengths:
- role-aware route guards;
- three distinct workflow workspaces;
- multi-step Reporter form;
- before/after evidence handling;
- clear active/resolved sections;
- authority verification workspace;
- controlled empty/loading/error UI;
- AI Assist interface with confirmation boundary.

Gap:
The dashboards remain large page-level components with duplicated status helpers. This is maintainability debt, but a full refactor is not justified before Review 2 validation because it increases regression risk.

### Backend/Data

Supabase is the backend/data platform. The application uses Auth, PostgreSQL data, Storage and protected RPCs rather than a separate backend server in the repository.

### Authentication

Supabase Auth is used for login and session state. ProtectedRoute checks session/profile role before rendering role-specific areas.

Live state:
The connected Auth database contains three users and three explicit profile rows mapped to Reporter, Authority and Staff. The browser login flow still requires the existing account passwords; no password was created or assumed by this audit.

### Authorization

Frontend authorization exists and role-specific RPCs are used for important workflow mutations.

Backend verification is stronger than frontend-only checks: core RLS is enabled, active workflow RPCs are restricted to authenticated execution, anonymous access was removed from active workflow RPCs, and obsolete legacy RPCs were restricted.

Runtime verification:
Role-negative SQL probes were executed against the live database in isolated transaction context. Reporter and Staff authority-only actions were denied, Staff final resolution was denied, Authority invalid verification was denied, and unassigned Staff access returned zero rows.

### Database

The inspected application tables are `profiles`, `reports`, `report_evidence`, `report_assignments`, and `authority_reviews`. Legacy `report_activity` and `waste_reports` remain present but are not part of the current frontend contract.

Active protected RPC signatures verified live:
- `reporter_update_report(p_report_id uuid, p_location text, p_description text, p_additional_info text)`
- `assign_report_to_staff(p_report_id uuid, p_staff_id uuid)`
- `staff_update_task_status(p_assignment_id uuid, p_status text)`
- `authority_review_report(p_report_id uuid, p_decision text, p_reason text, p_notes text)`

RLS is enabled on the inspected core tables.

### Storage

The `waste-evidence` bucket is private. A newly discovered legacy `report-evidence` bucket was also hardened to private because existing report records still referenced objects there.

The browser-side code no longer uses public Storage URLs for evidence. Stored paths are resolved to signed URLs with a one-hour TTL for the current session.

Storage policies now distinguish Reporter-owned evidence, Authority review access, and Staff-assigned evidence upload/read access.

Runtime qualification:
Live policy/configuration and role-scoped object visibility were checked in the database. Direct public URL, signed URL download, expiry, and browser wrong-role captures remain evidence-pending because browser/network execution is unavailable.

### AI

The Review 2 AI capability is implemented as a Supabase Edge Function named `structure-report` with JWT verification enabled.

AI responsibility is intentionally narrow:
- natural-language report structuring;
- conservative category suggestion;
- supplied-location preservation;
- neutral summary;
- missing/vague field identification.

AI is explicitly prohibited from assigning staff, changing workflow status, approving/rejecting, declaring cleaning complete, or resolving a report.

Safety implementation:
- input type/length validation;
- structured JSON Schema output;
- post-output validation;
- conservative fallback;
- suspicious control-language rejection in structured output;
- 8-second provider timeout;
- safe provider-error handling;
- no provider secret in frontend code;
- mandatory human confirmation in the UI.

Live provider status:
The deployed `structure-report` function uses the native Gemini REST API. The configured provider is Gemini with model `gemini-3.5-flash-lite`. A live request returned HTTP 200 with `source=gemini`, `providerConfigured=true`, the configured model, structured data and `needsConfirmation=true`.

No model-accuracy percentage is claimed.

### Testing

The repository now has an automated native Node test suite covering AI safety, Reporter-form validation, and Review 2 guard/regression behavior. The suite contains 29 tests: 11 AI safety, 8 form-validation, and 10 regression/guard tests.

GitHub Actions now runs:
```text
npm ci
npm run lint
npm test
npm run build
```

The previous red CI iterations were used to fix real lint and test issues. GitHub Actions run #166 passed the reviewed documentation state after the separate signed-URL error-cause lint fix. It is the final verified CI gate for this audit.

### CI/CD

GitHub Actions uses Node 22, which aligns with the currently installed Supabase JS package engine requirements observed during CI.

CI is therefore stronger than the Review 1 baseline because it covers automated tests in addition to lint/build.

### Performance

The Vite build has historically emitted a large JavaScript chunk warning. This is an optimization item, not a build failure.

Priority remains low relative to validation because route code splitting would be a useful future improvement but is not necessary to demonstrate the Review 2 problem/solution loop.

### Security

Implemented hardening includes:
- private evidence bucket;
- signed evidence access;
- authenticated execution for core workflow RPCs;
- anonymous execution removed from active workflow RPCs;
- anonymous access removed from obsolete workflow helpers;
- restrictive policies on unused legacy tables;
- fixed search path for `update_updated_at`.

Remaining Supabase advisor items include `SECURITY DEFINER` helper-function exposure warnings and disabled leaked-password protection. These are explicitly documented rather than hidden.

### UX

The product already addresses the earlier clarity issue through report status labels, workflow progress, correction messaging, explicit role responsibilities, and an authority-side five-step workflow visualization.

The Reporter already has a reusable local Progress component, while Authority has a detailed Workflow visualization. A large cross-page refactor would add risk without changing the core Review 2 outcome.

### Accessibility

Manual browser-level accessibility/usability checks passed for Login, New Report and AI Assist. This is not formal WCAG certification.

### Documentation

The repository now contains:
- README;
- architecture;
- database contract;
- AI integration;
- AI usage audit;
- testing record;
- validation record;
- Review 2 report;
- Review 2 validation template;
- Review 2 validation plan;
- live setup guide;
- project status;
- final completion roadmap;
- Review 2 architecture diagram.

One important documentation risk was found and corrected during the audit: older sections still described AI as planned and the Error Boundary as planned even though the code had evolved. The updated documents now separate implementation status from verification status.

## Feature-by-Feature Status Matrix

| Feature | Current State | Evidence | Remaining Work | Priority |
|---|---|---|---|---|
| Reporter login | COMPLETE AND VERIFIED | Controlled Review 1 workflow | New live role mapping | P1 |
| Authority login | COMPLETE AND VERIFIED | Controlled Review 1 workflow | New live role mapping | P1 |
| Staff login | COMPLETE AND VERIFIED | Controlled Review 1 workflow | New live role mapping | P1 |
| Reporter form | COMPLETE AND VERIFIED | Controlled workflow + source | Edge-case runtime captures | P1 |
| Before evidence upload | COMPLETE AND VERIFIED | Controlled workflow | Private-storage runtime proof | P1 |
| Authority assignment | VERIFIED COMPLETE | Code + live RPC + negative role probe | Browser capture optional | P1 |
| Staff status workflow | VERIFIED COMPLETE | Code + live RPC + negative role probe | Browser capture optional | P1 |
| After evidence upload | VERIFIED COMPLETE | Browser Staff retest after Storage RLS path fix | Cross-staff second-identity test pending | P1 |
| Authority verification | VERIFIED COMPLETE | Code + live RPC + negative role/state probes | Browser capture optional | P1 |
| AI Assist UI | VERIFIED COMPLETE | Manual Reporter browser test | Gemini live-provider label mismatch was corrected in `AIReportPage.tsx` during the audit | P0 |
| AI Edge Function | VERIFIED COMPLETE | Deployed function + live Gemini HTTP 200 result | No accuracy percentage claimed | P0 |
| AI fallback | COMPLETE AND VERIFIED | Automated tests | Optional runtime capture | P1 |
| AI output validation | COMPLETE AND VERIFIED | Automated tests | Live model adversarial capture | P1 |
| Error Boundary | VERIFIED COMPLETE | Controlled local runtime test | No permanent screenshot required | P2 |
| CI quality gate | VERIFIED COMPLETE | Final local validation + GitHub Actions #166 | 29/29 automated tests and build pass | P1 |
| Review 2 documentation | COMPLETE AND VERIFIED | Repository docs | Fill real validation results | P1 |
| Three-person validation | EXTERNAL ACTION REQUIRED | Validation plan/template | Genuine external sessions + iteration | P0 |
| Production deployment | UNKNOWN | No final production evidence | Confirm target + runtime proof | P2 |

## Critical Problems Found

### P0 — External evidence gate

**P0.1 Three-person Review 2 validation is still required.**
This is an academic/evaluator evidence requirement and cannot be replaced by internal project-owner testing.

### P1 — High value

**P1.1 Cross-staff negative browser validation is still pending.**
Only one Staff identity is available for manual testing, so a second-Staff isolation test is not claimed.

**P1.2 Retain any required final submission artifacts.**
The project owner has chosen not to record a final demo unless the official C29 process requires it.

**P1.3 Provider-label inconsistency fixed during audit.**
The Reporter AI Assist helper was updated to recognize the live Gemini provider so the UI does not mislabel a verified live result as fallback mode.

### P2 — Useful

**P2.1 Improve bundle size through route splitting if time remains.**
**P2.2 Add broader automated workflow transition tests if they add value beyond the current 10 regression tests.**

### P3 — Optional

Voice/multilingual reporting, image-based classification, prediction and anomaly analytics should wait until the core Review 2 validation loop is complete.

## Work Completed During This Session

| Change | Why | Files / systems | Verification | Evaluator value |
|---|---|---|---|---|
| Added/strengthened AI report assistant | Make AI a real engineering component | `AIReportPage.tsx`, `reportAssistant.ts`, `structure-report` | Source + deployed Edge Function | Demonstrable AI capability |
| Added safe fallback/output validation | Prevent hallucination and unsafe control claims | `logic.mjs`, Edge Function | Automated safety tests | Responsible AI evidence |
| Added timeout + failure handling | Prevent hanging/opaque AI requests | Edge Function | Source inspection | Robustness |
| Allowed missing location in AI Assist | Enables required missing-location reliability case | `AIReportPage.tsx` | Source inspection | Directly matches test matrix |
| Made fallback conservative for mixed waste | Avoid false single-category certainty | `logic.mjs` | Automated test | Uncertainty handling |
| Hardened evidence storage | Reduce data exposure | Supabase migration + `evidence.ts` + dashboards | Live bucket/policy inspection | Security maturity |
| Hardened workflow RPC execution | Remove anonymous mutation surface | Supabase migration | Live ACL inspection | Authorization maturity |
| Restricted legacy RPC/table exposure | Reduce unused attack surface | Supabase migration | Security advisor re-check | Security hygiene |
| Added automated AI test suite | Replace implementation-only testing with executable checks | `tests/report-assistant.test.mjs`, package/CI | CI | Testing maturity |
| Updated Node version in CI | Match Supabase dependency engine requirements | `quality.yml` | CI | Reproducibility |
| Updated Review 2 docs | Remove stale implementation claims | README + docs | Source consistency audit | Documentation credibility |
| Created status/validation/roadmap documents | Single source of truth | `docs/*.md` | Repository inspection | Evaluator confidence |

## New AI Capability

WasteVoice AI now has a dedicated Reporter AI Assist screen. The user supplies a location (optional for the AI-assist stage), observed description and optional additional information.

The request reaches the authenticated `structure-report` Edge Function. The live provider is Gemini (`gemini-3.5-flash-lite`). The live function test returned HTTP 200 with `source=gemini`, `providerConfigured=true`, a structured category/location/summary/missing-fields response, and `needsConfirmation=true`. The reporter can review and correct the result before continuing to the normal report form.

The AI layer has no workflow authority. It cannot assign staff, approve evidence or resolve reports.

The system also has a deterministic fallback so missing provider configuration does not produce a misleading “live AI” success state.

## New Validation & Security Capability

Validation capability now includes 29 automated tests plus manual browser/internal validation. Security capability includes private evidence storage, signed URLs, restricted workflow RPC execution and cleanup of obsolete API exposure. The remaining external evidence gate is three genuine Review 2 tester sessions; cross-staff isolation also remains unverified because only one Staff identity is available.

## Review 2 Readiness

| Category | Assessment |
|---|---|
| Product completeness | Strong |
| Technical implementation | Strong |
| AI implementation | Strong / verified live inference |
| Security | Strong |
| Testing | Strong |
| UX | Strong |
| Validation | Developing |
| Documentation | Strong |
| Evidence quality | Developing |

Do not convert these assessments into fabricated Qbee marks.

## Remaining Work

1. Run three genuine Review 2 tester sessions.
2. Record genuine feedback → change → retest evidence.
3. If required by the official C29 process, capture the final submission recording/evidence package.
4. Optionally add a second Staff test identity for cross-staff isolation validation.
5. Optionally clean up the Gemini provider-label helper in source code in a separate implementation pass.

## Final Completion Roadmap

**Phase 1 — Live setup:** role profiles + AI provider configuration.

**Phase 2 — Technical validation:** AI matrix + role/RLS/storage negative tests + final CI green check.

**Phase 3 — Human validation:** three real testers + observed friction + iteration + retest.

**Phase 4 — Submission:** final report + deck + video + evidence recordings + AI declaration.

**Phase 5 — Optional post-review improvements:** performance split, richer AI categorization, voice/multilingual input and analytics.

## Evidence Checklist

### Technical evidence
- Green GitHub Actions quality run after the final code state.
- AI Assist screenshot with live provider output.
- Four minimum AI reliability captures; preferably all A-J cases.
- Browser role-negative access captures.
- Signed private-evidence preview capture.
- Error Boundary capture.

### Human validation evidence
- T01 session recording/screenshot + notes.
- T02 session recording/screenshot + notes.
- T03 session recording/screenshot + notes.
- Feedback table.
- Prototype change linked to each meaningful finding.
- Retest evidence.

### Design Thinking evidence
- field observation footage;
- problem statement;
- Five Whys/root-cause analysis;
- stakeholder map;
- three field numbers with provenance;
- eight ideation directions;
- scoring matrix;
- winner + runner-up rationale;
- technical block diagram.

### Submission evidence
The C29 guide requires four evidence recordings, a 6-10 slide deck, an 8-12 minute 1080p video, and an AI-use declaration. fileciteturn236file0L187-L225

## Review 2 Submission Draft

**Project:** WasteVoice AI

**Problem:** Students and campus users are affected by accumulated waste in the campus park, and the current response may be delayed because people do not always know how to report the problem or when it will be addressed.

**What existed at Review 1:** a human-controlled reporting, assignment, cleaning-status, evidence and authority-verification prototype.

**What changed for Review 2:** a server-side AI-assisted report-structuring capability was added; private evidence access was hardened; workflow RPC permissions were tightened; automated AI safety tests were added to CI; and Review 2 documentation/evidence structure was expanded.

**Demonstrable workflow:** Reporter submits observation and evidence → Authority reviews and assigns → Staff performs work and uploads after evidence → Authority verifies → Resolved.

**AI technique:** natural-language understanding / schema-constrained structured information extraction.

**Human-in-the-loop:** reporter confirms AI suggestions; authority controls assignment and final resolution.

**Current limitation:** three-person genuine external Review 2 validation remains outstanding; cross-staff isolation using a second Staff identity also remains unobserved.

**Success criterion:** a credible, evidence-backed prototype rather than an inflated completion percentage.

## Final Answer to the Required Question

**What changed from Review 1 to Review 2?** The project gained a real server-side AI-assisted report path, stronger output safety, private evidence storage, tighter RPC permissions, executable AI safety tests, updated CI, and a much stronger evidence/documentation structure.

**Why does it matter?** Review 2 is no longer just a larger demo; the project now has a clearer AI boundary, a safer evidence model, reproducible quality checks, and a defined path for human validation.

**What is genuinely complete?** The core application workflow, AI Edge Function deployment, safe fallback/output validation, private evidence configuration, RPC permission hardening, automated AI safety tests, and Review 2 documentation are implemented and supported by code or live configuration checks.

**What still needs evidence?** Genuine external Review 2 tester sessions plus feedback-driven iteration; optional additional storage/browser isolation captures may strengthen the submission.

**What is the shortest credible path to final completion?** Create the three role profiles → configure live AI → run the AI matrix → execute security/access tests → validate with three real testers → implement the biggest feedback changes → retest → capture evidence → finalize deck/video → submit Review 2.
