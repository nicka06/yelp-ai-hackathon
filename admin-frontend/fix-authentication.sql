-- Fix for 401 error when creating user profile
-- Run this in Supabase SQL Editor

-- Drop policy if it exists, then create it
DROP POLICY IF EXISTS "Users can insert own profile" ON public.users;

CREATE POLICY "Users can insert own profile"
  ON public.users FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Create a trigger to auto-create user profile (BETTER SOLUTION)
-- This automatically creates a user profile when someone signs up in auth.users

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email)
  VALUES (NEW.id, NEW.email)
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop trigger if it exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Create trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- This way, when a user signs up, their profile is automatically created
-- No need to manually insert from the frontend!
