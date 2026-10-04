# Review 2 Runtime Security Tests

**Date:** 04 October 2026  
**Environment:** Connected Supabase project `wastevoice-ai`

> These probes used the real database authorization functions and policies with isolated transaction/request-JWT context. No production rows were intentionally modified.

| Attack / unauthorized action | Expected | Actual | Result |
|---|---|---|---|
| Reporter → `assign_report_to_staff` | Denied | `Only an authority can assign reports` | ✅ PASS |
| Reporter → `authority_review_report` | Denied | `Only authority users can verify reports` | ✅ PASS |
| Staff → `authority_review_report` | Denied | `Only authority users can verify reports` | ✅ PASS |
| Staff → `staff_update_task_status(..., 'resolved')` | Denied | `Staff can only set cleaning_in_progress or pending_verification` | ✅ PASS |
| Authority → verify already-resolved report | Denied | `Report is not awaiting authority verification. Current status: resolved` | ✅ PASS |
| Staff → unassigned report read | 0 rows | 0 rows | ✅ PASS |
| Staff → unassigned report evidence read | 0 rows | 0 rows | ✅ PASS |
| Anonymous → `assign_report_to_staff` EXECUTE privilege | Denied | `has_function_privilege(...) = false` | ✅ PASS |

## Runtime role-access counts observed

- Reporter visible reports: 16 own reports
- Reporter visible assignments: 0
- Staff visible assigned reports: 12
- Authority visible reports: 16

These counts describe the existing controlled project dataset; they are not impact metrics.

## Remaining direct-browser checks

- Real browser login per role
- Public direct Storage URL request
- Signed URL download
- Signed URL expiry
- Wrong-role browser evidence access
