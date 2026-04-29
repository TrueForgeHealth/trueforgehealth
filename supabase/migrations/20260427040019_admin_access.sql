/*
  # Admin Access Layer

  1. New Tables
    - `admin_users` - membership table that grants admin read access
      - `id` (uuid, FK to auth.users, primary key)
      - `email` (text)
      - `created_at` (timestamptz)

  2. New Functions
    - `public.is_admin()` - returns true when calling auth.uid() is in admin_users

  3. Security
    - RLS enabled on admin_users
    - Admins can read admin_users to verify membership
    - Adds admin SELECT policies on data tables (leads, consultations, quiz_responses,
      member_profiles, cart_items, portal_messages, questionnaire_completions)
    - Adds admin INSERT policy on portal_messages for care_team replies

  4. Granting admin
    INSERT INTO admin_users (id, email)
    SELECT id, email FROM auth.users WHERE email = 'you@example.com'
    ON CONFLICT (id) DO NOTHING;
*/

CREATE TABLE IF NOT EXISTS admin_users (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='admin_users' AND policyname='Admins can read admin list') THEN
    CREATE POLICY "Admins can read admin list"
      ON admin_users FOR SELECT
      TO authenticated
      USING (EXISTS (SELECT 1 FROM admin_users a WHERE a.id = auth.uid()));
  END IF;
END $$;

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid());
$$;

GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='leads' AND policyname='Admins read all leads') THEN
    CREATE POLICY "Admins read all leads" ON leads FOR SELECT TO authenticated USING (public.is_admin());
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='consultations' AND policyname='Admins read all consultations') THEN
    CREATE POLICY "Admins read all consultations" ON consultations FOR SELECT TO authenticated USING (public.is_admin());
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='quiz_responses' AND policyname='Admins read all quiz responses') THEN
    CREATE POLICY "Admins read all quiz responses" ON quiz_responses FOR SELECT TO authenticated USING (public.is_admin());
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='member_profiles' AND policyname='Admins read all member profiles') THEN
    CREATE POLICY "Admins read all member profiles" ON member_profiles FOR SELECT TO authenticated USING (public.is_admin());
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='cart_items' AND policyname='Admins read all cart items') THEN
    CREATE POLICY "Admins read all cart items" ON cart_items FOR SELECT TO authenticated USING (public.is_admin());
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='portal_messages' AND policyname='Admins read all portal messages') THEN
    CREATE POLICY "Admins read all portal messages" ON portal_messages FOR SELECT TO authenticated USING (public.is_admin());
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='portal_messages' AND policyname='Admins insert care team messages') THEN
    CREATE POLICY "Admins insert care team messages" ON portal_messages FOR INSERT TO authenticated WITH CHECK (public.is_admin() AND from_role = 'care_team');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='questionnaire_completions' AND policyname='Admins read all questionnaire completions') THEN
    CREATE POLICY "Admins read all questionnaire completions" ON questionnaire_completions FOR SELECT TO authenticated USING (public.is_admin());
  END IF;
END $$;
