-- SQL Migration: Create Payment Events Table for Transaction State Machine

CREATE TABLE IF NOT EXISTS public.payment_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  payment_id TEXT UNIQUE, -- gateway session or order id
  donor_id UUID,          -- optional link to a donor profile
  idempotency_key TEXT UNIQUE NOT NULL,
  gateway_transaction_id TEXT,
  current_state TEXT NOT NULL DEFAULT 'INITIATED',
  amount NUMERIC NOT NULL,
  currency TEXT NOT NULL DEFAULT 'INR',
  donor_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  address TEXT,
  pan_number TEXT,
  purpose TEXT DEFAULT 'General Donation',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  last_error TEXT,
  retry_count INT DEFAULT 0,
  refund_id TEXT
);

-- Enable RLS on payment_events
ALTER TABLE public.payment_events ENABLE ROW LEVEL SECURITY;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_payment_events_idempotency_key ON public.payment_events(idempotency_key);
CREATE INDEX IF NOT EXISTS idx_payment_events_payment_id ON public.payment_events(payment_id);
CREATE INDEX IF NOT EXISTS idx_payment_events_current_state ON public.payment_events(current_state);

-- Enable Supabase Realtime for table update notifications
ALTER TABLE public.payment_events REPLICA IDENTITY FULL;

DO $$
BEGIN
  -- Add table to publication if not already present
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'payment_events'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.payment_events;
  END IF;
END $$;
