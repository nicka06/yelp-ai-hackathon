"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MapPin, Mail, Lock, AlertCircle } from "lucide-react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default function LoginPage() {
  const router = useRouter();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!email || !password) {
      setError("Please fill in all fields");
      setLoading(false);
      return;
    }

    if (isSignUp && password !== confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      setLoading(false);
      return;
    }

    try {
      if (isSignUp) {
        // Sign up
        const { data, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
        });

        if (signUpError) throw signUpError;

        if (!data.user) {
          throw new Error("Failed to create user account");
        }

        // User profile will be created automatically by database trigger
        // No need to manually insert here

        // Try to sign in (will work if email confirmation is disabled)
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (signInError) {
          // If email confirmation is required, show helpful message
          if (signInError.message.includes("email_not_confirmed") || signInError.message.includes("Email not confirmed")) {
            setError("Please check your email and click the confirmation link before signing in.");
            setLoading(false);
            return;
          }
          throw signInError;
        }
      } else {
        // Sign in
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (signInError) {
          // If email confirmation is required, show helpful message
          if (signInError.message.includes("email_not_confirmed") || signInError.message.includes("Email not confirmed")) {
            setError("Please check your email and click the confirmation link to activate your account.");
            setLoading(false);
            return;
          }
          throw signInError;
        }
      }

      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message || "An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2.5 mb-6">
            <div className="w-8 h-8 bg-primary-600 rounded flex items-center justify-center">
              <MapPin className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-semibold text-gray-900">Restaurant Concierge</span>
          </Link>
          <h2 className="text-2xl font-bold text-gray-900">
            {isSignUp ? "Create your account" : "Sign in to your account"}
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {isSignUp ? "Or" : "Don't have an account?"}{" "}
            <button
              onClick={() => {
                setIsSignUp(!isSignUp);
                setError("");
              }}
              className="font-medium text-primary-600 hover:text-primary-700"
            >
              {isSignUp ? "sign in" : "sign up"}
            </button>
          </p>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-8">
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">
                Email address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete={isSignUp ? "new-password" : "current-password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {isSignUp && (
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-gray-700 mb-1.5"
                >
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    autoComplete="new-password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                    placeholder="••••••••"
                  />
                </div>
              </div>
            )}

            {!isSignUp && (
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                    Remember me
                  </label>
                </div>
                <div className="text-sm">
                  <a href="#" className="font-medium text-primary-600 hover:text-primary-700">
                    Forgot password?
                  </a>
                </div>
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary-600 text-white py-2.5 px-4 rounded-md font-medium hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm"
              >
                {loading ? "Processing..." : isSignUp ? "Create account" : "Sign in"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
