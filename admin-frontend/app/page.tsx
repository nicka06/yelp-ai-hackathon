"use client";

import { MapPin, Shield, BarChart3, Settings, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function HomePage() {
  const features = [
    {
      icon: MapPin,
      title: "Geofence Management",
      description: "Define precise geographic boundaries for your restaurant locations with an intuitive map interface.",
    },
    {
      icon: Shield,
      title: "Location-Based Notifications",
      description: "Automatically send SMS and email notifications when customers enter your defined zones.",
    },
    {
      icon: BarChart3,
      title: "Analytics & Insights",
      description: "Track visitor patterns, engagement rates, and notification performance in real-time.",
    },
    {
      icon: Settings,
      title: "Customizable Rules",
      description: "Set cooldown periods, time windows, and personalized message templates for each location.",
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="border-b border-gray-200 bg-white sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 bg-primary-600 rounded flex items-center justify-center">
                <MapPin className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg font-semibold text-gray-900">Restaurant Concierge</span>
            </div>
            <div className="flex items-center gap-6">
              <Link
                href="/login"
                className="text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/login"
                className="bg-primary-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-primary-700 transition-colors"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6 tracking-tight">
            Location-Based Customer Engagement Platform
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 mb-10 leading-relaxed">
            Connect with customers when they're near your restaurant. Automate SMS and email
            notifications based on precise geofencing technology.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/login"
              className="bg-primary-600 text-white px-6 py-3 rounded-md font-medium hover:bg-primary-700 transition-colors inline-flex items-center gap-2"
            >
              Get Started
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="#features"
              className="border border-gray-300 text-gray-700 px-6 py-3 rounded-md font-medium hover:bg-gray-50 transition-colors"
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
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Features</h2>
            <p className="text-base text-gray-600 max-w-2xl mx-auto">
              Everything you need to manage location-based customer engagement
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white rounded-lg border border-gray-200 p-8 hover:border-gray-300 transition-colors"
              >
                <div className="w-10 h-10 bg-primary-50 rounded-md flex items-center justify-center mb-4">
                  <feature.icon className="w-5 h-5 text-primary-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">How It Works</h2>
          </div>

          <div className="max-w-4xl mx-auto space-y-8">
            {[
              {
                step: "1",
                title: "Add Your Restaurant Location",
                description:
                  "Register your restaurant and provide its address. Our system will automatically geocode the location.",
              },
              {
                step: "2",
                title: "Define Geofence Area",
                description:
                  "Use our interactive map to draw a circular geofence around your restaurant. Set the radius that works best for your location.",
              },
              {
                step: "3",
                title: "Configure Notification Rules",
                description:
                  "Set up SMS and email templates, cooldown periods, and time windows. Customize messages with dynamic variables.",
              },
              {
                step: "4",
                title: "Monitor & Analyze",
                description:
                  "Track visitor patterns, notification delivery rates, and engagement metrics through our analytics dashboard.",
              },
            ].map((item) => (
              <div key={item.step} className="flex items-start gap-5">
                <div className="flex-shrink-0 w-10 h-10 bg-primary-600 text-white rounded-md flex items-center justify-center font-semibold text-sm">
                  {item.step}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1.5">{item.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gray-900 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-3">Ready to Get Started?</h2>
          <p className="text-base text-gray-400 mb-8">
            Start engaging with customers when they're near your restaurant today.
          </p>
          <Link
            href="/login"
            className="bg-white text-gray-900 px-6 py-3 rounded-md font-medium hover:bg-gray-100 transition-colors inline-flex items-center gap-2"
          >
            Create Account
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between">
            <div className="flex items-center gap-2.5 mb-4 sm:mb-0">
              <div className="w-7 h-7 bg-primary-600 rounded flex items-center justify-center">
                <MapPin className="w-4 h-4 text-white" />
              </div>
              <span className="text-base font-semibold text-gray-900">Restaurant Concierge</span>
            </div>
            <p className="text-sm text-gray-500">© 2024 Restaurant Concierge. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
