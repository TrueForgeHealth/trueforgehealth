/*
  # Stripe membership integration

  1. Changes
    - Adds stripe_customer_id, stripe_subscription_id, membership_status, membership_started_at,
      current_period_end, email columns to `member_profiles` so the webhook can persist
      subscription state without requiring a Supabase auth user up front.
    - Makes member_profiles.id default to gen_random_uuid() and drops the FK to auth.users so
      paid-but-not-yet-registered members can have a profile row keyed by email.
    - Adds `stripe_events` table for webhook idempotency (event id is unique).

  2. Security
    - RLS remains enabled on member_profiles. New SELECT policy lets members view their own row
      by matched email (jwt email) or by id. stripe_events is service-role only (no policies =
      locked down, only service role bypasses RLS).
*/

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE table_schema = 'public'
      AND table_name = 'member_profiles'
      AND constraint_name = 'member_profiles_id_fkey'
  ) THEN
    ALTER TABLE public.member_profiles DROP CONSTRAINT member_profiles_id_fkey;
  END IF;
END $$;

ALTER TABLE public.member_profiles
  ALTER COLUMN id SET DEFAULT gen_random_uuid();

ALTER TABLE public.member_profiles
  ADD COLUMN IF NOT EXISTS email text DEFAULT '' NOT NULL,
  ADD COLUMN IF NOT EXISTS stripe_customer_id text DEFAULT '',
  ADD COLUMN IF NOT EXISTS stripe_subscription_id text DEFAULT '',
  ADD COLUMN IF NOT EXISTS membership_status text DEFAULT 'inactive',
  ADD COLUMN IF NOT EXISTS membership_plan text DEFAULT '',
  ADD COLUMN IF NOT EXISTS membership_started_at timestamptz,
  ADD COLUMN IF NOT EXISTS current_period_end timestamptz;

CREATE UNIQUE INDEX IF NOT EXISTS member_profiles_email_idx
  ON public.member_profiles ((lower(email)))
  WHERE email <> '';

CREATE INDEX IF NOT EXISTS member_profiles_stripe_customer_idx
  ON public.member_profiles (stripe_customer_id)
  WHERE stripe_customer_id <> '';

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'member_profiles'
      AND policyname = 'Members can view own profile by email'
  ) THEN
    CREATE POLICY "Members can view own profile by email"
      ON public.member_profiles FOR SELECT
      TO authenticated
      USING (
        id = auth.uid()
        OR lower(email) = lower(coalesce(auth.jwt() ->> 'email', ''))
      );
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS public.stripe_events (
  id text PRIMARY KEY,
  type text NOT NULL DEFAULT '',
  payload jsonb NOT NULL DEFAULT '{}'::jsonb,
  processed_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.stripe_events ENABLE ROW LEVEL SECURITY;
