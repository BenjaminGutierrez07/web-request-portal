-- Run in Supabase: SQL Editor > New query > paste > Run
-- BEFORE running: replace b29089ff-2c2f-45f2-843b-a6775246f9e0 (3 places) with the
-- admin's "User UID" from Authentication > Users.

create table public.requests (
    id bigint generated always as identity primary key,
    full_name text not null check (char_length(full_name) between 2 and 100),
    whatsapp text not null check (char_length(whatsapp) between 6 and 20),
    barrio text not null check (char_length(barrio) <= 50),
    request_type text not null check (char_length(request_type) between 2 and 100),
    description text not null check (char_length(description) between 5 and 2000),
    status text not null default 'pendiente'
        check (status in ('pendiente', 'en proceso', 'resuelta')),
    created_at timestamptz not null default now()
);

-- Layer 1, privileges: what each role may do AT ALL
grant insert on public.requests to anon, authenticated;
grant select, update on public.requests to authenticated;

-- Layer 2, Row Level Security: which ROWS each role may touch
alter table public.requests enable row level security;

-- Visitors may only create requests (always starting as "pendiente")
create policy "Visitors can send requests"
    on public.requests for insert
    to anon, authenticated
    with check (status = 'pendiente');

-- Only the admin user can read requests
create policy "Admin can read requests"
    on public.requests for select
    to authenticated
    using ((select auth.uid()) = 'b29089ff-2c2f-45f2-843b-a6775246f9e0');

-- Only the admin user can change requests (the status)
create policy "Admin can update requests"
    on public.requests for update
    to authenticated
    using ((select auth.uid()) = 'b29089ff-2c2f-45f2-843b-a6775246f9e0')
    with check ((select auth.uid()) = 'b29089ff-2c2f-45f2-843b-a6775246f9e0');