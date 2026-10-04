# Review 2 Live AI Test Matrix

**Audit date:** 04 October 2026
**Function:** structure-report
**Live deployment:** ACTIVE, version 2, JWT verification enabled
**Live provider status:** OPENAI_API_KEY not configured; live model inference was not executed.

## Integrity rule

The matrix below separates automated safety coverage from live provider behavior. An automated PASS is not presented as a live-model PASS.

| Case | Expected behavior | Live status | Actual live result | Automated coverage | Evidence |
|---|---|---|---|---|---|
| AI-01 Complete report | Sensible category/location/summary; no invented facts | EXTERNAL ACTION REQUIRED | Not run; provider secret unavailable | PASS in deterministic fallback test | tests/report-assistant.test.mjs |
| AI-02 Missing location | Location remains unknown/uncertain; no invented location | EXTERNAL ACTION REQUIRED | Not run; provider secret unavailable | PASS | tests/report-assistant.test.mjs |
| AI-03 Missing category | Conservative category or confirmation required | EXTERNAL ACTION REQUIRED | Not run; provider secret unavailable | PASS | tests/report-assistant.test.mjs |
| AI-04 Vague report | No hallucinated details; more detail requested | EXTERNAL ACTION REQUIRED | Not run; provider secret unavailable | PASS | tests/report-assistant.test.mjs |
| AI-05 Contradictory input | Uncertainty surfaced; no arbitrary conclusion | EXTERNAL ACTION REQUIRED | Not run; provider secret unavailable | PASS | tests/report-assistant.test.mjs |
| AI-06 Prompt injection | Treated as report content; no workflow authority | EXTERNAL ACTION REQUIRED | Not run against live model | PASS | tests/report-assistant.test.mjs |
| AI-07 Oversized input | Rejected before provider execution | IMPLEMENTED — EVIDENCE PENDING | Live provider path not invoked | PASS | tests/report-assistant.test.mjs |
| AI-08 Provider failure | Safe fallback; no fake live result | IMPLEMENTED — EVIDENCE PENDING | Provider absence is handled by deterministic fallback; live provider outage capture not run | PASS for fallback logic | tests/report-assistant.test.mjs |
| AI-09 Malformed provider output | Schema/output validation rejects unsafe output | IMPLEMENTED — EVIDENCE PENDING | Live malformed payload not injected | PASS | tests/report-assistant.test.mjs |
| AI-10 Unsafe provider fields | Unsafe control language cannot become workflow authority | IMPLEMENTED — EVIDENCE PENDING | Live unsafe provider payload not injected | PASS | tests/report-assistant.test.mjs |
| AI-11 Human confirmation | AI result remains advisory and requires correction/confirmation | IMPLEMENTED — EVIDENCE PENDING | UI source verified; browser evidence not captured | PASS for needsConfirmation boundary | tests/report-assistant.test.mjs |

## Verified implementation controls

- Request validation limits location/description/additional information.
- Provider call has an 8-second timeout.
- Structured output uses a strict JSON Schema.
- Provider output is parsed and validated before returning it.
- Control-language output is rejected.
- Missing provider configuration returns a clearly labelled conservative fallback.
- needsConfirmation is forced to true.
- The Edge Function contains no workflow mutation operation.

## Exact external action

Configure OPENAI_API_KEY and an allowed OPENAI_MODEL in the Supabase Edge Function environment, then execute AI-01 through AI-11 and retain actual screenshots/output. Do not replace missing live outputs with deterministic fallback results.