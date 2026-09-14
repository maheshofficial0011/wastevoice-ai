-- WasteVoice AI — canonical database schema
-- Project Better Tomorrow / C29 Semester 3
-- Canonical report identity: public.reports.id
-- Run this in the Supabase SQL Editor for a new project.

create extension if not exists "pgcrypto";

-- Roles are stored separately from auth.users so application data can be
-- queried safely from the client through RLS.
create type public.user_role as enum ('reporter', 'authority', 'staff');

create type public.report_status as enum (
  'submitted',
  'ai_structured',
  'under_review',
  'assigned',
  'before_evidence_uploaded',
  'cleaning_in_progress',
  'after_evidence_uploaded',
  'verification_pending',
  'resolved'
);

create type public.evidence_type as enum ('before', 'after');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null default '',
  role public.user_role not null default 'reporter',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.reports (
  id uuid primary key default gen_random_uuid(),
  reporter_id uuid not null references public.profiles(id) on delete restrict,
  description text not null,
  location text not null,
  ai_structured_description text,
  ai_suggested_category text,
  ai_confidence numeric(5,4) check (ai_confidence is null or (ai_confidence >= 0 and ai_confidence <= 1)),
  status public.report_status not null default 'submitted',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.report_evidence (
  id uuid primary key default gen_random_uuid(),
  report_id uuid not null references public.reports(id) on delete cascade,
  evidence_type public.evidence_type not null,
  file_url text not null,
  uploaded_by uuid not null references public.profiles(id) on delete restrict,
  created_at timestamptz not null default now(),
  unique (report_id, evidence_type)
);

create table public.assignments (
  id uuid primary key default gen_random_uuid(),
  report_id uuid not null references public.reports(id) on delete cascade,
  staff_id uuid not null references public.profiles(id) on delete restrict,
  assigned_by uuid not null references public.profiles(id) on delete restrict,
  assigned_at timestamptz not null default now(),
  completed_at timestamptz,
  unique (report_id)
);

create table public.status_history (
  id uuid primary key default gen_random_uuid(),
  report_id uuid not null references public.reports(id) on delete cascade,
  status public.report_status not null,
  changed_by uuid references public.profiles(id) on delete set null,
  note text,
  created_at timestamptz not null default now()
);

create table public.verification (
  id uuid primary key default gen_random_uuid(),
  report_id uuid not null unique references public.reports(id) on delete cascade,
  authority_id uuid not null references public.profiles(id) on delete restrict,
  decision text not null check (decision in ('approved', 'rejected')),
  notes text,
  created_at timestamptz not null default now()
);

create index reports_reporter_id_idx on public.reports(reporter_id);
create index reports_status_idx on public.reports(status);
create index reports_created_at_idx on public.reports(created_at desc);
create index evidence_report_id_idx on public.report_evidence(report_id);
create index assignments_staff_id_idx on public.assignments(staff_id);
create index status_history_report_id_idx on public.status_history(report_id);

-- Helper functions. These are security-definer functions with a fixed search
-- path so role checks do not depend on caller-controlled schema resolution.
create or replace function public.current_user_role()
returns public.user_role
language sql
stable
security definer
set search_path = public
as $$
  select role from public.profiles where id = auth.uid();
$$;

create or replace function public.is_authority()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'authority'
  );
$$;

create or replace function public.is_staff()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'staff'
  );
$$;

-- New users receive a reporter profile by default. Privileged roles should be
-- assigned by an authorized database/admin workflow, not by client input.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', ''),
    'reporter'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

-- Keep updated_at current for mutable application records.
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

drop trigger if exists reports_set_updated_at on public.reports;
create trigger reports_set_updated_at
before update on public.reports
for each row execute function public.set_updated_at();

-- Automatically record report status changes.
create or replace function public.record_report_status_change()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if tg_op = 'INSERT' then
    insert into public.status_history(report_id, status, changed_by, note)
    values (new.id, new.status, auth.uid(), 'Report created');
  elsif new.status is distinct from old.status then
    insert into public.status_history(report_id, status, changed_by)
    values (new.id, new.status, auth.uid());
  end if;
  return new;
end;
$$;

drop trigger if exists reports_record_status_change on public.reports;
create trigger reports_record_status_change
after insert or update of status on public.reports
for each row execute function public.record_report_status_change();

-- Enable Row Level Security on every application table.
alter table public.profiles enable row level security;
alter table public.reports enable row level security;
alter table public.report_evidence enable row level security;
alter table public.assignments enable row level security;
alter table public.status_history enable row level security;
alter table public.verification enable row level security;

-- Profiles: users can read their own profile. Authorities can read profiles
-- needed for assignment/review. Users cannot self-promote by updating role.
drop policy if exists "profiles_select_own_or_authority" on public.profiles;
create policy "profiles_select_own_or_authority"
on public.profiles for select to authenticated
using (id = auth.uid() or public.is_authority());

drop policy if exists "profiles_update_own_name" on public.profiles;
create policy "profiles_update_own_name"
on public.profiles for update to authenticated
using (id = auth.uid())
with check (id = auth.uid() and role = (select role from public.profiles where id = auth.uid()));

-- Reports: reporters see/create their own reports; authority can review all;
-- assigned staff can see the reports assigned to them.
drop policy if exists "reports_insert_reporter" on public.reports;
create policy "reports_insert_reporter"
on public.reports for insert to authenticated
with check (reporter_id = auth.uid());

drop policy if exists "reports_select_role_scoped" on public.reports;
create policy "reports_select_role_scoped"
on public.reports for select to authenticated
using (
  reporter_id = auth.uid()
  or public.is_authority()
  or exists (
    select 1 from public.assignments a
    where a.report_id = reports.id and a.staff_id = auth.uid()
  )
);

drop policy if exists "reports_update_authority" on public.reports;
create policy "reports_update_authority"
on public.reports for update to authenticated
using (public.is_authority())
with check (public.is_authority());

-- Evidence: reporter may upload before evidence for own report; staff may
-- upload after evidence for assigned report; authority can review all.
drop policy if exists "evidence_select_role_scoped" on public.report_evidence;
create policy "evidence_select_role_scoped"
on public.report_evidence for select to authenticated
using (
  public.is_authority()
  or uploaded_by = auth.uid()
  or exists (
    select 1 from public.reports r
    where r.id = report_evidence.report_id and r.reporter_id = auth.uid()
  )
  or exists (
    select 1 from public.assignments a
    where a.report_id = report_evidence.report_id and a.staff_id = auth.uid()
  )
);

drop policy if exists "evidence_insert_role_scoped" on public.report_evidence;
create policy "evidence_insert_role_scoped"
on public.report_evidence for insert to authenticated
with check (
  uploaded_by = auth.uid()
  and (
    (evidence_type = 'before' and exists (
      select 1 from public.reports r
      where r.id = report_id and r.reporter_id = auth.uid()
    ))
    or
    (evidence_type = 'after' and exists (
      select 1 from public.assignments a
      where a.report_id = report_id and a.staff_id = auth.uid()
    ))
  )
);

-- Assignments: authority creates assignments; assigned staff and authority can read.
drop policy if exists "assignments_select_role_scoped" on public.assignments;
create policy "assignments_select_role_scoped"
on public.assignments for select to authenticated
using (staff_id = auth.uid() or public.is_authority());

drop policy if exists "assignments_insert_authority" on public.assignments;
create policy "assignments_insert_authority"
on public.assignments for insert to authenticated
with check (public.is_authority() and assigned_by = auth.uid());

drop policy if exists "assignments_update_authority" on public.assignments;
create policy "assignments_update_authority"
on public.assignments for update to authenticated
using (public.is_authority())
with check (public.is_authority());

-- Status history is append-only from application users. Reads are scoped to
-- users who can see the corresponding report.
drop policy if exists "status_history_select_role_scoped" on public.status_history;
create policy "status_history_select_role_scoped"
on public.status_history for select to authenticated
using (
  exists (
    select 1 from public.reports r
    where r.id = status_history.report_id
    and (
      r.reporter_id = auth.uid()
      or public.is_authority()
      or exists (
        select 1 from public.assignments a
        where a.report_id = r.id and a.staff_id = auth.uid()
      )
    )
  )
);

-- The trigger writes status history. No client insert policy is needed.

-- Verification: authority-only final decision and review.
drop policy if exists "verification_select_role_scoped" on public.verification;
create policy "verification_select_role_scoped"
on public.verification for select to authenticated
using (
  public.is_authority()
  or exists (
    select 1 from public.reports r
    where r.id = verification.report_id and r.reporter_id = auth.uid()
  )
);

drop policy if exists "verification_insert_authority" on public.verification;
create policy "verification_insert_authority"
on public.verification for insert to authenticated
with check (public.is_authority() and authority_id = auth.uid());

drop policy if exists "verification_update_authority" on public.verification;
create policy "verification_update_authority"
on public.verification for update to authenticated
using (public.is_authority() and authority_id = auth.uid())
with check (public.is_authority() and authority_id = auth.uid());

-- Explicitly revoke broad public access. Supabase's service role bypasses RLS
-- and must never be exposed in the frontend.
revoke all on public.profiles from anon;
revoke all on public.reports from anon;
revoke all on public.report_evidence from anon;
revoke all on public.assignments from anon;
revoke all on public.status_history from anon;
revoke all on public.verification from anon;
