"use client";

import { MapPin, Shield, BarChart3, Settings, ArrowRight, Zap, Users, Clock } from "lucide-react";
import Link from "next/link";

export default function HomePage() {
  const features = [
    {
      icon: MapPin,
      title: "Geofence Management",
      description: "Define precise geographic boundaries for your restaurant locations with an intuitive map interface.",
      color: "primary",
    },
    {
      icon: Zap,
      title: "Location-Based Notifications",
      description: "Automatically send SMS and email notifications when customers enter your defined zones.",
      color: "warning",
    },
    {
      icon: BarChart3,
      title: "Analytics & Insights",
      description: "Track visitor patterns, engagement rates, and notification performance in real-time.",
      color: "info",
    },
    {
      icon: Clock,
      title: "Smart Automation",
      description: "Set cooldown periods, time windows, and personalized message templates for each location.",
      color: "success",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-gray-50 to-white">
      {/* Navigation */}
      <nav className="bg-white/95 border-b border-gray-200 sticky top-0 z-50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <img src="/Untitled design (4).png" alt="LocalLoop" className="h-8" />
            </div>
            <div className="flex items-center gap-3">
              <Link
                href="/login"
                className="text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors px-4 py-2"
              >
                Sign In
              </Link>
              <Link
                href="/login"
                className="bg-primary-600 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-32">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-900 mb-8 tracking-tight leading-tight">
            Reach customers when they&apos;re nearby
          </h1>
          <p className="text-xl text-gray-600 mb-12 leading-relaxed max-w-2xl mx-auto">
            Automate location-based SMS and email campaigns for your restaurant. Set up geofences, customize messages, and track engagement—all in one place.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/login"
              className="bg-primary-600 text-white px-8 py-3.5 rounded-lg text-base font-semibold hover:bg-primary-700 transition-colors"
            >
              Get Started
            </Link>
            <Link
              href="#features"
              className="text-gray-700 px-8 py-3.5 text-base font-medium hover:text-gray-900 transition-colors"
            >
              Learn More
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">
              Everything you need
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Simple, powerful tools for location-based marketing
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white rounded-lg border border-gray-200 p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">{features[0].title}</h3>
              <p className="text-gray-600 leading-relaxed">{features[0].description}</p>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">{features[1].title}</h3>
              <p className="text-gray-600 leading-relaxed">{features[1].description}</p>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">{features[2].title}</h3>
              <p className="text-gray-600 leading-relaxed">{features[2].description}</p>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">{features[3].title}</h3>
              <p className="text-gray-600 leading-relaxed">{features[3].description}</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">How it works</h2>
            <p className="text-lg text-gray-600">Get started in minutes</p>
          </div>

          <div className="max-w-3xl mx-auto space-y-12">
            {[
              {
                step: "1",
                title: "Add Your Restaurant",
                description:
                  "Register your restaurant and provide its address.",
              },
              {
                step: "2",
                title: "Set Up Geofence",
                description:
                  "Use the map to define a circular area around your location.",
              },
              {
                step: "3",
                title: "Customize Messages",
                description:
                  "Create SMS and email templates for your campaigns.",
              },
              {
                step: "4",
                title: "Track Results",
                description:
                  "Monitor visitor patterns and engagement through your dashboard.",
              },
            ].map((item) => (
              <div
                key={item.step}
                className="flex items-start gap-6"
              >
                <div className="flex-shrink-0 w-10 h-10 bg-primary-600 text-white rounded-lg flex items-center justify-center font-semibold">
                  {item.step}
                </div>
                <div className="flex-1 pt-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-gray-600">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gray-900 py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to get started?</h2>
          <p className="text-lg text-gray-300 mb-8">
            Start engaging with customers near your restaurant.
          </p>
          <Link
            href="/login"
            className="bg-white text-gray-900 px-8 py-3 rounded-lg text-base font-semibold hover:bg-gray-100 transition-colors inline-block"
          >
            Create Account
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between">
            <img src="/Untitled design (4).png" alt="LocalLoop" className="h-6 mb-4 sm:mb-0" />
            <p className="text-sm text-gray-600">© 2024 LocalLoop. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
