# WasteVoice AI — Prototype Validation Record

## Review 1 validation status

This file contains three prototype validation records dated 15 September 2026. **Treat these as completed validation evidence only if the corresponding tester interaction, notes, screenshot/video, or other original evidence is retained by the project team.** The repository must not use a drafted record as a substitute for actual user evidence.

> **Evidence integrity:** These records are not statistical user research or proof of production effectiveness. If the underlying tester evidence is unavailable, move the record to a planned-test section rather than presenting it as completed validation.

## Tester 1 — T01

| Field | Record |
|---|---|
| Tester ID | T01 |
| Tester Type | Student |
| Date | 15 September 2026 |
| Prototype Tested | WasteVoice AI |
| Main Task | Report a waste problem using the reporting form |
| What they tested | Login → Create Report → Location → Description → Before Evidence → Submit → Dashboard |
| Result | Successfully completed the reporting flow |
| Feedback | The reporting process was easy to understand. The location and description fields were clear. |
| Issue noticed | The tester suggested making the status/progress of a submitted report more visible. |
| Improvement suggested | Add clearer status indicators such as Submitted → Assigned → Cleaning → Verification → Resolved. |
| Action taken | Status/progress visibility is included in the UI refinement direction. |

## Tester 2 — T02

| Field | Record |
|---|---|
| Tester ID | T02 |
| Tester Type | Student |
| Date | 15 September 2026 |
| Prototype Tested | WasteVoice AI |
| Main Task | Submit a waste report and review its progress |
| What they tested | Login → Create Report → Add evidence → Submit → View Reporter Dashboard |
| Result | Successfully completed the reporting and dashboard flow |
| Feedback | The evidence upload and report information were useful for explaining the waste problem. |
| Issue noticed | The tester initially wanted clearer information about what happens after submitting a report. |
| Improvement suggested | Provide a simple explanation of the resolution workflow and current report status. |
| Action taken | Workflow/status information is being emphasized in the dashboard. |

## Tester 3 — T03

| Field | Record |
|---|---|
| Tester ID | T03 |
| Tester Type | Student |
| Date | 15 September 2026 |
| Prototype Tested | WasteVoice AI |
| Main Task | Review and understand the waste-report handling and resolution workflow |
| What they tested | Login → View Reports/Assigned Task → Review Waste Details → Check Evidence → Update Workflow Status |
| Result | Successfully understood the report-handling workflow and the purpose of the different roles. |
| Feedback | The workflow gives a clear structure for handling a waste complaint from reporting through cleaning and verification. |
| Issue noticed | It was not immediately clear who is responsible for taking action at each stage of the workflow. |
| Improvement suggested | Clearly display the responsible role and next action for each stage of the report lifecycle. |
| Suggested workflow display | Reporter → Review → Staff Assignment → Cleaning → Evidence → Authority Verification → Resolution |
| Positive observation | The separation between Reporter, Staff, and Authority makes the responsibility structure easier to understand. |
| Action taken | Role responsibilities and workflow progression are being emphasized through the dashboard design and project documentation. |
| Overall feedback | The prototype provides a practical digital workflow for tracking a campus waste issue and maintaining evidence during resolution. |

## Consolidated findings

If the three underlying sessions are retained as genuine tester evidence, the records cover:

- **T01:** report creation and reporting-flow usability
- **T02:** evidence upload and reporter-side progress visibility
- **T03:** staff/authority workflow and responsibility clarity

The common improvement theme is clearer visibility of report status, next action, and responsibility at each workflow stage.

## Additional validation required

Regardless of these prototype records, the project still needs explicit execution evidence for role-based permissions, database/RLS behavior, workflow transitions, edge cases, and AI behavior once the server-side AI integration is implemented.
