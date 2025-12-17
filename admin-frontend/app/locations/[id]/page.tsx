"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  ArrowLeft,
  MapPin,
  Mail,
  MessageSquare,
  Save,
  ToggleLeft,
  ToggleRight,
} from "lucide-react";
import GeofenceMapClient from "@/components/GeofenceMapClient";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { supabase } from "@/lib/supabase";
import {
  getLocation,
  getGeofence,
  upsertGeofence,
  getAutomations,
  upsertAutomation,
  getEventStats,
  updateLocation,
} from "@/lib/db";
import type { Location, Geofence, Automation } from "@/lib/db";
import { AlertCircle } from "lucide-react";

const tabs = ["Overview", "Geofence", "Automations", "Analytics"];

export default function LocationDetailPage() {
  const router = useRouter();
  const params = useParams();
  const locationId = params.id as string;

  const [activeTab, setActiveTab] = useState("Overview");
  const [status, setStatus] = useState<"active" | "paused">("paused");
  const [geofenceRadius, setGeofenceRadius] = useState(200);
  const [mapCenter, setMapCenter] = useState<[number, number]>([42.2808, -83.7483]);
  const [smsEnabled, setSmsEnabled] = useState(false);
  const [emailEnabled, setEmailEnabled] = useState(false);
  const [cooldown, setCooldown] = useState("24h");
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("21:00");
  const [smsTemplate, setSmsTemplate] = useState(
    "Hi! {restaurant_name} here. We noticed you're nearby! Today's special: {special}. Visit us at {address}!"
  );
  const [emailSubject, setEmailSubject] = useState("Welcome to {restaurant_name}!");
  const [emailBody, setEmailBody] = useState(
    "Hi there!\n\nWe noticed you're near {restaurant_name} and wanted to share our special: {special}.\n\nWe'd love to see you!\n\n{restaurant_name} Team"
  );

  const [locationData, setLocationData] = useState<Location | null>(null);
  const [geofenceData, setGeofenceData] = useState<Geofence | null>(null);
  const [automations, setAutomations] = useState<Automation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const loadLocationData = async () => {
    try {
      setLoading(true);
      const location = await getLocation(locationId);
      if (!location) {
        setError("Location not found");
        return;
      }
      setLocationData(location);
      setStatus(location.status as "active" | "paused");

      // Load geofence
      const geofence = await getGeofence(locationId);
      if (geofence) {
        setGeofenceRadius(geofence.radius_meters);
        setMapCenter([geofence.center_latitude, geofence.center_longitude]);
        setGeofenceData(geofence);
      } else if (location.latitude && location.longitude) {
        setMapCenter([location.latitude, location.longitude]);
      }

      // Load automations
      const autoData = await getAutomations(locationId);
      setAutomations(autoData);
      
      const smsAuto = autoData.find((a) => a.channel === "sms");
      const emailAuto = autoData.find((a) => a.channel === "email");
      
      if (smsAuto) {
        setSmsEnabled(smsAuto.enabled);
        // Convert minutes to display format
        const minutes = smsAuto.cooldown_minutes;
        if (minutes === 15) setCooldown("15m");
        else if (minutes === 60) setCooldown("1h");
        else if (minutes === 1440) setCooldown("24h");
        else setCooldown(`${minutes}m`);
        if (smsAuto.start_time) setStartTime(smsAuto.start_time);
        if (smsAuto.end_time) setEndTime(smsAuto.end_time);
        setSmsTemplate(smsAuto.template_body);
      }
      
      if (emailAuto) {
        setEmailEnabled(emailAuto.enabled);
        if (emailAuto.start_time) setStartTime(emailAuto.start_time);
        if (emailAuto.end_time) setEndTime(emailAuto.end_time);
        setEmailSubject(emailAuto.template_subject || "");
        setEmailBody(emailAuto.template_body);
      }
    } catch (err: any) {
      console.error("Error loading location:", err);
      setError(err.message || "Failed to load location");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLocationData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locationId]);

  const handleSaveStatus = async () => {
    if (!locationData) return;
    try {
      setSaving(true);
      await updateLocation(locationId, { status });
      setError("");
    } catch (err: any) {
      setError(err.message || "Failed to update status");
    } finally {
      setSaving(false);
    }
  };

  const handleSaveGeofence = async () => {
    if (!locationData) return;
    try {
      setSaving(true);
      await upsertGeofence({
        location_id: locationId,
        center_latitude: mapCenter[0],
        center_longitude: mapCenter[1],
        radius_meters: geofenceRadius,
      });
      setError("");
      alert("Geofence saved successfully!");
    } catch (err: any) {
      setError(err.message || "Failed to save geofence");
    } finally {
      setSaving(false);
    }
  };

  const handleSaveAutomation = async (channel: "sms" | "email") => {
    if (!locationData) return;
    try {
      setSaving(true);
      const templateBody = channel === "sms" ? smsTemplate : emailBody;
      const templateSubject = channel === "email" ? emailSubject : null;
      const enabled = channel === "sms" ? smsEnabled : emailEnabled;
      
      const cooldownMinutes = cooldown === "15m" ? 15 : cooldown === "1h" ? 60 : 1440;
      
      await upsertAutomation({
        location_id: locationId,
        channel,
        enabled,
        cooldown_minutes: cooldownMinutes,
        start_time: startTime,
        end_time: endTime,
        template_subject: templateSubject,
        template_body: templateBody,
      });
      setError("");
      alert("Automation saved successfully!");
    } catch (err: any) {
      setError(err.message || "Failed to save automation");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600 text-sm">Loading...</p>
      </div>
    );
  }

  if (error && !locationData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
          <p className="text-gray-900 font-semibold mb-2">Error</p>
          <p className="text-gray-600 text-sm">{error}</p>
          <button
            onClick={() => router.push("/dashboard")}
            className="mt-4 text-primary-600 hover:text-primary-700 text-sm font-medium"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (!locationData) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <header className="glass border-b border-gray-200/50 sticky top-0 z-50 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button
            onClick={() => router.push("/dashboard")}
            className="flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-gray-900 mb-4 transition-colors px-3 py-2 rounded-lg hover:bg-gray-100"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Dashboard</span>
          </button>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{locationData.name}</h1>
              <p className="text-base text-gray-600 mt-2 flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                {locationData.address}
              </p>
            </div>
            <button
              onClick={() => setStatus(status === "active" ? "paused" : "active")}
              className={`flex items-center gap-2 px-5 py-3 rounded-xl font-semibold transition-all duration-300 shadow-soft hover:shadow-soft-lg ${
                status === "active"
                  ? "bg-gradient-to-r from-success-100 to-success-50 text-success-700 border-2 border-success-300 hover:-translate-y-0.5"
                  : "bg-gradient-to-r from-gray-100 to-gray-50 text-gray-700 border-2 border-gray-300 hover:-translate-y-0.5"
              }`}
            >
              {status === "active" ? (
                <>
                  <ToggleRight className="w-5 h-5" />
                  Active
                </>
              ) : (
                <>
                  <ToggleLeft className="w-5 h-5" />
                  Paused
                </>
              )}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
        <div className="bg-white rounded-2xl border border-gray-200 shadow-soft overflow-hidden">
          <div className="flex border-b border-gray-200 bg-gradient-to-r from-gray-50 to-transparent">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-8 py-4 text-sm font-bold transition-all duration-300 relative ${
                  activeTab === tab
                    ? "text-primary-600 bg-white"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                }`}
              >
                {tab}
                {activeTab === tab && (
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary-600 to-primary-700 rounded-t-full" />
                )}
              </button>
            ))}
          </div>

          <div className="p-8">
            {error && (
              <div className="mb-6 bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3 animate-slide-down">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-800 leading-relaxed">{error}</p>
              </div>
            )}

            {activeTab === "Overview" && (
              <div className="space-y-8">
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-3">Description</h3>
                  <p className="text-base text-gray-600 leading-relaxed">
                    {locationData.description || "No description provided"}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="group bg-gradient-to-br from-primary-50 to-white rounded-2xl border-2 border-primary-100 p-6 hover:shadow-soft-lg transition-all duration-300 hover:-translate-y-1">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center shadow-soft">
                        <MapPin className="w-5 h-5 text-white" strokeWidth={2.5} />
                      </div>
                      <span className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                        Visitors
                      </span>
                    </div>
                    <p className="text-3xl font-bold text-gray-900">0</p>
                    <p className="text-sm text-gray-600 mt-2 font-medium">Last 7 days</p>
                  </div>

                  <div className="group bg-gradient-to-br from-success-50 to-white rounded-2xl border-2 border-success-100 p-6 hover:shadow-soft-lg transition-all duration-300 hover:-translate-y-1">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-success-500 to-success-600 rounded-xl flex items-center justify-center shadow-soft">
                        <MessageSquare className="w-5 h-5 text-white" strokeWidth={2.5} />
                      </div>
                      <span className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                        SMS Sent
                      </span>
                    </div>
                    <p className="text-3xl font-bold text-gray-900">0</p>
                    <p className="text-sm text-gray-600 mt-2 font-medium">Last 7 days</p>
                  </div>

                  <div className="group bg-gradient-to-br from-warning-50 to-white rounded-2xl border-2 border-warning-100 p-6 hover:shadow-soft-lg transition-all duration-300 hover:-translate-y-1">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-warning-500 to-warning-600 rounded-xl flex items-center justify-center shadow-soft">
                        <Mail className="w-5 h-5 text-white" strokeWidth={2.5} />
                      </div>
                      <span className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                        Emails Sent
                      </span>
                    </div>
                    <p className="text-3xl font-bold text-gray-900">0</p>
                    <p className="text-sm text-gray-600 mt-2 font-medium">Last 7 days</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "Geofence" && (
              <div className="space-y-8">
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-5">
                    Define Geofence Area
                  </h3>
                  <div className="rounded-2xl overflow-hidden border-2 border-gray-200 shadow-soft">
                    <GeofenceMapClient
                      center={mapCenter}
                      radius={geofenceRadius}
                      onRadiusChange={setGeofenceRadius}
                      onCenterChange={setMapCenter}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-gradient-to-br from-primary-50 to-white p-6 rounded-2xl border-2 border-primary-100">
                    <label className="block text-sm font-bold text-gray-700 mb-4">
                      Radius (meters)
                    </label>
                    <input
                      type="range"
                      min="50"
                      max="500"
                      step="10"
                      value={geofenceRadius}
                      onChange={(e) => setGeofenceRadius(Number(e.target.value))}
                      className="w-full accent-primary-600"
                    />
                    <div className="mt-4 text-center">
                      <span className="text-3xl font-bold bg-gradient-to-r from-primary-600 to-primary-700 bg-clip-text text-transparent">
                        {geofenceRadius}m
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-3">
                      Latitude
                    </label>
                    <input
                      type="number"
                      value={mapCenter[0].toFixed(6)}
                      onChange={(e) =>
                        setMapCenter([Number(e.target.value), mapCenter[1]])
                      }
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent font-mono text-sm transition-all"
                      step="0.000001"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-3">
                      Longitude
                    </label>
                    <input
                      type="number"
                      value={mapCenter[1].toFixed(6)}
                      onChange={(e) =>
                        setMapCenter([mapCenter[0], Number(e.target.value)])
                      }
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent font-mono text-sm transition-all"
                      step="0.000001"
                    />
                  </div>
                </div>

                <button
                  onClick={handleSaveGeofence}
                  disabled={saving}
                  className="flex items-center gap-2 bg-gradient-to-r from-primary-600 to-primary-700 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-soft-lg transition-all duration-300 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Save className="w-5 h-5" />
                  {saving ? "Saving..." : "Save Geofence"}
                </button>
              </div>
            )}

            {activeTab === "Automations" && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-base font-semibold text-gray-900 mb-4">
                    Notification Channels
                  </h3>

                  <div className="bg-gray-50 rounded-md border border-gray-200 p-5 mb-4">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <MessageSquare className="w-5 h-5 text-primary-600" />
                        <div>
                          <h4 className="text-sm font-semibold text-gray-900">SMS via Twilio</h4>
                          <p className="text-xs text-gray-600">Text message notifications</p>
                        </div>
                      </div>
                      <button
                        onClick={async () => {
                          const newValue = !smsEnabled;
                          setSmsEnabled(newValue);
                          await handleSaveAutomation("sms");
                        }}
                        className={`relative w-11 h-6 rounded-full transition-colors ${
                          smsEnabled ? "bg-primary-600" : "bg-gray-300"
                        }`}
                      >
                        <span
                          className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                            smsEnabled ? "translate-x-5" : "translate-x-0"
                          }`}
                        />
                      </button>
                    </div>

                    {smsEnabled && (
                      <div className="space-y-4 mt-4 pt-4 border-t border-gray-200">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1.5">
                              Cooldown
                            </label>
                            <select
                              value={cooldown}
                              onChange={(e) => setCooldown(e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
                            >
                              <option value="15m">15 minutes</option>
                              <option value="1h">1 hour</option>
                              <option value="24h">24 hours</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1.5">
                              Time Window
                            </label>
                            <div className="flex items-center gap-2">
                              <input
                                type="time"
                                value={startTime}
                                onChange={(e) => setStartTime(e.target.value)}
                                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
                              />
                              <span className="text-xs text-gray-600">to</span>
                              <input
                                type="time"
                                value={endTime}
                                onChange={(e) => setEndTime(e.target.value)}
                                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
                              />
                            </div>
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1.5">
                            SMS Template
                          </label>
                          <textarea
                            value={smsTemplate}
                            onChange={(e) => setSmsTemplate(e.target.value)}
                            onBlur={() => handleSaveAutomation("sms")}
                            rows={3}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
                            placeholder="Enter your SMS template..."
                          />
                          <p className="text-xs text-gray-500 mt-1.5">
                            Variables: {"{restaurant_name}"}, {"{special}"}, {"{address}"}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="bg-gray-50 rounded-md border border-gray-200 p-5">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <Mail className="w-5 h-5 text-primary-600" />
                        <div>
                          <h4 className="text-sm font-semibold text-gray-900">
                            Email via SendGrid
                          </h4>
                          <p className="text-xs text-gray-600">Email notifications</p>
                        </div>
                      </div>
                      <button
                        onClick={async () => {
                          const newValue = !emailEnabled;
                          setEmailEnabled(newValue);
                          await handleSaveAutomation("email");
                        }}
                        className={`relative w-11 h-6 rounded-full transition-colors ${
                          emailEnabled ? "bg-primary-600" : "bg-gray-300"
                        }`}
                      >
                        <span
                          className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                            emailEnabled ? "translate-x-5" : "translate-x-0"
                          }`}
                        />
                      </button>
                    </div>

                    {emailEnabled && (
                      <div className="space-y-4 mt-4 pt-4 border-t border-gray-200">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1.5">
                              Cooldown
                            </label>
                            <select
                              value={cooldown}
                              onChange={(e) => setCooldown(e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
                            >
                              <option value="15m">15 minutes</option>
                              <option value="1h">1 hour</option>
                              <option value="24h">24 hours</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1.5">
                              Time Window
                            </label>
                            <div className="flex items-center gap-2">
                              <input
                                type="time"
                                value={startTime}
                                onChange={(e) => setStartTime(e.target.value)}
                                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
                              />
                              <span className="text-xs text-gray-600">to</span>
                              <input
                                type="time"
                                value={endTime}
                                onChange={(e) => setEndTime(e.target.value)}
                                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
                              />
                            </div>
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1.5">
                            Email Subject
                          </label>
                          <input
                            type="text"
                            value={emailSubject}
                            onChange={(e) => setEmailSubject(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
                            placeholder="Email subject..."
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1.5">
                            Email Body
                          </label>
                          <textarea
                            value={emailBody}
                            onChange={(e) => setEmailBody(e.target.value)}
                            rows={6}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
                            placeholder="Enter your email template..."
                          />
                          <p className="text-xs text-gray-500 mt-1.5">
                            Variables: {"{restaurant_name}"}, {"{special}"}, {"{address}"}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {activeTab === "Analytics" && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-base font-semibold text-gray-900 mb-4">
                    Notifications Sent (Last 30 Days)
                  </h3>
                  <div className="bg-white p-6 rounded-md border border-gray-200">
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={[]}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                        <XAxis dataKey="date" stroke="#6B7280" tick={{ fontSize: 12 }} />
                        <YAxis stroke="#6B7280" tick={{ fontSize: 12 }} />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "#FFFFFF",
                            border: "1px solid #E5E7EB",
                            borderRadius: "6px",
                            fontSize: "12px",
                          }}
                        />
                        <Line
                          type="monotone"
                          dataKey="sms"
                          stroke="#DC2626"
                          strokeWidth={2}
                          dot={{ fill: "#DC2626", r: 3 }}
                        />
                        <Line
                          type="monotone"
                          dataKey="email"
                          stroke="#1F2937"
                          strokeWidth={2}
                          dot={{ fill: "#1F2937", r: 3 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div>
                  <h3 className="text-base font-semibold text-gray-900 mb-4">Recent Events</h3>
                  <div className="bg-white rounded-md border border-gray-200 overflow-hidden">
                    <div className="p-12 text-center">
                      <p className="text-sm text-gray-600">No events yet</p>
                      <p className="text-xs text-gray-500 mt-1">
                        Events will appear here once notifications are sent
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
