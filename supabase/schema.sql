create extension if not exists pgcrypto;

create table if not exists public.lead_submissions (
  id uuid primary key default gen_random_uuid(),
  first_name text not null,
  last_name text not null,
  phone text not null,
  email text not null,
  province text not null,
  debt_range text not null,
  employment text,
  creditors text,
  behind_payments text,
  created_at timestamptz not null default now()
);

create table if not exists public.contact_clicks (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid references public.lead_submissions(id) on delete set null,
  channel text not null check (channel in ('phone', 'email')),
  created_at timestamptz not null default now()
);

create index if not exists contact_clicks_lead_channel_created_at_idx
  on public.contact_clicks (lead_id, channel, created_at desc);

create or replace view public.contact_click_counts as
select
  lead_id,
  channel,
  count(*)::int as click_count,
  max(created_at) as last_clicked_at
from public.contact_clicks
group by lead_id, channel;

alter table public.lead_submissions enable row level security;
alter table public.contact_clicks enable row level security;

grant insert on public.lead_submissions to anon;
grant insert on public.contact_clicks to anon;

drop policy if exists "allow public insert lead submissions" on public.lead_submissions;
create policy "allow public insert lead submissions"
  on public.lead_submissions
  for insert
  to anon
  with check (true);

drop policy if exists "allow public insert contact clicks" on public.contact_clicks;
create policy "allow public insert contact clicks"
  on public.contact_clicks
  for insert
  to anon
  with check (true);