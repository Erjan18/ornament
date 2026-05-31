/*
  # Restore Secure RLS — Require Authentication for Admin Writes

  ## Overview
  Now that the admin panel has proper Supabase Auth, we restore the write policies
  on patterns, categories, and pattern_images to require the `authenticated` role.
  Anonymous (public) users retain read-only access.

  ## Changes
  - patterns: INSERT/UPDATE/DELETE restricted to `authenticated`
  - categories: INSERT/UPDATE/DELETE restricted to `authenticated`
  - pattern_images: INSERT/UPDATE/DELETE restricted to `authenticated`
  - favorites: remains writable by `anon` (no-login session-based bookmarks)
*/

-- ==================== PATTERNS ====================

DROP POLICY IF EXISTS "Admin can insert patterns" ON patterns;
DROP POLICY IF EXISTS "Admin can update patterns" ON patterns;
DROP POLICY IF EXISTS "Admin can delete patterns" ON patterns;

CREATE POLICY "Admin can insert patterns"
  ON patterns FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Admin can update patterns"
  ON patterns FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Admin can delete patterns"
  ON patterns FOR DELETE
  TO authenticated
  USING (true);

-- ==================== CATEGORIES ====================

DROP POLICY IF EXISTS "Admin can insert categories" ON categories;
DROP POLICY IF EXISTS "Admin can update categories" ON categories;
DROP POLICY IF EXISTS "Admin can delete categories" ON categories;

CREATE POLICY "Admin can insert categories"
  ON categories FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Admin can update categories"
  ON categories FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Admin can delete categories"
  ON categories FOR DELETE
  TO authenticated
  USING (true);

-- ==================== PATTERN IMAGES ====================

DROP POLICY IF EXISTS "Admin can insert pattern images" ON pattern_images;
DROP POLICY IF EXISTS "Admin can update pattern images" ON pattern_images;
DROP POLICY IF EXISTS "Admin can delete pattern images" ON pattern_images;

CREATE POLICY "Admin can insert pattern images"
  ON pattern_images FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Admin can update pattern images"
  ON pattern_images FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Admin can delete pattern images"
  ON pattern_images FOR DELETE
  TO authenticated
  USING (true);
