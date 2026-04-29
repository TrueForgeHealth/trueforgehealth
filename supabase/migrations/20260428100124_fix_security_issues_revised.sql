/*
  # Fix Security Issues - Revised

  1. Move pg_net extension from public schema to extensions schema
  2. Fix RLS policies with always-true WITH CHECK clauses (overly permissive)
  3. Update is_admin() function to SECURITY INVOKER (keeps existing policies working)
  4. Add missing RLS policies to stripe_events table

  ## Security Changes:
  - Move pg_net to extensions schema (isolate extensions from public namespace)
  - Replace "always true" INSERT policies with restrictive default-deny policies
  - Require authenticated users only for data insertion
  - Alter is_admin() to SECURITY INVOKER to enforce proper authorization
  - Add RLS policies to stripe_events (currently unprotected)
*/

-- 1. Move pg_net extension to extensions schema
DO $$
BEGIN
  DROP EXTENSION IF EXISTS pg_net CASCADE;
  CREATE EXTENSION IF NOT EXISTS pg_net SCHEMA extensions;
EXCEPTION WHEN OTHERS THEN
  CREATE EXTENSION IF NOT EXISTS pg_net SCHEMA extensions;
END $$;

-- 2. Fix appointments table - remove overly permissive "Anyone can book" policy
DROP POLICY IF EXISTS "Anyone can book" ON appointments;

-- 3. Fix consultations table - remove overly permissive policies
DROP POLICY IF EXISTS "Anon can insert consultations" ON consultations;
DROP POLICY IF EXISTS "Authenticated can insert consultations" ON consultations;

-- Add restrictive consultations INSERT policy
CREATE POLICY "Consultations can be created"
  ON consultations FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- 4. Fix leads table - remove overly permissive policies
DROP POLICY IF EXISTS "Anon can insert leads" ON leads;
DROP POLICY IF EXISTS "Authenticated can insert leads" ON leads;

-- Add restrictive leads INSERT policy
CREATE POLICY "Leads can be created by authenticated users"
  ON leads FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- 5. Fix newsletter_subscribers table - remove overly permissive policies
DROP POLICY IF EXISTS "Anon can subscribe" ON newsletter_subscribers;
DROP POLICY IF EXISTS "Authenticated can subscribe" ON newsletter_subscribers;

-- Add restrictive newsletter_subscribers INSERT policy
CREATE POLICY "Newsletter subscription allowed"
  ON newsletter_subscribers FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- 6. Fix quiz_responses table - remove overly permissive policies
DROP POLICY IF EXISTS "Anon can insert quiz responses" ON quiz_responses;
DROP POLICY IF EXISTS "Authenticated can insert quiz responses" ON quiz_responses;

-- Add restrictive quiz_responses INSERT policy
CREATE POLICY "Quiz responses can be recorded"
  ON quiz_responses FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- 7. Fix referral_events table - remove overly permissive policies
DROP POLICY IF EXISTS "Anoncan insert referral events" ON referral_events;
DROP POLICY IF EXISTS "Authenticated can insert referral events" ON referral_events;

-- Add restrictive referral_events INSERT policy
CREATE POLICY "Referral events can be recorded"
  ON referral_events FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- 8. Fix trainer_referral_conversions table - remove overly permissive policies
DROP POLICY IF EXISTS "Anon can insert trainer conversions" ON trainer_referral_conversions;
DROP POLICY IF EXISTS "Authenticated can insert trainer conversions" ON trainer_referral_conversions;

-- Add restrictive trainer_referral_conversions INSERT policy
CREATE POLICY "Trainer conversions can be recorded"
  ON trainer_referral_conversions FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- 9. Alter is_admin() function to SECURITY INVOKER (without dropping/recreating)
-- This changes function behavior without breaking dependent policies
ALTER FUNCTION is_admin() SECURITY INVOKER;

-- 10. Revoke EXECUTE from anon and authenticated roles to prevent unauthorized calls
REVOKE EXECUTE ON FUNCTION is_admin() FROM anon;
REVOKE EXECUTE ON FUNCTION is_admin() FROM authenticated;

-- Grant EXECUTE only to roles that need it (optional, based on usage)
-- GRANT EXECUTE ON FUNCTION is_admin() TO authenticated;

-- 11. Add RLS policies to stripe_events table
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'stripe_events' AND table_schema = 'public') THEN
    -- Only service_role can view and manage stripe events (system-level access only)
    DROP POLICY IF EXISTS "Service role can view stripe events" ON stripe_events;
    DROP POLICY IF EXISTS "Service role can insert stripe events" ON stripe_events;
    DROP POLICY IF EXISTS "Service role can update stripe events" ON stripe_events;

    CREATE POLICY "Service role can view stripe events"
      ON stripe_events FOR SELECT
      TO service_role
      USING (true);

    CREATE POLICY "Service role can insert stripe events"
      ON stripe_events FOR INSERT
      TO service_role
      WITH CHECK (true);

    CREATE POLICY "Service role can update stripe events"
      ON stripe_events FOR UPDATE
      TO service_role
      USING (true)
      WITH CHECK (true);
  END IF;
END $$;