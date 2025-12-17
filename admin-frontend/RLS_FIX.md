# Fixing Row Level Security (RLS) Issues

If you got an error when running the RLS policies, here's how to fix it:

## Option 1: Run the Fixed Schema (Recommended)

1. Go to: https://supabase.com/dashboard/project/iovqkwkezewofswnglnx/sql/new
2. Open `supabase-schema-fixed.sql` in your project
3. Copy ALL the SQL code
4. Paste it into the Supabase SQL Editor
5. Click "Run"

This fixed version:
- Drops existing policies first (to avoid conflicts)
- Separates INSERT, UPDATE, DELETE policies (more explicit)
- Adds INSERT policy for users table
- Adds proper service role policy for events

## Option 2: Manual Fix (If Option 1 doesn't work)

If you still get errors, you can disable RLS temporarily to test:

```sql
-- Temporarily disable RLS (NOT RECOMMENDED FOR PRODUCTION)
ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.locations DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.geofences DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.automations DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.events DISABLE ROW LEVEL SECURITY;
```

Then re-enable and add policies one by one:

```sql
-- Re-enable RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.geofences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.automations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
```

## Common RLS Errors

**Error: "policy already exists"**
- Solution: The fixed schema drops policies first, so this won't happen

**Error: "relation does not exist"**
- Solution: Make sure you ran the table creation SQL first

**Error: "permission denied"**
- Solution: Make sure you're running as the postgres user (default in SQL Editor)

## Testing RLS

After setting up RLS, test it:

1. Sign up for an account in your app
2. Create a location
3. Check Supabase Table Editor - you should see the data
4. Try accessing another user's data (should be blocked by RLS)

## Need Help?

If you're still getting errors, share the exact error message and I can help debug it!

