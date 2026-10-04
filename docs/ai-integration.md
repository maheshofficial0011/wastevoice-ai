# WasteVoice AI — AI Integration

## Review 2 status
The first AI milestone is implemented and deployed as Supabase Edge Function structure-report. Live deployment is ACTIVE version 2 with JWT verification enabled. Live provider inference remains EXTERNAL ACTION REQUIRED until the server-side provider secret is configured.

## AI purpose
WasteVoice AI uses a narrow natural-language understanding task: convert a reporter's ordinary-language waste description into conservative structured suggestions that the reporter can review and correct.
The AI is not an autonomous workflow agent.

## Structured output
- category: plastic, paper, food, mixed, other, or unknown
- location: supplied location or unknown
- summary: concise neutral summary
- missingFields: fields that remain missing or vague
- needsConfirmation: always true

## Safety contract
1. Use only facts supplied by the reporter.
2. Preserve uncertainty.
3. Use unknown instead of inventing missing fields.
4. Keep the supplied location unchanged when present.
5. Write a neutral summary.
6. Never assign cleaning staff.
7. Never change workflow status.
8. Never declare cleaning complete.
9. Never approve or resolve a report.
10. Require reporter confirmation before structured information is used.

## Architecture
Reporter -> React Reporter UI -> authenticated request -> Supabase Edge Function -> AI provider -> structured output -> server validation -> reporter review -> normal report workflow.

## Provider and secret handling
The provider API key is read only by the Edge Function.
Required server-side secret: OPENAI_API_KEY
Optional server-side model selection: OPENAI_MODEL
The repository does not contain a provider secret.

## Safe fallback
When the provider secret is absent, or when the provider response cannot be safely validated, the function returns a deterministic conservative fallback and labels the response as fallback mode.
This prevents a fallback response from being presented as live model inference.

## Reliability tests
The repository contains 11 automated AI safety/boundary tests covering complete, missing, vague, contradictory, prompt-injection, oversized, malformed and unsafe-output cases plus fallback and prompt construction. These are deterministic/contract tests, not live-model accuracy measurements.

## Current limitation
The Edge Function is deployed, but live model inference remains pending until OPENAI_API_KEY and an allowed OPENAI_MODEL are configured in the Supabase project. No AI accuracy number is claimed. The live matrix is recorded in docs/evidence/live-ai-test-matrix.md.