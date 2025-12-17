"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, AlertCircle } from "lucide-react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { createLocation } from "@/lib/db";

export default function NewLocationPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (session) {
      setAuthenticated(true);
      setUserId(session.user.id);
    } else {
      router.push("/login");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!userId) {
      setError("Not authenticated");
      setLoading(false);
      return;
    }

    try {
      const location = await createLocation({
        user_id: userId,
        name,
        address,
        description: description || null,
        latitude: null,
        longitude: null,
        status: "paused",
      });

      router.push(`/locations/${location.id}`);
    } catch (err: any) {
      console.error("Error creating location:", err);
      setError(err.message || "Failed to create location. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600 text-sm">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Dashboard</span>
          </Link>
          <h1 className="text-2xl font-semibold text-gray-900 pb-4">Add New Location</h1>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1.5">
                Restaurant Name <span className="text-red-600">*</span>
              </label>
              <input
                id="name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                placeholder="e.g., Tony's Pizzeria"
              />
            </div>

            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1.5">
                Address <span className="text-red-600">*</span>
              </label>
              <input
                id="address"
                type="text"
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                placeholder="e.g., 123 Main St, Ann Arbor, MI 48104"
              />
            </div>

            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700 mb-1.5"
              >
                Description
              </label>
              <textarea
                id="description"
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                placeholder="Brief description of your restaurant..."
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
              <Link
                href="/dashboard"
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-50 transition-colors"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={loading}
                className="flex items-center gap-2 bg-primary-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save className="w-4 h-4" />
                {loading ? "Creating..." : "Create Location"}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
