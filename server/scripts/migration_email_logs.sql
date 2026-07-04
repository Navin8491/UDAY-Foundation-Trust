-- SQL Migration: Create email_logs table for tracking notification status
CREATE TABLE IF NOT EXISTS public.email_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  recipient TEXT NOT NULL,
  subject TEXT NOT NULL,
  template TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'sent', 'failed', 'retrying'
  error_message TEXT,
  retry_count INT DEFAULT 0,
  sent_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on email_logs
ALTER TABLE public.email_logs ENABLE ROW LEVEL SECURITY;

-- Enable Supabase Realtime for table update notifications
ALTER TABLE public.email_logs REPLICA IDENTITY FULL;

-- Add table to publication if not already present
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'email_logs'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.email_logs;
  END IF;
END $$;
