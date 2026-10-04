# WasteVoice AI — Review 2 Validation Plan

**Purpose:** collect genuine prototype validation evidence for Project Better Tomorrow Review 2.
**Minimum participants:** 3 real testers, either new testers or re-engaged users.
**Do not enter results before the interaction occurs.**

**Engineering readiness note (04 October 2026):** three demo Auth users are mapped to Reporter, Authority and Staff profiles; core authorization and storage hardening has been live-checked. Live AI inference and browser evidence still depend on external credentials/runtime access.

## Participant Profile

Use participants who can reasonably act as a campus reporter or understand the authority/staff workflow. Record only the minimum information needed for project evidence.

| Participant | Role tested | Date | Consent/evidence reference |
|---|---|---|---|
| T01 | Reporter | | |
| T02 | Reporter | | |
| T03 | Reporter + workflow observer | | |

## Core Scenario

A campus user notices unmanaged waste in a campus park. They need to report what they saw, understand what the system suggests, submit evidence, and understand what happens next.

## Test Task

1. Sign in.
2. Open AI Assist.
3. Enter a real or controlled waste observation.
4. Review the AI category, summary and missing-field suggestions.
5. Correct any suggestion that is inaccurate.
6. Continue to the normal report form.
7. Add before-cleaning evidence.
8. Submit the report.
9. Observe/report what the next workflow stage means.
10. For the end-to-end demonstration, use the Authority and Staff accounts to continue assignment, cleaning status and verification.

## Expected Behavior

- The user can understand what information is required.
- AI output is clearly marked as advisory.
- Missing location can remain unknown in AI Assist rather than being invented.
- The user can correct AI suggestions before submission.
- A new report starts in Submitted status.
- Authority owns review and assignment.
- Staff owns the cleaning task and after-cleaning evidence.
- Authority owns final verification.
- The user can identify the current stage and what happens next.

## Feedback Questions

Ask every tester the same core questions so the findings are comparable.

1. What was easiest to understand?
2. What was confusing or took longer than expected?
3. Did you understand what the AI was suggesting versus deciding?
4. Could you tell what information was missing?
5. Did you know what happens after submitting the report?
6. Could you tell who is responsible at each stage?
7. Did anything make you hesitate before submitting?
8. What single change would make this easier to use?

## Success Criteria

| Criterion | Pass condition |
|---|---|
| Report comprehension | Tester can explain what they are reporting |
| AI comprehension | Tester understands suggestions require confirmation |
| Correction ability | Tester can edit/override AI suggestions |
| Submission confidence | Tester can explain what will happen after submission |
| Workflow comprehension | Tester can identify the next stage and responsible role |
| Evidence comprehension | Tester understands the purpose of before/after evidence |

These are usability criteria, not claims of statistical significance. A tester is complete only when the interaction and underlying evidence are retained.

## Evidence Required Per Tester

- Screenshot or recording of the AI Assist interaction.
- Screenshot or recording of the report submission.
- Tester feedback notes.
- Specific friction observed.
- The prototype change caused by the feedback.
- Retest evidence after the change.

Suggested filenames:

- review2_t01_ai_assist.png
- review2_t01_submit.png
- review2_t01_feedback.md
- review2_t01_retest.png
- review2_t02_feedback.md
- review2_t03_feedback.md

## Results Table

| Tester | Key friction | Exact feedback | Change made | Retest result | Evidence |
|---|---|---|---|---|---|
| T01 | | | | | |
| T02 | | | | | |
| T03 | | | | | |

## Improvement Mapping

| Finding | Product change | Why it matters | Re-tested? |
|---|---|---|---|
| | | | |
| | | | |
| | | | |

## Integrity Rules

- Never invent a tester.
- Never invent feedback.
- Never convert a planned task into a passed result.
- Do not record personal information that is unnecessary for evaluation.
- Use only actual screenshots, recordings or notes as evidence.
- Controlled prototype data may demonstrate workflow behavior, but it must be labelled as controlled data.
- User validation does not prove real-world environmental impact.
