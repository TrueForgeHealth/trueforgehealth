/*
  # Questionnaire Completions

  1. New Tables
    - `questionnaire_completions` - tracks which intake questionnaires a member has completed
      - `id` (uuid, primary key)
      - `user_id` (uuid, FK to auth.users) - nullable so anon submissions can also be tracked by email
      - `email` (text) - fallback identifier for pre-account submissions
      - `slug` (text) - questionnaire identifier (weight, hormone, sexual)
      - `requested_at` (timestamptz) - when the member opened/started it
      - `completed_at` (timestamptz, nullable) - when they marked it complete
      - `created_at` (timestamptz)

  2. Security
    - RLS enabled
    - Authenticated members can read/insert/update only their own rows (auth.uid() = user_id)
    - Anonymous users can insert rows tied to their email so the consultation flow works pre-account
*/

CREATE TABLE IF NOT EXISTS questionnaire_completions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL DEFAULT '',
  slug text NOT NULL DEFAULT '',
  requested_at timestamptz NOT NULL DEFAULT now(),
  completed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE questionnaire_completions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Members read own questionnaire completions"
  ON questionnaire_completions FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Members insert own questionnaire completions"
  ON questionnaire_completions FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Members update own questionnaire completions"
  ON questionnaire_completions FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Anon can insert questionnaire completions by email"
  ON questionnaire_completions FOR INSERT
  TO anon
  WITH CHECK (user_id IS NULL);

CREATE INDEX IF NOT EXISTS idx_qc_user ON questionnaire_completions(user_id);
CREATE INDEX IF NOT EXISTS idx_qc_email ON questionnaire_completions(email);
