/*
  # Referral System for Newsletter

  1. New Tables
    - `referral_links`
      - `id` (uuid, primary key)
      - `subscriber_id` (uuid, FK to newsletter_subscribers)
      - `code` (text, unique, short slug used in referral URLs)
      - `created_at` (timestamptz)
      - `share_count` (int) - total times the link was shared via a button
      - `click_count` (int) - total times the referral link was visited
      - `converted_count` (int) - how many of those became leads/members

    - `referral_events`
      - `id` (uuid, primary key)
      - `referral_code` (text) - the code used
      - `event_type` (text) - 'click' | 'signup' | 'membership'
      - `metadata` (jsonb) - platform, new_subscriber_id, etc.
      - `created_at` (timestamptz)

  2. Security
    - RLS enabled on both tables
    - Anon can insert referral_events (link clicks, signups)
    - Admins can read all referral data
    - No public SELECT on referral_links (emails are private)
*/

CREATE TABLE IF NOT EXISTS referral_links (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  subscriber_id uuid NOT NULL REFERENCES newsletter_subscribers(id) ON DELETE CASCADE,
  code text UNIQUE NOT NULL,
  share_count int NOT NULL DEFAULT 0,
  click_count int NOT NULL DEFAULT 0,
  converted_count int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS referral_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  referral_code text NOT NULL,
  event_type text NOT NULL DEFAULT 'click',
  metadata jsonb NOT NULL DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE referral_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE referral_events ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='referral_links' AND policyname='Admins read all referral links') THEN
    CREATE POLICY "Admins read all referral links"
      ON referral_links FOR SELECT
      TO authenticated
      USING (public.is_admin());
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='referral_events' AND policyname='Anon can insert referral events') THEN
    CREATE POLICY "Anon can insert referral events"
      ON referral_events FOR INSERT
      TO anon
      WITH CHECK (true);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='referral_events' AND policyname='Authenticated can insert referral events') THEN
    CREATE POLICY "Authenticated can insert referral events"
      ON referral_events FOR INSERT
      TO authenticated
      WITH CHECK (true);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='referral_events' AND policyname='Admins read all referral events') THEN
    CREATE POLICY "Admins read all referral events"
      ON referral_events FOR SELECT
      TO authenticated
      USING (public.is_admin());
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_referral_links_subscriber ON referral_links(subscriber_id);
CREATE INDEX IF NOT EXISTS idx_referral_links_code ON referral_links(code);
CREATE INDEX IF NOT EXISTS idx_referral_events_code ON referral_events(referral_code);
CREATE INDEX IF NOT EXISTS idx_referral_events_type ON referral_events(event_type);
