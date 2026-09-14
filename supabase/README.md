# Supabase setup

WasteVoice AI uses `public.reports` as the single canonical report table. Do not recreate or reintroduce a `waste_reports` table for application reports.

## Setup

1. Create/open the project's Supabase database.
2. Open **SQL Editor**.
3. Run `schema.sql` once on a fresh project.
4. In the frontend, configure `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in the local `.env` file.
5. Never commit `.env`, service-role keys, or other secrets.

## Data model

```text
profiles
   |
   +-- reports
          |
          +-- report_evidence
          +-- assignments
          +-- status_history
          +-- verification
```

## Workflow

`Report → Review → Assign → Clean → Evidence → Verify → Resolve`

The database deliberately keeps the final decision under human authority review. AI output is advisory and can be corrected before a report is accepted as structured data.

## Important migration note

The current application foundation previously contained a connection test against `waste_reports`. That obsolete test has been removed. Existing databases should be migrated to the `reports` identity before application data is connected.
