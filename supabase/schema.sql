-- Run once in the connected Supabase project's SQL editor.
-- The public site reads published trips. All writes go through authenticated
-- server routes using the server-only secret key.

create table if not exists public.trips (
  slug text primary key,
  document jsonb not null,
  published boolean not null default false,
  updated_at timestamptz not null default now(),
  constraint trips_slug_format check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  constraint trips_document_object check (jsonb_typeof(document) = 'object')
);

alter table public.trips enable row level security;
revoke all on public.trips from anon, authenticated;
grant select on public.trips to anon, authenticated;

drop policy if exists "Visitors read published trips" on public.trips;
create policy "Visitors read published trips"
on public.trips for select to anon, authenticated
using (published = true);

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'trip-photos',
  'trip-photos',
  true,
  6291456,
  array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

-- A public bucket permits downloads. No browser role receives upload or delete
-- policies; the app's authenticated server routes handle those operations.
