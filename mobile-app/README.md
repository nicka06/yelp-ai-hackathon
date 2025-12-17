# Mobile App – Product Mockup

Goal: A **consumer app** that feels like a restaurant discovery + rewards app, with smart location-aware nudges in the background.

## Tech Stack (planned)

- **Expo React Native** (iOS first, Android later)
- Navigation: `@react-navigation` with a bottom tab navigator
- Location: `expo-location` + `expo-task-manager` (background updates)
- Backend: REST/GraphQL API from `../backend/`

## App Structure (Tabs)

- **Home**
  - Personalized feed:
    - "Near you now" cards (partner restaurants ordered by distance)
    - "Because you liked…" (future: recommendation logic)
  - Each card shows:
    - Name, cuisine, distance, rating, key perk (e.g. "Free appetizer")
  - Tapping a card → `RestaurantDetail` screen.

- **Map**
  - Full-screen map with:
    - User location (blue dot)
    - Pins for partner restaurants
    - Pin badges when there is an active reward / special
  - Bottom sheet with the currently selected restaurant.

- **Favorites**
  - List of restaurants the user has starred:
    - Name, distance, a small badge if user is currently near one
  - Per-favorite toggles (future):
    - Notify when near this place
    - Mute for 24h

- **Rewards**
  - "Wallet" of perks:
    - Active rewards (with expiry and conditions)
    - Progress bars ("Visit X more times to unlock Y")
  - Each reward links back to `RestaurantDetail`.

- **Profile / Settings**
  - Profile info (optional name/avatar)
  - Notification preferences:
    - Enable/disable Calls / SMS / Push / Email
    - Quiet hours (e.g. 9pm–9am = no calls)
  - Location & privacy:
    - One-time explanation
    - "Clear my location history" (hits backend)
  - Developer/testing section (only in dev builds):
    - Fake location selector (choose a restaurant and simulate being there)

## Key Flows

### Onboarding Flow

1. **Welcome** – quick explanation of value.
2. **Location Permissions** – friendly screen + OS prompt:
   - Request foreground
   - Then background (with clear justification)
3. **Contact Info (Optional)** – phone/email for SMS/email channels.
4. Land on **Home** with basic content (even if location off).

If user denies background location:
- App still works for browsing, but some features show a subtle banner: "Turn on background location to get real-time perks."

### Background Location Behavior (Concept)

- On app start and periodically in background (once implemented):
  - Send `{ userId, coords, timestamp }` to backend.
- Backend decides:
  - Whether user entered a geofence
  - Whether to trigger a notification (call/SMS/email/push) based on cooldowns & preferences.

**Important:**
- The app UI does **not** revolve around a giant "Tracking" toggle.
- Location is a supporting feature; the visible UX is about discovery, favorites, and rewards.

## Data the App Needs

From backend:
- List of nearby partner restaurants (for Home + Map)
- Restaurant details:
  - id, name, coordinates, cuisine, rating, photos, short description
  - available rewards / specials
- User profile/preferences:
  - notification channel preferences
  - favorites list
  - active rewards
- Event history:
  - recent calls / SMS / emails initiated on user’s behalf

To backend:
- Auth token / user identifier
- Location pings (when implemented)
- Favorites changes (add/remove)
- Preferences updates

## MVP vs Later

**MVP mobile app:**
- Onboarding with location permission
- Bottom tabs with stub screens
- Home showing static or mock restaurants from backend
- Map screen showing pins from backend
- Favorites + Rewards using mocked data
- Profile/Settings saving preferences locally and syncing to backend

**Later:**
- Real-time background location + geofence-triggered events
- Deep rewards logic and visit tracking
- In-app call UI summary after an AI call completes
