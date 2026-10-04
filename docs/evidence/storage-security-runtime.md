# Review 2 Storage Security Runtime Evidence

**Date:** 04 October 2026
**Environment:** Connected Supabase project wastevoice-ai

## Status

**Policy/runtime database verification: VERIFIED COMPLETE**
**Browser/network evidence: IMPLEMENTED — EVIDENCE PENDING**

## Verified live configuration

- waste-evidence is private.
- Legacy report-evidence is now also private.
- Reporter, Staff and Authority policies are role/path constrained.
- Legacy report-evidence uploads are no longer allowed by the removed legacy upload policy.
- Current client evidence handling uses signed URLs and recognizes the two evidence buckets only.

## Live role-scoped object probes

| Test | Expected | Actual | Result |
|---|---|---|---|
| Reporter reads legacy evidence | Own referenced evidence allowed | 12 objects visible for the Reporter account | VERIFIED COMPLETE |
| Staff reads assigned legacy evidence | Assigned object allowed | Selected assigned object visible (1) | VERIFIED COMPLETE |
| Staff reads unassigned legacy evidence | Denied | Selected unassigned object visible (0) | VERIFIED COMPLETE |
| Authority reads legacy evidence | Authority review access allowed | 12 objects visible | VERIFIED COMPLETE |
| Public bucket configuration | Private | report-evidence.public = false | VERIFIED COMPLETE |

The Staff probes used isolated transaction/request-JWT context and did not modify production rows.

## Browser/network checks not executed

| Test | Required result | Status |
|---|---|---|
| Direct public URL request | DENIED | IMPLEMENTED — EVIDENCE PENDING |
| Authorized signed URL download | ALLOWED | IMPLEMENTED — EVIDENCE PENDING |
| Wrong-role evidence access | DENIED | IMPLEMENTED — EVIDENCE PENDING |
| Expired signed URL | DENIED | IMPLEMENTED — EVIDENCE PENDING |

The current execution environment does not provide a logged-in browser session, and direct external network access is unavailable for a reliable HTTP capture. No browser PASS is claimed.