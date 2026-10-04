# Review 2 Storage Security Tests

**Date:** 04 October 2026  
**Environment:** Connected Supabase project `wastevoice-ai`

## Verified live configuration

- Bucket: `waste-evidence`
- Access model: **private**
- Role-scoped Storage policies are present for Reporter, Staff and Authority.
- Reporter upload is constrained to the reporter-owned `reports/<user-id>/...` path.
- Staff upload/read is constrained to reports assigned to the current Staff user.
- Authority can read evidence required for verification.
- Current client code uses short-lived signed URLs for evidence previews.

## Policy-level checks

| Test | Expected | Actual | Result |
|---|---|---|---|
| Public bucket configuration | Private | `public=false` | ✅ PASS |
| Reporter own evidence policy | Own report only | Policy joins `report_evidence → reports.reporter_id = auth.uid()` | ✅ PASS |
| Staff assigned evidence policy | Assigned reports only | Policy checks `report_assignments.staff_id = auth.uid()` | ✅ PASS |
| Authority evidence policy | Authority-only reads | Policy checks Authority role | ✅ PASS |
| Reporter upload path | Own user folder | Policy checks `reports/<auth.uid>/...` | ✅ PASS |
| Staff upload | Assigned report only | Policy checks assignment ownership | ✅ PASS |

## Direct storage URL test

A direct public URL request was not executed successfully from the current container because external DNS resolution is unavailable. No result is being fabricated.

Expected behavior for the private bucket is documented by Supabase: private assets are not accessible through the public object URL and must be accessed with an authenticated request or a signed URL.

## Still required for final browser evidence

- Authorized Reporter signed-URL preview
- Authorized Staff assigned-evidence preview
- Authorized Authority preview
- Wrong-role denial in the browser
- Expired signed URL capture
