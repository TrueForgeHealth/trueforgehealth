/*
  # Relax member_onboarding_events FK

  1. Changes
    - Drops member_onboarding_events.user_id FK to auth.users so events can reference
      member_profiles rows for paid-but-not-yet-registered members.
*/

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE table_schema = 'public'
      AND table_name = 'member_onboarding_events'
      AND constraint_name = 'member_onboarding_events_user_id_fkey'
  ) THEN
    ALTER TABLE public.member_onboarding_events DROP CONSTRAINT member_onboarding_events_user_id_fkey;
  END IF;
END $$;
