# Wanderly — Security Architecture
### Travel & Tourism Management System

Version 1.0

Security is applied in layers — network, application, data, and operational — following the principle of defense in depth and OWASP best practices.

---

## 4.1 Authentication & Authorization

- Password-based auth uses bcrypt/argon2 hashing (never plaintext or reversible encryption).
- Social login via OAuth 2.0 / OpenID Connect (Google), validated server-side before session issuance.
- Stateless authentication using short-lived JWT access tokens (~15 min) plus longer-lived, rotating refresh tokens stored as HttpOnly, Secure, SameSite=Strict cookies.
- Role-based access control (RBAC): roles include Traveler (default), Content Moderator, and Admin, enforced via middleware on every protected route.
- Refresh token rotation with reuse detection — a reused/stolen refresh token immediately revokes the entire token family.

## 4.2 Data Protection

- Encryption in transit: TLS 1.2+ enforced everywhere (ALB, CloudFront, RDS connections) via HSTS.
- Encryption at rest: RDS storage encryption (AES-256) and S3 server-side encryption (SSE-S3/KMS) for all stored objects.
- PII minimization: only essential personal data is stored; sensitive fields (if any, e.g. payment tokens in later phases) are tokenized via a PCI-compliant processor, never stored directly.
- Backups: automated encrypted RDS snapshots with point-in-time recovery; retention policy aligned with data governance requirements.

## 4.3 Application (API) Security

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

## 4.4 Infrastructure & Network Security

- VPC segmentation: application servers in private subnets; only the Load Balancer sits in the public subnet.
- Security Groups restrict traffic to least-privilege (e.g., DB accepts connections only from app-tier security group on port 5432).
- AWS WAF rules block common attack patterns (SQLi, XSS signatures) and enable geo/IP-based rate rules.
- AWS Shield Standard for baseline DDoS protection; Shield Advanced considered at higher scale.
- Secrets (DB credentials, third-party API keys) stored exclusively in AWS Secrets Manager, injected at runtime — never committed to source control.

## 4.5 Third-Party API Key Management

- Each external API key is scoped, rotated periodically, and restricted (e.g., Google Maps key restricted by HTTP referrer/IP and API scope).
- All third-party calls are routed through the backend Integration Layer — API keys are never exposed to the client/browser.
- Per-provider usage quotas and budget alarms prevent runaway costs from abuse or bugs.

## 4.6 Compliance & Privacy

- Privacy-by-design: clear consent capture for data collection; a user-facing privacy policy and cookie consent banner.
- Data subject rights supported: account data export and account/data deletion on request (GDPR-aligned, even for non-EU launch markets).
- Review content moderation pipeline to remove abusive, fraudulent, or policy-violating content.

## 4.7 Monitoring, Logging & Incident Response

- Centralized logging via CloudWatch Logs with structured JSON logs (no sensitive data logged).
- Real-time alarms for anomalous traffic, elevated error rates, and failed-login spikes (possible credential-stuffing).
- AWS X-Ray distributed tracing to diagnose latency and failures across service calls.
- Documented incident response runbook: detection, containment, eradication, recovery, and post-incident review.

---
*Wanderly — Security Architecture v1.0*
