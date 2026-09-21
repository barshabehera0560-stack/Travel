# Wanderly — System Workflow
### Travel & Tourism Management System

Version 1.0

This document describes the primary end-to-end workflows a user or the system executes across the platform.

---

## 3.1 User Onboarding Workflow

1. **Sign Up / Login** — User registers via email/password or Google OAuth. Backend creates a user record and issues a JWT access token + refresh token.
2. **Preference Capture** — A short onboarding quiz captures travel style, interests, and typical budget tier, stored in `users.preferences` (JSONB).
3. **Personalized Home Feed** — The Destinations service returns a ranked feed combining popularity, season, and the user's stated preferences.

## 3.2 Destination Search & Discovery Workflow

1. **Query Input** — User enters a search term or applies filters (budget, season, theme, traveler type).
2. **Search Execution** — Frontend calls `/api/v1/destinations/search`; backend queries PostgreSQL (indexed) and merges cached third-party enrichment (weather snapshot, hotel price-from) via Redis.
3. **Result Rendering** — Results render as animated destination cards (Framer Motion stagger-in) with quick-glance budget tier, weather icon, and rating.
4. **Destination Deep Dive** — Selecting a card opens a full destination profile: attractions, hotels, weather forecast, and reviews, each in its own lazy-loaded section.

## 3.3 Trip & Itinerary Planning Workflow

1. **Create Trip** — User defines destination(s), travel dates, traveler count, and budget ceiling, creating a row in `trips`.
2. **Auto-Suggested Itinerary** — The Itinerary service generates a draft day-by-day plan: it queries top-rated attractions, groups them geographically per day (using Maps distance data), and inserts a suggested hotel.
3. **Manual Customization** — User drags attractions/hotels/transport blocks between days via a drag-and-drop calendar UI; changes persist via PATCH calls to `itinerary_items`.
4. **Budget Recalculation** — Every change triggers a debounced recalculation of the budget summary (stay + transport + food + activities), rendered live in a sticky budget panel.
5. **Save / Share / Export** — Finalized trip can be saved, shared via a read-only link, or exported as a PDF itinerary (generated asynchronously via a background job and stored in S3).

## 3.4 Budget Comparison Workflow

1. **Select Candidates** — User adds 2-3 destinations to a comparison tray.
2. **Parallel Estimation** — Backend computes an estimated budget per destination using average hotel price tier, transport cost model, and a per-day food/activity multiplier based on selected budget tier.
3. **Side-by-Side View** — Frontend renders a comparison table/chart highlighting cost breakdown differences, with an animated bar-chart transition between selections.

## 3.5 Hotel & Transportation Discovery Workflow

1. **Fetch Request** — User opens the Hotels or Transport tab for a destination/date range.
2. **Cache Check** — Integration Layer checks Redis for a fresh cached response; if stale/missing, it calls the relevant third-party API.
3. **Normalize & Return** — Raw provider responses are normalized into Wanderly's internal schema and cached, then returned to the client.
4. **Compare & Add to Trip** — User compares options and adds a selection to their itinerary; clicking "Book" deep-links to the partner site/app (affiliate model) in the MVP.

## 3.6 Reviews & Ratings Workflow

1. **Eligibility Check** — System checks whether the user has interacted with the item (e.g., saved/visited) to encourage authentic reviews (soft gate, not a hard requirement in MVP).
2. **Submission** — User submits a star rating, comment, and optional photos; content passes basic profanity/spam filtering before being stored.
3. **Aggregation** — A scheduled job recalculates the average rating and review count for the item, cached for fast display.

## 3.7 Favorites (Wishlist) Workflow

1. **Save Action** — User taps a heart/save icon on a destination, attraction, or hotel; an optimistic UI update fires immediately with a micro-animation.
2. **Persistence** — A row is written to `favorites`; if the API call fails, the UI rolls back the optimistic state and shows a toast.
3. **Retrieval** — The Favorites dashboard queries all saved items grouped by type, enabling quick conversion into a new trip.

---
*Wanderly — System Workflow v1.0*
