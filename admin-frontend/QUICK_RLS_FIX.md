# Quick Fix for 401 Error on Sign Up

The 401 error happens because the `users` table is missing an INSERT policy. Here's how to fix it:

## Step 1: Run This SQL

Go to: https://supabase.com/dashboard/project/iovqkwkezewofswnglnx/sql/new

Copy and paste this:

```sql
-- Add INSERT policy for users table
CREATE POLICY IF NOT EXISTS "Users can insert own profile"
  ON public.users FOR INSERT
  WITH CHECK (auth.uid() = id);
```

Click "Run"

## Step 2: Test Again

Try signing up again in your app. It should work now!

## If You Still Get Errors

If you get "policy already exists", run this first:

```sql
DROP POLICY IF EXISTS "Users can insert own profile" ON public.users;

CREATE POLICY "Users can insert own profile"
  ON public.users FOR INSERT
  WITH CHECK (auth.uid() = id);
```

## What This Does

This policy allows users to insert their own profile into the `users` table when they sign up. The `WITH CHECK (auth.uid() = id)` ensures they can only create a profile with their own user ID.

