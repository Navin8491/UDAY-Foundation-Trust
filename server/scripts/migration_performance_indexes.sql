-- migration_performance_indexes.sql
-- Optimizes public page sorting and indexing on Supabase PostgreSQL database.

-- 1. Index for Events sorting
CREATE INDEX IF NOT EXISTS idx_events_created_at ON public.events(created_at DESC);

-- 2. Index for Programs sorting
CREATE INDEX IF NOT EXISTS idx_programs_created_at ON public.programs(created_at DESC);

-- 3. Index for Gallery sorting
CREATE INDEX IF NOT EXISTS idx_gallery_uploaded_at ON public.gallery("uploadedAt" DESC);

-- 4. Index for Team Member displaying order
CREATE INDEX IF NOT EXISTS idx_team_display_order ON public.team("displayOrder" ASC);
