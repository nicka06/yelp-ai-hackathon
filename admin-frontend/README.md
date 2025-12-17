# Admin Web App – Product Mockup

Goal: A **control panel** for restaurant owners/ops to:
- Define geofences on a map
- Configure what happens when users enter those zones (calls/SMS/emails)
- See basic analytics

## Tech Stack (planned)

- **Next.js** (App Router) + React
- UI: Tailwind or shadcn/ui (to move fast)
- Map: Mapbox GL JS or Google Maps JS SDK
- Auth: simple email/password (NextAuth or custom)
- API: talks to `../backend/` over REST/GraphQL

## Main Pages

- **Login / Signup**
  - Email + password (or magic link later).
  - Once logged in → Dashboard.

- **Dashboard**
  - KPI cards:
    - Total active locations
    - Visitors detected (today)
    - Calls made (today)
  - Table: "Your Locations"
    - Name, City, Status (Active/Paused), last activity
    - Clicking a row → `Location Detail`.

- **Location Detail** (core screen)
  - Tabs: `Overview | Geofence | Automations | Analytics`

  ### Overview tab
  - Name, address, description
  - Status toggle: Active / Paused
  - Quick metrics: visitors, calls, SMS, emails (last 7 days)

  ### Geofence tab
  - Map centered on restaurant
  - Tools (MVP):
    - Drag a **circle** (radius slider: 50m–500m)
  - Show current radius + coordinates
  - "Save Geofence" button (sends shape to backend)

  ### Automations tab
  - Channel toggles:
    - [x] Call via ElevenLabs
    - [ ] SMS via Twilio (future)
    - [ ] Email via SendGrid (future)
  - For each enabled channel:
    - Cooldown: `Max 1 per user every [ 15m | 1h | 24h ]`
    - Time window: `Only between [start time] and [end time]`
    - Template editor:
      - **Call**: Prompt text with variables like `{restaurant_name}`, `{special}`, `{rating}`.
      - **SMS/Email (later)**: Subject + body with variables.
  - "Test this flow" section:
    - Input: phone number
    - Button: `Send test call`
    - Backend simulates a geofence hit and triggers the same logic.

  ### Analytics tab
  - Chart: calls per day (last 30 days)
  - Table: recent events
    - Time, user (anonymized id), channel, outcome (answered/voicemail/etc.)

- **Account / Settings**
  - Organization name
  - Default cooldowns & time windows
  - Billing (later)

