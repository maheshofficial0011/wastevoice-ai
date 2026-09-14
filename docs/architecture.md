# WasteVoice AI — Architecture

## Overview

WasteVoice AI is a React web application backed by Supabase services. The application separates three roles and uses database-side workflow operations for important state changes.

```text
Reporter
  │ location + description + before evidence
  ▼
React + TypeScript UI
  │
  ├── Supabase Auth
  ├── PostgreSQL data
  └── Supabase Storage
        │
        ▼
  Authority Dashboard
        │ review / assign / verify
        ▼
  Staff Dashboard
        │ status + after evidence
        ▼
  Authority Verification
        │
        ├── Resolved
        └── Further action / reopened
```

## Application layers

### Presentation

- Home/landing experience
- Login
- Reporter dashboard
- Report creation/edit flow
- Authority dashboard
- Staff dashboard
- Shared layout/navigation

### Authentication and authorization

Supabase Auth identifies the authenticated user. The application then uses the user's profile role to route the user to the permitted dashboard. Protected-route logic prevents unauthenticated access to role-specific application areas.

### Data

The current frontend contract uses:

- `profiles`
- `reports`
- `report_evidence`
- `report_assignments`
- `authority_reviews`

Important workflow mutations are performed through RPC calls rather than allowing arbitrary client-side state transitions.

## Role boundaries

| Role | Main responsibilities |
|---|---|
| Reporter | Create/edit eligible report, submit before evidence, track own reports |
| Authority | Review reports, assign staff, review completion evidence, resolve/reopen |
| Staff | View assignments, update cleaning progress, upload after evidence |

A staff member does not make the final resolved decision.

## Evidence flow

Before evidence is supplied by the reporter. After evidence is supplied by the assigned staff member. Authority review brings the two pieces of evidence together before final resolution.

## Realtime/update strategy

The workflow dashboards use database reads with periodic refresh and realtime subscription support where configured, with polling serving as a fallback for keeping the UI current.

## AI boundary

The project specification calls for server-side natural-language report structuring. The current public repository does not claim a completed LLM integration. When implemented, the AI layer should sit behind a protected server-side endpoint, return structured output, preserve uncertainty, and require human confirmation.

## Security principles

- No service-role secret in frontend code.
- Supabase credentials come from environment variables.
- Role-sensitive actions are controlled through application/database authorization.
- Final resolution is human controlled.
- Evidence access must be validated against the deployed Supabase RLS/Storage policies before production claims are made.
