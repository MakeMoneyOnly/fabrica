# Fabrica - Enterprise Blueprint & Task List (v4)

This document is the definitive master plan for the Fabrica project. It is a comprehensive and granular blueprint outlining all tasks from inception to long-term, enterprise-grade operation, ensuring every feature and requirement from all project documentation is accounted for.

---

## Phase 0: Project Initialization & Foundation (Pre-Development)

_This phase focuses on setting up a professional-grade development ecosystem, accounts, and project structure before writing application code. Estimated Timeline: 2-3 Days._

### 0.1. Project Management & Documentation

- [x] Initialize project management board (Linear/GitHub Projects) with these tasks, organized by Epics and Phases. [Requires GitHub repository setup]
- [ ] Set up a shared documentation space (Notion) for internal architecture documents, runbooks, and meeting notes. [Requires Notion account setup]
- [x] Create GitHub Issue and Pull Request templates to enforce quality and consistency.
- [x] Create and maintain this `Tasks.md` file as the project bible.

### 0.2. Version Control & Repository

- [x] Initialize Git repository on GitHub under the Fabrica organization.
- [x] Configure `main` (production) and `staging` branches with protection rules (require PR approval, passing CI checks). [Requires GitHub repository setup]
- [x] Configure `.gitignore`, Prettier, ESLint, and TypeScript for strict code quality.
- [x] Configure pre-commit hooks (Husky, lint-staged) to automate formatting, linting, and type-checking.

### 0.3. Account & Service Setup

- [x] **Vercel**: Set up a new project linked to the GitHub repo. Configure Production, Staging, and Preview environments.
- [x] **Supabase**: Create `fabrica-prod` and `fabrica-staging` projects. Enable daily backups and Point-in-Time Recovery (PITR) for production.
- [ ] **Clerk**: Set up `fabrica-prod` and `fabrica-dev` applications. Customize theme and configure authentication methods (email, phone).
- [ ] **Telebirr**: Apply for and secure a merchant account. Obtain and securely store sandbox and production API credentials.
- [ ] **Resend**: Sign up and obtain API key. Configure with `fabrica.et` domain and necessary DNS records (DKIM, SPF).
- [ ] **Cloudflare**: Set up `fabrica.et` domain, configure DNS to point to Vercel, and enable security features (WAF, DDoS, Bot Fight Mode).
- [ ] **Sentry**: Set up a project for error monitoring and configure source maps.
- [ ] **PostHog**: Set up a project for product analytics.
- [ ] **UptimeRobot**: Configure uptime and health check monitoring.
- [ ] **GitHub Security**: Enable Dependabot for automated dependency updates and Snyk for vulnerability scanning.

### 0.4. Local & CI/CD Environment

- [x] Set up local Supabase environment using Docker (`supabase init`, `supabase start`).
- [x] Create `.env.example` file and document all environment variables. Populate `.env.local` with development credentials.
- [x] Write a `CONTRIBUTING.md` guide for local setup, development workflow, and coding standards.
- [x] **Storybook**: Install and configure Storybook for isolated UI component development and visual testing.
- [x] **CI/CD Pipeline**: Set up initial GitHub Actions workflow for linting, testing, and building on every push.

### 0.5. Project Scaffolding

- [x] Initialize Next.js 14 project (`npx create-next-app`).
- [x] Implement the directory structure from `2. System Architecture.md`.
- [x] Install and configure all core dependencies as per `3. Tech Stack.md`.
- [x] Generate initial TypeScript types from the database schema (`npx supabase gen types`).

---

## Phase 1: MVP Development (Core Functionality)

_The main development phase to build all "Must-Have" features for the MVP launch, with a focus on quality, security, and testability. Estimated Timeline: 6-7 Weeks._

### 1.1. Backend & Database

- [ ] Implement the full database schema as code in a Supabase migration file.
- [ ] Implement robust RLS policies for all tables, with unit tests to verify permissions.
- [ ] Create PostgreSQL Functions (RPC) for complex atomic operations (e.g., `process_payment`, `create_user_with_referral`).
- [ ] Set up Supabase Storage buckets with strict security policies.
- [ ] Create server, client, and admin Supabase helper functions (`/lib/supabase/*`).
- [ ] Implement a `db:seed` script to populate the development database with realistic sample data.

### 1.2. User Authentication & Onboarding

- [ ] Integrate Clerk components for sign-up/in and user profile, styled to match the Fabrica brand.
- [ ] Implement `middleware.ts` for route protection based on user role and auth state.
- [ ] Create a resilient Clerk webhook handler (`/api/webhooks/clerk`) with retry logic to sync user data to Supabase.
- [ ] Build the multi-step onboarding wizard UI using a state machine (Zustand).
- [ ] Step 1: Implement username selection with a real-time availability check API.
- [ ] Step 2: Build the profile setup form with secure avatar upload.
- [ ] Step 3: Create the "Connect Telebirr" form with encryption for sensitive account info.
- [ ] Step 4: Implement a guided "Create First Product" flow.
- [ ] Step 5: Build the "Preview & Launch" step.
- [ ] Configure and design all transactional email templates in Resend (Welcome, New Order, etc.).

### 1.3. Public Storefront & Pages

- [ ] Build the dynamic storefront page `app/(public)/[username]/page.tsx` with ISR for performance.
- [ ] Create the Creator Profile, Product Card, and Product List components, developed in Storybook.
- [ ] Ensure all public-facing pages are fully responsive and achieve Lighthouse scores >90.
- [ ] Implement PWA capabilities (manifest, service worker) for offline access.
- [ ] Implement structured data (JSON-LD) for creator and product pages for SEO.
- [ ] Build static marketing pages (Pricing, Features, About) and legal pages (Terms, Privacy).
- [ ] Implement drag-and-drop interface for store building.
- [ ] Add real-time preview of store changes.
- [ ] Implement social media integration for TikTok, Instagram, Facebook, Twitter.

### 1.4. Product Management

- [ ] **Digital Products**: Build the "Create/Edit Digital Product" form with `react-hook-form`, Zod, and a file upload component with progress indicators.
- [ ] **1-on-1 Bookings**: Implement Google Calendar OAuth flow and build the "Create/Edit Booking" form with an availability editor.
- [ ] **External Links**: Build the simple form for adding/editing external links.
- [ ] **Product APIs**: Create fully tested API endpoints (`POST`, `PATCH`, `DELETE /api/products`) for all product types.
- [ ] **Product Dashboard**: Build the "Products" tab UI with grid/list views, filters, search, and "Duplicate Product" functionality.
- [ ] Implement comprehensive logging for all product management actions.
- [ ] Implement unlimited products feature (Creator Pro).

### 1.5. Guest Checkout & Payments

- [ ] Build the guest checkout UI with Zod validation.
- [ ] Implement a provider-agnostic payment SDK structure in `/lib/payments` with Telebirr as the first provider.
- [ ] Create the "Initiate Payment" API with validation and detailed logging.
- [ ] Create the Telebirr webhook handler with **critical** signature verification and idempotency checks.
- [ ] Implement atomic database updates within the webhook using an RPC function.
- [ ] Build the order confirmation page and the secure file download handler with token validation and download limits.
- [ ] Implement the creator-initiated refund system via an API that calls the Telebirr refund API.
- [ ] Implement one-click checkout functionality.
- [ ] Add payment plans option for higher-priced products.

### 1.6. Creator Dashboard

- [ ] **Overview Tab**: Build UI for key metrics from cached analytics endpoints.
- [ ] **Orders/Income Tab**: Implement a paginated, searchable, and filterable table of orders with an export-to-CSV feature.
- [ ] **Analytics Tab**: Implement charts and APIs for traffic, sales, and customer data.
- [ ] **Calendar Tab**: Implement a calendar view of upcoming bookings.
- [ ] **Settings Tab**: Create forms for profile, storefront customization, payment details, notifications, and plan management.
- [ ] **Referral System**: Build the Referrals dashboard UI and create a Supabase Edge Function (cron job) for monthly payout calculations.
- [ ] Add customer database management.
- [ ] Implement customer communication/messaging system.
- [ ] Add revenue projections feature.

### 1.7. Admin Panel (MVP)

- [ ] Build a secure, role-based admin dashboard layout.
- [ ] **Creator Management**: Implement UI to view, search, suspend, and impersonate creators for support.
- [ ] **Content Moderation**: Build a basic queue to review manually flagged content.
- [ ] **Payout Management**: Create the UI to review, approve, and reject monthly referral payouts.
- [ ] **Financial Reporting**: Build a basic dashboard for MRR, GMV, and platform revenue.
- [ ] **Platform Analytics**: Build a basic dashboard for user growth and engagement metrics.
- [ ] **Audit Log**: Implement a table to log all critical admin actions.

### 1.8. Testing

- [ ] **Unit Tests**: Achieve >80% test coverage for all critical business logic in `/lib`.
- [ ] **Integration Tests**: Write tests for all API routes and webhook handlers, mocking external services.
- [ ] **E2E Tests**: Use Playwright to create tests for all critical user flows, including happy paths and failure cases.

---

## Phase 2: Pre-Launch & Deployment

_This phase covers final testing, infrastructure setup, and the official launch of the MVP. Estimated Timeline: 1 Week._

### 2.1. Final Testing & QA

- [ ] Conduct full E2E testing on the staging environment.
- [ ] Perform cross-browser and device testing, focusing on mid-range Android devices on 3G networks.
- [ ] Conduct and document results of a full pre-launch security audit (DAST, SAST, manual penetration testing).
- [ ] Conduct load testing (k6) to ensure the system can handle target concurrent users.
- [ ] Create and document incident response runbooks for common failure scenarios.
- [ ] Final legal review of all public-facing policies by legal counsel.

### 2.2. Production Infrastructure & Deployment

- [ ] Configure all production environment variables and secrets in Vercel, Supabase, and Clerk.
- [ ] Finalize and lock down Cloudflare configuration (WAF, rate limiting rules).
- [ ] Run final database migrations on the production Supabase project.
- [ ] Set up production monitoring dashboards and alerting rules in Sentry and UptimeRobot.
- [ ] Finalize the CI/CD pipeline in GitHub Actions, including required approvals for production deploys.
- [ ] Merge `staging` into `main` to trigger production deployment.
- [ ] Perform post-deployment smoke tests and monitor systems closely.

### 2.3. Launch

- [ ] Execute the Go-to-Market plan from `PRD.md`.
- [ ] Onboard the 20 hand-picked beta creators and provide white-glove support.

---

## Phase 3: Post-Launch & Core Improvements (Months 1-3)

_This phase is about stabilizing the platform and implementing the "Phase 2 Features" from the PRD based on user feedback._

- [ ] **Monitoring & Bug Fixing**: Establish an on-call rotation. Triage and fix bugs based on severity.
- [ ] **Performance Optimization**: Analyze PostHog and Vercel Analytics to identify and resolve performance bottlenecks.
- [ ] **Feature: Chapa Payment Integration**: Implement Chapa as a switchable backup payment provider.
- [ ] **Feature: Discount Codes (Creator Pro)**:
  - [ ] Roll out the feature behind a feature flag (PostHog or Vercel Edge Config).
  - [ ] Add `discount_codes` table to DB, build creator UI, and update checkout logic.
- [ ] **Feature: Advanced Analytics (Creator Pro)**:
  - [ ] Implement settings for creators to add Facebook Pixel and GA4 IDs.
  - [ ] Build A/B testing capabilities for product details.
- [ ] **Feature: Referral Dashboard Enhancements**: Add performance insights and marketing assets for referrers.
- [ ] **Feature: Multiple Storefront Themes & Customization**:
  - [ ] Design and build 5+ new storefront themes.
  - [ ] Implement a theme previewer and selector.
  - [ ] Add Custom CSS option for Creator Pro users.
- [ ] **Feature: Custom Branding**: Add option for Pro creators to remove the Fabrica badge.
- [ ] **Feature: Custom Domains**: Implement custom domain support for Creator Pro users.
- [ ] **Feature: SEO Optimization Tools**: Add meta tags, sitemaps, and search optimization tools.
- [ ] **Feature: Social Proof Tools**: Implement testimonials, reviews, and social sharing features.
- [ ] **Feature: Lead Magnification**: Add lead capture forms and popups.

---

## Phase 4: Major Feature Expansion (Months 4-6)

_This phase focuses on building major new platform capabilities, mapping to "Phase 3 Features" in the PRD._

- [ ] **Feature: Course Builder**:
  - [ ] Design a scalable schema for courses, modules, lessons, and student progress.
  - [ ] Build a creator-facing UI with a drag-and-drop interface for course organization.
  - [ ] Support video, rich text, and downloadable content blocks.
  - [ ] Implement a performant, mobile-first course consumption UI for students.
  - [ ] Add "drip content" and lesson-locking functionality.
  - [ ] Implement auto-generating certificates of completion.
  - [ ] Create course landing pages with descriptions.
  - [ ] Implement student management and progress tracking.
  - [ ] Add content update capabilities.
  - [ ] Implement pricing options (one-time, subscription, payment plans).
  - [ ] Add reviews system for courses.
  - [ ] Implement course bundles feature.
- [ ] **Feature: Memberships/Subscriptions**:
  - [ ] Design a robust schema for recurring billing, tiers, and gated content.
  - [ ] Build the creator UI for managing membership plans.
  - [ ] Integrate with a subscription billing provider or build a custom engine.
  - [ ] Implement logic to gate content based on active subscriptions.
- [ ] **Feature: Email Marketing Tools**:
  - [ ] Build UI for creating lead magnets and embeddable signup forms.
  - [ ] Create an email broadcast tool with a drag-and-drop editor.
  - [ ] Develop automated email flows (welcome series, abandoned cart) using a background job queue.
  - [ ] Add upsell features (order bumps and product recommendations).
  - [ ] Implement sales funnels for automated sales sequences (Creator Pro).
- [ ] **Feature: Affiliate Share (Creator Pro)**:
  - [ ] Design the schema and UI for the creator-managed affiliate program.
  - [ ] Create a separate, simple dashboard for affiliates to track their performance.
- [ ] **Feature: Creator Networking**: Implement creator networking capabilities.
- [ ] **Feature: Educational Resources**: Add tutorials, webinars, and best practices section.
- [ ] **Feature: Success Stories**: Create showcase for successful creators and their stores.

---

## Phase 5: Scaling & Growth (Months 7-12)

_This phase focuses on scaling the platform technically and expanding its feature set for growth and new verticals._

- [ ] **Technical Scaling**:
  - [ ] Implement a Redis caching layer (Upstash) for read-heavy operations.
  - [ ] Set up a background job queue (BullMQ) for resource-intensive tasks.
  - [ ] Add and configure read replicas for the Supabase database.
- [ ] **Feature: Physical Products**:
  - [ ] Extend product schema for inventory, shipping, and variants.
  - [ ] Integrate with a local Ethiopian shipping provider's API.
  - [ ] Update the checkout flow to collect shipping addresses.
- [ ] **Feature: Community Platform**: Build an integrated forum or group chat feature for creators and their members.
- [ ] **Feature: API & Integrations**:
  - [ ] Design and develop a versioned, public-facing REST API with OpenAPI/Swagger documentation.
  - [ ] Build a Zapier integration to enable broader ecosystem connectivity.
- [ ] **Expansion Planning**:
  - [ ] Begin technical and legal discovery for expansion into Kenya and Uganda.
  - [ ] Start the internationalization (i18n) of the codebase.
- [ ] **Feature: Tax Reporting**: Add automatic tax calculation and reporting tools.
- [ ] **Feature: Expense Tracking**: Implement business expense and cost tracking.
- [ ] **Feature: Multi-language Storefronts**: Implement Amharic and English storefronts.

---

## Phase 6: Long-Term Enterprise Readiness (Year 2+)

_This phase focuses on long-term platform health, architectural evolution, and building a competitive moat with advanced features and global reach._

- [ ] **Architectural Evolution**: Plan and execute a gradual migration to a microservices architecture, starting with extracting the `payments` service.
- [ ] **Mobile App Development**: Develop and launch the Fabrica mobile app for iOS and Android using React Native (Expo) within a monorepo.
- [ ] **Advanced AI Features**:
  - [ ] Implement an AI-powered product description generator.
  - [ ] Build an AI-driven pricing suggestion tool.
  - [ ] Create an AI chatbot for first-line customer support.
- [ ] **Internationalization & Localization**:
  - [ ] Launch the platform in Amharic and other local languages.
  - [ ] Integrate international payment gateways like Stripe to serve the Ethiopian diaspora.
- [ ] **Security & Compliance**:
  - [ ] Conduct annual third-party penetration tests and security audits.
  - [ ] Establish a formal GDPR/data compliance program.
  - [ ] Implement a bug bounty program (via HackerOne or Bugcrowd).
- [ ] **Ongoing Maintenance**:
  - [ ] Establish a regular schedule for dependency updates and technical debt repayment sprints.
  - [ ] Conduct quarterly disaster recovery drills to test runbooks.
  - [ ] Continuously monitor and optimize infrastructure costs.
