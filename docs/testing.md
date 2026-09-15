# WasteVoice AI — Testing Record and Plan

## 1. Current build verification

A local production build was successfully executed on the current development machine with:

```bash
npm run build
```

The command completed TypeScript compilation and the Vite production build. Vite reported a large JavaScript chunk warning; this is a performance optimization item, not a build failure.

Recommended quality checks:

```bash
npm run lint
npm run build
```

A test result should be treated as current only when the command has actually been executed and the execution evidence is retained.

## 2. Controlled end-to-end Review 1 test

A controlled prototype test was completed on **15 September 2026** using test accounts/data for the three application roles.

### Reporter

- Logged in as the test Reporter.
- Created a waste report.
- Entered the location and description.
- Uploaded before-cleaning evidence.
- Confirmed the submitted report appeared in the reporter workflow.

### Authority

- Logged in as the test Authority.
- Viewed the submitted report.
- Reviewed the report and before evidence.
- Assigned the report to Test Staff.
- Later opened the verification workspace after staff evidence was submitted.
- Could compare before/after evidence and access human verification controls.

### Cleaning Staff

- Logged in as Test Staff.
- Viewed the assigned task.
- Updated the cleaning workflow.
- Uploaded after-cleaning evidence.
- Submitted the task back for authority review.

### Test-data qualification

The end-to-end test used controlled prototype data and test evidence images. The same image was used as the before/after fixture. This is acceptable as a functional test fixture because the purpose was to exercise the software workflow.

It must **not** be interpreted as proof that a real campus cleaning operation occurred, that waste was physically removed, or that the proposed system improved cleanup outcomes.

## 3. Review 1 functional test matrix

| Area | Status | Evidence / qualification |
|---|---|---|
| Production build | **Passed** | `npm run build` execution on current development machine |
| Login and role routing | **Functionally exercised** | Test-account screenshots |
| Reporter protected workflow | **Functionally exercised** | Reporter test workflow |
| Report creation | **Functionally exercised** | Reporter dashboard/report evidence |
| Input validation | **Implemented** | Source-level implementation; edge-case execution should be retained separately |
| Before evidence upload | **Functionally exercised** | Reporter test workflow |
| Reporter dashboard | **Functionally exercised** | Screenshot evidence |
| Authority review | **Functionally exercised** | Authority workflow screenshots |
| Staff assignment | **Functionally exercised** | Assignment screenshot |
| Staff status updates | **Functionally exercised** | Staff workflow screenshot |
| After-cleaning evidence | **Functionally exercised** | Staff/authority workflow evidence |
| Authority verification | **Functionally exercised** | Verification workspace screenshots |
| Human resolution control | **Functionally exercised** | Authority verification workspace |
| AI inference | **Pending** | Do not claim as tested or completed |
| Systematic RLS/security testing | **Pending** | Must be explicitly executed and recorded |
| Three-user validation | **Pending verification of evidence** | Only claim complete when retained tester interaction/evidence supports it |

## 4. Evidence files retained

The local Review 1 screenshot set is organized as:

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

The screenshots document prototype behavior and UI state. They are not field-impact measurements.

## 5. Role-based security tests still required

### Reporter

- Can log in and reach reporter area.
- Can create a valid report.
- Can view own report status.
- Cannot perform authority/staff-only workflow actions.

### Authority

- Can view reports requiring review.
- Can assign a staff member.
- Can review before/after evidence.
- Can approve or request correction.

### Staff

- Can view assigned work.
- Can update cleaning progress.
- Can upload after-cleaning evidence.
- Cannot make the final resolved decision.

These should be tested against the connected Supabase project and retained as runtime evidence, not inferred only from frontend source code.

## 6. Input and edge-case tests

The application includes validation for cases such as:

- empty location;
- too-short description;
- oversized additional information;
- unsupported image type;
- image larger than the configured application limit;
- missing before evidence on a new report;
- editing a report after it is no longer eligible for reporter edits;
- missing/invalid authenticated session.

Where Review 1 claims a specific edge case as **passed**, retain execution evidence. Implementation alone is not a test result.

## 7. AI reliability tests for later implementation

After server-side AI integration is implemented, test at minimum:

1. Complete description: `Plastic waste near the park entrance.`
2. Missing location: `There is a large amount of plastic waste.`
3. Missing category: `There is a pile of waste near the entrance.`
4. Vague input: `The place is very dirty.`

Expected safety behavior:

- preserve uncertainty;
- avoid inventing missing facts;
- return schema-valid structured data;
- allow the reporter to correct AI suggestions;
- never let AI independently make the final resolution decision.

## 8. Evidence rule

A test should be marked **Passed** only after it is actually executed. A planned test is not a test result. Screenshots, terminal output, or other execution evidence should be retained for important Review 1 claims.
