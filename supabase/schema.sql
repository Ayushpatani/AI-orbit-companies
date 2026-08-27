create extension if not exists pgcrypto;

create table if not exists public.company_submissions (
  id uuid primary key default gen_random_uuid(),
  tracking_code text unique not null,
  company_name text not null,
  website text not null,
  category text not null,
  stage text not null,
  country text not null,
  city text not null,
  founded integer not null,
  employee_range text not null,
  description text not null,
  products jsonb not null default '[]'::jsonb,
  submitter_name text not null,
  submitter_email text not null,
  submitter_role text not null,
  status text not null default 'pending' check (status in ('pending','in_review','approved','rejected')),
  reviewer_notes text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists company_submissions_status_idx on public.company_submissions(status);
create index if not exists company_submissions_created_at_idx on public.company_submissions(created_at desc);

alter table public.company_submissions enable row level security;

comment on table public.company_submissions is 'AI Orbit company listing submissions. Accessed server-side with the Supabase service role only.';
