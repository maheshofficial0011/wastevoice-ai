# Supabase Integration — Review 2

Project: wastevoice-ai
Region: ap-south-1

## Current application contract
Application tables: profiles, reports, report_evidence, report_assignments, authority_reviews.
Legacy tables still present: report_activity, waste_reports.
RLS is enabled on the inspected tables.

## Protected workflow operations
Active frontend RPCs: reporter_update_report, assign_report_to_staff, staff_update_task_status, authority_review_report.
Anonymous execution was removed from these active workflow RPCs.
Legacy RPCs no longer used by the current frontend were restricted from API execution.

## Evidence storage
Bucket: waste-evidence
Current state: private bucket, authenticated role-specific policies, signed URL previews.
The report record stores the Storage path rather than a public URL.

## AI Edge Function
Deployed function: structure-report.
JWT verification: enabled.
Server-side secrets: OPENAI_API_KEY and optional OPENAI_MODEL.
Until the provider secret is configured, the function uses a labelled conservative fallback.

## Review 2 live setup
See docs/review-2-live-setup.md.
Current live state: 3 Auth users exist and all 3 now have explicit Reporter, Authority and Staff profile rows.
The Login page is now backed by the intended Reporter, Authority and Staff profile mapping. Browser login still requires the account passwords.

## Remaining security notes
Supabase security advisors still report SECURITY DEFINER helper functions exposed in the public schema and leaked-password protection disabled. These remain documented hardening items.