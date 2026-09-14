# WasteVoice AI ♻️

### AI-Assisted Campus Waste Reporting & Resolution Tracking

> **Project Better Tomorrow · C29 · Semester 3**
>
> **Report → Review → Assign → Clean → Evidence → Verify → Resolve**

WasteVoice AI is a student-built web application prototype designed to make campus waste reporting more structured and make the resolution process more visible and accountable.

The project continues the field problem identified during the C29 AI Immersion activity: accumulated waste was observed in a campus park, while stakeholder evidence indicated uncertainty around whom to contact, how to report the issue, and when cleanup would occur.

---

## 🎯 Problem

Students and campus users are affected by accumulated waste in the campus park, and the current response may be delayed because people do not always know how to report the problem or when it will be addressed.

### Verified field evidence

- Location: a park inside the campus
- Approximately **4 waste accumulation points** observed
- Waste appeared to have remained uncleared for approximately **1 week** during the visit
- Approximately **8–10 people** were observed passing during the visit
- Stakeholder evidence indicated that waste removal may generally take approximately **2–3 weeks**
- Reporting contacts and cleanup timing may not always be clear to users

These observations are kept separate from project inference and proposed features. No unverified statistics are presented as facts.

---

## 💡 Proposed Solution

WasteVoice AI converts an informal waste observation into a structured, reviewable workflow.

### Core journey

```text
Waste Observed
      ↓
Reporter Creates Report
      ↓
AI-Assisted Structuring
      ↓
Reporter Reviews / Corrects
      ↓
Submitted
      ↓
Authority Review
      ↓
Staff Assignment
      ↓
Cleaning In Progress
      ↓
After-Cleaning Evidence
      ↓
Authority Verification
      ↓
Resolved / Reopened
```

AI assists with information understanding and structuring. Human users remain responsible for real-world action and final verification.

---

## 👥 User Roles

### 👤 Reporter
- Create a waste report
- Enter/select location
- Describe the issue
- Upload before-cleaning evidence
- Review and correct AI suggestions
- Submit the report
- Track report status

### 🏛️ Authority
- Review submitted reports
- Review before evidence
- Assign cleaning staff
- Review after evidence
- Verify completion
- Resolve or reopen reports

### 🧹 Cleaning Staff
- View assigned tasks
- View location and issue details
- Start work
- Update work status
- Upload after-cleaning evidence
- Mark cleaning work as completed

**Cleaning Completed ≠ Resolved.** Final resolution remains an authority decision after evidence review.

---

## 🤖 AI Boundary

The planned primary AI capability is natural-language report structuring.

Given a description such as:

> "There is a pile of plastic waste near the entrance of the park."

AI should suggest structured fields such as:

- Waste category
- Location, when supported by the input
- Concise issue summary

The reporter must be able to review and correct the suggestions before submission.

The AI must not:

- Invent missing facts
- Automatically dispatch staff
- Decide that cleaning happened
- Mark a report as resolved
- Replace human authority decisions

The exact AI provider/model will be documented only after the real server-side integration is implemented.

---

## 🧱 Technology Stack

| Layer | Technology |
|---|---|
| Frontend | React 19 + TypeScript |
| Build | Vite 8 |
| Styling | Tailwind CSS 4 |
| Routing | React Router 7 |
| Backend services | Supabase |
| Database | PostgreSQL via Supabase |
| Authentication | Supabase Auth |
| Evidence | Supabase Storage |
| AI | Server-side language-processing integration (planned) |

The repository currently contains the frontend foundation and Supabase client foundation. Production credentials are never committed to the repository.

---

## 📁 Repository Structure

```text
wastevoice-ai/
├── README.md
├── docs/
│   ├── architecture.md
│   ├── database-schema.md
│   ├── ai-integration.md
│   ├── ai-usage-audit.md
│   ├── testing.md
│   └── review-1-report.md
├── supabase/
│   └── schema.sql
├── public/
└── src/
    ├── components/
    ├── data/
    ├── lib/
    ├── pages/
    ├── types/
    ├── App.tsx
    └── main.tsx
```

---

## 🚧 Review 1 Status

**Review window:** 8–17 September 2026  
**Evaluation target:** approximately 35% of the overall project.

### Implemented / committed

- Public GitHub repository
- React + TypeScript + Vite foundation
- Tailwind CSS 4 configuration
- Application routing
- Shared application layout
- Project types and workflow data model
- Reporter waste-report form with validation
- Before-cleaning image preview in the report form
- Supabase JavaScript client foundation
- Initial role and workflow architecture
- Project specification and evidence documentation

### In progress / next implementation

- Supabase database schema deployment and verification
- Supabase authentication and role enforcement
- Persistent report submission
- Server-side AI integration
- AI review/confirmation screen
- Reporter dashboard persistence
- Authority review and assignment workflow
- Cleaning staff workflow
- After-cleaning evidence
- Authority verification
- End-to-end testing and user validation

The repository deliberately does **not** describe these pending items as completed.

---

## 🔐 Evidence & Responsible AI Principle

This project follows four evidence classes:

1. **Verified Field Evidence** — directly observed during the field visit
2. **Stakeholder Evidence** — obtained from stakeholder interaction
3. **Implemented Functionality** — actually present and testable in code
4. **Proposed Feature** — planned but not yet implemented

> **AI assists humans; humans make the final decisions.**

No AI-generated claim becomes project evidence unless it is verified.

---

## 🧪 Testing Philosophy

Testing will cover:

- Application build and routing
- Report form validation
- Image upload/preview
- Authentication and role restrictions
- Report persistence
- AI structured output
- Human correction of AI output
- Staff assignment
- Status transitions
- Before/after evidence
- Authority verification

AI reliability tests will include complete, incomplete, and vague descriptions to verify that the model does not confidently invent missing information.

---

## 🗺️ Roadmap

- [x] Field problem and continuation pathway defined
- [x] Eight AI ideation directions evaluated
- [x] Integrated WasteVoice AI solution selected
- [x] Public repository created
- [x] React + TypeScript + Vite foundation
- [x] Tailwind CSS configured
- [x] Routing and shared layout
- [x] Reporter form foundation
- [x] Supabase client foundation
- [ ] Supabase schema + RLS deployment
- [ ] Authentication + roles
- [ ] Persistent reporter workflow
- [ ] Server-side AI integration
- [ ] Authority workflow
- [ ] Staff workflow
- [ ] Before/after evidence persistence
- [ ] Verification workflow
- [ ] Automated / repeatable tests
- [ ] Validation with at least three real testers
- [ ] Final Project Better Tomorrow submission

---

## 📚 Project Documentation

- [`docs/architecture.md`](docs/architecture.md) — system architecture and role boundaries
- [`docs/database-schema.md`](docs/database-schema.md) — data model and status lifecycle
- [`docs/ai-integration.md`](docs/ai-integration.md) — AI contract and safety rules
- [`docs/ai-usage-audit.md`](docs/ai-usage-audit.md) — AI contribution and verification record
- [`docs/testing.md`](docs/testing.md) — test plan and known limitations
- [`docs/review-1-report.md`](docs/review-1-report.md) — Review 1 progress report
- [`supabase/schema.sql`](supabase/schema.sql) — planned database schema

---

## 📌 Project Identity

**Project:** Better Tomorrow  
**Batch:** C29  
**Semester:** 3  
**Pathway:** A — Continuation Track  
**Project:** WasteVoice AI  
**Type:** AI-Assisted Software Project

---

## ⚠️ Development Note

WasteVoice AI is an active student prototype. A feature is labelled **implemented** only when the corresponding functionality exists in code and can be tested. Planned AI, prediction, anomaly detection, image comparison, notifications, and institutional integrations are not presented as completed functionality.
