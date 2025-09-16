# 16. Stan Store Windsurf - Creator Platform Developer Onboarding

## 1. Overview

Welcome to the Stan Store Windsurf engineering team! This guide provides a comprehensive checklist to get you set up and ready to contribute to our Ethiopian creator platform. As part of our mission to empower Ethiopian creators with no-code store building and zero-fee monetization, you'll be working on a platform that serves creators building stores for ebooks, courses, templates, digital consultations, and more in Ethiopian Birr.

## 2. Initial Steps

- [ ] **Access Granted**: Ensure you have access to GitHub, AWS Africa (Cape Town), Jira, and Slack.
- [ ] **Review Key Documents**:
  - [ ] Familiarize yourself with the creator platform architecture in
        [08-Architecture.md](../Stage%201%20-%20Foundation/08-Architecture.md).
  - [ ] Understand Ethiopian creator goals in the [PRD](../Stage%201%20-%20Foundation/04-PRD.md).
  - [ ] Review creator platform tasks in [tasks.yaml](../../tasks/tasks.yaml).
  - [ ] Study creator business model: zero transaction fees, ETB processing
  - [ ] Review Ethiopian payment integrations: WeBirr, TeleBirr, CBE Birr

## 3. Creator Platform Local Environment Setup

- [ ] **Clone Repositories**:
  - [ ] Clone the Backend Monorepo (`git clone https://github.com/stanstorew/backend`)
  - [ ] Clone the Frontend Monorepo (`git clone https://github.com/stanstorew/web`)
- [ ] **Install Core Dependencies**:
  - [ ] Install Node.js (v18+ LTS), Docker Desktop, PNPM, and Nx CLI
  - [ ] Install PostgreSQL (for local database development)
  - [ ] Install Redis (for caching and sessions)
- [ ] **Configure Environment**:
  - [ ] Set up PostgreSQL with Row-Level Security (RLS) for multi-tenant support
  - [ ] Configure Redis for creator session management
  - [ ] Set up Ethiopian payment sandbox accounts (WeBirr test environment)
  - [ ] Configure AWS Cape Town region credentials for Ethiopian deployments
- [ ] **Run Creator Platform Services**:
  - [ ] Launch creator authentication service
  - [ ] Launch store builder microservice
  - [ ] Launch Ethiopian payment integration service
  - [ ] Launch creator analytics and reporting service
- [ ] **Verify Creator Platform Setup**:
  - [ ] Test creator registration flow (Email/Phone OTP)
  - [ ] Verify ETB pricing and currency display
  - [ ] Test WeBirr payment integration
  - [ ] Confirm creator data isolation and tenant security

## 4. Your First Contribution

- [ ] Find a "good first issue" in Jira.
- [ ] Create a feature branch.
- [ ] Submit a Pull Request (PR) and go through the code review process.

## 5. Key Contacts

_This section will be populated with key contacts for different domains (e.g., Architecture,
Security, specific microservices)._

## 6. First Service Creation

To ensure consistency and accelerate development, all new microservices must be bootstrapped from
our standard service template. This template includes the foundational setup for:

- **Directory Structure**: A standardized layout for source code, tests, and documentation.
- **Dockerfile**: A pre-configured Dockerfile for containerization.
- **CI/CD Pipeline Configuration**: A baseline `.gitlab-ci.yml` or GitHub Actions workflow file.
- **Observability Hooks**: Pre-configured libraries and endpoints for logging, metrics (Prometheus),
  and tracing (OpenTelemetry).
- **Health Check Endpoint**: A default `/health` endpoint as required by Kubernetes.

**To create a new service:**

1.  Use the `cookiecutter` command to generate a new service from the central template repository.
2.  Follow the prompts to name the service and define its initial ownership.
3.  Push the newly generated code to a new repository within the monorepo structure.

## 7. Code Contribution

- **Branching Strategy**: Follow a trunk-based development model. Create short-lived feature
  branches from `main`.
- **Pull Requests (PRs)**: All code must be submitted via PRs. PRs require at least one approval
  from a service owner or tech lead.
