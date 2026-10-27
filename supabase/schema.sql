-- A/B test landing stranice "Protokol ishrane" (Olgica Božinović)
-- Pokreni jednom u Supabase SQL Editoru.
-- Upis ide isključivo sa servera (service role ključ), zato RLS nema javnih polisa:
-- niko iz browsera ne može da čita ni piše ove tabele.

create table if not exists public.lp_leads (
  id              uuid primary key default gen_random_uuid(),
  created_at      timestamptz not null default now(),
  experiment      text not null,
  variant         text check (variant in ('a','b')),
  visitor_id      uuid,
  is_qa           boolean not null default false,
  form_location   text,               -- 'hero' (B) ili 'section' (A)
  who             text not null check (who in ('me','kid')),
  symptoms        text[] not null default '{}',
  symptoms_other  text,
  has_documents   text[] not null default '{}',
  name            text not null,
  phone           text not null,
  email           text,
  consent         boolean not null,
  consent_at      timestamptz not null,
  utm_source      text,
  utm_medium      text,
  utm_campaign    text,
  utm_content     text,
  utm_term        text,
  fbclid          text,
  gclid           text,
  referrer        text,
  user_agent      text,
  status          text not null default 'nova'   -- za Olgicu: nova / javljeno / zakazan poziv / kupila / odustala
);

create table if not exists public.lp_events (
  id          bigint generated always as identity primary key,
  created_at  timestamptz not null default now(),
  experiment  text not null,
  variant     text not null check (variant in ('a','b')),
  visitor_id  uuid not null,
  event       text not null,   -- view, cta_click, form_start, form_step, lead
  props       jsonb not null default '{}',
  is_qa       boolean not null default false,
  user_agent  text
);

create index if not exists lp_events_exp_idx on public.lp_events (experiment, variant, event);
create index if not exists lp_events_vid_idx on public.lp_events (visitor_id);
create index if not exists lp_leads_created_idx on public.lp_leads (created_at desc);

alter table public.lp_leads  enable row level security;
alter table public.lp_events enable row level security;

-- Rezultati po varijanti (bez QA posetilaca i bez botova koji se predstavljaju kao crawleri).
create or replace view public.lp_ab_results
with (security_invoker = true) as
with ev as (
  select * from public.lp_events
  where not is_qa
    and coalesce(user_agent, '') !~* '(bot|crawl|spider|facebookexternalhit|preview|headless)'
)
select
  experiment,
  variant,
  count(distinct visitor_id) filter (where event = 'view')        as posetioci,
  count(distinct visitor_id) filter (where event = 'form_start')  as zapoceli_formu,
  count(distinct visitor_id) filter (where event = 'form_step' and (props->>'step')::int >= 4) as stigli_do_kontakta,
  count(distinct visitor_id) filter (where event = 'lead')        as prijave,
  round(100.0 * count(distinct visitor_id) filter (where event = 'lead')
        / nullif(count(distinct visitor_id) filter (where event = 'view'), 0), 2) as konverzija_pct,
  round(100.0 * count(distinct visitor_id) filter (where event = 'form_start')
        / nullif(count(distinct visitor_id) filter (where event = 'view'), 0), 2) as zapoceli_pct
from ev
group by experiment, variant
order by experiment, variant;
