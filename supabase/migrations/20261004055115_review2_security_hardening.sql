-- WasteVoice AI Review 2 security hardening
-- Applied to Supabase project on 2026-10-04.

update storage.buckets
set public = false
where id = 'waste-evidence';

drop policy if exists "wastevoice_authenticated_read" on storage.objects;
drop policy if exists "wastevoice_authenticated_upload" on storage.objects;
drop policy if exists "wastevoice_authenticated_delete" on storage.objects;
drop policy if exists "Authenticated users can view waste evidence" on storage.objects;
drop policy if exists "Authenticated users can upload waste evidence" on storage.objects;
drop policy if exists "wastevoice_reporter_upload_own_evidence" on storage.objects;

create policy "wastevoice_reporter_upload_own_evidence"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'waste-evidence'
  and (storage.foldername(name))[1] = 'reports'
  and (storage.foldername(name))[2] = (select auth.uid())::text
);

revoke execute on function public.reporter_update_report(uuid, text, text, text) from public, anon;
revoke execute on function public.assign_report_to_staff(uuid, uuid) from public, anon;
revoke execute on function public.staff_update_task_status(uuid, text) from public, anon;
revoke execute on function public.authority_review_report(uuid, text, text, text) from public, anon;

grant execute on function public.reporter_update_report(uuid, text, text, text) to authenticated, service_role;
grant execute on function public.assign_report_to_staff(uuid, uuid) to authenticated, service_role;
grant execute on function public.staff_update_task_status(uuid, text) to authenticated, service_role;
grant execute on function public.authority_review_report(uuid, text, text, text) to authenticated, service_role;
