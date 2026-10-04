# WasteVoice AI — Review 2 User Validation Kit

**Purpose:** run the minimum three genuine Review 2 tester sessions and capture evidence without fabricating results.

> The project requires real human validation. This file is a prepared script, not a completed validation record.

**Engineering readiness note (04 October 2026):** role profiles and live database authorization/storage controls are ready for browser sessions. Live AI provider configuration and account passwords remain external.

## Tester 1 — Reporter

### Task

"Imagine you see unmanaged waste near the campus park. Use WasteVoice AI to report what you observed."

### Steps

1. Sign in as Reporter.
2. Open AI Assist.
3. Enter the observation.
4. Review the AI suggestions.
5. Correct anything inaccurate.
6. Continue to the report form.
7. Add before evidence.
8. Submit.
9. Review the resulting status.

### Questions

1. Was the reporting flow easy to understand?
2. Was AI assistance useful?
3. Did you understand that the AI was suggesting rather than deciding?
4. Did anything feel confusing?
5. What one change would make this easier?

## Tester 2 — Reporter

### Task

"Submit a waste report and explain what you think will happen after submission."

### Questions

1. Was the status clear?
2. Did you understand who handles the issue next?
3. Was the next action obvious?
4. Did you know what evidence was required?
5. What should be improved?

## Tester 3 — Authority/Staff Workflow Observer

### Task

"Process a submitted waste report through review, assignment, cleaning evidence and authority verification."

### Questions

1. Was responsibility clear at each stage?
2. Was the workflow understandable?
3. Was evidence comparison useful?
4. Was anything difficult or slow?
5. What should change?

## Tester Record

| Tester | Date/time | Role | Task completed | Friction | Exact feedback | Product change | Retest | Evidence |
|---|---|---|---|---|---|---|---|---|
| T01 |  | Reporter |  |  |  |  |  |  |
| T02 |  | Reporter |  |  |  |  |  |  |
| T03 |  | Authority/Staff |  |  |  |  |  |  |

## Feedback → Change → Retest

For every meaningful finding, record:

**Observed friction → exact feedback → selected change → implementation → regression test → tester retest**

Do not replace actual feedback with a summary invented afterward.

## Suggested evidence files

`docs/evidence/users/T01-ai-assist.png`  
`docs/evidence/users/T01-submit.png`  
`docs/evidence/users/T01-feedback.md`  
`docs/evidence/users/T01-retest.png`

Repeat for T02 and T03.

## Completion rule

A tester counts as complete only when the interaction actually occurred and its evidence is retained. Database-only probes or controlled screenshots do not count.
