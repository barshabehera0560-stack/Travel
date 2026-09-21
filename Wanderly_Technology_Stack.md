# Wanderly — Technology Stack
### Travel & Tourism Management System

Version 1.0

---

## 5.1 Frontend

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

## 5.2 Backend

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

## 5.3 Database & Caching

| Layer | Technology |
|---|---|
| Primary database | PostgreSQL 15+ (Amazon RDS, Multi-AZ) |
| Caching / sessions / queues | Redis (Amazon ElastiCache) |
| Search (optional, Phase 2) | PostgreSQL full-text search initially; Elasticsearch/OpenSearch if scale demands richer relevance ranking |
| File / media storage | Amazon S3 |

## 5.4 Third-Party APIs

| Purpose | Provider |
|---|---|
| Maps, places, geocoding, directions | Google Maps Platform |
| Weather & forecasts | OpenWeatherMap |
| Flights | Amadeus for Developers |
| Hotels | Booking.com / RapidAPI Hotels |
| Ground transport (optional) | Rome2Rio |
| Transactional email | SendGrid / Amazon SES |

## 5.5 DevOps & Infrastructure

| Layer | Technology |
|---|---|
| Cloud provider | Amazon Web Services (AWS) |
| Compute | ECS Fargate (containers), Application Load Balancer |
| CI/CD | GitHub Actions → Amazon ECR → ECS |
| Infrastructure as Code | Terraform |
| Monitoring & Tracing | Amazon CloudWatch, AWS X-Ray |
| Security | AWS WAF, AWS Shield, AWS Secrets Manager, IAM least-privilege roles |
| CDN & DNS | Amazon CloudFront, Route 53 |

## 5.6 Motion, Animation & Visual Effects

To achieve the modern, adventurous, and premium feel requested, motion is treated as a first-class design element rather than decoration:

- **Framer Motion** — page transitions, card hover/lift effects, staggered list reveals, animated modals and drawers.
- **GSAP + ScrollTrigger** — parallax hero imagery on destination pages, scroll-driven storytelling sections (e.g., "A Day in Bali").
- **Lottie** — lightweight vector animations for loading states, empty states ("no favorites yet"), and success confirmations.
- **AOS (Animate on Scroll)** — fade/slide-in reveals for content blocks on long destination and landing pages.
- Skeleton loaders and shimmer effects during data fetch to keep perceived performance high.
- Subtle micro-interactions: animated heart/save icon, animated budget slider, confetti burst on itinerary completion.
- Design tone: full-bleed high-quality destination photography, warm sunset-inspired accent color, generous whitespace, rounded premium card components, and a consistent 200-300ms easing curve across all transitions for a cohesive, polished feel.

---
*Wanderly — Technology Stack v1.0*
