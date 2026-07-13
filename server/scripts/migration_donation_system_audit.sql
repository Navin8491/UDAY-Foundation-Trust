-- ====================================================================
-- SQL Migration: Complete Donation & Payment System Database Audit
-- ====================================================================

-- 1. Donors Table
CREATE TABLE IF NOT EXISTS public.donors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  phone TEXT,
  address TEXT,
  pan_number TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Donation Transactions Table
CREATE TABLE IF NOT EXISTS public.donation_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  donation_id UUID REFERENCES public.donations(id) ON DELETE CASCADE,
  payment_event_id UUID REFERENCES public.payment_events(id) ON DELETE SET NULL,
  gateway_transaction_id TEXT UNIQUE,
  amount NUMERIC NOT NULL,
  status TEXT NOT NULL,
  payment_method TEXT,
  raw_response JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Payment Logs Table
CREATE TABLE IF NOT EXISTS public.payment_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  payment_event_id UUID REFERENCES public.payment_events(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  request_payload JSONB,
  response_payload JSONB,
  status_code INT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Payment Sessions Table
CREATE TABLE IF NOT EXISTS public.payment_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  idempotency_key TEXT UNIQUE NOT NULL,
  order_id TEXT UNIQUE NOT NULL,
  payment_session_id TEXT NOT NULL,
  amount NUMERIC NOT NULL,
  expiry_time TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Payment Status History Table
CREATE TABLE IF NOT EXISTS public.payment_status_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  payment_event_id UUID REFERENCES public.payment_events(id) ON DELETE CASCADE NOT NULL,
  from_state TEXT,
  to_state TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Invoices Table
CREATE TABLE IF NOT EXISTS public.invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  donation_id UUID REFERENCES public.donations(id) ON DELETE CASCADE UNIQUE NOT NULL,
  invoice_number TEXT UNIQUE NOT NULL,
  pdf_url TEXT,
  amount NUMERIC NOT NULL,
  tax_deductible BOOLEAN DEFAULT TRUE,
  status TEXT NOT NULL DEFAULT 'ISSUED',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Invoice Items Table
CREATE TABLE IF NOT EXISTS public.invoice_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_id UUID REFERENCES public.invoices(id) ON DELETE CASCADE NOT NULL,
  description TEXT NOT NULL,
  amount NUMERIC NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Refunds Table
CREATE TABLE IF NOT EXISTS public.refunds (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  payment_event_id UUID REFERENCES public.payment_events(id) ON DELETE SET NULL,
  refund_id TEXT UNIQUE NOT NULL,
  gateway_transaction_id TEXT NOT NULL,
  amount NUMERIC NOT NULL,
  status TEXT NOT NULL,
  reason TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. Webhook Logs Table
CREATE TABLE IF NOT EXISTS public.webhook_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id TEXT UNIQUE,
  event_type TEXT NOT NULL,
  raw_payload JSONB NOT NULL,
  processed BOOLEAN DEFAULT FALSE,
  error TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. Failed Payments Table
CREATE TABLE IF NOT EXISTS public.failed_payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  payment_event_id UUID REFERENCES public.payment_events(id) ON DELETE SET NULL,
  order_id TEXT,
  error_code TEXT,
  error_description TEXT,
  amount NUMERIC,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. Payment Retries Table
CREATE TABLE IF NOT EXISTS public.payment_retries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  payment_event_id UUID REFERENCES public.payment_events(id) ON DELETE CASCADE NOT NULL,
  retry_count INT NOT NULL,
  previous_state TEXT,
  reason TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ====================================================================
-- Enable RLS (Row Level Security) on all new tables
-- ====================================================================
ALTER TABLE public.donors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.donation_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_status_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoice_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.refunds ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.webhook_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.failed_payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_retries ENABLE ROW LEVEL SECURITY;

-- ====================================================================
-- Create RLS Policies to allow backend (public/authenticated/service) access
-- ====================================================================

-- Donors Policies
CREATE POLICY "Allow public all on donors" ON public.donors FOR ALL TO public USING (true) WITH CHECK (true);

-- Donation Transactions Policies
CREATE POLICY "Allow public all on donation_transactions" ON public.donation_transactions FOR ALL TO public USING (true) WITH CHECK (true);

-- Payment Logs Policies
CREATE POLICY "Allow public all on payment_logs" ON public.payment_logs FOR ALL TO public USING (true) WITH CHECK (true);

-- Payment Sessions Policies
CREATE POLICY "Allow public all on payment_sessions" ON public.payment_sessions FOR ALL TO public USING (true) WITH CHECK (true);

-- Payment Status History Policies
CREATE POLICY "Allow public all on payment_status_history" ON public.payment_status_history FOR ALL TO public USING (true) WITH CHECK (true);

-- Invoices Policies
CREATE POLICY "Allow public all on invoices" ON public.invoices FOR ALL TO public USING (true) WITH CHECK (true);

-- Invoice Items Policies
CREATE POLICY "Allow public all on invoice_items" ON public.invoice_items FOR ALL TO public USING (true) WITH CHECK (true);

-- Refunds Policies
CREATE POLICY "Allow public all on refunds" ON public.refunds FOR ALL TO public USING (true) WITH CHECK (true);

-- Webhook Logs Policies
CREATE POLICY "Allow public all on webhook_logs" ON public.webhook_logs FOR ALL TO public USING (true) WITH CHECK (true);

-- Failed Payments Policies
CREATE POLICY "Allow public all on failed_payments" ON public.failed_payments FOR ALL TO public USING (true) WITH CHECK (true);

-- Payment Retries Policies
CREATE POLICY "Allow public all on payment_retries" ON public.payment_retries FOR ALL TO public USING (true) WITH CHECK (true);

-- ====================================================================
-- Performance Indexes for New Tables
-- ====================================================================
CREATE INDEX IF NOT EXISTS idx_donors_email ON public.donors(email);
CREATE INDEX IF NOT EXISTS idx_donation_transactions_donation_id ON public.donation_transactions(donation_id);
CREATE INDEX IF NOT EXISTS idx_payment_logs_event_id ON public.payment_logs(payment_event_id);
CREATE INDEX IF NOT EXISTS idx_payment_sessions_idempotency ON public.payment_sessions(idempotency_key);
CREATE INDEX IF NOT EXISTS idx_payment_status_history_event_id ON public.payment_status_history(payment_event_id);
CREATE INDEX IF NOT EXISTS idx_invoices_donation_id ON public.invoices(donation_id);
CREATE INDEX IF NOT EXISTS idx_refunds_payment_event_id ON public.refunds(payment_event_id);
CREATE INDEX IF NOT EXISTS idx_webhook_logs_event_id ON public.webhook_logs(event_id);
CREATE INDEX IF NOT EXISTS idx_failed_payments_event_id ON public.failed_payments(payment_event_id);
CREATE INDEX IF NOT EXISTS idx_payment_retries_event_id ON public.payment_retries(payment_event_id);
