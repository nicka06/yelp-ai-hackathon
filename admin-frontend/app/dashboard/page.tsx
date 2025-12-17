"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  MapPin,
  Users,
  Mail,
  MessageSquare,
  Plus,
  LogOut,
} from "lucide-react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { getLocations } from "@/lib/db";
import type { Location } from "@/lib/db";

export default function DashboardPage() {
  const router = useRouter();
  const [authenticated, setAuthenticated] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (session) {
      setAuthenticated(true);
      setUser(session.user);
      loadLocations(session.user.id);
    } else {
      router.push("/login");
    }
  };

  const loadLocations = async (userId: string) => {
    try {
      const data = await getLocations(userId);
      setLocations(data);
    } catch (error) {
      console.error("Error loading locations:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  if (!authenticated || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600 text-sm">Loading...</p>
      </div>
    );
  }

  const totalLocations = locations.length;
  const activeLocations = locations.filter((l) => l.status === "active").length;
  // TODO: Calculate from events table
  const totalVisitors = 0;
  const totalSms = 0;
  const totalEmails = 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-primary-600 rounded flex items-center justify-center">
                <MapPin className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-semibold text-gray-900">Dashboard</h1>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-sm text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md hover:bg-gray-100 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 bg-primary-50 rounded-md flex items-center justify-center">
                <MapPin className="w-5 h-5 text-primary-600" />
              </div>
            </div>
            <h3 className="text-sm font-medium text-gray-600 mb-1">Total Locations</h3>
            <p className="text-2xl font-semibold text-gray-900">{totalLocations}</p>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 bg-blue-50 rounded-md flex items-center justify-center">
                <Users className="w-5 h-5 text-blue-600" />
              </div>
            </div>
            <h3 className="text-sm font-medium text-gray-600 mb-1">Visitors Today</h3>
            <p className="text-2xl font-semibold text-gray-900">{totalVisitors}</p>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 bg-green-50 rounded-md flex items-center justify-center">
                <MessageSquare className="w-5 h-5 text-green-600" />
              </div>
            </div>
            <h3 className="text-sm font-medium text-gray-600 mb-1">SMS Sent</h3>
            <p className="text-2xl font-semibold text-gray-900">{totalSms}</p>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 bg-purple-50 rounded-md flex items-center justify-center">
                <Mail className="w-5 h-5 text-purple-600" />
              </div>
            </div>
            <h3 className="text-sm font-medium text-gray-600 mb-1">Emails Sent</h3>
            <p className="text-2xl font-semibold text-gray-900">{totalEmails}</p>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Locations</h2>
            <Link
              href="/locations/new"
              className="flex items-center gap-2 bg-primary-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-primary-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Location
            </Link>
          </div>

          {locations.length === 0 ? (
            <div className="p-12 text-center">
              <div className="w-12 h-12 bg-gray-100 rounded-md flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-6 h-6 text-gray-400" />
              </div>
              <h3 className="text-base font-medium text-gray-900 mb-1">No locations yet</h3>
              <p className="text-sm text-gray-600 mb-6">
                Get started by adding your first restaurant location.
              </p>
              <Link
                href="/locations/new"
                className="inline-flex items-center gap-2 bg-primary-600 text-white px-4 py-2.5 rounded-md text-sm font-medium hover:bg-primary-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add Your First Location
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Address
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Created
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {locations.map((location) => (
                    <tr
                      key={location.id}
                      className="hover:bg-gray-50 cursor-pointer transition-colors"
                      onClick={() => router.push(`/locations/${location.id}`)}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium text-gray-900">{location.name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {location.address}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            location.status === "active"
                              ? "bg-green-100 text-green-700"
                              : "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {location.status === "active" ? "Active" : "Paused"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {new Date(location.created_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
