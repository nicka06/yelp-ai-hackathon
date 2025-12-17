# Backend – Architecture Mockup

Goal: A service that connects **user location events** from the mobile app to **notification automations** configured in the admin app.

## Tech Stack (planned)

- **Node.js** (Express / Fastify / Nest – to decide)
- Database: Postgres (Supabase, Neon, or managed Postgres)
- Background jobs / scheduling: simple queue (BullMQ) or cron for retries/cooldowns
- Integrations:
  - ElevenLabs (calls via Twilio)
  - Twilio (SMS / phone infra)
  - Email provider (SendGrid/Resend) later

## Core Responsibilities

- Receive **location pings** from mobile app
- Match against geofences
- Check automations & cooldowns
- Trigger appropriate actions (call/SMS/email)
- Expose APIs for:
  - Admin frontend (locations, geofences, automations, analytics)
  - Mobile app (restaurants nearby, user profile, rewards)

## Key Endpoints (conceptual)

### Public / Mobile

- `POST /api/mobile/location`
  - Body: `{ userId, lat, lng, timestamp }`
  - Finds which geofences (if any) the user is in
  - Enqueues geofence-enter events for processing

- `GET /api/mobile/nearby?lat=&lng=`
  - Returns nearby partner locations + minimal data

- `GET /api/mobile/profile`
  - Returns user preferences, favorites, rewards

### Admin

- `GET /api/admin/locations`
- `POST /api/admin/locations`
- `GET /api/admin/locations/:id`
- `PATCH /api/admin/locations/:id`

- `POST /api/admin/locations/:id/geofence`
- `GET /api/admin/locations/:id/geofence`

- `POST /api/admin/locations/:id/automations`
- `GET /api/admin/locations/:id/automations`

- `GET /api/admin/locations/:id/events` (for analytics)

### Internal / Jobs

- Job worker consumes events:
  - `user_entered_geofence`
  - Checks:
    - User cooldowns for this location + channel
    - Time window
    - User preferences
  - If allowed:
    - Calls ElevenLabs / Twilio API
    - Persists `call_started` / `call_completed` events

## Data Flow (MVP)

1. Mobile app calls `POST /api/mobile/location` with coords.
2. Backend:
   - Finds matching geofence(s)
   - For each, pushes `user_entered_geofence` job into queue
3. Worker pulls job:
   - Loads automations for that location
   - For each enabled channel (e.g. call):
     - Check cooldown & rules
     - If allowed → call ElevenLabs Twilio endpoint
4. Admin app reads aggregated data via `/api/admin/*` endpoints.

## MVP vs Later

**MVP backend:**
- Basic user + location + geofence + automation models
- Location ingestion + simple geofence check (circle)
- One channel: call via ElevenLabs (Twilio outbound-call API)
- Simple cooldown (e.g. 1 call per user per 24h per location)

**Later:**
- More channels (SMS, email)
- Detailed analytics & reporting
- Advanced segmentation rules
- Webhooks from Twilio/ElevenLabs to update call status in real time
