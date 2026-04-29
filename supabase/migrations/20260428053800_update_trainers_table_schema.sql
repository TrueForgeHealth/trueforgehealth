/*
  # Update Trainers Table Schema

  Add missing columns to trainers table for full management functionality:
  - custom_reward_percentage (for individual trainer reward overrides)
  - successful_conversions (track conversions per trainer)
  - updated_at (track last modification time)
*/

DO $$
BEGIN
  -- Add custom_reward_percentage if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'trainers' AND column_name = 'custom_reward_percentage'
  ) THEN
    ALTER TABLE trainers ADD COLUMN custom_reward_percentage numeric(5,2);
  END IF;

  -- Add successful_conversions if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'trainers' AND column_name = 'successful_conversions'
  ) THEN
    ALTER TABLE trainers ADD COLUMN successful_conversions int NOT NULL DEFAULT 0;
  END IF;

  -- Add total_referrals if it doesn't exist (rename from referred_count if needed)
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'trainers' AND column_name = 'total_referrals'
  ) THEN
    -- Check if referred_count exists, if so we'll use it as total_referrals
    IF EXISTS (
      SELECT 1 FROM information_schema.columns
      WHERE table_name = 'trainers' AND column_name = 'referred_count'
    ) THEN
      ALTER TABLE trainers RENAME COLUMN referred_count TO total_referrals;
    ELSE
      ALTER TABLE trainers ADD COLUMN total_referrals int NOT NULL DEFAULT 0;
    END IF;
  END IF;

  -- Add updated_at if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'trainers' AND column_name = 'updated_at'
  ) THEN
    ALTER TABLE trainers ADD COLUMN updated_at timestamptz NOT NULL DEFAULT now();
  END IF;
END $$;
