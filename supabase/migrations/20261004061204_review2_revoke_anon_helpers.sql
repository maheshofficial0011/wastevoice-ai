-- WasteVoice AI Review 2 helper-function hardening
-- Applied to Supabase project as migration 20261004061204.

revoke execute on function public.current_user_role() from public, anon;
revoke execute on function public.is_authority() from public, anon;
revoke execute on function public.is_staff() from public, anon;

grant execute on function public.current_user_role() to authenticated, service_role;
grant execute on function public.is_authority() to authenticated, service_role;
grant execute on function public.is_staff() to authenticated, service_role;
