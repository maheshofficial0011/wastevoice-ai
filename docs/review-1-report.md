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

A local production build has previously been completed successfully with:

```bash
npm run build
```

The recorded build completed TypeScript compilation and the Vite production build, with a large JavaScript chunk warning noted as a performance optimization item. This repository should be re-installed and re-run locally before treating that result as a fresh verification on the current machine.

The repository also contains the implementation of the role-based workflow described above. Runtime database/RLS verification should be retained as explicit test evidence rather than inferred from source code alone.

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

1. Re-run dependency installation, lint and production build on the current machine and retain the terminal evidence.
2. Validate the deployed Supabase tables, RLS and RPC signatures against the actual connected project.
3. Run and record systematic Reporter/Authority/Staff end-to-end tests with real test accounts.
4. Confirm that any three-user validation records are backed by corresponding tester interaction/evidence before treating them as completed validation evidence.
5. Implement the server-side AI report-structuring integration.
6. Test AI behavior on complete, incomplete and vague descriptions.
7. Optimize the large frontend bundle where practical.
8. Verify production deployment.
9. Continue with later-stage enhancements such as voice/multilingual reporting, image comparison, prediction and anomaly detection only after the core workflow is validated.

## 10. Repository

**Public GitHub repository:** https://github.com/maheshofficial0011/wastevoice-ai

## 11. Integrity statement

This report intentionally distinguishes implemented functionality from planned AI features and from test results that still need to be executed. No AI accuracy figure, cleanup improvement or production result is claimed before it has actually been measured. Validation records should be treated as completed evidence only when their underlying tester interaction/evidence is retained.
