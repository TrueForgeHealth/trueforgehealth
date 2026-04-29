/*
  # Native Scheduling System

  Replaces Calendly with a fully native booking + reminder + onboarding pipeline.

  1. New Tables
    - `availability_rules` — weekly recurring availability windows in local time.
    - `availability_blackouts` — date ranges (vacations, holidays) that override rules.
    - `appointments` — booked calls with all info needed for confirmation, reminders, journey.
    - `appointment_reminders` — log of every email sent against an appointment.
    - `member_onboarding_events` — tracks onboarding actions after a discovery converts.

  2. Security
    - All tables RLS-enabled.
    - Anonymous users can INSERT into appointments and SELECT availability for /book.
    - Authenticated users read their own appointments (matched by user_id).
    - Admins (is_admin()) get full access via existing helper function.
    - Edge functions use SERVICE_ROLE for cron operations.

  3. Seed Data
    - Default rules: Mon–Thu 16:00–20:00 ET, Sat 09:00–12:00 ET, 15-minute slots.
*/

CREATE TABLE IF NOT EXISTS availability_rules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  weekday smallint NOT NULL CHECK (weekday BETWEEN 0 AND 6),
  start_minute smallint NOT NULL CHECK (start_minute BETWEEN 0 AND 1439),
  end_minute smallint NOT NULL CHECK (end_minute BETWEEN 1 AND 1440),
  slot_minutes smallint NOT NULL DEFAULT 15 CHECK (slot_minutes BETWEEN 5 AND 240),
  timezone text NOT NULL DEFAULT 'America/New_York',
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  CHECK (end_minute > start_minute)
);

CREATE TABLE IF NOT EXISTS availability_blackouts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  starts_at timestamptz NOT NULL,
  ends_at timestamptz NOT NULL,
  reason text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now(),
  CHECK (ends_at > starts_at)
);

CREATE TABLE IF NOT EXISTS appointments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  lead_id uuid,
  kind text NOT NULL DEFAULT 'discovery_15' CHECK (kind IN ('discovery_15','consultation','member_visit')),
  email text NOT NULL,
  first_name text NOT NULL DEFAULT '',
  last_name text NOT NULL DEFAULT '',
  phone text NOT NULL DEFAULT '',
  goal text NOT NULL DEFAULT '',
  notes text NOT NULL DEFAULT '',
  scheduled_at timestamptz NOT NULL,
  duration_minutes smallint NOT NULL DEFAULT 15 CHECK (duration_minutes BETWEEN 5 AND 240),
  timezone text NOT NULL DEFAULT 'America/New_York',
  status text NOT NULL DEFAULT 'scheduled' CHECK (status IN ('scheduled','confirmed','completed','cancelled','no_show')),
  zoom_link text NOT NULL DEFAULT '',
  source text NOT NULL DEFAULT '',
  confirmation_token uuid NOT NULL DEFAULT gen_random_uuid(),
  cancellation_token uuid NOT NULL DEFAULT gen_random_uuid(),
  member_upsell_shown boolean NOT NULL DEFAULT false,
  member_joined_at timestamptz,
  cancelled_at timestamptz,
  completed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS appointments_scheduled_at_idx ON appointments(scheduled_at);
CREATE INDEX IF NOT EXISTS appointments_email_idx ON appointments(email);
CREATE INDEX IF NOT EXISTS appointments_user_id_idx ON appointments(user_id);
CREATE INDEX IF NOT EXISTS appointments_status_idx ON appointments(status);

CREATE TABLE IF NOT EXISTS appointment_reminders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  appointment_id uuid NOT NULL REFERENCES appointments(id) ON DELETE CASCADE,
  kind text NOT NULL CHECK (kind IN ('confirmation','remind_3d','remind_24h','remind_2h','remind_10m','post_thanks','post_nurture_3d','post_nurture_7d')),
  status text NOT NULL DEFAULT 'sent' CHECK (status IN ('sent','failed','skipped')),
  error text NOT NULL DEFAULT '',
  sent_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (appointment_id, kind)
);

CREATE INDEX IF NOT EXISTS appointment_reminders_kind_idx ON appointment_reminders(kind);

CREATE TABLE IF NOT EXISTS member_onboarding_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  appointment_id uuid REFERENCES appointments(id) ON DELETE SET NULL,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL,
  event text NOT NULL CHECK (event IN ('intake_sent','questionnaire_sent','consultation_scheduled','membership_started')),
  payload jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS onboarding_email_idx ON member_onboarding_events(email);

ALTER TABLE availability_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE availability_blackouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointment_reminders ENABLE ROW LEVEL SECURITY;
ALTER TABLE member_onboarding_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read active availability rules"
  ON availability_rules FOR SELECT TO anon, authenticated
  USING (active = true);

CREATE POLICY "Admin insert availability rules"
  ON availability_rules FOR INSERT TO authenticated
  WITH CHECK (is_admin());

CREATE POLICY "Admin update availability rules"
  ON availability_rules FOR UPDATE TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

CREATE POLICY "Admin delete availability rules"
  ON availability_rules FOR DELETE TO authenticated
  USING (is_admin());

CREATE POLICY "Public read blackouts"
  ON availability_blackouts FOR SELECT TO anon, authenticated
  USING (true);

CREATE POLICY "Admin insert blackouts"
  ON availability_blackouts FOR INSERT TO authenticated
  WITH CHECK (is_admin());

CREATE POLICY "Admin update blackouts"
  ON availability_blackouts FOR UPDATE TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

CREATE POLICY "Admin delete blackouts"
  ON availability_blackouts FOR DELETE TO authenticated
  USING (is_admin());

CREATE POLICY "Anyone can book"
  ON appointments FOR INSERT TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Members read own appointments"
  ON appointments FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Admin reads all appointments"
  ON appointments FOR SELECT TO authenticated
  USING (is_admin());

CREATE POLICY "Members update own appointments"
  ON appointments FOR UPDATE TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admin update appointments"
  ON appointments FOR UPDATE TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

CREATE POLICY "Admin delete appointments"
  ON appointments FOR DELETE TO authenticated
  USING (is_admin());

CREATE POLICY "Admin read reminders"
  ON appointment_reminders FOR SELECT TO authenticated
  USING (is_admin());

CREATE POLICY "Owner read onboarding events"
  ON member_onboarding_events FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Admin read onboarding events"
  ON member_onboarding_events FOR SELECT TO authenticated
  USING (is_admin());

INSERT INTO availability_rules (weekday, start_minute, end_minute, slot_minutes, timezone, active)
VALUES
  (1, 16*60, 20*60, 15, 'America/New_York', true),
  (2, 16*60, 20*60, 15, 'America/New_York', true),
  (3, 16*60, 20*60, 15, 'America/New_York', true),
  (4, 16*60, 20*60, 15, 'America/New_York', true),
  (6, 9*60,  12*60, 15, 'America/New_York', true)
ON CONFLICT DO NOTHING;
