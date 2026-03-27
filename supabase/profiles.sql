create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text not null,
  email text not null,
  phone text not null unique,
  plan text not null default 'free',
  monthly_quota integer,
  monthly_used integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles add column if not exists email text;
alter table public.profiles add column if not exists phone text;

update public.profiles
set email = lower(trim(auth.users.email))
from auth.users
where public.profiles.id = auth.users.id
  and (public.profiles.email is null or btrim(public.profiles.email) = '');

update public.profiles
set phone = nullif(regexp_replace(phone, '\D', '', 'g'), '')
where phone is not null;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'profiles_email_key'
      and conrelid = 'public.profiles'::regclass
  ) then
    alter table public.profiles add constraint profiles_email_key unique (email);
  end if;

  if not exists (
    select 1
    from pg_constraint
    where conname = 'profiles_phone_key'
      and conrelid = 'public.profiles'::regclass
  ) then
    alter table public.profiles add constraint profiles_phone_key unique (phone);
  end if;

  if not exists (
    select 1
    from public.profiles
    where email is null or btrim(email) = ''
  ) then
    alter table public.profiles alter column email set not null;
  end if;

  if not exists (
    select 1
    from public.profiles
    where phone is null or btrim(phone) = ''
  ) then
    alter table public.profiles alter column phone set not null;
  end if;
end $$;

alter table public.profiles enable row level security;

create policy "users can view own profile"
on public.profiles
for select
to authenticated
using ((select auth.uid()) = id);

create policy "users can insert own profile"
on public.profiles
for insert
to authenticated
with check ((select auth.uid()) = id);

create policy "users can update own profile"
on public.profiles
for update
to authenticated
using ((select auth.uid()) = id)
with check ((select auth.uid()) = id);
