-- Migration: adicionar coluna name na waitlist_signups
-- Data: 2026-02-20
-- Descricao: nome do inscrito (opcional, retrocompativel)

ALTER TABLE waitlist_signups ADD COLUMN IF NOT EXISTS name TEXT;
