# Supabase Setup Guide

## Step 1: Create Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Sign up or log in
3. Click "New Project"
4. Fill in:
   - **Name**: restaurant-concierge (or your choice)
   - **Database Password**: Choose a strong password (save it!)
   - **Region**: Choose closest to you
5. Click "Create new project"
6. Wait 2-3 minutes for project to initialize

## Step 2: Get API Credentials

1. In your Supabase project, go to **Settings** → **API**
2. Copy:
   - **Project URL** (under "Project URL")
   - **anon/public key** (under "Project API keys" → "anon public")

## Step 3: Set Up Database Schema

1. In Supabase, go to **SQL Editor**
2. Click "New query"
3. Copy and paste the entire contents of `supabase-schema.sql`
4. Click "Run" (or press Cmd/Ctrl + Enter)
5. You should see "Success. No rows returned"

## Step 4: Configure Environment Variables

1. Copy `.env.local.example` to `.env.local`:
   ```bash
   cp .env.local.example .env.local
   ```

2. Edit `.env.local` and add your credentials:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
   ```

3. Restart your Next.js dev server:
   ```bash
   npm run dev
   ```

## Step 5: Set Up Authentication (Optional but Recommended)

1. In Supabase, go to **Authentication** → **Providers**
2. Enable **Email** provider (should be enabled by default)
3. Configure email templates if needed

## Database Schema Overview

### Tables Created:
- **users** - User profiles (extends Supabase auth)
- **locations** - Restaurant locations
- **geofences** - Geofence definitions for locations
- **automations** - SMS/Email automation rules
- **events** - Analytics events

### Security:
- Row Level Security (RLS) enabled on all tables
- Users can only access their own data
- Policies automatically enforce user isolation

## Testing the Connection

Once set up, you can test by:

1. Creating a user account in your app
2. Adding a location
3. Checking Supabase dashboard → **Table Editor** to see the data

## Troubleshooting

**"Invalid API key" error:**
- Double-check your `.env.local` file
- Make sure you're using the **anon** key, not the service_role key
- Restart your dev server after changing env vars

**"relation does not exist" error:**
- Make sure you ran the SQL schema in Supabase SQL Editor
- Check that all tables were created in **Table Editor**

**RLS errors:**
- Make sure you're authenticated (user must be logged in)
- Check that the user_id matches the authenticated user

