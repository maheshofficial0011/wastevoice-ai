# WasteVoice AI ♻️

## AI-Assisted Campus Waste Reporting & Resolution Tracking

> **Project Better Tomorrow · C29 · Semester 3 · Pathway A — Continuation Track**
>
> **Report → Review → Assign → Clean → Evidence → Verify → Resolve**

[![Build](https://img.shields.io/badge/build-Vite%20%2B%20TypeScript-646CFF)](https://vite.dev/)
[![Frontend](https://img.shields.io/badge/frontend-React-61DAFB)](https://react.dev/)
[![Data](https://img.shields.io/badge/data-Supabase-3ECF8E)](https://supabase.com/)
[![Status](https://img.shields.io/badge/status-Review%202%20prototype-informational)](https://github.com/maheshofficial0011/wastevoice-ai)

WasteVoice AI is a student-built web application prototype for turning an informal campus waste observation into a structured, evidence-backed workflow. It helps a reporter submit an issue, allows an authority to review and assign it, gives cleaning staff a task and evidence workflow, and keeps final resolution under human authority verification.

The project continues the problem investigated during the C29 AI Immersion activity. Field observation identified accumulated waste in a campus park, while stakeholder evidence indicated uncertainty around whom to contact, how to report an issue, and when cleanup would happen.

> **Evidence integrity principle:** this repository deliberately distinguishes verified field evidence, stakeholder evidence, implemented software functionality, actual test results, and externally blocked or proposed capabilities.

---

## Table of Contents

- [1. Project at a Glance](#1-project-at-a-glance)
- [2. Problem Context](#2-problem-context)
- [3. Verified Field Evidence](#3-verified-field-evidence)
- [4. Problem Definition](#4-problem-definition)
- [5. C29 Ideation and Solution Selection](#5-c29-ideation-and-solution-selection)
- [6. Selected Solution](#6-selected-solution)
- [7. Current Prototype](#7-current-prototype)
- [8. End-to-End Prototype Workflow](#8-end-to-end-prototype-workflow)
- [9. Human-in-the-Loop Design](#9-human-in-the-loop-design)
- [10. User Roles](#10-user-roles)
- [11. Technical Architecture](#11-technical-architecture)
- [12. Technology Stack](#12-technology-stack)
- [13. Application Structure](#13-application-structure)
- [14. Data and Supabase Contract](#14-data-and-supabase-contract)
- [15. Evidence Handling](#15-evidence-handling)
- [16. AI-Assisted Report Structuring](#16-ai-assisted-report-structuring)
- [17. Testing and Validation](#17-testing-and-validation)
- [18. Security and Privacy](#18-security-and-privacy)
- [19. Responsible AI and Academic Integrity](#19-responsible-ai-and-academic-integrity)
- [20. Review 2 Readiness](#20-review-2-readiness)
- [21. Next Review 2 Actions](#21-next-review-2-actions)
- [22. Local Setup](#22-local-setup)
- [23. Environment Configuration](#23-environment-configuration)
- [24. Submission Links](#24-submission-links)

---

## 1. Project at a Glance

| Item | Details |
|---|---|
| Project | **WasteVoice AI** |
| Programme | Project Better Tomorrow · C29 Semester 3 |
| Track | Pathway A — Continuation Track |
| Problem domain | Campus waste reporting and resolution visibility |
| Current stage | **Review 2 prototype + validation** |
| Core workflow | Report → Review → Assign → Clean → Evidence → Verify → Resolve |
| Frontend | React + TypeScript + Vite |
| Styling | Tailwind CSS |
| Backend/data | Supabase |
| Database | PostgreSQL via Supabase |
| Authentication | Supabase Auth |
| Storage | Supabase Storage |
| AI layer | **Assisted report structuring with human confirmation** |
| Repository | `maheshofficial0011/wastevoice-ai` |

---

## 2. Problem Context

WasteVoice AI continues a campus problem investigated during the earlier C29 AI Immersion work: unmanaged waste in a campus park and a reporting/follow-up gap around that waste.

The project is intentionally bounded. It does **not** claim that software alone can clean a campus, guarantee cleanup times, replace cleaning staff, or prove a reduction in waste.

### Working project goal

> To design and prototype an AI-assisted campus waste reporting system that helps users submit structured reports about unmanaged waste and makes reported issues more visible for human review and follow-up.

---

## 3. Verified Field Evidence

The following evidence was carried forward from the C29 field investigation:

- **Location:** a park inside the campus.
- Approximately **4 waste accumulation points** were observed.
- Waste appeared to have remained uncleared for approximately **1 week** during the visit.
- Approximately **8–10 people** were observed passing during the visit.
- Stakeholder evidence indicated that waste removal may generally take approximately **2–3 weeks**.
- People may not always know whom to contact about the waste issue.
- People may not know when the issue will be cleaned.

These observations are deliberately not presented as daily population counts, official service-level measurements, exact waste volume, or causal proof.

### Evidence classification

Project claims follow five categories:

1. **Verified Field Evidence** — directly observed during the field work.
2. **Stakeholder Evidence** — information obtained through stakeholder interaction.
3. **Implemented Functionality** — present in the repository and testable.
4. **Test Result** — supported by an actual execution/test record.
5. **Proposed Feature** — future work only.

No assumption is promoted to field evidence, and no planned feature is described as implemented. AI functionality is described according to its actual deployed and verified state.

---

## 4. Problem Definition

### Refined problem statement

**Students and campus users are affected by accumulated waste in the campus park, and the current response may be delayed because people do not always know how to report the problem or when it will be addressed.**

The investigation identified a practical information and workflow gap rather than treating the problem as an autonomous-cleaning problem.

### Root-cause and stakeholder analysis

The C29 analysis included:

- Five Whys analysis.
- Man / Machine / Method / Material / Measurement / Milieu cause categories.
- Primary, secondary and tertiary stakeholder mapping.
- Frequency, magnitude and reach considerations.
- Existing approaches and the reporting/follow-up gap.

Detailed project reasoning is retained in the project documentation rather than being hidden behind the software implementation.

---

## 5. C29 Ideation and Solution Selection

The ideation stage followed the required eight AI directions:

1. **Sense**
2. **Predict**
3. **Understand language**
4. **Optimise**
5. **Detect anomalies**
6. **Assist a user**
7. **Automate a step**
8. **Make an invisible problem visible**

The C29 scoring framework used the required weighted criteria:

| Criterion | Weight |
|---|---:|
| Impact on the observed problem | 30% |
| Technical feasibility | 25% |
| Data availability | 15% |
| Cost and sustainability | 15% |
| Ethics, privacy and risk | 15% |

Each idea was considered on a 1–5 scale using the C29 definitions. The decision prioritized concepts that could be prototyped responsibly with available data rather than relying on unverified historical datasets.

### Eight concepts considered

| Direction | Concept |
|---|---|
| Sense | **AI Waste Image Detector** |
| Predict | **Waste Accumulation Trend Predictor** |
| Understand language | **WasteVoice AI — Natural Language Report Understanding** |
| Optimise | **Waste Report Priority Assistant** |
| Detect anomalies | **Waste Hotspot Anomaly Detector** |
| Assist a user | **Guided Waste Reporting Assistant** |
| Automate a step | **Automatic Structured Report Generator** |
| Make invisible problem visible | **Campus Waste Report Visibility Dashboard** |

### Selected solution

**WasteVoice AI — AI-Powered Campus Waste Reporter**

The selected direction integrates guided reporting, natural-language understanding, structured report generation, visibility, evidence and human verification around one human-controlled workflow.

### Runner-up

**AI Waste Image Detector**

It was not selected as the overall solution because image analysis alone addresses only one part of the broader reporting and information gap identified during the field and stakeholder investigation.

> The detailed E4 recording and scoring evidence remain the authoritative source for the original ideation exercise; this README summarizes the decision rather than inventing a new scoring record.

---

## 6. Selected Solution

WasteVoice AI converts a user's informal waste observation into a structured workflow:

```text
Reporter
   │
   ├── Location + description + before evidence
   ▼
Authority Review
   │
   ├── Review report and evidence
   └── Assign cleaning staff
   ▼
Cleaning Staff
   │
   ├── Update work status
   └── Upload after-cleaning evidence
   ▼
Authority Verification
   │
   ├── Compare evidence
   └── Approve or request correction
   ▼
Resolved
```

The workflow keeps the human role explicit at each important decision point.

---

## 7. Current Prototype

The current prototype includes:

- Role-aware authentication with Supabase Auth.
- Protected reporter, authority and staff routes.
- Reporter report creation with input validation.
- Before-cleaning evidence upload to Supabase Storage.
- Reporter dashboard with report state and review information.
- Authority report review and staff assignment workflow.
- Staff task dashboard and cleaning-status workflow.
- After-cleaning evidence upload.
- Authority evidence comparison and final verification controls.
- Workflow refresh/realtime support.
- Human-readable evidence and review history.

### Current verification status

The application has been manually exercised end-to-end across Reporter, Authority and Staff. Live Gemini inference has been verified through the deployed `structure-report` Edge Function. The Staff before-evidence visibility issue was identified, fixed through Storage RLS path handling, and successfully retested. The connected Supabase project contains three mapped role profiles.

> **Evidence qualification:** these screenshots are controlled prototype-test evidence. The before/after evidence used the same image as a test fixture, so it demonstrates application workflow and evidence-handling behavior only. It must not be interpreted as proof of real-world cleaning or physical improvement.

### Runtime evidence

- [01 — Homepage](docs/evidence/01_homepage.png)
- [02 — Authority Login](docs/evidence/02_authority_login.png)
- [03 — Authority Dashboard](docs/evidence/03_authority_dashboard.png)
- [04 — Authority Report Assignment](docs/evidence/04_authority_report_assignment.png)
- [05 — Authority Verification Workspace](docs/evidence/05_authority_verification_workspace.png)
- [06 — Evidence Comparison](docs/evidence/06_evidence_comparison.png)
- [07 — Staff Dashboard](docs/evidence/07_staff_dashboard.png)
- [08 — Reporter Dashboard](docs/evidence/08_reporter_dashboard.png)

---

## 8. End-to-End Prototype Workflow

### Reporter

1. Sign in.
2. Enter waste location and description.
3. Upload before-cleaning evidence.
4. Submit the report.

### Authority

1. Review submitted report.
2. Inspect the available evidence.
3. Assign cleaning staff.
4. Open the verification workspace after staff evidence is submitted.
5. Approve or request correction.

### Cleaning Staff

1. Open the assigned task.
2. Update the cleaning status.
3. Upload after-cleaning evidence.
4. Mark the cleaning step as completed.

### Final state

The authority, not the application or AI, makes the final verification decision. **Cleaning Completed is not the same as Resolved.**

---

## 9. Human-in-the-Loop Design

WasteVoice AI does not delegate final responsibility to AI.

- **Reporter:** confirms/corrects submitted report information.
- **AI layer:** assists with structuring reporter-supplied information; output remains advisory and requires human confirmation.
- **Cleaning staff:** performs physical cleaning and supplies evidence.
- **Authority:** reviews evidence and decides whether a report is resolved.

The design intentionally keeps a human in control of workflow state changes and final resolution.

---

## 10. User Roles

| Role | Primary responsibility |
|---|---|
| Reporter | Create a waste report and provide before evidence |
| Authority | Review reports, assign staff, verify evidence and resolve/reject |
| Staff | Execute cleaning task, update status and upload after evidence |

---

## 11. Technical Architecture

```text
Reporter / Authority / Staff
            │
            ▼
     React + TypeScript + Vite
            │
            ├── Supabase Auth
            ├── Supabase Data API
            └── Supabase Storage
            │
            ▼
 PostgreSQL tables + protected RPCs
            │
            ▼
 Workflow dashboards and evidence views

Implemented Review 2 AI path:
User description → authenticated Edge Function → structured model output → server-side validation → human correction → workflow
```

The AI path is live-verified with Gemini and remains human-controlled: AI output is advisory and does not directly mutate workflow state.

---

## 12. Technology Stack

| Layer | Technology |
|---|---|
| Frontend | React 19 + TypeScript |
| Build tool | Vite |
| UI styling | Tailwind CSS |
| Routing | React Router |
| Backend/data platform | Supabase |
| Database | PostgreSQL via Supabase |
| Authentication | Supabase Auth |
| File storage | Supabase Storage |
| Workflow/security | Supabase RLS + protected RPCs |
| Realtime/refresh | Supabase realtime subscriptions and dashboard refresh logic |
| AI | **Supabase Edge Function + Gemini (`gemini-3.5-flash-lite`) with server-side secrets** |
| Quality tooling | ESLint, TypeScript, Vite production build |
| CI | GitHub Actions (`.github/workflows/quality.yml`) |
| Version control | Git + GitHub |

---

## 13. Application Structure

```text
src/
├── components/
├── pages/
│   ├── LoginPage.tsx
│   ├── CreateReportPage.tsx
│   ├── ReporterDashboard.tsx
│   ├── AuthorityDashboard.tsx
│   └── StaffDashboard.tsx
├── lib/
│   └── supabase.ts
├── App.tsx
└── main.tsx

docs/
├── review-1-report.md
├── testing.md
├── validation.md
├── architecture.md
├── database-schema.md
├── ai-integration.md
├── ai-usage-audit.md
└── evidence/
    ├── 01_homepage.png
    ├── 02_authority_login.png
    ├── 03_authority_dashboard.png
    ├── 04_authority_report_assignment.png
    ├── 05_authority_verification_workspace.png
    ├── 06_evidence_comparison.png
    ├── 07_staff_dashboard.png
    └── 08_reporter_dashboard.png

.github/
└── workflows/
    └── quality.yml
```

---

## 14. Data and Supabase Contract

The current frontend workflow expects application data centered on:

- `profiles`
- `reports`
- `report_evidence`
- `report_assignments`
- `authority_reviews`

Key workflow mutations are designed around protected RPCs rather than trusting client-side role fields alone.

The repository's Supabase documentation is the current setup reference. Frontend configuration uses the Vite publishable key rather than a service-role secret.



### API and Workflow Operation Contract

WasteVoice AI currently uses Supabase Auth, the Supabase Data API, Supabase Storage, and protected PostgreSQL RPC operations rather than a separate REST backend maintained in this repository.

#### Authentication

| Operation | Purpose |
|---|---|
| Supabase Auth sign-in/session | Authenticate Reporter, Authority and Staff users |
| Supabase Auth user lookup | Identify the current authenticated user |

#### Application data resources

| Resource | Purpose |
|---|---|
| `profiles` | Stores the user's application profile and role |
| `reports` | Stores canonical waste-report records |
| `report_evidence` | Stores before/after evidence associated with reports |
| `report_assignments` | Stores staff assignment records |
| `authority_reviews` | Stores authority review and verification records |

#### Protected workflow operations

| RPC operation | Responsible role | Purpose |
|---|---|---|
| `reporter_update_report` | Reporter | Update an eligible report |
| `assign_report_to_staff` | Authority | Assign a report to cleaning staff |
| `staff_update_task_status` | Staff | Update cleaning task status |
| `authority_review_report` | Authority | Record an authority review/verification decision |

The following signatures were verified against the connected Supabase project on 04 October 2026:

- reporter_update_report(p_report_id uuid, p_location text, p_description text, p_additional_info text)
- assign_report_to_staff(p_report_id uuid, p_staff_id uuid)
- staff_update_task_status(p_assignment_id uuid, p_status text)
- authority_review_report(p_report_id uuid, p_decision text, p_reason text, p_notes text)

#### Evidence storage

The current evidence storage bucket is:

```text
waste-evidence
```

The bucket is private and the client resolves evidence references through short-lived signed URLs.

---

## 15. Evidence Handling

The prototype treats evidence as a first-class part of the workflow.

- Reporter supplies **before-cleaning evidence** when creating a new report.
- Staff can supply **after-cleaning evidence** during task completion.
- Authority can inspect evidence and use it during human verification.
- The system retains review/evidence history in the workflow UI.

Test evidence is clearly separated from real-world impact claims.

---

## 16. AI-Assisted Report Structuring

### Current status

The first AI milestone is a narrow, human-confirmed report-structuring capability. It should suggest structured information from the reporter's own description without inventing unsupported facts.

### AI responsibilities

1. Understand natural-language descriptions.
2. Extract explicit structured fields.
3. Preserve unknown or missing values rather than inventing them.
4. Provide advisory suggestions that the reporter can correct.
5. Keep workflow decisions human controlled.

### Safety constraints

- Server-side AI only.
- No API keys in client code.
- No fabricated missing fields.
- Human correction before workflow use.
- AI never changes workflow status.
- AI never makes the final resolution decision.

### Suggested structured output

```json
{
  "category": "plastic | paper | food | mixed | unknown",
  "location": "string | unknown",
  "summary": "string",
  "missingFields": ["string"],
  "needsConfirmation": true
}
```

The deployed server-side function uses the native Gemini REST API with `gemini-3.5-flash-lite`. The provider credential is kept in Supabase Edge Function secrets.

---

### Live Gemini verification

The deployed `structure-report` function returned HTTP 200 with `source=gemini`, `providerConfigured=true`, model `gemini-3.5-flash-lite`, a structured category/location/summary/missing-field result, and `needsConfirmation=true`.

Reporter can **copy the AI-generated structured summary for use in the reporting workflow**. The action does not apply a workflow decision.

## 17. Testing and Validation

### Automated quality

- `npm test`: **29/29 passed** (11 AI + 8 form-validation + 10 Review 2 regression/guard tests).
- `npm run build`: **PASS** — TypeScript compilation and Vite production build; 83 modules transformed.
- Vite emitted one non-blocking chunk-size optimization warning (>500 kB).
- `npm audit`: **0 known package vulnerabilities reported by npm**.
- GitHub Actions run #166 is recorded as the green 29-test quality gate for this documentation audit.

### Manual browser validation

The complete workflow was manually exercised:

**Reporter → Report → Authority Review → Staff Assignment → Staff Cleaning → After Evidence → Authority Verification → Resolution → Reporter resolved state**

Reporter, Authority and Staff login/workflow behavior passed. Reporter AI Assist was tested with the documented College Canteen input; the structured result displayed correctly and **Copy structured summary** worked.

The Error Boundary was also runtime-tested with a temporary controlled error and restored afterward.

Manual browser-level accessibility/usability checks passed for Login, New Report and AI Assist. These are not formal WCAG certification results.

### Still pending / external

- Three genuine external Review 2 tester sessions and the resulting feedback → change → retest evidence.
- Cross-staff negative browser validation using a second Staff identity; only one Staff identity is currently available.
- Any final recording/evidence artifact explicitly required by the official C29 submission process. No recording is claimed.

---

## 18. Security and Privacy

- Authentication is handled through Supabase Auth.
- Protected application routes are role-aware.
- Client-side configuration uses the publishable Supabase key.
- Service-role/database credentials are not intended for frontend use.
- RLS and protected RPCs are enabled for the core workflow.
- Security hardening has been applied and verified against the connected Supabase configuration.
- Database role-negative runtime tests are verified.
- Evidence buckets are private and evidence references are resolved through signed URLs.
- `npm audit` reports 0 known package vulnerabilities. This is a package-vulnerability result, not a complete security certification.
- Supabase advisor warnings remain documented for SECURITY DEFINER helpers and leaked-password protection.

---

## 19. Responsible AI and Academic Integrity

This project distinguishes between:

- student-owned field evidence,
- stakeholder evidence,
- implemented software,
- actual test results,
- proposed AI behavior.

AI assistance is treated as a co-pilot for development and documentation support, not as a substitute for field evidence or student judgment. Conclusions should remain defendable by the project team, and sources/claims should be verified before final submission.

---

## 20. Review 2 Readiness

### Completed / demonstrated

- Public GitHub repository.
- Clear problem context and carried-forward field evidence.
- C29 ideation directions and solution-selection rationale.
- React/TypeScript/Vite prototype.
- Supabase authentication and data/storage integration.
- Reporter → Authority → Staff → Verification workflow.
- Before/after evidence handling.
- Role-aware dashboards.
- Controlled runtime test with retained screenshots.
- Review 1 report and testing documentation.
- Review 2 AI Assist implementation and live Gemini inference.
- Private evidence storage and signed URL handling, including hardening of the legacy report-evidence bucket.
- Live database authorization and storage role-boundary probes.
- 29 automated tests, successful production build and npm dependency audit.
- Manual end-to-end Reporter/Authority/Staff validation, Error Boundary runtime test and selected accessibility checks.
- Review 2 status, validation plan and completion roadmap.

### Remaining before final Review 2 submission

- Conduct three genuine external Review 2 tester sessions and complete feedback → change → retest.
- Optionally add a second Staff identity to validate cross-staff isolation manually.
- Complete only the final presentation/recording/evidence artifacts that are actually required by the C29 submission process.

No external tester, recording, production-impact metric, or AI-accuracy percentage is claimed here.

---

## 21. Next Review 2 Actions

1. Conduct and retain three genuine external Review 2 tester sessions.
2. Record the actual feedback → change → retest loop.
3. Optionally add a second Staff identity for cross-staff isolation testing.
4. Complete only the final presentation/recording/evidence artifacts explicitly required by the official C29 process.

---

## 22. Local Setup

```bash
npm install
npm run dev
```

For a production build:

```bash
npm run build
```

For linting:

```bash
npm run lint
```

The development server normally runs at the local Vite URL printed by the terminal.

---

## 23. Environment Configuration

Create a local environment file based on the project's expected Vite variables.

```env
VITE_SUPABASE_URL=your-supabase-project-url
VITE_SUPABASE_PUBLISHABLE_KEY=your-supabase-publishable-key
```

Do **not** commit `.env`, `.env.*`, or service-role/database credentials.

The frontend client intentionally uses the Supabase publishable key. The live Gemini configuration is server-side through Supabase Edge Function secrets (`AI_PROVIDER`, `AI_MODEL`, and `GEMINI_API_KEY`). See [`supabase/README.md`](supabase/README.md) for the current setup contract.

---

## 24. Submission Links

### Public GitHub repository

**https://github.com/maheshofficial0011/wastevoice-ai**

### Important documentation
- [`docs/review-2-report.md`](docs/review-2-report.md) — Review 2 project report.
- [`docs/review-2-live-setup.md`](docs/review-2-live-setup.md) — live AI/database setup and validation checklist.
- [`docs/architecture-review2.svg`](docs/architecture-review2.svg) — Review 2 technical block diagram.

- [`docs/review-1-report.md`](docs/review-1-report.md) — Review 1 progress report.
- [`docs/testing.md`](docs/testing.md) — testing matrix and evidence rules.
- [`docs/validation.md`](docs/validation.md) — validation evidence records and requirements.
- [`docs/architecture.md`](docs/architecture.md) — technical architecture.
- [`docs/database-schema.md`](docs/database-schema.md) — application data contract.
- [`docs/ai-integration.md`](docs/ai-integration.md) — AI integration, live Gemini validation and safety specification.
- [`docs/final-review-2-execution-status.md`](docs/final-review-2-execution-status.md) — current Review 2 status ledger.
- [`docs/evidence/`](docs/evidence/) — Review 2 technical evidence records and evidence index.
- [`docs/ai-usage-audit.md`](docs/ai-usage-audit.md) — AI usage and integrity record.
- [`docs/evidence/`](docs/evidence/) — controlled runtime screenshots for Review 1.
- [`supabase/README.md`](supabase/README.md) — Supabase setup notes.

---

## Final Project Statement

WasteVoice AI is not presented as a finished autonomous AI waste-management system. For Review 2, it is a working human-controlled prototype with live Gemini-assisted report structuring, evidence-backed workflow tracking and human verification. Real-world environmental impact and external-user validation are not claimed without corresponding evidence.


---

## Documentation synchronization

This documentation was audited and synchronized after final validation on **04 October 2026**. The validation baseline was repository HEAD `dd10705` (`dd10705601817d2c91ab83ab28d2ee930512e114`). A later documentation-only commit may update the branch tip; no secrets or passwords are included.
