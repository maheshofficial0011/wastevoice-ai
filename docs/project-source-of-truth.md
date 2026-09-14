# WasteVoice AI — Project Source of Truth

## Project identity

- Project: WasteVoice AI
- Programme: Project Better Tomorrow / C29 Semester 3
- Pathway: A — Continuation Track
- Core workflow: **Report → Review → Assign → Clean → Evidence → Verify → Resolve**

## Evidence classification

All project claims belong to one of these categories:

1. Verified field evidence
2. Stakeholder evidence
3. Implemented software functionality
4. Test result
5. Proposed/future feature

A proposed feature must not be described as implemented. A test result must come from an actual test. AI-generated statements are not field evidence unless independently verified.

## Field evidence carried forward from AI Immersion

- A park inside the campus was observed.
- Approximately four waste accumulation points were observed.
- Waste appeared to have remained uncleared for approximately one week during the visit; this is an observation estimate, not an official cleaning interval.
- Approximately 8–10 people were observed passing during the visit; this was informal and is not a daily affected-user count.
- Stakeholder evidence indicated that waste removal may generally take approximately two to three weeks.
- Stakeholder evidence indicated uncertainty around whom to contact, how to report the issue, and when cleanup would occur.

## Defined problem

**Students and campus users are affected by accumulated waste in the campus park, and the current response may be delayed because people do not always know how to report the problem or when it will be addressed.**

## Product definition

WasteVoice AI is an AI-assisted campus waste reporting and resolution tracking prototype. It structures a report, records evidence, supports authority assignment to cleaning staff, tracks cleaning progress, and keeps final resolution under human authority verification.

## Review 1 boundary

The current repository contains a substantial role-based application workflow. The public documentation deliberately distinguishes the implemented human workflow from the planned server-side AI language-processing layer.

### Implemented in the current repository

- React/TypeScript/Vite application
- Tailwind UI
- Routing and shared layout
- Supabase client
- Supabase authentication flow
- Role-aware reporter/authority/staff routing
- Protected routes and logout
- Waste report creation and validation
- Before-cleaning evidence upload
- Reporter dashboard
- Authority dashboard
- Staff dashboard
- Staff assignment and status workflow
- After-cleaning evidence workflow
- Authority review/verification workflow
- Search/filter/sort and evidence/review displays

### Not to be claimed as completed without new implementation evidence

- Server-side LLM integration
- AI accuracy/performance
- Predictive analytics
- Anomaly detection
- Automatic before/after verification
- Automatic staff selection
- Production deployment
- Three-user validation results

## Human control

- Reporter confirms report information.
- Staff performs physical cleaning and uploads completion evidence.
- Authority makes the final resolution decision.

The system does not autonomously perform physical cleaning or independently declare a report resolved.
