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
   ├── Update cleaning progress
   └── Submit after-cleaning evidence
   ▼
Authority Verification
   │
   ├── Compare before / after evidence
   ├── Human verification checklist
   └── Approve or request correction
   ▼
Resolved / Correction Loop
```

### Core design principle

**Cleaning Completed ≠ Resolved.**

Staff can report completed work and provide evidence, but the final resolution decision belongs to the authority.

---

## 7. Review 1 Implementation

The current public repository contains a substantial working prototype, including:

### Application foundation

- React 19 + TypeScript application.
- Vite production build.
- Tailwind CSS interface.
- Shared layout and navigation.
- React Router routing.
- Protected application routes.
- Logout flow.

### Authentication and roles

- Supabase Authentication.
- Profile-based role routing.
- Reporter workspace.
- Authority workspace.
- Cleaning staff workspace.
- Role-aware access control in the application.

### Reporter workflow

- Create waste report.
- Location validation.
- Description validation.
- Additional information field.
- Before-cleaning evidence requirement for new reports.
- JPG/PNG/WebP evidence support.
- Evidence size validation.
- Drag-and-drop upload interface.
- Supabase Storage upload.
- Report submission.
- Reporter dashboard.
- Search/filter/status views.
- Eligible report editing.

### Authority workflow

- View submitted reports.
- Search/filter/sort.
- Review report details.
- View before evidence.
- Assign cleaning staff.
- Review staff-submitted after evidence.
- Compare before/after evidence.
- Human verification checklist.
- Approve and resolve.
- Request correction/reopen through the workflow.
- Preserve authority review history.

### Cleaning staff workflow

- View assigned tasks.
- Search/filter/sort tasks.
- Start cleaning.
- Update cleaning status.
- View before evidence.
- Upload after-cleaning evidence.
- Submit work for authority review.
- See authority feedback/correction state.

### Evidence and workflow visibility

- Evidence history.
- Review history.
- Status normalization for workflow aliases.
- Periodic refresh.
- Realtime/polling support in workflow dashboards.
- Clear distinction between active and resolved reports.

---

## 8. End-to-End Prototype Workflow

The Review 1 prototype was exercised with controlled test accounts and test data across the three application roles.

```text
Reporter
  ↓
Create report
  ↓
Upload before evidence
  ↓
Authority receives report
  ↓
Authority assigns Test Staff
  ↓
Staff receives assigned task
  ↓
Staff updates cleaning workflow
  ↓
Staff submits after evidence
  ↓
Authority sees both evidence files
  ↓
Authority compares before / after
  ↓
Human verification checklist
  ↓
Approve & Resolve / Request Correction
```

### Test-data qualification

The end-to-end test used controlled prototype data and test evidence images. The same image was used for the before/after fixture in this functional test. Therefore this test demonstrates **workflow behavior**, not proof that a real campus cleaning operation occurred or that the physical waste condition improved.

This distinction is intentional and is part of the project's evidence-integrity policy.

---

## 9. Human-in-the-Loop Design

WasteVoice AI is designed to assist humans rather than replace them.

| Role | Human responsibility |
|---|---|
| Reporter | Provides and corrects the report information. |
| Cleaning staff | Performs the physical task and submits completion evidence. |
| Authority | Reviews evidence and makes the final resolution decision. |

### Planned AI safety behavior

When AI inference is integrated, it should:

- structure information from the user's description;
- preserve unknown fields instead of inventing them;
- return validated structured output;
- allow reporter correction;
- expose uncertainty where appropriate;
- never decide final workflow status;
- never autonomously declare a physical cleanup successful.

---

## 10. User Roles

### Reporter

- Create a report.
- Enter location and description.
- Upload before-cleaning evidence.
- View submitted reports.
- Track status.
- Edit an eligible report.

### Authority

- Review reports.
- View evidence.
- Assign staff.
- Review after-cleaning evidence.
- Compare evidence.
- Approve or request correction.
- Resolve the report after human verification.

### Cleaning Staff

- View assigned tasks.
- Start cleaning work.
- Update task status.
- Upload after-cleaning evidence.
- Submit work for verification.
- Respond to correction requests.

---

## 11. Technical Architecture

The current Review 1 application is a client application backed by Supabase services. The planned AI layer is intentionally separated from the current human-controlled workflow.

```text
┌───────────────────────┐
│ Reporter / Authority  │
│ / Cleaning Staff      │
└──────────┬────────────┘
           │ Web UI
           ▼
┌───────────────────────┐
│ React + TypeScript    │
│ Vite + Tailwind       │
│ Role-aware routing    │
└──────────┬────────────┘
           │ Supabase client
           ▼
┌─────────────────────────────────────┐
│ Supabase                            │
│ Auth │ PostgreSQL │ Storage │ RPCs │
└──────────┬──────────────────────────┘
           │
           ▼
┌───────────────────────┐
│ Evidence + workflow  │
│ state + review history│
└───────────────────────┘

Future server-side AI layer:
User description → validation/pre-processing → AI structuring →
validated structured output → reporter confirmation → workflow
```

The broader C29 AI architecture follows the required conceptual pattern of real-world source → data acquisition → pre-processing → AI/ML engine → decision logic → user interface, with a human feedback loop. The current Review 1 implementation does not claim that every future AI block is already deployed.

---

## 12. Technology Stack

| Layer | Technology |
|---|---|
| Frontend | React 19 + TypeScript |
| Build tool | Vite 8 |
| Styling | Tailwind CSS 4 |
| Routing | React Router 7 |
| Backend/data services | Supabase |
| Database | PostgreSQL via Supabase |
| Authentication | Supabase Auth |
| Evidence storage | Supabase Storage |
| AI | Planned server-side language-processing integration |
| Quality checks | ESLint + TypeScript build + Vite production build |
| CI | GitHub Actions lint/build workflow |

---

## 13. Application Structure

```text
wastevoice-ai/
├── README.md
├── package.json
├── src/
│   ├── components/
│   │   ├── auth/
│   │   └── layout/
│   ├── data/
│   ├── lib/
│   ├── pages/
│   │   ├── HomePage.tsx
│   │   ├── LoginPage.tsx
│   │   ├── CreateReportPage.tsx
│   │   ├── ReporterDashboard.tsx
│   │   ├── AuthorityDashboard.tsx
│   │   └── StaffDashboard.tsx
│   └── types/
├── docs/
│   ├── project-source-of-truth.md
│   ├── architecture.md
│   ├── database-schema.md
│   ├── ai-integration.md
│   ├── ai-usage-audit.md
│   ├── testing.md
│   ├── validation.md
│   └── review-1-report.md
├── supabase/
│   └── README.md
└── .github/
    └── workflows/
        └── ci.yml
```

---

## 14. Data and Supabase Contract

The frontend currently works against the following application-level data contract:

- `profiles`
- `reports`
- `report_evidence`
- `report_assignments`
- `authority_reviews`

Key workflow mutations use protected database functions/RPCs rather than trusting arbitrary client-side state changes.

### Evidence storage

Reporter before evidence uses a structured storage path similar to:

```text
reports/{user-id}/{report-id}/before_{safe-file-name}.{extension}
```

The frontend uses the Supabase publishable client key. Service-role credentials and database passwords must never be placed in frontend source or committed to Git.

For the exact connected-project contract and setup notes, see [`supabase/README.md`](supabase/README.md) and [`docs/database-schema.md`](docs/database-schema.md).

---

## 15. Evidence Handling

Evidence is a first-class part of the workflow.

### Before-cleaning evidence

The reporter supplies evidence when creating a new report.

### After-cleaning evidence

Cleaning staff supplies evidence after performing the physical task.

### Authority verification

Authority compares the available evidence before making the final decision.

The interface includes explicit human verification checks such as:

- same reported area;
- issue addressed;
- evidence clear enough for a responsible decision.

This is designed to prevent an uploaded image from automatically becoming a resolution decision.

---

## 16. AI Status and Future Integration

### Current status: AI inference layer pending

The product name is **WasteVoice AI**, and the C29 ideation selected an AI-assisted direction, but the current public Review 1 implementation should **not** be interpreted as a completed server-side LLM integration.

### Planned AI responsibilities

The future server-side AI layer may assist with:

- natural-language report understanding;
- structured field extraction;
- guided reporting;
- category assistance;
- uncertainty-aware suggestions;
- optional image understanding;
- later-stage prioritisation or visibility features after sufficient data exists.

### Explicitly not claimed at Review 1

- No completed server-side LLM integration is claimed.
- No AI accuracy percentage is claimed.
- No automatic waste-image detection accuracy is claimed.
- No predictive cleanup model is claimed.
- No anomaly-detection performance is claimed.
- No autonomous staff assignment is claimed.
- No automatic resolution decision is claimed.

This boundary is intentional: the repository documents what exists rather than using the word “AI” as a substitute for implementation evidence.

---

## 17. Testing and Validation

### Build verification

A local production build was successfully executed on the current development machine:

```bash
npm run build
```

The build completed TypeScript compilation and the Vite production build. Vite reported a large JavaScript chunk warning; this is a performance optimization item, not a build failure.

### End-to-end functional test

A controlled end-to-end prototype test was performed using test accounts for:

- Reporter
- Authority
- Cleaning Staff

The tested path included report creation, evidence upload, authority assignment, staff task handling, after-evidence submission, evidence comparison, and authority verification controls.

### Test evidence

The corresponding local evidence set is organized with the following filenames:

```text
01_homepage.png
02_authority_login.png
03_authority_dashboard.png
04_authority_report_assignment.png
05_authority_verification_workspace.png
06_evidence_comparison.png
07_staff_dashboard.png
08_reporter_dashboard.png
```

These screenshots document prototype behavior. They do not constitute proof of real-world cleaning impact.

### Tests still requiring systematic evidence

- Role/RLS verification against the connected Supabase project.
- More systematic edge-case testing.
- Three-user validation using retained tester interaction evidence.
- AI reliability testing after the AI layer is implemented.

See [`docs/testing.md`](docs/testing.md) for the detailed test matrix.

---

## 18. Security and Privacy

The project follows these basic security boundaries:

- Local environment files are ignored by Git.
- Supabase publishable client configuration is kept in environment variables.
- Service-role keys and database passwords are not placed in the frontend.
- Role-aware application routing is used for user workspaces.
- Sensitive workflow mutations use protected backend/database functions.
- Evidence and account information should be handled only through the intended authenticated workflow.
- Field recordings must respect consent and privacy requirements.

The C29 guidance requires privacy-conscious handling of faces, ID cards, vehicle numbers and account details. Such information should be blurred or excluded where applicable.

---

## 19. Responsible AI and Academic Integrity

WasteVoice AI follows the C29 principle that AI is a **co-pilot, not the author**.

### Project integrity rules

- Field observations must come from the team's own investigation.
- AI-generated claims must be verified before becoming project evidence.
- External sources must be checked before citation.
- Proposed functionality must not be described as completed functionality.
- Test results must come from actual execution.
- AI-generated output must remain subject to human review.
- Personal or sensitive information should not be unnecessarily exposed.

### AI use documentation

The repository includes:

- [`docs/ai-usage-audit.md`](docs/ai-usage-audit.md)
- [`docs/ai-integration.md`](docs/ai-integration.md)

These documents separate AI-assisted project work from implemented application functionality.

For the original C29 AI Immersion deliverables, the guide requires declaration of AI tools, their purpose, and a sample prompt, alongside the required E1–E4 evidence recordings and final-deck/video declaration.

---

## 20. Review 1 Completion Status

| Review 1 requirement | Current status |
|---|---|
| Public GitHub repository | ✅ Complete |
| Clear project README | ✅ Complete |
| Problem and evidence documented | ✅ Complete |
| Key modules/features documented | ✅ Complete |
| Current implementation documented | ✅ Complete |
| Build verified locally | ✅ Complete |
| Reporter workflow tested | ✅ Complete as controlled prototype test |
| Authority workflow tested | ✅ Complete as controlled prototype test |
| Staff workflow tested | ✅ Complete as controlled prototype test |
| Evidence workflow tested | ✅ Complete as controlled prototype test |
| Human verification workflow tested | ✅ Complete as controlled prototype test |
| Server-side AI inference | ⏳ Pending |
| Systematic RLS/runtime security verification | ⏳ Pending |
| Three-user validation evidence | ⏳ Retain/verify tester evidence before claiming complete |
| Production deployment | ⏳ Pending |

> **Important:** “Complete” here means the implementation/test scope described in this table was actually demonstrated. It does not mean the project has already achieved real-world impact.

---

## 21. Pending Work and Next Steps

### Immediate next steps

1. Retain the Review 1 screenshots and test records.
2. Verify the connected Supabase tables, RLS policies and RPC signatures.
3. Keep systematic Reporter/Authority/Staff test evidence.
4. Confirm any three-user validation records against retained tester evidence.

### AI integration

5. Implement the server-side AI report-structuring layer.
6. Validate structured output against a schema.
7. Test complete, incomplete and vague descriptions.
8. Preserve uncertainty instead of inventing missing facts.
9. Require reporter confirmation before AI-derived information becomes part of a report.

### Later enhancements

10. Optional image understanding.
11. Voice and multilingual reporting.
12. Better evidence comparison.
13. Prediction after sufficient historical data exists.
14. Anomaly detection after sufficient data exists.
15. Practical bundle-size optimization.
16. Production deployment and monitoring.

---

## 22. Local Setup

### Prerequisites

- Node.js
- npm
- A Supabase project
- Git

### Install

```bash
npm install
```

### Development

```bash
npm run dev
```

### Lint

```bash
npm run lint
```

### TypeScript/build verification

```bash
npm run build
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
- [`supabase/README.md`](supabase/README.md) — Supabase setup notes.

---

## Final Project Statement

WasteVoice AI is not presented as a finished autonomous AI waste-management system. At Review 1, it is a working human-controlled prototype that makes the reporting, assignment, evidence and verification process more structured and visible.

The next engineering step is to add and validate the server-side AI layer without weakening the project's evidence integrity, privacy boundaries, or human decision points.

> **See the problem. Structure the report. Track the work. Verify the result.**
