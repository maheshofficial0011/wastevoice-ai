# WasteVoice AI ♻️

## AI-Assisted Campus Waste Reporting & Resolution Tracking

> **Project Better Tomorrow · C29 · Semester 3 · Pathway A — Continuation Track**
>
> **Report → Review → Assign → Clean → Evidence → Verify → Resolve**

WasteVoice AI is a student-built web application prototype for making campus waste reporting structured and making the follow-up and resolution process visible to the people responsible for it.

The project continues the problem investigated during the C29 AI Immersion activity. Field observation identified accumulated waste in a campus park, while stakeholder evidence indicated uncertainty around whom to contact, how to report an issue, and when cleanup would happen.

> **Review 1 principle:** document what is actually implemented, what has been tested, and what remains pending. Do not treat planned AI capability as completed functionality.

---

## 1. Problem Context

### Defined problem statement

**Students and campus users are affected by accumulated waste in the campus park, and the current response may be delayed because people do not always know how to report the problem or when it will be addressed.**

### Verified field evidence

- Location: a park inside the campus
- Approximately **4 waste accumulation points** observed
- Waste appeared to have remained uncleared for approximately **1 week** during the visit
- Approximately **8–10 people** were observed passing during the visit
- Stakeholder evidence indicated that waste removal may generally take approximately **2–3 weeks**
- Reporting contacts and cleanup timing may not always be clear to users

These observations are not presented as daily population counts, official service-level times, or causal proof.

---

## 2. Solution

WasteVoice AI turns an informal waste observation into a structured workflow with three roles:

```text
Reporter
   ↓
Create Report + Before Evidence
   ↓
Authority Review
   ↓
Staff Assignment
   ↓
Cleaning Staff
   ↓
Cleaning Progress + After Evidence
   ↓
Authority Verification
   ↓
Resolved / Reopened
```

### Human-in-the-loop control

- **Reporter:** supplies and can correct report information.
- **Cleaning staff:** performs the physical task and provides completion evidence.
- **Authority:** reviews the work and makes the final resolution decision.

The system does not autonomously clean waste or declare a report resolved without human verification.

---

## 3. Current Review 1 Implementation

The current public repository contains a React/Supabase application workflow, including:

- React + TypeScript + Vite application
- Tailwind CSS UI
- Shared application layout and routing
- Supabase client integration
- Supabase Authentication integration
- Role-aware routing for reporter, authority and staff
- Protected routes and logout
- Reporter report creation form
- Location and description validation
- Before-cleaning image upload to Supabase Storage
- Reporter dashboard with report retrieval, filtering, search and status views
- Authority dashboard with report review, staff assignment, evidence review and verification workflow
- Cleaning staff dashboard with assigned-task workflow
- After-cleaning evidence upload
- Authority approval/rejection workflow
- Review history/evidence display
- Periodic refresh and realtime/polling support in workflow dashboards

### Build verification

The application has been verified locally with:

```bash
npm run build
```

The TypeScript/Vite production build completed successfully. The build reported a bundle-size warning for a large JavaScript chunk; this is a performance optimization item, not a build failure.

---

## 4. AI Status — Important Accuracy Note

The project specification defines **AI-assisted natural-language report structuring** as the primary AI direction. The current public implementation should **not** be interpreted as having a completed server-side LLM integration merely because the product is named WasteVoice AI.

At Review 1:

- The human reporting and resolution workflow is implemented.
- The server-side AI integration is **pending / further integration work**.
- AI accuracy has **not** been claimed without systematic testing.
- Prediction, anomaly detection, automatic image verification and automatic staff selection remain future work.

When the AI layer is implemented, it should be server-side, structured, uncertainty-aware and subject to reporter confirmation.

---

## 5. User Roles

### Reporter

- Create a report
- Enter location and description
- Upload before-cleaning evidence
- View submitted reports
- Track status
- Edit an eligible submitted report

### Authority

- Review reports
- View evidence
- Assign cleaning staff
- Review after-cleaning evidence
- Approve or reject completion
- Reopen/request further action

### Cleaning Staff

- View assigned tasks
- Start cleaning work
- Update task status
- Upload after-cleaning evidence
- Mark cleaning work completed

**Cleaning Completed ≠ Resolved.** Final resolution is an authority decision.

---

## 6. Technology Stack

| Layer | Technology |
|---|---|
| Frontend | React 19 + TypeScript |
| Build | Vite 8 |
| Styling | Tailwind CSS 4 |
| Routing | React Router 7 |
| Backend/Data services | Supabase |
| Database | PostgreSQL via Supabase |
| Authentication | Supabase Auth |
| Evidence storage | Supabase Storage |
| AI | Planned server-side language-processing integration |

Environment variables are used for Supabase client configuration. Secrets and service-role credentials must not be committed to the repository.

---

## 7. Repository Structure

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
│   └── review-1-report.md
└── supabase/
    └── README.md
```

---

## 8. Evidence Integrity

Project claims are classified as:

1. **Verified Field Evidence** — directly observed.
2. **Stakeholder Evidence** — obtained from stakeholder interaction.
3. **Implemented Functionality** — present in the repository and testable.
4. **Test Result** — supported by an actual test.
5. **Proposed Feature** — future work only.

No assumption is presented as field evidence, and no planned feature is presented as implemented.

---

## 9. Documentation

- [`docs/project-source-of-truth.md`](docs/project-source-of-truth.md) — evidence, scope, decisions and implementation boundaries
- [`docs/architecture.md`](docs/architecture.md) — application architecture and workflow
- [`docs/database-schema.md`](docs/database-schema.md) — runtime data contract used by the frontend
- [`docs/ai-integration.md`](docs/ai-integration.md) — AI design, safety boundary and current status
- [`docs/ai-usage-audit.md`](docs/ai-usage-audit.md) — AI-assisted development/documentation record
- [`docs/testing.md`](docs/testing.md) — testing matrix, current evidence and limitations
- [`docs/review-1-report.md`](docs/review-1-report.md) — submission-ready Review 1 progress report
- [`supabase/README.md`](supabase/README.md) — database deployment/verification notes

---

## 10. Review 1 Status

The official Project Better Tomorrow Review 1 asks for approximately 35% project completion and requires a public GitHub repository plus a report covering completed work, key features/modules, what works, and pending work/next steps.

### Completed / implemented

- Public repository and project documentation
- Frontend application foundation
- Role-aware authentication flow
- Reporter workflow
- Before evidence workflow
- Reporter dashboard
- Authority dashboard
- Staff dashboard
- Staff assignment and status workflow
- After-cleaning evidence workflow
- Authority verification workflow
- Production build verification

### Pending / next

- Final validation of the deployed Supabase schema/RLS against the actual connected project
- Systematic end-to-end role testing with real test accounts
- Server-side AI natural-language structuring integration and reliability testing
- User validation with at least three real testers as required for the continuation track
- Performance optimization
- Production deployment verification
- Final evidence package and later-stage enhancements

---

## 11. Roadmap

- [x] Field problem and Pathway A continuation established
- [x] Eight AI ideation directions documented
- [x] Integrated WasteVoice AI solution selected
- [x] Public repository
- [x] React + TypeScript + Vite foundation
- [x] Tailwind UI
- [x] Role-aware authentication/routing
- [x] Reporter report creation
- [x] Before evidence
- [x] Reporter dashboard
- [x] Authority workflow
- [x] Staff assignment
- [x] Staff workflow
- [x] After evidence
- [x] Authority verification workflow
- [x] Local production build
- [ ] Final Supabase/RLS verification against deployed project
- [ ] Server-side AI integration
- [ ] AI reliability tests
- [ ] Three-user validation
- [ ] Production deployment verification
- [ ] Advanced AI features

---

## 12. Review 1 Repository

**GitHub:** https://github.com/maheshofficial0011/wastevoice-ai

The repository is intentionally documented as an active student prototype. Its purpose is to let an evaluator inspect the implementation, understand the problem-to-solution reasoning, see what is genuinely working, and distinguish current functionality from future work.
