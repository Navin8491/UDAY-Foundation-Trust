-- ==========================================
-- SQL Migration: Add Featured Initiative Column
-- ==========================================
-- Copy and paste this script into your Supabase Dashboard SQL Editor, then click "Run".

-- 1. Add show_in_featured_initiative column with default false
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS show_in_featured_initiative BOOLEAN DEFAULT FALSE;

-- 2. Mark the Certificate of Appreciation ceremony as the default featured event
UPDATE public.events 
SET show_in_featured_initiative = TRUE 
WHERE title->>'en' = 'Certificate of Appreciation & Felicitation Ceremony'
   OR title->>'gu' = 'Certificate of Appreciation & Felicitation Ceremony';
