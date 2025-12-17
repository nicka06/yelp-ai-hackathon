# LocalLoop – Architecture & Plan

This repo is a **blueprint**, not an implementation (yet). It defines what we’re going to build:

- A **mobile app** for consumers (maps, favorites, rewards, subtle background location)
- A **web admin app** for restaurant owners (map-based geofences, notifications config)
- A **backend** that connects location events to notification rules (calls/SMS/email)

## High-Level Components

- `mobile-app/` – React Native (Expo) app
- `admin-frontend/` – Next.js web admin
- `backend/` – API + worker/cron for geofence logic and integrations

See each subdirectory’s README for detailed mockups and flows.
