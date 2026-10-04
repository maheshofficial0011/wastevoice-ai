# Review 2 Storage Security Runtime Evidence

**Date:** 04 October 2026

## Verified

- waste-evidence bucket is private.
- Legacy report-evidence bucket is private after hardening.
- Evidence previews are resolved through short-lived signed URLs.
- Staff assigned before-evidence visibility was successfully retested after Storage RLS path handling was corrected.
- The nested before-evidence path format is supported.
- Only the assigned Staff role is permitted by the verified policy boundary.

## Before-evidence fix

Original issue:

The Staff dashboard could not read a valid before-cleaning evidence object using the nested path:

reports/<reporter_id>/<report_id>/before_...

Cause:

The Storage RLS policy interpreted the first path component as the report ID.

Fix:

The policy now resolves the report ID using the third path component when the first component is `reports`, otherwise using the first path component.

Retest:

**PASS — Staff could view the assigned report's before-cleaning evidence.**

This was internal/project-owner validation feedback, not external-user testing.

## Cross-staff isolation

**IMPLEMENTED — EVIDENCE PENDING**

Only one Staff identity is currently available for manual browser testing. A second Staff identity was not created or fabricated.

The policy is role/assignment constrained, but manual cross-staff browser isolation is not claimed as observed.

## npm dependency security

`npm audit` reports **0 known package vulnerabilities** for the current dependency tree. This is separate from Supabase/RLS security and is not a claim of complete security certification.

