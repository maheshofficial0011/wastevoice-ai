# WasteVoice AI - Review 2 Live Setup

## Verified live state (04 October 2026)

- Supabase project: wastevoice-ai
- Region: ap-south-1
- Application tables exist and RLS is enabled.
- 3 Auth users exist.
- 3 explicit profiles exist: Reporter, Authority and Staff.
- Edge Function structure-report is ACTIVE with JWT verification enabled.
- Live provider: Gemini.
- Live model: gemini-3.5-flash-lite.
- Live function test: HTTP 200, source=gemini, providerConfigured=true.
- waste-evidence Storage bucket is private.

## 1. Create Reporter / Authority / Staff profiles

The application routes users from the profiles.role field. Create one profile for each intended Review 2 demo account after checking the Supabase Auth users list.

Use this SQL template with the exact Auth UUIDs selected by the project team:

```sql
insert into public.profiles (id, full_name, role)
values
  ('REPORTER_AUTH_USER_UUID', 'Review 2 Reporter', 'reporter'),
  ('AUTHORITY_AUTH_USER_UUID', 'Review 2 Authority', 'authority'),
  ('STAFF_AUTH_USER_UUID', 'Review 2 Staff', 'staff')
on conflict (id) do update
set full_name = excluded.full_name, role = excluded.role;
```

Verify:

```sql
select id, full_name, role from public.profiles order by role;
```

Do not guess role assignments.

## 2. Configure live AI inference

The deployed structure-report Edge Function reads these server-side secrets:

```bash
AI_PROVIDER=gemini
AI_MODEL=gemini-3.5-flash-lite
GEMINI_API_KEY=<Supabase secret>
```

Do not place the provider key in React source or any committed environment file.

Without the provider secret, the function intentionally returns a clearly labelled conservative fallback. That fallback is useful for a safe demo, but it must not be called live model inference.

## 3. Review 2 AI test cases

Run the following four cases in Reporter -> AI Assist and retain the input/output evidence.

### Case A - Complete

Location: Campus Park near the walking path

Description: Plastic bottles and wrappers are collected beside the walking path.

Expected: a plastic suggestion may be returned, supplied location is preserved, summary is neutral, no unsupported facts are added, confirmation remains required.

### Case B - Missing location

Location: blank

Description: There is a large amount of plastic waste.

Expected: location remains unknown; no location is invented.

### Case C - Missing category

Location: Campus Park near the walking path

Description: There is a pile of waste near the entrance.

Expected: category may remain unknown; no waste type is invented.

### Case D - Vague input

Location: Campus Park

Description: The place is very dirty.

Expected: conservative output; missing or vague detail is identified; no specific category is invented.

## 4. Required 3-tester validation

Review 2 needs at least three real testers.

Each tester should:

1. Sign in.
2. Open AI Assist.
3. Enter an observed waste description.
4. Review the AI suggestions.
5. Correct anything inaccurate.
6. Continue to the normal report form.
7. Add before evidence.
8. Submit.
9. Authority reviews and assigns staff.
10. Staff updates status and adds after evidence.
11. Authority verifies.

For every tester retain the task, friction, exact feedback, prototype change, retest result, and supporting screenshot/recording/notes.

Never invent tester feedback or completion statistics.

## 5. Final security verification

Core role-based authorization and private-storage controls have been verified through live database probes and browser testing. Only the cross-staff negative browser test remains pending because a second Staff identity is unavailable.


- Reporter reads only permitted reports.
- Staff reads only assigned reports.
- Authority can review required reports.
- Staff cannot make the final resolved decision.
- Reporter cannot assign staff.
- Anonymous users cannot execute the four protected workflow RPCs.
- Evidence is not publicly readable.
- Signed evidence previews work for permitted users.