-- Restaurant Concierge Database Schema
-- Run this in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.users (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  organization_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Locations table
CREATE TABLE IF NOT EXISTS public.locations (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  description TEXT,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  status TEXT DEFAULT 'paused' CHECK (status IN ('active', 'paused')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Geofences table
CREATE TABLE IF NOT EXISTS public.geofences (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  location_id UUID REFERENCES public.locations(id) ON DELETE CASCADE NOT NULL,
  center_latitude DECIMAL(10, 8) NOT NULL,
  center_longitude DECIMAL(11, 8) NOT NULL,
  radius_meters INTEGER NOT NULL CHECK (radius_meters >= 50 AND radius_meters <= 500),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  UNIQUE(location_id)
);

-- Automations table
CREATE TABLE IF NOT EXISTS public.automations (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  location_id UUID REFERENCES public.locations(id) ON DELETE CASCADE NOT NULL,
  channel TEXT NOT NULL CHECK (channel IN ('sms', 'email')),
  enabled BOOLEAN DEFAULT false,
  cooldown_minutes INTEGER DEFAULT 1440, -- 24 hours default
  start_time TIME,
  end_time TIME,
  template_subject TEXT, -- For email
  template_body TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  UNIQUE(location_id, channel)
);

-- Events table (for analytics)
CREATE TABLE IF NOT EXISTS public.events (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  location_id UUID REFERENCES public.locations(id) ON DELETE CASCADE NOT NULL,
  user_id TEXT NOT NULL, -- Anonymous user ID from mobile app
  channel TEXT NOT NULL CHECK (channel IN ('sms', 'email')),
  event_type TEXT NOT NULL CHECK (event_type IN ('geofence_entered', 'notification_sent', 'notification_delivered', 'notification_failed')),
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_locations_user_id ON public.locations(user_id);
CREATE INDEX IF NOT EXISTS idx_geofences_location_id ON public.geofences(location_id);
CREATE INDEX IF NOT EXISTS idx_automations_location_id ON public.automations(location_id);
CREATE INDEX IF NOT EXISTS idx_events_location_id ON public.events(location_id);
CREATE INDEX IF NOT EXISTS idx_events_created_at ON public.events(created_at);

-- Row Level Security (RLS) Policies

-- Enable RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.geofences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.automations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can view own profile"
  ON public.users FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.users FOR UPDATE
  USING (auth.uid() = id);

-- Locations policies
CREATE POLICY "Users can view own locations"
  ON public.locations FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own locations"
  ON public.locations FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own locations"
  ON public.locations FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own locations"
  ON public.locations FOR DELETE
  USING (auth.uid() = user_id);

-- Geofences policies
CREATE POLICY "Users can view geofences for own locations"
  ON public.geofences FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.locations
      WHERE locations.id = geofences.location_id
      AND locations.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can manage geofences for own locations"
  ON public.geofences FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.locations
      WHERE locations.id = geofences.location_id
      AND locations.user_id = auth.uid()
    )
  );

-- Automations policies
CREATE POLICY "Users can view automations for own locations"
  ON public.automations FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.locations
      WHERE locations.id = automations.location_id
      AND locations.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can manage automations for own locations"
  ON public.automations FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.locations
      WHERE locations.id = automations.location_id
      AND locations.user_id = auth.uid()
    )
  );

-- Events policies
CREATE POLICY "Users can view events for own locations"
  ON public.events FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.locations
      WHERE locations.id = events.location_id
      AND locations.user_id = auth.uid()
    )
  );

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc'::text, NOW());
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_locations_updated_at BEFORE UPDATE ON public.locations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_geofences_updated_at BEFORE UPDATE ON public.geofences
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_automations_updated_at BEFORE UPDATE ON public.automations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

