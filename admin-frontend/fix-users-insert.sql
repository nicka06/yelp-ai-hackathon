-- Quick fix for users table INSERT permission
-- Run this in Supabase SQL Editor

-- Drop policy if it exists first (PostgreSQL doesn't support IF NOT EXISTS for policies)
DROP POLICY IF EXISTS "Users can insert own profile" ON public.users;

-- Add INSERT policy for users table (allows users to create their own profile)
CREATE POLICY "Users can insert own profile"
  ON public.users FOR INSERT
  WITH CHECK (auth.uid() = id);
