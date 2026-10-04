# WasteVoice AI — Database Contract

This document describes the current application contract and the connected Supabase project as inspected on **04 October 2026**. It is still not a substitute for the final role-by-role runtime security test.

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

The following deployed signatures were verified against the connected Supabase project:

## Verified workflow RPC signatures

- `reporter_update_report(p_report_id uuid, p_location text, p_description text, p_additional_info text)`
- `assign_report_to_staff(p_report_id uuid, p_staff_id uuid)`
- `staff_update_task_status(p_assignment_id uuid, p_status text)`
- `authority_review_report(p_report_id uuid, p_decision text, p_reason text, p_notes text)`

Active application RPCs require the authenticated role; anonymous execute access was removed during Review 2 hardening.

## Storage

Evidence uploads use the Supabase Storage bucket:

```text
waste-evidence
```

Reporter before-evidence uploads use a user/report-specific path. Staff after-evidence uploads are associated with the corresponding report. The `waste-evidence` bucket is private and the browser resolves stored paths through signed URLs.

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

## Live configuration notes

- RLS is enabled on the inspected core application tables.
- The connected project currently has 3 Auth users and 0 `profiles` rows; those existing demo accounts must be mapped to intended roles before the role-based live demo.
- Two legacy tables (`report_activity` and `waste_reports`) are retained but are not part of the current frontend runtime contract.

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
