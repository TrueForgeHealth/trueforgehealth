/*
  # Member Portal Schema

  1. New Tables
    - `member_profiles` - personal info for each authenticated member
      - `id` (uuid, FK to auth.users, primary key)
      - `first_name`, `last_name`, `phone`, `dob` (date), `state` (text)
      - `primary_goal` (text), `notes` (text)
      - `created_at`, `updated_at`
    - `cart_items` - prospective protocols a member is considering
      - `id` (uuid, primary key)
      - `user_id` (uuid, FK to auth.users)
      - `product` (text), `concentration` (text), `pharmacy` (text)
      - `category` (text), `price` (integer)
      - `kind` (text) - 'product' or 'stack'
      - `notes` (text)
      - `created_at` (timestamptz)
    - `portal_messages` - simple message log between member and care team
      - `id` (uuid, primary key)
      - `user_id` (uuid, FK)
      - `from_role` (text) - 'member' or 'care_team'
      - `body` (text)
      - `created_at` (timestamptz)

  2. Security
    - All tables RLS enabled
    - Members can only read/write their own rows (auth.uid() = user_id / id)
    - No public anon access
*/

CREATE TABLE IF NOT EXISTS member_profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  first_name text NOT NULL DEFAULT '',
  last_name text NOT NULL DEFAULT '',
  phone text NOT NULL DEFAULT '',
  dob date,
  state text NOT NULL DEFAULT '',
  primary_goal text NOT NULL DEFAULT '',
  notes text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE member_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Members read own profile"
  ON member_profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Members insert own profile"
  ON member_profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Members update own profile"
  ON member_profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE TABLE IF NOT EXISTS cart_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  product text NOT NULL DEFAULT '',
  concentration text NOT NULL DEFAULT '',
  pharmacy text NOT NULL DEFAULT '',
  category text NOT NULL DEFAULT '',
  price integer NOT NULL DEFAULT 0,
  kind text NOT NULL DEFAULT 'product',
  notes text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Members read own cart"
  ON cart_items FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Members insert own cart"
  ON cart_items FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Members update own cart"
  ON cart_items FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Members delete own cart"
  ON cart_items FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE TABLE IF NOT EXISTS portal_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  from_role text NOT NULL DEFAULT 'member',
  body text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE portal_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Members read own messages"
  ON portal_messages FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Members insert own messages"
  ON portal_messages FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id AND from_role = 'member');

CREATE INDEX IF NOT EXISTS idx_cart_user ON cart_items(user_id);
CREATE INDEX IF NOT EXISTS idx_msg_user ON portal_messages(user_id, created_at DESC);
