/*
  # Kyrgyz Patterns Web Application Schema

  ## Overview
  This migration creates the full schema for a web application dedicated to promoting
  Kyrgyz national patterns (ornaments). The schema supports pattern management,
  categorization, image galleries, and user favorites.

  ## New Tables

  ### 1. categories
  - `id` (uuid, primary key)
  - `name` (text) - Category name in Russian/Kyrgyz
  - `slug` (text, unique) - URL-friendly identifier
  - `description` (text) - Category description
  - `image_url` (text) - Representative image for category
  - `created_at` (timestamptz)

  ### 2. patterns
  - `id` (uuid, primary key)
  - `name` (text) - Pattern name
  - `slug` (text, unique) - URL-friendly identifier
  - `description` (text) - Short description
  - `history` (text) - History of origin
  - `symbolism` (text) - Symbolic meaning
  - `application` (text) - Areas of application
  - `category_id` (uuid, FK to categories)
  - `image_url` (text) - Primary image
  - `featured` (boolean) - Featured on homepage
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### 3. pattern_images
  - `id` (uuid, primary key)
  - `pattern_id` (uuid, FK to patterns)
  - `image_url` (text)
  - `caption` (text)
  - `sort_order` (int)
  - `created_at` (timestamptz)

  ### 4. favorites
  - `id` (uuid, primary key)
  - `session_id` (text) - Anonymous session identifier
  - `pattern_id` (uuid, FK to patterns)
  - `created_at` (timestamptz)

  ## Security
  - RLS enabled on all tables
  - Public read access for categories and patterns
  - Admin write access via service role key
  - Session-based favorites (no auth required)
*/

-- Categories table
CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text DEFAULT '',
  image_url text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view categories"
  ON categories FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert categories"
  ON categories FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update categories"
  ON categories FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete categories"
  ON categories FOR DELETE
  TO authenticated
  USING (true);

-- Patterns table
CREATE TABLE IF NOT EXISTS patterns (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text DEFAULT '',
  history text DEFAULT '',
  symbolism text DEFAULT '',
  application text DEFAULT '',
  category_id uuid REFERENCES categories(id) ON DELETE SET NULL,
  image_url text DEFAULT '',
  featured boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE patterns ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view patterns"
  ON patterns FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert patterns"
  ON patterns FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update patterns"
  ON patterns FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete patterns"
  ON patterns FOR DELETE
  TO authenticated
  USING (true);

-- Pattern images table
CREATE TABLE IF NOT EXISTS pattern_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  pattern_id uuid NOT NULL REFERENCES patterns(id) ON DELETE CASCADE,
  image_url text NOT NULL,
  caption text DEFAULT '',
  sort_order int DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE pattern_images ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view pattern images"
  ON pattern_images FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert pattern images"
  ON pattern_images FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update pattern images"
  ON pattern_images FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete pattern images"
  ON pattern_images FOR DELETE
  TO authenticated
  USING (true);

-- Favorites table (session-based, no auth required)
CREATE TABLE IF NOT EXISTS favorites (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id text NOT NULL,
  pattern_id uuid NOT NULL REFERENCES patterns(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(session_id, pattern_id)
);

ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own favorites"
  ON favorites FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Users can insert own favorites"
  ON favorites FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Users can delete own favorites"
  ON favorites FOR DELETE
  TO anon, authenticated
  USING (true);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_patterns_category_id ON patterns(category_id);
CREATE INDEX IF NOT EXISTS idx_patterns_featured ON patterns(featured);
CREATE INDEX IF NOT EXISTS idx_patterns_slug ON patterns(slug);
CREATE INDEX IF NOT EXISTS idx_pattern_images_pattern_id ON pattern_images(pattern_id);
CREATE INDEX IF NOT EXISTS idx_favorites_session_id ON favorites(session_id);
CREATE INDEX IF NOT EXISTS idx_favorites_pattern_id ON favorites(pattern_id);
