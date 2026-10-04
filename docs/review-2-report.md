# WasteVoice AI - Review 2 Project Report

**Project Better Tomorrow - C29 Semester 3 - Pathway A - Continuation Track**  
**Review 2 status date: 04 October 2026**

**Latest engineering quality gate:** the expanded GitHub Actions workflow covers `npm ci`, lint, 19 automated tests, TypeScript compilation and the production build; the last verified green gate preceded the final documentation-only updates.

> Core workflow: **Report -> Review -> Assign -> Clean -> Evidence -> Verify -> Resolve**

## 1. Executive Summary

WasteVoice AI is an AI-assisted campus waste reporting and resolution tracking prototype. It continues the real campus-park problem investigated during the C29 AI Immersion field activity.

The project focuses on a practical reporting and follow-up gap rather than autonomous cleaning. A reporter records an observed issue and before-cleaning evidence. The system supports authority review and staff assignment, gives cleaning staff a structured task workflow, collects after-cleaning evidence, and keeps final resolution under human authority verification.

For Review 2, the prototype has been extended with a narrow AI-assisted report-structuring capability. A reporter can describe the issue in ordinary language. A server-side Supabase Edge Function can request structured output from an AI model, validate the returned schema, preserve unknown information, and send suggestions back for reporter confirmation.

The repository also includes a Review 2 security hardening pass: the evidence bucket is private, workflow RPCs are no longer executable by the anonymous role, redundant legacy RPCs were restricted, and legacy tables received restrictive policies.

The remaining evidence gap is explicit: **three real-tester Review 2 validation sessions have not yet been retained in the repository, and the AI provider secret has not yet been configured for live model inference.** These are not being presented as completed.

## 2. Problem Context and Field Evidence

The project continues the problem identified during the earlier C29 AI Immersion work.

### Verified field observations

- A park inside the campus was observed.
- Approximately **4 waste accumulation points** were observed.
- Waste appeared to have remained uncleared for approximately **1 week** during the visit.
- Approximately **8-10 people** were observed passing during the visit.
- Stakeholder evidence indicated that waste removal may generally take approximately **2-3 weeks**.
- Stakeholder evidence indicated uncertainty around whom to contact, how to report the issue, and when cleanup would occur.

### Evidence qualification

The four accumulation points are an observation from the visit. The approximately one-week duration is an observation estimate, not an official cleaning interval. The 8-10 people count is an informal observation, not a daily affected-user count. The 2-3 week interval is stakeholder evidence, not a measured institutional service-level agreement.

No claim of waste reduction, cleanup improvement, or production impact is made from these observations alone.

## 3. Problem Definition

### Refined problem statement

**Students and campus users are affected by accumulated waste in the campus park, and the current response may be delayed because people do not always know how to report the problem or when it will be addressed.**

### Root-cause framing

The investigation treated the issue as an information and workflow gap.

The C29 analysis included:

- Five Whys root-cause analysis.
- Man / Machine / Method / Material / Measurement / Milieu categories.
- Primary, secondary and tertiary stakeholder mapping.
- Frequency, magnitude and reach considerations.
- Existing approaches and the gap they leave open.

### Why the problem is AI-tractable

The reporting problem contains structured information that can be extracted from ordinary language:

- location;
- waste category when explicitly supported;
- concise description or summary;
- missing information that should be requested or left unknown.

This allows a narrow AI intervention without making unsupported operational decisions.

## 4. Objectives

1. **Structure** reporter descriptions into useful fields.
2. **Preserve** missing information instead of inventing it.
3. **Guide** users through evidence-backed reporting.
4. **Track** report progress across three roles.
5. **Verify** cleaning completion through before/after evidence.
6. **Protect** role and evidence access with database controls.
7. **Validate** the prototype with at least three real testers.

Objectives 1-6 are represented in the current prototype. Objective 7 remains the Review 2 validation evidence task.

## 5. Ideation and Solution Selection

The ideation stage used the required eight directions:

| Direction | Idea |
|---|---|
| Sense | AI Waste Image Detector |
| Predict | Waste Accumulation Trend Predictor |
| Understand language | WasteVoice AI - Natural Language Report Understanding |
| Optimise | Waste Report Priority Assistant |
| Detect anomalies | Waste Hotspot Anomaly Detector |
| Assist a user | Guided Waste Reporting Assistant |
| Automate a step | Automatic Structured Report Generator |
| Make an invisible problem visible | Campus Waste Report Visibility Dashboard |

### Weighted C29 matrix

The required criteria were:

| Criterion | Weight |
|---|---:|
| Impact on the observed problem | 30% |
| Technical feasibility | 25% |
| Data availability | 15% |
| Cost and sustainability | 15% |
| Ethics, privacy and risk | 15% |

All ideas were considered on a 1-5 rating scale.

### Selected solution

**WasteVoice AI - AI-Powered Campus Waste Reporter**

The selected direction combines natural-language understanding, guided reporting, structured information, visibility, evidence, and human verification within a single workflow.

### Runner-up

**AI Waste Image Detector**

**Why it lost:** image analysis alone addresses only one part of the reporting and information gap identified during the field and stakeholder investigation.

## 6. Proposed Solution

The solution is a human-controlled workflow:

**Reporter -> AI-assisted structuring -> Reporter confirmation -> Authority review -> Staff assignment -> Cleaning -> After evidence -> Authority verification -> Resolved or correction**

### Role responsibility

- Reporter supplies and confirms the observed information.
- AI structures the reporter's text and identifies missing or vague information.
- Authority reviews and assigns the work.
- Staff performs the physical cleaning and supplies completion evidence.
- Authority makes the final resolution decision.

## 7. Prototype Development - Review 2

### Existing foundation

The repository already contained:

- React + TypeScript + Vite;
- Supabase Auth;
- role-aware protected routes;
- Reporter, Authority and Staff dashboards;
- report creation and validation;
- before-cleaning evidence;
- staff assignment;
- cleaning status workflow;
- after-cleaning evidence;
- authority verification;
- review/evidence history;
- application error boundary;
- GitHub Actions quality checks.

### Review 2 implementation added

#### AI report assistant

A new Reporter-facing AI Assist workspace was added.

The flow is:

1. Reporter enters observed location and description.
2. Request is sent to an authenticated Supabase Edge Function.
3. The function validates input limits.
4. The server-side AI provider is called when configured.
5. Structured output is validated against a JSON schema.
6. Unknown or missing details remain conservative.
7. The result is shown as advisory suggestions.
8. The reporter continues to the normal report form.
9. Suggestions are shown again for verification before submission.

#### Safe fallback

When no AI provider secret is configured, the Edge Function returns a clearly labelled conservative fallback structure. This prevents deterministic fallback logic from being presented as live model inference.

#### Server-side credential boundary

The AI provider key is read only inside the Edge Function and is not stored in React source code.

## 8. Technical Architecture

The Review 2 architecture diagram is stored at docs/architecture-review2.svg.

### Technical flow

**Real-world source**  
Reporter observation and description

**Acquisition**  
React + TypeScript form

**Pre-processing**  
Input validation and text limits

**AI / ML engine**  
Supabase Edge Function with a configurable OpenAI model

**Named technique**  
Natural-language understanding and schema-constrained structured information extraction

**Decision logic**  
Reporter confirmation and correction

**User interface**  
Reporter, Authority and Staff dashboards

**Persistence**  
Supabase PostgreSQL

**Evidence**  
Private Supabase Storage bucket

**Feedback loop**  
Reporter corrections plus later tester feedback

The block diagram explicitly shows the human decision point and the feedback path.

## 9. Database and Security

### Verified live database contract

The connected Supabase project was inspected on 04 October 2026.

The current public application tables include:

- profiles;
- reports;
- report_evidence;
- report_assignments;
- authority_reviews;
- report_activity;
- legacy waste_reports.

RLS is enabled on the inspected tables.

### Protected workflow RPCs

The current application uses:

- reporter_update_report;
- assign_report_to_staff;
- staff_update_task_status;
- authority_review_report.

Their deployed signatures were verified against the live project.

The four active workflow RPCs now have explicit execution access for authenticated users and service_role; anonymous execution was removed.

### Evidence security

The `waste-evidence` bucket is configured as **private**. A legacy `report-evidence` bucket was also found during final audit and hardened to private because existing reports referenced objects there.

Access is controlled through authenticated Storage policies for:

- reporter-owned evidence;
- authority review access;
- staff-assigned evidence;
- reporter evidence upload in the reporter-owned path.

The client resolves recognized Supabase evidence references through short-lived signed Storage URLs and no longer treats arbitrary HTTP evidence references as directly displayable.

### Legacy cleanup

Two legacy security issues were addressed:

- unused legacy RPCs were restricted from anonymous and authenticated API execution where they were no longer part of the current frontend contract;
- legacy report_activity and waste_reports tables received restrictive deny policies because they are not part of the current application runtime.

The update_updated_at function also has a fixed search path.

### Remaining security-advisor items

Supabase still reports warnings for helper SECURITY DEFINER functions used by the current RLS and workflow design, and for leaked-password protection being disabled. These are documented as remaining platform-security hardening items.

## 10. Evidence Handling

### Before-cleaning evidence

Reporter evidence documents the condition being reported.

### After-cleaning evidence

Cleaning staff supplies evidence after performing the physical work.

### Human verification

The authority compares the available evidence and either approves the work or requests correction.

### Important limitation

The prior controlled prototype test used the same image as the before/after fixture. Therefore it demonstrates software workflow behavior only. It does not prove that real waste was removed.

## 11. Testing

### Static quality

The repository has:

npm run lint

npm run build

GitHub Actions also runs linting and the production build.

### Existing functional evidence

Review 1 retained controlled screenshots cover:

- homepage;
- authority login;
- authority dashboard;
- report assignment;
- authority verification;
- evidence comparison;
- staff dashboard;
- reporter dashboard.

### Review 2 technical tests

| Test | Status |
|---|---|
| Reporter protected access | Existing functional evidence |
| Authority protected access | Existing functional evidence |
| Staff protected access | Existing functional evidence |
| Reporter blocked from authority action | **Verified in live SQL role probe** |
| Staff blocked from final resolution | **Verified in live SQL role probe** |
| Invalid location/description | Implemented; runtime evidence should be retained |
| Evidence upload validation | Implemented; runtime evidence should be retained |
| Error boundary | **Code verified; retained runtime screenshot pending** |
| AI complete description | Provider configuration + runtime capture required |
| AI missing location | Provider configuration + runtime capture required |
| AI missing category | Provider configuration + runtime capture required |
| AI vague description | Provider configuration + runtime capture required |
| Three real testers | **Required and not yet retained** |

## 12. Validation

### Review 2 requirement

The C29 guide requires validation with **at least three real testers**.

The project therefore uses:

**Prototype -> 3+ real testers -> observed friction -> feedback -> prototype change -> retest -> validation record**

### Current validation status

**Not yet complete.**

The repository deliberately does not convert earlier drafted Review 1 validation notes into new Review 2 user evidence.

### Required retained evidence

For each tester, retain:

- tester identifier;
- task;
- observed friction;
- exact feedback;
- change made;
- retest outcome;
- screenshot, recording or notes.

The recommended Review 2 task combines AI Assist with the existing reporting and resolution workflow.

## 13. Expected Outcomes

Because the project does not yet contain a valid field-impact study, outcomes are stated as prototype outcomes rather than measured real-world impact.

### Prototype outcomes

- More structured waste reports.
- Clearer workflow visibility.
- Evidence attached to the report lifecycle.
- Clear role responsibilities.
- Human verification before resolution.
- Safer evidence access through a private storage bucket.
- AI assistance that preserves unknown information.

### Expected before/after comparison

**Before**

- Informal waste observation.
- Unclear reporting path.
- Limited visibility after reporting.
- Separate evidence and follow-up work can be difficult to trace.

**With WasteVoice AI**

- Structured report.
- Explicit workflow stage.
- Evidence linked to the report.
- Assigned work is visible.
- Completion evidence is reviewed before resolution.

### Feasibility

The current prototype is web-first and uses a stack available to a student team: React, TypeScript, Supabase, PostgreSQL, Storage and server-side Edge Functions.

No specialist hardware is required for the first deployment stage.

### Cost and sustainability

The prototype is designed to minimize infrastructure complexity. The current architecture avoids dedicated custom backend infrastructure for the core workflow and uses managed application services.

AI model cost depends on the selected provider/model and actual usage.

## 14. Risks and Mitigation

| Risk | Mitigation |
|---|---|
| AI invents a missing detail | Use unknown and schema validation |
| AI summary is misleading | Reporter must confirm/edit |
| AI changes operational state | AI has no workflow-state authority |
| Evidence is exposed publicly | Private bucket + signed URLs |
| Unauthorized role performs actions | RLS + protected RPC checks |
| Provider unavailable | Safe conservative fallback |
| Test image mistaken for real cleanup | Explicit test-data qualification |
| User feedback is fabricated | Validation requires retained evidence |
| AI key leaks into frontend | Key stored only in Edge Function secrets |
| Platform security warning remains | Documented as pending hardening item |

## 15. Responsible AI and Academic Integrity

AI is used as a co-pilot for:

- ideation;
- implementation assistance;
- documentation structure;
- report-structuring assistance.

The project does **not** use AI-generated output as a substitute for field evidence, stakeholder evidence, tester feedback, or measured project outcomes.

### AI usage boundary

**AI suggests -> Human reviews -> Human corrects -> Confirmed information -> Workflow**

### AI disclosure

The final presentation and video should declare:

- AI tool name;
- purpose;
- one representative prompt;
- statement that field evidence and conclusions remain student-verified.

## 16. Learning Outcomes

This project demonstrates:

1. Real-place problem identification.
2. Root-cause reasoning before technology selection.
3. Eight-direction AI ideation.
4. Weighted solution selection with a named runner-up.
5. A buildable technical architecture.
6. Human-in-the-loop AI design.
7. Role-aware software implementation.
8. Evidence-backed workflow design.
9. Privacy and security consideration for user evidence.
10. The importance of validation evidence over unsupported claims.

## 17. Review 2 Readiness Checklist

### Evidence

- [x] Real site/problem carried forward.
- [x] Problem statement documented.
- [x] Three field numbers documented with source qualification.
- [x] Eight ideation directions documented.
- [x] Winner and runner-up named.
- [x] Technical block diagram created.
- [x] AI technique named.
- [x] Human decision point shown.
- [ ] Three real Review 2 tester sessions retained.
- [ ] Feedback -> change -> retest chain retained.

### Prototype

- [x] Reporter workflow.
- [x] Authority workflow.
- [x] Staff workflow.
- [x] Before/after evidence.
- [x] Human resolution.
- [x] AI Assist interface.
- [x] Server-side AI Edge Function deployed.
- [x] Private evidence storage.
- [x] Signed evidence URL handling.
- [x] Workflow RPC permissions hardened.

### AI

- [x] Structured output schema.
- [x] Conservative fallback.
- [x] Unknown/missing-field handling.
- [x] Human confirmation boundary.
- [ ] AI provider secret configured.
- [ ] Live AI test captures retained for four reliability cases.

### Submission

According to the C29 guide, the final submission also requires:

- 6-10 slide deck;
- PDF and source link;
- 8-12 minute 1080p video;
- face visible throughout the final video;
- four evidence recordings;
- correct C29 file naming;
- final-slide AI declaration;
- private-browser test of the YouTube link.

The repository can support those deliverables, but it does not claim that the recordings, final deck, or YouTube submission have been completed unless they are actually retained.

## 18. Current Project Status

### Strong foundation

WasteVoice AI now has a working human-controlled reporting and resolution workflow, a deployed server-side AI-assistance endpoint, explicit data/security contracts, private evidence storage, signed evidence access, an architecture diagram, Review 2 evidence templates, and a passing GitHub Actions lint/build gate.

### Two remaining gates

**Gate 1 - AI runtime**

Configure the server-side AI provider secret and capture the four required AI reliability cases.

**Gate 2 - Human validation**

Run at least three real tester sessions, retain the evidence, record specific feedback, make the resulting prototype changes, and retest.

### Integrity statement

This report does not claim AI accuracy, production effectiveness, real-world cleanup improvement, or completed user validation without corresponding evidence.

## 19. Repository Evidence Map

| Evidence | Repository location |
|---|---|
| Review 1 report | docs/review-1-report.md |
| Review 2 report | docs/review-2-report.md |
| Review 2 validation template | docs/review-2-validation.md |
| Architecture diagram | docs/architecture-review2.svg |
| Testing record | docs/testing.md |
| Validation record | docs/validation.md |
| Database contract | docs/database-schema.md |
| AI integration documentation | docs/ai-integration.md |
| AI usage audit | docs/ai-usage-audit.md |
| Runtime evidence | docs/evidence/ |
| Supabase setup | supabase/README.md |
| AI Edge Function | supabase/functions/structure-report/index.ts |

## 20. Final Conclusion

WasteVoice AI has progressed from a C29 problem-framing exercise into a reviewable software prototype that connects reporting, evidence, assignment, cleaning progress, verification and responsible AI assistance.

The key engineering decision is to keep AI narrow and accountable: the model helps structure information, while people remain responsible for the observed facts, physical cleaning, assignment, and final resolution.

The strongest path to final Review 2 completion is now evidence-driven rather than feature-driven: configure the AI provider, run the required AI matrix, use the mapped demo accounts in a real browser session, conduct the required three-person validation, show exactly what changed from their feedback, and retain the evidence for the final deck and video.
