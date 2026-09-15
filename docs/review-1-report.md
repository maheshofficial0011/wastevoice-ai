# WasteVoice AI — Review 1 Progress Report

**Project Better Tomorrow · C29 · Semester 3 · Pathway A — Continuation Track**

## 1. Project summary

WasteVoice AI is an AI-assisted campus waste reporting and resolution tracking prototype. It addresses the reporting and visibility gap identified during the earlier AI Immersion field work.

The core workflow is:

**Report → Review → Assign → Clean → Evidence → Verify → Resolve**

## 2. Problem evidence

The carried-forward field evidence includes a campus park with approximately four waste accumulation points, waste that appeared to have remained uncleared for approximately one week during the visit, and an informal observation of approximately 8–10 people passing through the area. Stakeholder evidence indicated that waste removal may generally take approximately two to three weeks and that reporting contacts/cleanup timing may not always be clear.

These observations are not presented as daily user counts, official service-level measurements or causal proof.

## 3. What has been completed

The public repository currently contains:

- React + TypeScript + Vite application
- Tailwind CSS interface
- Shared application layout and routing
- Supabase client integration
- Supabase authentication flow
- Role-aware reporter, authority and staff routing
- Protected routes and logout
- Reporter report creation with validation
- Before-cleaning evidence upload
- Reporter dashboard
- Authority dashboard
- Cleaning staff dashboard
- Staff assignment workflow
- Staff cleaning-status workflow
- After-cleaning evidence workflow
- Authority review/approval/rejection workflow
- Evidence and review-history displays
- Refresh/realtime support used by workflow dashboards

## 4. What is currently verified

### Build

A local production build was successfully completed on the current development machine with:

```bash
npm run build
```

The command completed TypeScript compilation and the Vite production build. Vite reported a large JavaScript chunk warning; this is a performance optimization item, not a build failure.

### Controlled end-to-end prototype test

On **15 September 2026**, the application was exercised with controlled test accounts/data across the three application roles:

1. Reporter logged in and created a waste report.
2. Reporter supplied before-cleaning evidence.
3. Authority received the report and reviewed it.
4. Authority assigned the report to Test Staff.
5. Test Staff received the assigned task and progressed the cleaning workflow.
6. Test Staff submitted after-cleaning evidence.
7. Authority received both evidence files and opened the human verification workspace.
8. Authority could compare before/after evidence and access the human verification decision controls.

The retained screenshot set is organized as:

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

**Test-data qualification:** the end-to-end test used controlled prototype data and test evidence images. The same image was used as the before/after fixture. Therefore the test demonstrates the application workflow and evidence-handling behavior; it does **not** prove that a real campus cleaning operation occurred or that the physical waste condition improved.

Runtime database/RLS verification should still be retained as explicit evidence rather than inferred from source code alone.

## 5. AI status

The C29 ideation work selected an integrated WasteVoice AI direction combining natural-language understanding, guided reporting, structured report generation, visibility, and optional image understanding. The current public repository does not provide sufficient implementation evidence to claim a completed server-side LLM integration. Therefore the AI inference layer is listed as pending rather than falsely marked complete.

When implemented, AI should:

- structure information from the user's description;
- preserve unknown fields instead of inventing them;
- return validated structured output;
- allow reporter correction;
- never decide workflow status or final resolution.

## 6. Human-in-the-loop design

- Reporter confirms/corrects report information.
- Staff performs physical cleaning and supplies after-cleaning evidence.
- Authority reviews the evidence and makes the final resolution decision.

**Cleaning Completed is not the same as Resolved.**

## 7. Technical architecture

The application uses React/TypeScript/Vite on the frontend and Supabase for authentication, PostgreSQL data and Storage. The current frontend contract references `profiles`, `reports`, `report_evidence`, `report_assignments` and `authority_reviews`, with protected RPCs for key workflow mutations.

## 8. C29 ideation and solution selection

The ideation stage used the required eight directions: Sense, Predict, Understand Language, Optimise, Detect Anomalies, Assist a User, Automate a Step, and Make an Invisible Problem Visible. The weighted evaluation used Impact 30%, Technical Feasibility 25%, Data Availability 15%, Cost & Sustainability 15%, and Ethics/Privacy/Risk 15%.

The selected integrated solution was **WasteVoice AI — AI-Powered Campus Waste Reporter**. It combines natural-language understanding, guided reporting, structured report generation, report visibility, and optional image understanding. The **AI Waste Image Detector** was the runner-up because image analysis alone does not directly address the broader reporting and information gap identified during the field and stakeholder investigation.

## 9. Pending work and next steps

1. Validate the connected Supabase tables, RLS and RPC signatures against the actual project.
2. Run systematic Reporter/Authority/Staff role and access tests and retain evidence.
3. Confirm that any three-user validation records are backed by corresponding tester interaction/evidence before treating them as completed validation evidence.
4. Implement the server-side AI report-structuring integration.
5. Test AI behavior on complete, incomplete and vague descriptions.
6. Optimize the large frontend bundle where practical.
7. Verify production deployment.
8. Continue with later-stage enhancements such as voice/multilingual reporting, image comparison, prediction and anomaly detection only after the core workflow is validated.

## 10. Repository

**Public GitHub repository:** https://github.com/maheshofficial0011/wastevoice-ai

## 11. Integrity statement

This report intentionally distinguishes implemented functionality from planned AI features and from test results. No AI accuracy figure, cleanup improvement or production result is claimed before it has actually been measured. The controlled end-to-end test is explicitly described as a prototype workflow test using test data, not as evidence of real-world cleanup impact. Validation records should be treated as completed evidence only when their underlying tester interaction/evidence is retained.
