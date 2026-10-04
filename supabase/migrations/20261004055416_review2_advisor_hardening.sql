-- WasteVoice AI Review 2 advisor hardening
-- Applied to Supabase project on 2026-10-04.

alter function public.update_updated_at()
set search_path = public, pg_temp;

create policy "review2_deny_report_activity"
on public.report_activity
as restrictive
for all
to anon, authenticated
using (false)
with check (false);

create policy "review2_deny_legacy_waste_reports"
on public.waste_reports
as restrictive
for all
to anon, authenticated
using (false)
with check (false);

revoke execute on function public.report_to_staff(uuid, uuid) from public, anon, authenticated;
revoke execute on function public.staff_update_report_status(uuid, text) from public, anon, authenticated;
revoke execute on function public.update_assigned_task_status(uuid, text) from public, anon, authenticated;
revoke execute on function public.update_assigned_task_status(uuid, report_status) from public, anon, authenticated;
revoke execute on function public.update_my_assigned_report_status(uuid, text) from public, anon, authenticated;
revoke execute on function public.handle_new_user() from public, anon, authenticated;
