-- Fix reporter before-cleaning evidence persistence and authorized reads.
-- The reporter upload path is reports/<reporter_id>/<report_id>/..., while
-- report_evidence is the canonical history record used by storage read policies.

drop policy if exists "wastevoice_reporter_read_own_evidence" on storage.objects;
drop policy if exists "wastevoice_reporter_insert_before_evidence" on public.report_evidence;
drop policy if exists "wastevoice_reporter_read_own_evidence" on public.report_evidence;

create policy "wastevoice_reporter_read_own_evidence"
on storage.objects
for select
to authenticated
using (
  bucket_id = 'waste-evidence'
  and (storage.foldername(name))[1] = 'reports'
  and exists (
    select 1
    from public.reports r
    where r.id::text = (storage.foldername(name))[3]
      and r.reporter_id = (select auth.uid())
  )
);

create policy "wastevoice_reporter_insert_before_evidence"
on public.report_evidence
for insert
to authenticated
with check (
  uploaded_by = (select auth.uid())
  and evidence_type = 'before_cleaning'
  and exists (
    select 1
    from public.reports r
    where r.id = report_evidence.report_id
      and r.reporter_id = (select auth.uid())
  )
);

create policy "wastevoice_reporter_read_own_evidence"
on public.report_evidence
for select
to authenticated
using (
  exists (
    select 1
    from public.reports r
    where r.id = report_evidence.report_id
      and r.reporter_id = (select auth.uid())
  )
);

-- Backfill the evidence history row for reports that already have a valid
-- before-evidence storage path but no report_evidence row.
insert into public.report_evidence (
  report_id,
  evidence_type,
  file_path,
  uploaded_by
)
select
  r.id,
  'before_cleaning',
  r.evidence_url,
  r.reporter_id
from public.reports r
where r.evidence_url is not null
  and r.evidence_url <> ''
  and not exists (
    select 1
    from public.report_evidence re
    where re.report_id = r.id
      and re.evidence_type = 'before_cleaning'
      and re.file_path = r.evidence_url
  )
  and exists (
    select 1
    from storage.objects so
    where so.bucket_id = 'waste-evidence'
      and so.name = r.evidence_url
  );