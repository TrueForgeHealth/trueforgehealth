/*
  # Newsletter Subscribers (Double Opt-In)

  1. New Tables
    - `newsletter_subscribers`
      - `id` (uuid, primary key)
      - `email` (text, unique, lowercased on insert)
      - `source` (text) - which page/area captured the signup
      - `status` (text) - 'pending' | 'confirmed' | 'unsubscribed'
      - `confirmation_token` (uuid) - opaque token used in confirm link
      - `unsubscribe_token` (uuid) - opaque token used in unsubscribe link
      - `subscribed_at` (timestamptz) - when the row was created
      - `confirmed_at` (timestamptz, nullable) - when the user clicked confirm
      - `unsubscribed_at` (timestamptz, nullable)

  2. Security
    - RLS enabled
    - NO public SELECT — emails are private
    - Anon and authenticated users can INSERT (lead capture)
    - Admins can SELECT all rows via existing is_admin() helper
    - Confirmation and unsubscribe happen via edge function with the service role,
      so no policies are needed for those flows
*/

CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  source text NOT NULL DEFAULT '',
  status text NOT NULL DEFAULT 'pending',
  confirmation_token uuid NOT NULL DEFAULT gen_random_uuid(),
  unsubscribe_token uuid NOT NULL DEFAULT gen_random_uuid(),
  subscribed_at timestamptz NOT NULL DEFAULT now(),
  confirmed_at timestamptz,
  unsubscribed_at timestamptz
);

ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='newsletter_subscribers' AND policyname='Anon can subscribe') THEN
    CREATE POLICY "Anon can subscribe"
      ON newsletter_subscribers FOR INSERT
      TO anon
      WITH CHECK (true);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='newsletter_subscribers' AND policyname='Authenticated can subscribe') THEN
    CREATE POLICY "Authenticated can subscribe"
      ON newsletter_subscribers FOR INSERT
      TO authenticated
      WITH CHECK (true);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='newsletter_subscribers' AND policyname='Admins read all subscribers') THEN
    CREATE POLICY "Admins read all subscribers"
      ON newsletter_subscribers FOR SELECT
      TO authenticated
      USING (public.is_admin());
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_newsletter_status ON newsletter_subscribers(status);
CREATE INDEX IF NOT EXISTS idx_newsletter_confirm_token ON newsletter_subscribers(confirmation_token);
CREATE INDEX IF NOT EXISTS idx_newsletter_unsub_token ON newsletter_subscribers(unsubscribe_token);
