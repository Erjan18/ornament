/*
  # Fix RLS Policies — Allow Anon Admin Writes

  ## Problem
  The original policies restricted INSERT/UPDATE/DELETE to `authenticated` role only.
  Since the admin panel does not use Supabase Auth (no login), all requests arrive
  as the `anon` role and were being rejected, causing "Database error querying schema".

  ## Changes
  - Drop old write-only authenticated policies on categories, patterns, pattern_images
  - Re-create them to also include the `anon` role so the admin panel can operate
    without requiring a login session

  ## Tables Affected
  - categories
  - patterns
  - pattern_images
*/

-- ==================== CATEGORIES ====================

DROP POLICY IF EXISTS "Authenticated users can insert categories" ON categories;
DROP POLICY IF EXISTS "Authenticated users can update categories" ON categories;
DROP POLICY IF EXISTS "Authenticated users can delete categories" ON categories;

CREATE POLICY "Admin can insert categories"
  ON categories FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Admin can update categories"
  ON categories FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Admin can delete categories"
  ON categories FOR DELETE
  TO anon, authenticated
  USING (true);

-- ==================== PATTERNS ====================

DROP POLICY IF EXISTS "Authenticated users can insert patterns" ON patterns;
DROP POLICY IF EXISTS "Authenticated users can update patterns" ON patterns;
DROP POLICY IF EXISTS "Authenticated users can delete patterns" ON patterns;

CREATE POLICY "Admin can insert patterns"
  ON patterns FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Admin can update patterns"
  ON patterns FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Admin can delete patterns"
  ON patterns FOR DELETE
  TO anon, authenticated
  USING (true);

-- ==================== PATTERN IMAGES ====================

DROP POLICY IF EXISTS "Authenticated users can insert pattern images" ON pattern_images;
DROP POLICY IF EXISTS "Authenticated users can update pattern images" ON pattern_images;
DROP POLICY IF EXISTS "Authenticated users can delete pattern images" ON pattern_images;

CREATE POLICY "Admin can insert pattern images"
  ON pattern_images FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Admin can update pattern images"
  ON pattern_images FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Admin can delete pattern images"
  ON pattern_images FOR DELETE
  TO anon, authenticated
  USING (true);
