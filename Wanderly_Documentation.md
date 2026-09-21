# WANDERLY
### Travel & Tourism Management System
*Discover. Plan. Wander.*

**Product & Engineering Documentation**
Product Requirements • Technical Architecture • System Workflow • Security Architecture • Technology Stack

**Stack:** React.js • Node.js • PostgreSQL • AWS
Version 1.0

---

## Table of Contents

1. [Product Requirements Document (PRD)](#1-product-requirements-document-prd)
2. [Technical Architecture](#2-technical-architecture)
3. [System Workflow](#3-system-workflow)
4. [Security Architecture](#4-security-architecture)
5. [Technology Stack](#5-technology-stack)

---

## 1. Product Requirements Document (PRD)

### 1.1 Product Overview

Wanderly is a modern travel and tourism management platform that helps travelers discover destinations, explore attractions, compare hotels and transportation, check real-time weather, and build complete day-wise trip itineraries in one place. The platform replaces the current experience of juggling 6-8 different apps and browser tabs (maps, weather, hotel sites, blogs, spreadsheets) with a single, personalized, visually rich planning workspace.

The product is designed to feel modern, adventurous, and premium — using immersive imagery, smooth motion design, and a friendly, inspiring tone — while remaining fast, organized, and easy to use for both quick weekend getaways and complex multi-city trips.

### 1.2 Vision & Goals

- Make trip planning feel inspiring and effortless rather than overwhelming.
- Provide one unified, personalized source of truth for destination info, budget, weather, and itinerary.
- Help users make confident decisions through transparent budget estimates and authentic peer reviews.
- Build a platform that scales from a single-city weekend trip to a multi-destination international itinerary.
- Create a delightful, premium visual experience with motion and micro-interactions that reflect a modern travel brand.

### 1.3 Target Users & Personas

| Persona | Description | Key Needs |
|---|---|---|
| **The Explorer** (Priya, 27) | Solo/small-group traveler planning 2-3 trips a year on a moderate budget. | Budget comparison, authentic reviews, quick itinerary building. |
| **The Family Planner** (Rohan, 38) | Plans annual family vacations, values safety and convenience. | Weather forecasts, kid-friendly attractions, hotel + transport bundling. |
| **The Adventure Seeker** (Maya, 24) | Backpacker chasing unique experiences and offbeat destinations. | Discovery of hidden gems, community reviews, day-wise flexibility. |
| **The Business-Leisure Traveler** (Arjun, 34) | Extends work trips into short leisure add-ons. | Fast search, reliable transport info, saved favorites for repeat cities. |

### 1.4 Core Features (Functional Requirements)

#### 1.4.1 Destination Discovery
- Search destinations by name, region, theme (beach, mountain, heritage, adventure, nightlife).
- Filter by budget range, travel season, trip duration, and traveler type (solo, family, couple, group).
- Rich destination profiles: photos, overview, best time to visit, top attractions, local tips.
- Personalized recommendations based on past searches, saved favorites, and preferences.

#### 1.4.2 Attractions & Points of Interest
- Browse attractions per destination with category tags (historical, nature, food, adventure, shopping).
- Map view of attractions with distance and estimated visit duration.
- Add attractions directly into a day-wise itinerary with one click / drag-and-drop.

#### 1.4.3 Hotels & Accommodation
- Search and compare hotels by price, rating, amenities, and distance from key attractions.
- Live availability and pricing sourced from third-party hotel APIs (e.g., Booking.com / RapidAPI Hotels).
- Save shortlisted hotels to a trip for later comparison.

#### 1.4.4 Transportation
- Flight, train, and intercity bus/cab options between origin and destination.
- Estimated travel time, cost range, and booking-partner deep links.
- Local transportation guidance within the destination (metro, rental, walkability).

#### 1.4.5 Weather Intelligence
- Live weather and multi-day forecast for the selected destination and travel dates.
- Seasonal climate guide to support "best time to visit" recommendations.
- Packing suggestions generated from forecast conditions.

#### 1.4.6 Trip Planning & Itinerary Builder
- Create a trip with destination(s), travel dates, number of travelers, and budget.
- Auto-generate a suggested day-wise itinerary, fully editable via drag-and-drop.
- Add hotels, attractions, transport legs, and custom notes to each day.
- Multi-city / multi-destination trip support.

#### 1.4.7 Budget Estimator & Comparison
- Auto-calculate estimated cost across stay, transport, food, and activities.
- Compare estimated budgets across 2-3 destinations side-by-side.
- Adjustable budget sliders that live-update the itinerary suggestions.

#### 1.4.8 Favorites, Reviews & Ratings
- Save destinations, attractions, and hotels to a personal wishlist.
- Submit star ratings and written reviews with optional photos.
- View aggregated ratings and sort/filter reviews (most recent, most helpful).

#### 1.4.9 User Account & Personalization
- Sign up / login via email or social OAuth (Google).
- Preference profile: travel style, budget tier, interests.
- Trip history and dashboard of upcoming/past trips.

### 1.5 Non-Functional Requirements

| Category | Requirement |
|---|---|
| Performance | Core pages load in under 2.5s (LCP); search results return within 800ms P95. |
| Scalability | Support growth from MVP (1K users) to 500K+ MAU without architecture rewrite. |
| Availability | 99.9% uptime target for core booking-adjacent flows. |
| Usability | Mobile-first responsive design; WCAG 2.1 AA accessibility baseline. |
| Security | Encrypted data in transit/at rest; OWASP Top 10 mitigations (see Security Architecture). |
| Internationalization | Multi-currency budget display; timezone-aware dates; extensible for i18n text. |
| Maintainability | Modular codebase with documented APIs and automated test coverage ≥ 70%. |

### 1.6 Key User Stories

1. As a traveler, I want to search destinations by budget and season, so that I can shortlist places I can realistically afford and enjoy.
2. As a traveler, I want to see a live weather forecast for my travel dates, so that I can pack and plan appropriately.
3. As a traveler, I want to compare estimated budgets across two destinations, so that I can decide where to go.
4. As a traveler, I want to build a day-by-day itinerary by adding attractions and hotels, so that my trip is organized.
5. As a traveler, I want to save places to favorites, so that I can revisit them before making a final decision.
6. As a traveler, I want to read and write reviews, so that I can trust the information and help other travelers.
7. As a returning user, I want personalized destination suggestions, so that I discover places matching my interests.

### 1.7 Success Metrics (KPIs)

- **Activation:** % of signups who create at least one trip itinerary within 7 days.
- **Engagement:** average number of destinations saved to favorites per active user/month.
- **Retention:** % of users returning to edit/view a trip within 30 days.
- **Conversion-adjacent:** click-through rate to hotel/transport booking partners.
- **Content trust:** average review rating volume growth and review completion rate.

### 1.8 Assumptions & Constraints

- Actual hotel, flight, and payment transactions are completed on partner platforms (affiliate/deep-link model) in the initial release; native in-app booking/payments are a future phase.
- Weather, maps, and inventory data depend on third-party API uptime, rate limits, and licensing terms.
- Initial launch targets web (responsive) with a mobile app as a future phase.

### 1.9 MVP Scope vs. Future Roadmap

| Phase | Scope |
|---|---|
| **MVP (Phase 1)** | Destination search & discovery, attraction browsing, weather, budget estimator, manual itinerary builder, favorites, reviews & ratings, hotel/transport comparison via affiliate APIs. |
| **Phase 2** | AI-personalized itinerary auto-generation, multi-city trip planning, collaborative trip planning (shared trips with friends/family), price-drop alerts. |
| **Phase 3** | Native in-app booking & payments, mobile apps (iOS/Android), offline itinerary access, loyalty/rewards program. |

---

## 2. Technical Architecture

### 2.1 Architecture Style

Wanderly is built as a modular, service-oriented monolith at launch — a single Node.js backend organized into clearly bounded domain modules (Users, Destinations, Itineraries, Reviews, Bookings-Integration, Notifications) — designed so that any module can be extracted into an independent microservice as scale demands, without a rewrite. This balances development speed for an MVP with a clean path to horizontal scaling.

#### 2.1.1 High-Level System Diagram

```
Client (React SPA, CDN-hosted static assets)
        │
        ▼
API Gateway / Load Balancer (AWS ALB)
        │
        ▼
Node.js / Express Application Layer (containerized, auto-scaled)
        │
        ├──► PostgreSQL (Amazon RDS, primary + read replica)
        ├──► Redis (ElastiCache — caching & sessions)
        │
        └──► Integration Layer (circuit breakers + caching)
                ├── Google Maps API
                ├── OpenWeatherMap API
                ├── Amadeus API (flights)
                └── Hotels API (RapidAPI / Booking.com)

Static media (images, itinerary PDFs) → Amazon S3 → served via CloudFront CDN
```

### 2.2 Frontend Architecture (React.js)

- Single Page Application built with React 18+ and React Router for client-side navigation.
- State management: React Query (TanStack Query) for server-state/caching, Zustand/Redux Toolkit for global UI state.
- Component library: design-system based component structure (atoms/molecules/organisms) with Tailwind CSS for styling.
- Animation layer: Framer Motion for page/component transitions, GSAP for scroll-based storytelling on destination pages, Lottie for lightweight vector animations (loading states, empty states).
- Code-splitting and lazy loading per route to keep initial bundle small; image lazy-loading and responsive `srcset` for hero imagery.
- PWA-ready (service worker + manifest) to support installability and basic offline caching of viewed trips.

### 2.3 Backend Architecture (Node.js)

- Runtime: Node.js (LTS) with Express.js as the HTTP framework, structured using a layered pattern: Routes → Controllers → Services → Data Access (Repositories).
- ORM: Prisma (or Sequelize) for type-safe PostgreSQL access and migrations.
- API style: RESTful JSON APIs, versioned (`/api/v1/...`), with OpenAPI/Swagger documentation.
- Background jobs: BullMQ (Redis-backed queue) for async tasks — sending emails, refreshing cached weather/hotel data, generating itinerary PDFs.
- Integration Layer: a dedicated module wrapping each third-party API (Maps, Weather, Flights, Hotels) with retry logic, circuit breaker, and response caching to isolate the core app from third-party instability.

### 2.4 Database Design (PostgreSQL)

Core entities and relationships (simplified):

| Table | Key Columns | Notes |
|---|---|---|
| `users` | id, name, email, password_hash, oauth_provider, preferences (JSONB), created_at | Preferences stored as JSONB for flexible personalization attributes. |
| `destinations` | id, name, country, region, category, best_season, description, avg_cost_tier | Indexed on name, region, category for fast search. |
| `attractions` | id, destination_id (FK), name, category, lat, lng, avg_visit_minutes | Linked to destinations; geo-indexed. |
| `hotels_cache` | id, destination_id (FK), external_id, name, price_range, rating, amenities (JSONB), fetched_at | Cached snapshot of third-party hotel API results. |
| `trips` | id, user_id (FK), title, start_date, end_date, budget_estimate, status | One user can own many trips. |
| `itinerary_days` | id, trip_id (FK), day_number, date, notes | Represents one day within a trip. |
| `itinerary_items` | id, itinerary_day_id (FK), item_type, ref_id, start_time, order_index | item_type: attraction / hotel / transport / custom. |
| `favorites` | id, user_id (FK), item_type, item_id, created_at | Polymorphic favorite reference (destination/attraction/hotel). |
| `reviews` | id, user_id (FK), item_type, item_id, rating, comment, photos (JSONB), created_at | Powers ratings & review feed. |
| `weather_cache` | id, destination_id (FK), forecast_date, data (JSONB), fetched_at | Short-TTL cache of weather API responses. |

All foreign keys use `ON DELETE CASCADE` or `SET NULL` as appropriate; monetary columns use `NUMERIC` types (never floating point) to avoid rounding errors in budget calculations.

### 2.5 Third-Party API Integrations

| Capability | Provider (Recommended) | Purpose |
|---|---|---|
| Maps & Places | Google Maps Platform (Places, Directions, Geocoding APIs) | Attraction locations, distance/duration, map rendering. |
| Weather | OpenWeatherMap (Current + One Call/Forecast API) | Live weather and multi-day forecasts per destination. |
| Flights | Amadeus for Developers (Flight Offers Search) | Flight options, indicative pricing between origin/destination. |
| Hotels | Booking.com / RapidAPI Hotels API | Hotel search, pricing, availability, ratings. |
| Ground Transport (optional) | Rome2Rio API or regional transit APIs | Intercity train/bus options and estimated fares. |

### 2.6 Caching & Performance Layer

- Amazon ElastiCache (Redis) caches: weather responses (TTL ~1 hour), hotel search results (TTL ~15-30 min), popular destination pages, and session/JWT blacklist data.
- CDN (CloudFront) serves static assets and destination imagery close to users globally.
- Database read replica offloads heavy read traffic (destination browsing, search) from the primary write instance.

### 2.7 Deployment Architecture (AWS)

| Layer | AWS Service |
|---|---|
| Frontend hosting | S3 (static build) + CloudFront CDN |
| Backend compute | ECS Fargate (containerized Node.js services) behind an Application Load Balancer |
| Database | Amazon RDS for PostgreSQL (Multi-AZ) + read replica |
| Caching / Queue | Amazon ElastiCache (Redis) |
| Object storage | Amazon S3 (images, generated itinerary PDFs) |
| Secrets | AWS Secrets Manager (API keys, DB credentials) |
| Networking | VPC with public/private subnets, security groups, NAT Gateway |
| CI/CD | GitHub Actions → Amazon ECR → ECS deployment pipeline |
| Monitoring | Amazon CloudWatch (logs/metrics/alarms) + AWS X-Ray (tracing) |
| DNS / Edge | Route 53 + AWS WAF + Shield (DDoS protection) |

---

## 3. System Workflow

This section describes the primary end-to-end workflows a user or the system executes across the platform.

### 3.1 User Onboarding Workflow

1. **Sign Up / Login** — User registers via email/password or Google OAuth. Backend creates a user record and issues a JWT access token + refresh token.
2. **Preference Capture** — A short onboarding quiz captures travel style, interests, and typical budget tier, stored in `users.preferences` (JSONB).
3. **Personalized Home Feed** — The Destinations service returns a ranked feed combining popularity, season, and the user's stated preferences.

### 3.2 Destination Search & Discovery Workflow

1. **Query Input** — User enters a search term or applies filters (budget, season, theme, traveler type).
2. **Search Execution** — Frontend calls `/api/v1/destinations/search`; backend queries PostgreSQL (indexed) and merges cached third-party enrichment (weather snapshot, hotel price-from) via Redis.
3. **Result Rendering** — Results render as animated destination cards (Framer Motion stagger-in) with quick-glance budget tier, weather icon, and rating.
4. **Destination Deep Dive** — Selecting a card opens a full destination profile: attractions, hotels, weather forecast, and reviews, each in its own lazy-loaded section.

### 3.3 Trip & Itinerary Planning Workflow

1. **Create Trip** — User defines destination(s), travel dates, traveler count, and budget ceiling, creating a row in `trips`.
2. **Auto-Suggested Itinerary** — The Itinerary service generates a draft day-by-day plan: it queries top-rated attractions, groups them geographically per day (using Maps distance data), and inserts a suggested hotel.
3. **Manual Customization** — User drags attractions/hotels/transport blocks between days via a drag-and-drop calendar UI; changes persist via PATCH calls to `itinerary_items`.
4. **Budget Recalculation** — Every change triggers a debounced recalculation of the budget summary (stay + transport + food + activities), rendered live in a sticky budget panel.
5. **Save / Share / Export** — Finalized trip can be saved, shared via a read-only link, or exported as a PDF itinerary (generated asynchronously via a background job and stored in S3).

### 3.4 Budget Comparison Workflow

1. **Select Candidates** — User adds 2-3 destinations to a comparison tray.
2. **Parallel Estimation** — Backend computes an estimated budget per destination using average hotel price tier, transport cost model, and a per-day food/activity multiplier based on selected budget tier.
3. **Side-by-Side View** — Frontend renders a comparison table/chart highlighting cost breakdown differences, with an animated bar-chart transition between selections.

### 3.5 Hotel & Transportation Discovery Workflow

1. **Fetch Request** — User opens the Hotels or Transport tab for a destination/date range.
2. **Cache Check** — Integration Layer checks Redis for a fresh cached response; if stale/missing, it calls the relevant third-party API.
3. **Normalize & Return** — Raw provider responses are normalized into Wanderly's internal schema and cached, then returned to the client.
4. **Compare & Add to Trip** — User compares options and adds a selection to their itinerary; clicking "Book" deep-links to the partner site/app (affiliate model) in the MVP.

### 3.6 Reviews & Ratings Workflow

1. **Eligibility Check** — System checks whether the user has interacted with the item (e.g., saved/visited) to encourage authentic reviews (soft gate, not a hard requirement in MVP).
2. **Submission** — User submits a star rating, comment, and optional photos; content passes basic profanity/spam filtering before being stored.
3. **Aggregation** — A scheduled job recalculates the average rating and review count for the item, cached for fast display.

### 3.7 Favorites (Wishlist) Workflow

1. **Save Action** — User taps a heart/save icon on a destination, attraction, or hotel; an optimistic UI update fires immediately with a micro-animation.
2. **Persistence** — A row is written to `favorites`; if the API call fails, the UI rolls back the optimistic state and shows a toast.
3. **Retrieval** — The Favorites dashboard queries all saved items grouped by type, enabling quick conversion into a new trip.

---

## 4. Security Architecture

Security is applied in layers — network, application, data, and operational — following the principle of defense in depth and OWASP best practices.

### 4.1 Authentication & Authorization

- Password-based auth uses bcrypt/argon2 hashing (never plaintext or reversible encryption).
- Social login via OAuth 2.0 / OpenID Connect (Google), validated server-side before session issuance.
- Stateless authentication using short-lived JWT access tokens (~15 min) plus longer-lived, rotating refresh tokens stored as HttpOnly, Secure, SameSite=Strict cookies.
- Role-based access control (RBAC): roles include Traveler (default), Content Moderator, and Admin, enforced via middleware on every protected route.
- Refresh token rotation with reuse detection — a reused/stolen refresh token immediately revokes the entire token family.

### 4.2 Data Protection

- Encryption in transit: TLS 1.2+ enforced everywhere (ALB, CloudFront, RDS connections) via HSTS.
- Encryption at rest: RDS storage encryption (AES-256) and S3 server-side encryption (SSE-S3/KMS) for all stored objects.
- PII minimization: only essential personal data is stored; sensitive fields (if any, e.g. payment tokens in later phases) are tokenized via a PCI-compliant processor, never stored directly.
- Backups: automated encrypted RDS snapshots with point-in-time recovery; retention policy aligned with data governance requirements.

### 4.3 Application (API) Security

| Control | Implementation |
|---|---|
| Input validation | Schema validation (e.g., Zod/Joi) on every request body/query/params before it reaches business logic. |
| Injection prevention | Parameterized queries via ORM (Prisma/Sequelize); no raw string-concatenated SQL. |
| XSS protection | React's default output escaping + Content-Security-Policy headers; sanitize any rendered user HTML (reviews). |
| CSRF protection | SameSite cookies + CSRF tokens for state-changing form submissions. |
| Rate limiting | Per-IP and per-user rate limiting (e.g., express-rate-limit / API Gateway throttling) on auth and search endpoints. |
| CORS policy | Strict allow-list of trusted frontend origins only. |
| Security headers | Helmet.js middleware: CSP, X-Frame-Options, X-Content-Type-Options, Referrer-Policy. |
| Dependency hygiene | Automated vulnerability scanning (npm audit / Snyk / Dependabot) in CI pipeline. |

### 4.4 Infrastructure & Network Security

- VPC segmentation: application servers in private subnets; only the Load Balancer sits in the public subnet.
- Security Groups restrict traffic to least-privilege (e.g., DB accepts connections only from app-tier security group on port 5432).
- AWS WAF rules block common attack patterns (SQLi, XSS signatures) and enable geo/IP-based rate rules.
- AWS Shield Standard for baseline DDoS protection; Shield Advanced considered at higher scale.
- Secrets (DB credentials, third-party API keys) stored exclusively in AWS Secrets Manager, injected at runtime — never committed to source control.

### 4.5 Third-Party API Key Management

- Each external API key is scoped, rotated periodically, and restricted (e.g., Google Maps key restricted by HTTP referrer/IP and API scope).
- All third-party calls are routed through the backend Integration Layer — API keys are never exposed to the client/browser.
- Per-provider usage quotas and budget alarms prevent runaway costs from abuse or bugs.

### 4.6 Compliance & Privacy

- Privacy-by-design: clear consent capture for data collection; a user-facing privacy policy and cookie consent banner.
- Data subject rights supported: account data export and account/data deletion on request (GDPR-aligned, even for non-EU launch markets).
- Review content moderation pipeline to remove abusive, fraudulent, or policy-violating content.

### 4.7 Monitoring, Logging & Incident Response

- Centralized logging via CloudWatch Logs with structured JSON logs (no sensitive data logged).
- Real-time alarms for anomalous traffic, elevated error rates, and failed-login spikes (possible credential-stuffing).
- AWS X-Ray distributed tracing to diagnose latency and failures across service calls.
- Documented incident response runbook: detection, containment, eradication, recovery, and post-incident review.

---

## 5. Technology Stack

### 5.1 Frontend

| Layer | Technology |
|---|---|
| Framework | React.js 18+ (Vite build tooling) |
| Routing | React Router |
| Styling / Design | Tailwind CSS + a custom design-token theme |
| State management | TanStack Query (server state) + Zustand/Redux Toolkit (UI state) |
| Animation & Effects | Framer Motion, GSAP + ScrollTrigger, Lottie, AOS |
| Maps rendering | Google Maps JavaScript SDK / react-google-maps |
| Forms & validation | React Hook Form + Zod |
| Testing | Jest + React Testing Library, Playwright (E2E) |

### 5.2 Backend

| Layer | Technology |
|---|---|
| Runtime & Framework | Node.js (LTS) + Express.js |
| Language | TypeScript (recommended) for type safety across API contracts |
| ORM / Query layer | Prisma (or Sequelize) for PostgreSQL |
| Authentication | JWT (jsonwebtoken) + Passport.js (OAuth strategies) + bcrypt/argon2 |
| Validation | Zod / Joi schema validation middleware |
| Background jobs / Queue | BullMQ on Redis |
| API documentation | OpenAPI (Swagger) via swagger-jsdoc |
| Testing | Jest + Supertest for API integration tests |

### 5.3 Database & Caching

| Layer | Technology |
|---|---|
| Primary database | PostgreSQL 15+ (Amazon RDS, Multi-AZ) |
| Caching / sessions / queues | Redis (Amazon ElastiCache) |
| Search (optional, Phase 2) | PostgreSQL full-text search initially; Elasticsearch/OpenSearch if scale demands richer relevance ranking |
| File / media storage | Amazon S3 |

### 5.4 Third-Party APIs

| Purpose | Provider |
|---|---|
| Maps, places, geocoding, directions | Google Maps Platform |
| Weather & forecasts | OpenWeatherMap |
| Flights | Amadeus for Developers |
| Hotels | Booking.com / RapidAPI Hotels |
| Ground transport (optional) | Rome2Rio |
| Transactional email | SendGrid / Amazon SES |

### 5.5 DevOps & Infrastructure

| Layer | Technology |
|---|---|
| Cloud provider | Amazon Web Services (AWS) |
| Compute | ECS Fargate (containers), Application Load Balancer |
| CI/CD | GitHub Actions → Amazon ECR → ECS |
| Infrastructure as Code | Terraform |
| Monitoring & Tracing | Amazon CloudWatch, AWS X-Ray |
| Security | AWS WAF, AWS Shield, AWS Secrets Manager, IAM least-privilege roles |
| CDN & DNS | Amazon CloudFront, Route 53 |

### 5.6 Motion, Animation & Visual Effects

To achieve the modern, adventurous, and premium feel requested, motion is treated as a first-class design element rather than decoration:

- **Framer Motion** — page transitions, card hover/lift effects, staggered list reveals, animated modals and drawers.
- **GSAP + ScrollTrigger** — parallax hero imagery on destination pages, scroll-driven storytelling sections (e.g., "A Day in Bali").
- **Lottie** — lightweight vector animations for loading states, empty states ("no favorites yet"), and success confirmations.
- **AOS (Animate on Scroll)** — fade/slide-in reveals for content blocks on long destination and landing pages.
- Skeleton loaders and shimmer effects during data fetch to keep perceived performance high.
- Subtle micro-interactions: animated heart/save icon, animated budget slider, confetti burst on itinerary completion.
- Design tone: full-bleed high-quality destination photography, warm sunset-inspired accent color, generous whitespace, rounded premium card components, and a consistent 200-300ms easing curve across all transitions for a cohesive, polished feel.

---

*End of Document — Wanderly Travel & Tourism Management System v1.0*
