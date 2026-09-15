# WasteVoice AI ♻️

## AI-Assisted Campus Waste Reporting & Resolution Tracking

> **Project Better Tomorrow · C29 · Semester 3 · Pathway A — Continuation Track**
>
> **Report → Review → Assign → Clean → Evidence → Verify → Resolve**

[![Build](https://img.shields.io/badge/build-Vite%20%2B%20TypeScript-646CFF)](https://vite.dev/)
[![Frontend](https://img.shields.io/badge/frontend-React-61DAFB)](https://react.dev/)
[![Data](https://img.shields.io/badge/data-Supabase-3ECF8E)](https://supabase.com/)
[![Status](https://img.shields.io/badge/status-Review%201%20prototype-success)](https://github.com/maheshofficial0011/wastevoice-ai)

WasteVoice AI is a student-built web application prototype for turning an informal campus waste observation into a structured, evidence-backed workflow. It helps a reporter submit an issue, allows an authority to review and assign it, gives cleaning staff a task and evidence workflow, and keeps final resolution under human authority verification.

The project continues the problem investigated during the C29 AI Immersion activity. Field observation identified accumulated waste in a campus park, while stakeholder evidence indicated uncertainty around whom to contact, how to report an issue, and when cleanup would happen.

> **Review 1 accuracy principle:** this repository deliberately distinguishes verified field evidence, stakeholder evidence, implemented software functionality, actual test results, and proposed AI features. Planned AI capability is not presented as completed functionality.

---

## Table of Contents

- [1. Project at a Glance](#1-project-at-a-glance)
- [2. Problem Context](#2-problem-context)
- [3. Verified Field Evidence](#3-verified-field-evidence)
- [4. Problem Definition](#4-problem-definition)
- [5. C29 Ideation and Solution Selection](#5-c29-ideation-and-solution-selection)
- [6. Selected Solution](#6-selected-solution)
- [7. Review 1 Implementation](#7-review-1-implementation)
- [8. End-to-End Prototype Workflow](#8-end-to-end-prototype-workflow)
- [9. Human-in-the-Loop Design](#9-human-in-the-loop-design)
- [10. User Roles](#10-user-roles)
- [11. Technical Architecture](#11-technical-architecture)
- [12. Technology Stack](#12-technology-stack)
- [13. Application Structure](#13-application-structure)
- [14. Data and Supabase Contract](#14-data-and-supabase-contract)
- [15. Evidence Handling](#15-evidence-handling)
- [16. AI Status and Future Integration](#16-ai-status-and-future-integration)
- [17. Testing and Validation](#17-testing-and-validation)
- [18. Security and Privacy](#18-security-and-privacy)
- [19. Responsible AI and Academic Integrity](#19-responsible-ai-and-academic-integrity)
- [20. Review 1 Completion Status](#20-review-1-completion-status)
- [21. Pending Work and Next Steps](#21-pending-work-and-next-steps)
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
| Current stage | **Review 1 prototype** |
| Core workflow | Report → Review → Assign → Clean → Evidence → Verify → Resolve |
| Frontend | React + TypeScript + Vite |
| Styling | Tailwind CSS |
| Backend/data | Supabase |
| Database | PostgreSQL via Supabase |
| Authentication | Supabase Auth |
| Storage | Supabase Storage |
| AI layer | **Planned / pending server-side integration** |
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

No assumption is promoted to field evidence, and no planned feature is described as implemented.

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

The selected direction integrates guided reporting, natural-language understanding, structured report generation, visibility, and optional image understanding around one human-controlled workflow.

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

## 7. Review 1 Implementation

The current Review 1 prototype includes:

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

The application has been exercised with controlled test accounts/data across the three roles. The screenshots in [`docs/evidence/`](docs/evidence/) document the tested workflow states.

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
- **AI layer (planned):** assists with structuring information and identifying possible details; output remains advisory.
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

Planned future path:
User description → server-side AI → validated structured output → human correction → workflow
```

The planned AI path is intentionally shown separately from the current implemented runtime so that the repository does not imply a completed LLM integration.

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
| AI | **Planned server-side integration; provider/model not claimed yet** |
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

---

## 15. Evidence Handling

The prototype treats evidence as a first-class part of the workflow.

- Reporter supplies **before-cleaning evidence** when creating a new report.
- Staff can supply **after-cleaning evidence** during task completion.
- Authority can inspect evidence and use it during human verification.
- The system retains review/evidence history in the workflow UI.

Test evidence is clearly separated from real-world impact claims.

---

## 16. AI Status and Future Integration

### Current status

The AI inference layer is **not yet integrated into the public runtime**. It is therefore not presented as complete.

### Planned AI responsibilities

1. Understand natural-language descriptions.
2. Extract explicit structured fields.
3. Preserve unknown or missing values rather than inventing them.
4. Provide advisory suggestions that the reporter can correct.
5. Support later image understanding only after the core workflow is validated.

### Safety constraints

- Server-side AI only.
- No API keys in client code.
- No fabricated missing fields.
- Human correction before workflow use.
- AI never makes the final resolution decision.

---

## 17. Testing and Validation

### Verified locally

- `npm run lint` is configured as a quality check.
- `npm run build` successfully completed TypeScript compilation and Vite production build on the development machine.
- The build emitted a large JavaScript chunk warning; this remains an optimization item.

### Controlled runtime test

A three-role controlled workflow was exercised on **15 September 2026**:

**Reporter → Authority → Staff → After Evidence → Authority Verification**

The supporting screenshots are stored in [`docs/evidence/`](docs/evidence/).

### Still pending

- Systematic role/RLS access tests.
- Explicit validation of connected Supabase table/RPC signatures against the deployment.
- Formal retained three-user validation evidence.
- AI edge-case/reliability tests after AI integration.
- Production deployment verification.

---

## 18. Security and Privacy

- Authentication is handled through Supabase Auth.
- Protected application routes are role-aware.
- Client-side configuration uses the publishable Supabase key.
- Service-role/database credentials are not intended for frontend use.
- RLS and protected RPCs remain part of the security verification work.
- The project does not claim security completeness before the pending runtime access tests are executed.

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

## 20. Review 1 Completion Status

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

### Not claimed as complete

- Server-side AI inference.
- Measured AI accuracy.
- Real-world cleanup impact.
- Production security verification.
- Production deployment.
- Formal three-user validation evidence until the underlying tester interaction is retained.

---

## 21. Pending Work and Next Steps

1. Validate connected Supabase tables, RLS and RPC signatures against the actual deployment.
2. Retain systematic Reporter/Authority/Staff role and access test evidence.
3. Complete formal tester validation evidence.
4. Implement server-side AI report structuring.
5. Test AI on complete, incomplete and vague descriptions.
6. Optimize the large frontend bundle where practical.
7. Verify production deployment.
8. Add later enhancements such as voice/multilingual reporting, image comparison, prediction and anomaly detection only after the core workflow is validated.

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

The frontend client intentionally uses the Supabase publishable key. See [`supabase/README.md`](supabase/README.md) for the current setup contract.

---

## 24. Submission Links

### Public GitHub repository

**https://github.com/maheshofficial0011/wastevoice-ai**

### Important documentation

- [`docs/review-1-report.md`](docs/review-1-report.md) — Review 1 progress report.
- [`docs/testing.md`](docs/testing.md) — testing matrix and evidence rules.
- [`docs/validation.md`](docs/validation.md) — validation evidence records and requirements.
- [`docs/architecture.md`](docs/architecture.md) — technical architecture.
- [`docs/database-schema.md`](docs/database-schema.md) — application data contract.
- [`docs/ai-integration.md`](docs/ai-integration.md) — AI integration and safety specification.
- [`docs/ai-usage-audit.md`](docs/ai-usage-audit.md) — AI usage and integrity record.
- [`docs/evidence/`](docs/evidence/) — controlled runtime screenshots for Review 1.
- [`supabase/README.md`](supabase/README.md) — Supabase setup notes.

---

## Final Project Statement

WasteVoice AI is not presented as a finished autonomous AI waste-management system. At Review 1, it is a working human-controlled prototype that makes the reporting, assignment, evidence and verification process more structured and visible.
