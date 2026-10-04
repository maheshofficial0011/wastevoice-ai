# Review 2 Live AI Test Matrix

**Date:** 04 October 2026  
**Provider:** Gemini  
**Model:** gemini-3.5-flash-lite  
**Function:** structure-report

## Live verification

A live request to the deployed Edge Function returned:

- HTTP 200
- source = gemini
- providerConfigured = true
- model = gemini-3.5-flash-lite
- category = mixed
- location = College Canteen
- generated summary
- missing-field information
- needsConfirmation = true

The provider secret value is not stored in this evidence record.

## Reporter AI Assist browser test

Input:

- Location: College Canteen
- Description: Several plastic bottles and food wrappers are lying near the entrance.
- Additional information: Observed during the afternoon.

Observed:

| Case | Result |
|---|---|
| AI Assist opened | PASS |
| AI analysis completed | PASS |
| Category displayed | PASS |
| Location displayed | PASS |
| Summary displayed | PASS |
| Missing fields displayed | PASS |
| needsConfirmation displayed | PASS |
| Human control preserved | PASS |
| Copy Structured Summary | PASS |

The UI action is **Copy Structured Summary**. It copies the structured summary for use in the reporting workflow; it does not apply a workflow decision.

## Automated AI coverage

The repository contains 11 AI safety/structuring tests plus 10 Review 2 regression/guard tests.

Covered boundaries include:

- complete and incomplete descriptions;
- missing location/category;
- vague and contradictory input;
- prompt injection;
- oversized input;
- malformed provider output;
- unsafe provider fields;
- missing-provider fallback;
- prompt isolation;
- invalid categories;
- conservative fallback;
- non-operational AI output.

These tests are safety/contract checks, not a statistical accuracy study.

## Required evidence integrity

Do not claim:

- 100% accuracy;
- universal classification correctness;
- production impact;
- autonomous workflow decisions;
- replacement of human judgment.

AI output is advisory and does not directly mutate workflow state.

## Additional live cases

AI-01 through AI-11 should be marked **VERIFIED COMPLETE** only where an actual live-provider execution was observed and retained. Automated safety tests must not be relabelled as live-model outputs.
