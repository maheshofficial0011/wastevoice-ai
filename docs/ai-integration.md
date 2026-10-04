# WasteVoice AI — AI Integration

## Current Review 2 status

**VERIFIED COMPLETE — live Gemini inference**

The deployed Supabase Edge Function `structure-report` was exercised with the live provider configuration.

Verified live response:

- HTTP 200
- `source = gemini`
- `providerConfigured = true`
- model = `gemini-3.5-flash-lite`
- category, location, summary and missing-field data returned
- `needsConfirmation = true`

The actual `GEMINI_API_KEY` value is never documented.

## AI purpose

WasteVoice AI uses a narrow natural-language understanding task: structure the reporter's own description into conservative fields for human review.

**AI output is advisory and does not directly mutate workflow state.**

## Architecture

```text
Reporter text
   ↓
Authenticated structure-report Edge Function
   ↓
Gemini / gemini-3.5-flash-lite
   ↓
Structured JSON
   ↓
Application validation / safety checks
   ↓
Reporter review and correction
   ↓
Normal workflow
```

## AI responsibilities

- suggest a supported waste category;
- preserve the supplied location;
- create a neutral summary;
- identify missing or vague information;
- require reporter confirmation.

AI must not:

- assign staff;
- approve reports;
- reject reports;
- resolve reports;
- change workflow state;
- declare cleaning complete.

## Safety controls

- input type and length validation;
- structured response validation;
- conservative unknown handling;
- malformed-output rejection;
- unsafe control-language rejection;
- bounded provider timeout;
- safe provider-failure fallback;
- mandatory confirmation.

## Reporter AI Assist — manual browser validation

Test input:

**Location:** College Canteen

**Description:** Several plastic bottles and food wrappers are lying near the entrance.

**Additional information:** Observed during the afternoon.

Observed results:

| Check | Result |
|---|---|
| AI Assist opened | PASS |
| AI analysis completed | PASS |
| Category displayed | PASS |
| Location displayed | PASS |
| Summary displayed | PASS |
| Missing fields displayed | PASS |
| Confirmation requirement displayed | PASS |
| Human control preserved | PASS |
| Copy structured summary | PASS |

The UI action is **“Copy structured summary”**. It copies the structured information and does not authorize a workflow transition.

## Accuracy qualification

Live inference was verified, but this does not establish a statistical accuracy percentage or universal correctness.

No 100% accuracy claim is made.

## Automated AI coverage

The repository contains 11 AI safety/structuring tests plus 10 Review 2 regression/guard tests. These are contract/safety checks, not model-accuracy measurements.

## Secret handling

Provider configuration is server-side through Supabase Edge Function secrets:

- `GEMINI_API_KEY`
- `AI_PROVIDER=gemini`
- `AI_MODEL=gemini-3.5-flash-lite`

No secret value belongs in the repository or frontend bundle.

## Known limitations

Three genuine external Review 2 tester sessions have not been claimed. The AI remains human-controlled even though live inference is now verified.
