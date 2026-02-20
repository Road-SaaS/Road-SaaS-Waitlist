-- Migration: criar tabela waitlist_signups
-- Data: 2026-02-20
-- Descricao: schema minimo para captura de leads da waitlist

create extension if not exists "pgcrypto";

create table if not exists waitlist_signups (
  id                     uuid primary key default gen_random_uuid(),
  email                  text not null,
  email_normalized       text not null,
  status                 text not null default 'subscribed',
  created_at             timestamptz not null default now(),
  source                 text not null default 'landing',
  utm_source             text,
  utm_medium             text,
  utm_campaign           text,
  utm_term               text,
  utm_content            text,
  referrer               text,
  landing_path           text,
  user_agent             text,
  ip_hash                text,
  unsubscribe_token_hash text,
  unsubscribed_at        timestamptz
);

-- Indice unico para deduplicacao por email normalizado
create unique index if not exists idx_waitlist_email_normalized
  on waitlist_signups (email_normalized);

-- Indice para buscas por status (ex: listar apenas subscribed)
create index if not exists idx_waitlist_status
  on waitlist_signups (status);

-- Indice para busca por token de descadastro
create index if not exists idx_waitlist_unsubscribe_token
  on waitlist_signups (unsubscribe_token_hash)
  where unsubscribe_token_hash is not null;
