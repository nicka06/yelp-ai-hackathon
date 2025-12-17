# Quick Supabase Setup

## Your Project Details
- **Project ID**: iovqkwkezewofswnglnx
- **Project URL**: https://iovqkwkezewofswnglnx.supabase.co
- **Database Password**: 87UJR%X9$3mbreu

## Step 1: Get Your Anon Key

1. Go to: https://supabase.com/dashboard/project/iovqkwkezewofswnglnx/settings/api
2. Under "Project API keys", find the **anon public** key
3. Copy it (it starts with `eyJ...`)

## Step 2: Create .env.local File

Create a file called `.env.local` in the `admin-frontend` directory with:

```
NEXT_PUBLIC_SUPABASE_URL=https://iovqkwkezewofswnglnx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=paste_your_anon_key_here
```

## Step 3: Run the Database Schema

1. Go to: https://supabase.com/dashboard/project/iovqkwkezewofswnglnx/sql/new
2. Open the file `supabase-schema.sql` in this directory
3. Copy ALL the SQL code
4. Paste it into the Supabase SQL Editor
5. Click "Run" (or press Cmd/Ctrl + Enter)
6. You should see "Success. No rows returned"

## Step 4: Restart Your Dev Server

```bash
# Stop the current server (Ctrl+C)
# Then restart:
npm run dev
```

## That's it! Your database is ready to use.

