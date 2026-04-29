/*
  # TrueForge Leads & Bookings Schema

  1. New Tables
    - `leads` - Captures all lead/contact form submissions
      - `id` (uuid, primary key)
      - `email` (text)
      - `first_name` (text)
      - `last_name` (text)
      - `phone` (text)
      - `source_page` (text) - which page captured the lead
      - `interest` (text) - weight loss, hormone, etc.
      - `notes` (text)
      - `created_at` (timestamptz)
    - `consultations` - Tracks consultation booking intents
      - `id` (uuid, primary key)
      - `lead_id` (uuid, fk)
      - `email` (text)
      - `goal` (text)
      - `status` (text) default 'requested'
      - `created_at` (timestamptz)
    - `quiz_responses` - Captures quiz / find-my-option responses
      - `id` (uuid, primary key)
      - `email` (text)
      - `answers` (jsonb)
      - `recommendation` (text)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Public anon can INSERT leads/consultations/quiz_responses (lead capture)
    - No public SELECT/UPDATE/DELETE (only service role / authenticated staff in future)
*/

CREATE TABLE IF NOT EXISTS leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL DEFAULT '',
  first_name text NOT NULL DEFAULT '',
  last_name text NOT NULL DEFAULT '',
  phone text NOT NULL DEFAULT '',
  source_page text NOT NULL DEFAULT '',
  interest text NOT NULL DEFAULT '',
  notes text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anon can insert leads"
  ON leads FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Authenticated can insert leads"
  ON leads FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE TABLE IF NOT EXISTS consultations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id uuid REFERENCES leads(id) ON DELETE SET NULL,
  email text NOT NULL DEFAULT '',
  goal text NOT NULL DEFAULT '',
  status text NOT NULL DEFAULT 'requested',
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE consultations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anon can insert consultations"
  ON consultations FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Authenticated can insert consultations"
  ON consultations FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE TABLE IF NOT EXISTS quiz_responses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL DEFAULT '',
  answers jsonb NOT NULL DEFAULT '{}'::jsonb,
  recommendation text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE quiz_responses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anon can insert quiz responses"
  ON quiz_responses FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Authenticated can insert quiz responses"
  ON quiz_responses FOR INSERT
  TO authenticated
  WITH CHECK (true);
