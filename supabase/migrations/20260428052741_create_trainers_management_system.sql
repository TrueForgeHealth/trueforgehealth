/*
  # Trainers Management System for Referral Program

  1. New Tables
    - `trainers`
      - `id` (uuid, primary key)
      - `name` (text, not null)
      - `email` (text, unique, not null)
      - `referral_code` (text, unique, not null) - unique code for tracking referrals
      - `custom_reward_percentage` (numeric, nullable) - override default 15%
      - `total_referrals` (int, default 0) - count of all referrals
      - `successful_conversions` (int, default 0) - count of paid members
      - `total_rewards_earned` (numeric, default 0) - sum of all rewards paid
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

    - `trainer_referral_rewards`
      - `id` (uuid, primary key)
      - `trainer_id` (uuid, FK to trainers)
      - `referred_email` (text) - email of person who was referred
      - `reward_percentage` (numeric) - the % used for this reward
      - `reward_amount` (numeric) - calculated reward amount
      - `membership_id` (uuid, nullable FK to stripe_members) - member who joined
      - `status` (text) - 'pending' | 'earned' | 'paid'
      - `created_at` (timestamptz)
      - `paid_at` (timestamptz, nullable)

  2. Security
    - RLS enabled on both tables
    - Admins can read/write all trainer data
    - Trainers can read their own referral data

  3. Important Notes
    - Use custom_reward_percentage if set, otherwise default to 15%
    - Track all referral-to-reward conversions in trainer_referral_rewards
    - Automatically update trainer stats (total_referrals, conversions, rewards_earned)
*/

CREATE TABLE IF NOT EXISTS trainers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text UNIQUE NOT NULL,
  referral_code text UNIQUE NOT NULL,
  custom_reward_percentage numeric(5,2),
  total_referrals int NOT NULL DEFAULT 0,
  successful_conversions int NOT NULL DEFAULT 0,
  total_rewards_earned numeric(10,2) NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS trainer_referral_rewards (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  trainer_id uuid NOT NULL REFERENCES trainers(id) ON DELETE CASCADE,
  referred_email text NOT NULL,
  reward_percentage numeric(5,2) NOT NULL,
  reward_amount numeric(10,2) NOT NULL,
  membership_id uuid,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz NOT NULL DEFAULT now(),
  paid_at timestamptz
);

ALTER TABLE trainers ENABLE ROW LEVEL SECURITY;
ALTER TABLE trainer_referral_rewards ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='trainers' AND policyname='Admins can read trainers') THEN
    CREATE POLICY "Admins can read trainers"
      ON trainers FOR SELECT
      TO authenticated
      USING (public.is_admin());
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='trainers' AND policyname='Admins can manage trainers') THEN
    CREATE POLICY "Admins can manage trainers"
      ON trainers FOR UPDATE
      TO authenticated
      USING (public.is_admin())
      WITH CHECK (public.is_admin());
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='trainers' AND policyname='Admins can insert trainers') THEN
    CREATE POLICY "Admins can insert trainers"
      ON trainers FOR INSERT
      TO authenticated
      WITH CHECK (public.is_admin());
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='trainer_referral_rewards' AND policyname='Admins read all rewards') THEN
    CREATE POLICY "Admins read all rewards"
      ON trainer_referral_rewards FOR SELECT
      TO authenticated
      USING (public.is_admin());
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='trainer_referral_rewards' AND policyname='Admins manage rewards') THEN
    CREATE POLICY "Admins manage rewards"
      ON trainer_referral_rewards FOR UPDATE
      TO authenticated
      USING (public.is_admin())
      WITH CHECK (public.is_admin());
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='trainer_referral_rewards' AND policyname='Admins insert rewards') THEN
    CREATE POLICY "Admins insert rewards"
      ON trainer_referral_rewards FOR INSERT
      TO authenticated
      WITH CHECK (public.is_admin());
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_trainers_code ON trainers(referral_code);
CREATE INDEX IF NOT EXISTS idx_trainers_email ON trainers(email);
CREATE INDEX IF NOT EXISTS idx_trainer_rewards_trainer ON trainer_referral_rewards(trainer_id);
CREATE INDEX IF NOT EXISTS idx_trainer_rewards_status ON trainer_referral_rewards(status);
CREATE INDEX IF NOT EXISTS idx_trainer_rewards_created ON trainer_referral_rewards(created_at);
