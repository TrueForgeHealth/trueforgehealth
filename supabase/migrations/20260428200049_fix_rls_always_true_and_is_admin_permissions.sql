/*
  # Fix RLS "always true" policies and is_admin() execution permissions

  ## Problem
  Several public-facing INSERT policies used WITH CHECK (true), which flags as
  unrestricted access in security audits. These tables (leads, consultations,
  quiz_responses, newsletter_subscribers, referral_events,
  trainer_referral_conversions) legitimately need anonymous inserts (contact/
  capture forms), but the check clause must validate row content rather than
  being a literal constant.

  ## Fix
  Replace WITH CHECK (true) with minimal content-validity checks per table:
    - Email tables: email must be non-empty and match basic RFC format
    - quiz_responses: answers jsonb must be non-null
    - referral_events: referral_code must be non-empty
    - trainer_referral_conversions: trainer_id must be non-null

  ## is_admin() function
  SECURITY DEFINER + public EXECUTE grant lets anon call it via /rpc/is_admin.
  Fix: REVOKE from PUBLIC and anon, keep GRANT to authenticated only.

  ## Tables modified
  - public.leads
  - public.consultations
  - public.quiz_responses
  - public.newsletter_subscribers
  - public.referral_events
  - public.trainer_referral_conversions

  ## Security changes
  - All INSERT policies now have meaningful WITH CHECK constraints
  - is_admin() no longer callable by unauthenticated users
*/

-- ────────────────────────────────────────────────────────────
-- 1. leads
-- ────────────────────────────────────────────────────────────
DROP POLICY IF EXISTS "Anyone can submit a lead" ON public.leads;
DROP POLICY IF EXISTS "Leads can be created by authenticated users" ON public.leads;
DROP POLICY IF EXISTS "Anon can insert leads" ON public.leads;
DROP POLICY IF EXISTS "Authenticated can insert leads" ON public.leads;

CREATE POLICY "Leads require a non-empty valid email"
  ON public.leads
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    email IS NOT NULL
    AND length(trim(email)) > 0
    AND email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'
  );

-- ────────────────────────────────────────────────────────────
-- 2. consultations
-- ────────────────────────────────────────────────────────────
DROP POLICY IF EXISTS "Anyone can request a consultation" ON public.consultations;
DROP POLICY IF EXISTS "Consultations can be created" ON public.consultations;
DROP POLICY IF EXISTS "Anon can insert consultations" ON public.consultations;
DROP POLICY IF EXISTS "Authenticated can insert consultations" ON public.consultations;

CREATE POLICY "Consultations require a non-empty valid email"
  ON public.consultations
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    email IS NOT NULL
    AND length(trim(email)) > 0
    AND email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'
  );

-- ────────────────────────────────────────────────────────────
-- 3. quiz_responses
-- ────────────────────────────────────────────────────────────
DROP POLICY IF EXISTS "Anyone can submit a quiz response" ON public.quiz_responses;
DROP POLICY IF EXISTS "Quiz responses can be recorded" ON public.quiz_responses;
DROP POLICY IF EXISTS "Anon can insert quiz responses" ON public.quiz_responses;
DROP POLICY IF EXISTS "Authenticated can insert quiz responses" ON public.quiz_responses;

CREATE POLICY "Quiz responses require non-null answers and valid email"
  ON public.quiz_responses
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    answers IS NOT NULL
    AND email IS NOT NULL
    AND length(trim(email)) > 0
    AND email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'
  );

-- ────────────────────────────────────────────────────────────
-- 4. newsletter_subscribers
-- ────────────────────────────────────────────────────────────
DROP POLICY IF EXISTS "Newsletter subscription allowed" ON public.newsletter_subscribers;
DROP POLICY IF EXISTS "Anon can subscribe" ON public.newsletter_subscribers;
DROP POLICY IF EXISTS "Authenticated can subscribe" ON public.newsletter_subscribers;

CREATE POLICY "Newsletter subscribers require a valid email"
  ON public.newsletter_subscribers
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    email IS NOT NULL
    AND length(trim(email)) > 0
    AND email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'
  );

-- ────────────────────────────────────────────────────────────
-- 5. referral_events
-- ────────────────────────────────────────────────────────────
DROP POLICY IF EXISTS "Anon can insert referral events" ON public.referral_events;
DROP POLICY IF EXISTS "Referral events can be recorded" ON public.referral_events;
DROP POLICY IF EXISTS "Authenticated can insert referral events" ON public.referral_events;

CREATE POLICY "Referral events require a non-empty referral code"
  ON public.referral_events
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    referral_code IS NOT NULL
    AND length(trim(referral_code)) > 0
  );

-- ────────────────────────────────────────────────────────────
-- 6. trainer_referral_conversions
-- ────────────────────────────────────────────────────────────
DROP POLICY IF EXISTS "Trainer conversions can be recorded" ON public.trainer_referral_conversions;

CREATE POLICY "Trainer conversions require a non-null trainer id"
  ON public.trainer_referral_conversions
  FOR INSERT
  TO authenticated
  WITH CHECK (
    trainer_id IS NOT NULL
  );

-- ────────────────────────────────────────────────────────────
-- 7. is_admin() — revoke EXECUTE from anon / public
-- ────────────────────────────────────────────────────────────
REVOKE EXECUTE ON FUNCTION public.is_admin() FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.is_admin() FROM anon;
GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated;
