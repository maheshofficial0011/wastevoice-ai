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

The application has passed a local production build using:

```bash
npm run build
```

TypeScript compilation and the Vite production build completed successfully. A large JavaScript chunk warning remains as a performance optimization item.

The repository also contains the implementation of the role-based workflow described above. Runtime database/RLS verification should be retained as explicit test evidence rather than inferred from source code alone.

## 5. AI status

The project specification selected natural-language report structuring as the primary AI direction. The current public repository does not provide sufficient implementation evidence to claim a completed server-side LLM integration. Therefore the AI inference layer is listed as pending rather than falsely marked complete.

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

## 8. Pending work and next steps

1. Validate the deployed Supabase tables, RLS and RPC signatures against the actual connected project.
2. Run and record systematic Reporter/Authority/Staff end-to-end tests with real test accounts.
3. Implement the server-side AI report-structuring integration.
4. Test AI behavior on complete, incomplete and vague descriptions.
5. Conduct validation with at least three real testers, as required by the Pathway A continuation track.
6. Optimize the large frontend bundle where practical.
7. Verify production deployment.
8. Continue with later-stage enhancements such as voice/multilingual reporting, image comparison, prediction and anomaly detection only after the core workflow is validated.

## 9. Repository

**Public GitHub repository:** https://github.com/maheshofficial0011/wastevoice-ai

## 10. Integrity statement

This report intentionally distinguishes implemented functionality from planned AI features and from test results that still need to be executed. No user-validation outcome, AI accuracy figure, cleanup improvement or production result is claimed before it has been actually measured.
