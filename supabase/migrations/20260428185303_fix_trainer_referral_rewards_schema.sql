/*
  # Fix trainer_referral_rewards schema

  The calculate-referral-rewards edge function expects:
    - referred_email (text)  — actual email of the referred member
    - membership_id (uuid)   — FK to member_profiles for dedup

  The original table only has referred_member_id (uuid nullable) and membership_fee.
  This migration adds the missing columns and a partial index for dedup, without
  touching existing rows or dropping anything.
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'trainer_referral_rewards' AND column_name = 'referred_email'
  ) THEN
    ALTER TABLE trainer_referral_rewards ADD COLUMN referred_email text NOT NULL DEFAULT '';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'trainer_referral_rewards' AND column_name = 'membership_id'
  ) THEN
    ALTER TABLE trainer_referral_rewards ADD COLUMN membership_id uuid;
  END IF;
END $$;

CREATE UNIQUE INDEX IF NOT EXISTS idx_trainer_referral_rewards_dedup
  ON trainer_referral_rewards(trainer_id, membership_id)
  WHERE membership_id IS NOT NULL;
