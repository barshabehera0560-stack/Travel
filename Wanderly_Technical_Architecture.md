# Wanderly — Technical Architecture
### Travel & Tourism Management System

Version 1.0

---

## 2.1 Architecture Style

Wanderly is built as a modular, service-oriented monolith at launch — a single Node.js backend organized into clearly bounded domain modules (Users, Destinations, Itineraries, Reviews, Bookings-Integration, Notifications) — designed so that any module can be extracted into an independent microservice as scale demands, without a rewrite. This balances development speed for an MVP with a clean path to horizontal scaling.

### 2.1.1 High-Level System Diagram

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

## 2.2 Frontend Architecture (React.js)

- Single Page Application built with React 18+ and React Router for client-side navigation.
- State management: React Query (TanStack Query) for server-state/caching, Zustand/Redux Toolkit for global UI state.
- Component library: design-system based component structure (atoms/molecules/organisms) with Tailwind CSS for styling.
- Animation layer: Framer Motion for page/component transitions, GSAP for scroll-based storytelling on destination pages, Lottie for lightweight vector animations (loading states, empty states).
- Code-splitting and lazy loading per route to keep initial bundle small; image lazy-loading and responsive `srcset` for hero imagery.
- PWA-ready (service worker + manifest) to support installability and basic offline caching of viewed trips.

## 2.3 Backend Architecture (Node.js)

- Runtime: Node.js (LTS) with Express.js as the HTTP framework, structured using a layered pattern: Routes → Controllers → Services → Data Access (Repositories).
- ORM: Prisma (or Sequelize) for type-safe PostgreSQL access and migrations.
- API style: RESTful JSON APIs, versioned (`/api/v1/...`), with OpenAPI/Swagger documentation.
- Background jobs: BullMQ (Redis-backed queue) for async tasks — sending emails, refreshing cached weather/hotel data, generating itinerary PDFs.
- Integration Layer: a dedicated module wrapping each third-party API (Maps, Weather, Flights, Hotels) with retry logic, circuit breaker, and response caching to isolate the core app from third-party instability.

## 2.4 Database Design (PostgreSQL)

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

## 2.5 Third-Party API Integrations

| Capability | Provider (Recommended) | Purpose |
|---|---|---|
| Maps & Places | Google Maps Platform (Places, Directions, Geocoding APIs) | Attraction locations, distance/duration, map rendering. |
| Weather | OpenWeatherMap (Current + One Call/Forecast API) | Live weather and multi-day forecasts per destination. |
| Flights | Amadeus for Developers (Flight Offers Search) | Flight options, indicative pricing between origin/destination. |
| Hotels | Booking.com / RapidAPI Hotels API | Hotel search, pricing, availability, ratings. |
| Ground Transport (optional) | Rome2Rio API or regional transit APIs | Intercity train/bus options and estimated fares. |

## 2.6 Caching & Performance Layer

- Amazon ElastiCache (Redis) caches: weather responses (TTL ~1 hour), hotel search results (TTL ~15-30 min), popular destination pages, and session/JWT blacklist data.
- CDN (CloudFront) serves static assets and destination imagery close to users globally.
- Database read replica offloads heavy read traffic (destination browsing, search) from the primary write instance.

## 2.7 Deployment Architecture (AWS)

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
*Wanderly — Technical Architecture v1.0*
