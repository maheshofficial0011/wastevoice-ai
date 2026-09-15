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



## 9. Granular Technical Test Cases

The following test cases define the expected behavior for important user, validation, workflow, and failure scenarios. A case is marked as passed only after runtime execution evidence is retained.

| ID | Test case | Input / condition | Expected result | Current status |
|---|---|---|---|---|
| TC-01 | Valid reporter login | Valid Reporter credentials | Reporter dashboard opens | Functionally exercised |
| TC-02 | Report with valid data | Valid description, location and before image | Report can be submitted | Functionally exercised |
| TC-03 | Empty location | Location left empty | Submission is blocked with validation feedback | Implemented; runtime evidence pending |
| TC-04 | Short description | Description below minimum length | Submission is blocked with validation feedback | Implemented; runtime evidence pending |
| TC-05 | Missing before evidence | Valid text but no before image | Submission is blocked | Implemented; runtime evidence pending |
| TC-06 | Unsupported image type | Unsupported file format | Upload is rejected | Implemented; runtime evidence pending |
| TC-07 | Oversized image | Image exceeds configured limit | Upload is rejected with user feedback | Implemented; runtime evidence pending |
| TC-08 | Reporter edits eligible report | Report still allows reporter edits | Changes can be made | Implemented; runtime evidence pending |
| TC-09 | Reporter edits locked report | Report no longer allows reporter edits | Edit operation is prevented | Implemented; runtime evidence pending |
| TC-10 | Authority assignment | Submitted report + available staff | Authority can assign staff | Functionally exercised |
| TC-11 | Staff task access | Assigned staff account | Assigned task is visible | Functionally exercised |
| TC-12 | Staff completion evidence | Assigned task + after-cleaning image | Staff can submit completion evidence | Functionally exercised |
| TC-13 | Authority verification | Staff evidence available | Authority can review evidence and make final decision | Functionally exercised |
| TC-14 | Staff attempts final resolution | Staff role | Final resolution remains unavailable to staff | Runtime security test pending |
| TC-15 | Reporter attempts authority action | Reporter role | Authority-only action is unavailable | Runtime security test pending |
| TC-16 | Invalid/missing session | No valid authenticated session | Protected operation is denied and user is redirected or shown an authentication error | Runtime test pending |
| TC-17 | Backend/database failure | Supabase operation fails | User receives controlled error feedback; application does not silently report success | Failure-injection test pending |
| TC-18 | Evidence upload failure | Storage/upload operation fails | Upload failure is shown and report is not falsely marked as successful | Failure-injection test pending |

### Test result interpretation

- **Functionally exercised** = the workflow was executed successfully using controlled prototype data.
- **Implemented; runtime evidence pending** = validation exists in the application code, but the specific case has not yet been retained as a separate execution result.
- **Runtime security test pending** = requires execution against the connected Supabase/RLS environment.
- **Failure-injection test pending** = requires intentionally simulating a service/storage/database failure.
- A planned test is never reported as a passed test.

## 10. Error Handling and Failure Boundaries

WasteVoice AI should fail safely rather than silently presenting an unsuccessful operation as successful.

### Current application-level handling

The application includes validation around important user inputs and evidence handling, including:

- required/empty location validation;
- minimum description validation;
- additional-information length limits;
- image type validation;
- image size validation;
- before-evidence requirements;
- authentication/session checks;
- restrictions on editing reports after workflow progression.

### Failure cases to verify

The following failure conditions require dedicated runtime verification:

1. Supabase authentication failure.
2. Database read/write failure.
3. Evidence storage/upload failure.
4. Network interruption during a submission.
5. Expired or missing authenticated session.
6. Unauthorized role attempting a protected operation.
7. Failed report assignment.
8. Failed status update.

Expected behavior is to show a clear user-facing error, preserve data where possible, and avoid displaying a false success state.

### Error boundary status

A dedicated React error boundary should be added and tested in a subsequent implementation step so that an unexpected component-level exception does not result in an uncontrolled blank application state.

**Current status: Planned / not yet claimed as implemented.**

## 11. Expected vs Actual Result Recording

For future runtime testing, each important test should record:

| Field | Required information |
|---|---|
| Test ID | Example: TC-03 |
| Preconditions | Account, role, data or system state |
| Action | Exact user/system action |
| Expected result | Behavior defined before execution |
| Actual result | What actually happened |
| Status | Passed / Failed / Blocked |
| Evidence | Screenshot, terminal output or other retained proof |
| Notes | Error message, limitation or follow-up |

This prevents implementation status from being confused with execution status and provides traceable evidence for later project reviews.