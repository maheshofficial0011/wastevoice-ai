-- WasteVoice AI Review 2 hardens the legacy evidence bucket.
-- Existing report records still reference objects in this bucket, so the
-- objects are preserved while public access and unrestricted uploads are removed.

update storage.buckets
set public = false
where id = 'report-evidence';

drop policy if exists "Authenticated users can upload report evidence" on storage.objects;

create policy "review2_legacy_report_evidence_read_authorized"
on storage.objects
for select
to authenticated
using (
  bucket_id = 'report-evidence'
  and exists (
    select 1
    from public.reports r
    left join public.report_assignments ra
      on ra.report_id = r.id
    where right(r.evidence_url, length(storage.objects.name) + 1) =
      '/' || storage.objects.name
      and (
        r.reporter_id = (select auth.uid())
        or exists (
          select 1
          from public.profiles p
          where p.id = (select auth.uid())
            and p.role = 'authority'
        )
        or ra.staff_id = (select auth.uid())
      )
  )
);
