# Supabase integration

WasteVoice AI uses Supabase for authentication, PostgreSQL data, and evidence storage.

## Current runtime contract

The frontend is already implemented against these application objects:

```text
profiles
reports
report_evidence
report_assignments
authority_reviews
```

The frontend also invokes workflow RPCs for protected state changes, including:

```text
staff_update_task_status
assign_report_to_staff
authority_review_report
reporter_update_report
```

These names are the **application contract observed in the current frontend**, not a claim that a particular SQL migration is already deployed in the connected Supabase project.

## Environment

Create a local `.env` file containing:

```text
VITE_SUPABASE_URL=your-project-url
VITE_SUPABASE_ANON_KEY=your-anon-key
```

Never commit `.env`, service-role keys, database passwords, or other secrets.

## Evidence storage

The report form uses the Supabase Storage bucket:

```text
waste-evidence
```

Before-cleaning uploads are stored under a report/user-specific path. Staff after-cleaning evidence is associated with the same report through `report_evidence`.

## Verification before deployment

Before treating the database as production-ready, verify the connected Supabase project directly:

1. Confirm the tables above exist with the columns used by the frontend.
2. Confirm the four workflow RPCs exist with the expected parameters and return behavior.
3. Confirm authentication profiles and roles are present.
4. Confirm Row Level Security prevents cross-role or cross-user access.
5. Confirm Storage policies allow the intended evidence workflow without exposing unrelated files.
6. Run the complete Reporter → Authority → Staff → Authority verification flow.

A previous draft `schema.sql` was removed from the public repository because its table/RPC names did not match the application's actual runtime contract. This prevents evaluators from mistaking an unverified draft for the deployed database schema.
