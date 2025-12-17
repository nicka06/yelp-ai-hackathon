import { supabase } from "./supabase";

// Types
export interface Location {
  id: string;
  user_id: string;
  name: string;
  address: string;
  description: string | null;
  latitude: number | null;
  longitude: number | null;
  status: "active" | "paused";
  created_at: string;
  updated_at: string;
}

export interface Geofence {
  id: string;
  location_id: string;
  center_latitude: number;
  center_longitude: number;
  radius_meters: number;
  created_at: string;
  updated_at: string;
}

export interface Automation {
  id: string;
  location_id: string;
  channel: "sms" | "email";
  enabled: boolean;
  cooldown_minutes: number;
  start_time: string | null;
  end_time: string | null;
  template_subject: string | null;
  template_body: string;
  created_at: string;
  updated_at: string;
}

export interface Event {
  id: string;
  location_id: string;
  user_id: string;
  channel: "sms" | "email";
  event_type: "geofence_entered" | "notification_sent" | "notification_delivered" | "notification_failed";
  metadata: any;
  created_at: string;
}

// Location functions
export async function getLocations(userId: string): Promise<Location[]> {
  const { data, error } = await supabase
    .from("locations")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function getLocation(id: string): Promise<Location | null> {
  const { data, error } = await supabase
    .from("locations")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw error;
  return data;
}

export async function createLocation(location: Omit<Location, "id" | "created_at" | "updated_at">): Promise<Location> {
  const { data, error } = await supabase
    .from("locations")
    .insert(location)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateLocation(id: string, updates: Partial<Location>): Promise<Location> {
  const { data, error } = await supabase
    .from("locations")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteLocation(id: string): Promise<void> {
  const { error } = await supabase
    .from("locations")
    .delete()
    .eq("id", id);

  if (error) throw error;
}

// Geofence functions
export async function getGeofence(locationId: string): Promise<Geofence | null> {
  const { data, error } = await supabase
    .from("geofences")
    .select("*")
    .eq("location_id", locationId)
    .single();

  if (error && error.code !== "PGRST116") throw error; // PGRST116 = no rows returned
  return data || null;
}

export async function upsertGeofence(geofence: Omit<Geofence, "id" | "created_at" | "updated_at">): Promise<Geofence> {
  const { data, error } = await supabase
    .from("geofences")
    .upsert(geofence, { onConflict: "location_id" })
    .select()
    .single();

  if (error) throw error;
  return data;
}

// Automation functions
export async function getAutomations(locationId: string): Promise<Automation[]> {
  const { data, error } = await supabase
    .from("automations")
    .select("*")
    .eq("location_id", locationId);

  if (error) throw error;
  return data || [];
}

export async function upsertAutomation(automation: Omit<Automation, "id" | "created_at" | "updated_at">): Promise<Automation> {
  const { data, error } = await supabase
    .from("automations")
    .upsert(automation, { onConflict: "location_id,channel" })
    .select()
    .single();

  if (error) throw error;
  return data;
}

// Event functions
export async function getEvents(locationId: string, limit: number = 100): Promise<Event[]> {
  const { data, error } = await supabase
    .from("events")
    .select("*")
    .eq("location_id", locationId)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data || [];
}

export async function getEventStats(locationId: string, days: number = 30) {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  const { data, error } = await supabase
    .from("events")
    .select("channel, event_type, created_at")
    .eq("location_id", locationId)
    .gte("created_at", startDate.toISOString());

  if (error) throw error;

  // Group by date and channel
  const stats: Record<string, { sms: number; email: number }> = {};
  
  data?.forEach((event) => {
    const date = new Date(event.created_at).toISOString().split("T")[0];
    if (!stats[date]) {
      stats[date] = { sms: 0, email: 0 };
    }
    if (event.event_type === "notification_sent") {
      stats[date][event.channel]++;
    }
  });

  return Object.entries(stats).map(([date, counts]) => ({
    date,
    sms: counts.sms,
    email: counts.email,
  }));
}

