# WasteVoice AI — Database Contract

This document describes the **frontend runtime contract** observed in the current repository. It is not a substitute for inspecting the connected Supabase project.

## Tables referenced by the application

### `profiles`

Stores the authenticated user's application profile and role.

Relevant role values:

- `reporter`
- `authority`
- `staff`

### `reports`

Canonical waste-report entity. The report stores the reporter, location, description, status and related workflow information used by the dashboards.

### `report_evidence`

Stores evidence associated with a report. The frontend distinguishes before-cleaning and after-cleaning evidence.

### `report_assignments`

Stores the relationship between a report and the staff member assigned to it.

### `authority_reviews`

Stores authority review information and feedback associated with report verification.

## Workflow RPC contract

The frontend invokes these database functions for protected workflow operations:

- `reporter_update_report`
- `assign_report_to_staff`
- `staff_update_task_status`
- `authority_review_report`

The exact deployed signatures must be checked against the connected Supabase project before a SQL migration is published as authoritative.

## Storage

Evidence uploads use the Supabase Storage bucket:

```text
waste-evidence
```

Reporter before-evidence uploads use a user/report-specific path. Staff after-evidence uploads are associated with the corresponding report.

## Expected workflow states

The UI normalizes some legacy status names, but the intended workflow is:

```text
submitted
  ↓
under review
  ↓
action assigned
  ↓
cleaning in progress
  ↓
pending verification
  ↓
resolved
```

A verification rejection can return the report to further cleaning action.

## RLS verification checklist

Before production use, verify directly in Supabase:

- Reporter can read only permitted report data.
- Authority can review the required reports.
- Staff can access only assigned work.
- Reporter cannot assign staff or resolve reports.
- Staff cannot resolve reports.
- Authority-only review/assignment operations cannot be invoked by other roles.
- Evidence access follows the same role boundaries.
- Storage policies do not expose unrelated evidence.

## Why no `schema.sql` is included

An earlier draft schema was removed because its table names (`assignments`, `verification`) did not match the actual frontend contract (`report_assignments`, `authority_reviews`). Publishing an unverified migration would create a misleading source of truth. The deployed Supabase schema should be documented only after it has been inspected and tested against the application.
