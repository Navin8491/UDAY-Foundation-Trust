-- SQL Migration: Create Notifications Table & Enable Realtime

CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type TEXT NOT NULL, -- 'volunteer', 'partnership', 'donation', 'contact', 'event', 'program'
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  related_record_id TEXT,
  read_status BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Supabase Realtime for the notifications table
ALTER TABLE public.notifications REPLICA IDENTITY FULL;

-- Check if publication exists, otherwise create it and add notifications table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication WHERE pubname = 'supabase_realtime'
  ) THEN
    CREATE PUBLICATION supabase_realtime;
  END IF;
  
  -- Add table to publication if not already present
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'notifications'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;
  END IF;
END $$;
