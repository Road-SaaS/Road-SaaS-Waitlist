-- Migration: adicionar coluna experience_level na waitlist_signups
-- Data: 2026-02-20
-- Descricao: campo opcional para nivel tecnico do inscrito (retrocompativel)

ALTER TABLE waitlist_signups ADD COLUMN IF NOT EXISTS experience_level TEXT;
