# WasteVoice AI — Architecture

## Review 2 architecture
WasteVoice AI is a React + TypeScript application using Supabase for authentication, PostgreSQL data, Storage, and protected workflow functions.
The Review 2 AI capability is a server-side natural-language report-structuring function.

## Runtime layers
- Reporter: location, description, before evidence, AI Assist, human confirmation.
- AI: Supabase Edge Function structure-report, JWT verification, schema-constrained output, conservative fallback.
- Workflow/data: Supabase Auth, PostgreSQL, protected RPCs, private Storage, signed evidence URLs.
- Human decisions: reporter confirms information, authority assigns staff, staff performs cleaning, authority makes final resolution.

## Data flow
Reporter observation -> React form -> validated text -> Supabase Edge Function -> natural-language understanding -> structured AI output -> reporter confirmation -> report workflow -> authority review/assignment -> staff cleaning/after evidence -> authority verification -> resolved or correction required.

## Feedback loop
Tester feedback and reporter corrections feed the next prototype iteration. AI suggestions are advisory and do not become workflow truth until a person confirms them.

Visual Review 2 block diagram: docs/architecture-review2.svg