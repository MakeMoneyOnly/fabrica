# Contributing to Fabrica

Welcome to Fabrica! We're excited to have you contribute to our enterprise-grade creator economy platform for Ethiopia. This guide will help you get started with local development and our coding standards.

## 🚀 Quick Start

### Prerequisites

- **Node.js**: LTS version (18.17+)
- **npm**: Latest version
- **Git**: Latest version
- **VS Code**: With recommended extensions

### Local Setup

1. **Clone the repository**

   ```bash
   git clone https://github.com/fabrica/fabrica.git
   cd fabrica
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   ```bash
   cp .env.example .env.local
   ```

   Fill in the required environment variables (see `.env.example`)

4. **Set up Supabase locally**

   ```bash
   npx supabase init
   npx supabase start
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

## 📋 Development Workflow

### 1. Choose a Task

- Check [Tasks.md](Tasks.md) for available tasks
- Pick a task from the current phase
- Create a branch for your task: `git checkout -b feature/your-feature-name`

### 2. Code Standards

#### TypeScript

- Use `strict: true` mode
- No implicit `any` types
- Prefer `readonly` where possible
- Exhaustive switch/case statements

#### Money & Currency

- **Never use float/double for currency**
- Use `Decimal` or `BigInt` for money calculations
- Store money in minor units (cents)
- Round using **banker's rounding** only where policy dictates

#### Date/Time

- Store all times in **UTC** in database
- Convert to **Africa/Addis_Ababa** timezone for user display
- Handle **Ethiopian calendar** for user-visible dates

#### Security

- Validate all inputs with schemas (Zod/DTOs)
- **No secrets in code** - fetch from environment at runtime
- Use AES-256-GCM for data at rest
- TLS 1.3 for data in transit
- Never log raw PII/PCI data

### 3. Testing

- Write tests for all new features
- Aim for >80% test coverage for critical business logic
- Use synthetic/anonymized data only
- Test with deterministic clocks for schedule features

### 4. Commit & Push

```bash
# Stage your changes
git add .

# Commit with conventional commit format
git commit -m "feat: add user authentication"

# Push to your branch
git push origin feature/your-feature-name
```

### 5. Create Pull Request

- Use the PR template
- Include risk assessment and rollback plan
- Request review from at least 2 team members
- Wait for CI checks to pass

## 🛠️ Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server

# Code Quality
npm run lint         # Check linting errors
npm run lint:fix     # Fix linting errors automatically
npm run format       # Format code with Prettier
npm run type-check   # Run TypeScript type checking

# Testing
npm run test         # Run unit tests
npm run test:ui      # Run tests with UI
npm run test:coverage # Run tests with coverage report
```

## 📁 Project Structure

```
fabrica/
├── app/                    # Next.js app directory
│   ├── (auth)/            # Authentication pages
│   ├── (dashboard)/       # Creator dashboard
│   ├── (public)/          # Public storefront pages
│   ├── api/               # API routes
│   └── globals.css        # Global styles
├── components/            # Reusable React components
│   ├── ui/               # shadcn/ui components
│   └── ...
├── lib/                  # Utility libraries
│   ├── supabase/         # Supabase client setup
│   ├── payments/         # Payment processing logic
│   ├── utils/            # Helper functions
│   └── ...
├── hooks/                # Custom React hooks
├── stores/               # Zustand state stores
├── types/                # TypeScript type definitions
├── docs/                 # Documentation
└── public/               # Static assets
```

## 🔒 Security Guidelines

### Input Validation

- All API inputs validated with Zod schemas
- Business logic validation in domain layer
- Sanitize all user inputs

### Authentication & Authorization

- Use Clerk for authentication
- Implement role-based access control (RBAC)
- Validate permissions on every request

### Data Protection

- Encrypt sensitive data at rest
- Use HTTPS everywhere
- Implement proper session management
- Regular security audits

## 📊 Performance Budgets

- **Initial bundle**: <200KB (gzipped)
- **First Load JS**: <300KB
- **Lighthouse score**: >90
- **API P99 latency**: <500ms
- **Database query budget**: <100ms per query

## 🧪 Testing Strategy

### Unit Tests

- Business logic in `/lib`
- Component behavior
- Utility functions
- API route handlers

### Integration Tests

- API endpoints with database
- External service integrations
- Webhook handlers

### E2E Tests

- Critical user journeys
- Payment flows
- Onboarding process
- Mobile responsiveness

## 🚨 Error Handling

### Fail Safe

- Never lose money due to errors
- Surface retriable errors for payment failures
- Log errors with correlation IDs
- Use structured JSON logging

### Monitoring

- Sentry for error tracking
- Vercel Analytics for performance
- UptimeRobot for availability
- Custom business metrics

## 🤝 Code Review Process

### PR Requirements

- [ ] Passes all CI checks
- [ ] Includes tests for new features
- [ ] Updates documentation if needed
- [ ] Follows coding standards
- [ ] Includes risk assessment
- [ ] Has rollback plan for production changes

### Review Checklist

- [ ] Security: No secrets, proper input validation
- [ ] Performance: No N+1 queries, efficient algorithms
- [ ] Type Safety: Proper TypeScript usage
- [ ] Testing: Adequate test coverage
- [ ] Documentation: Clear comments and docs

## 📞 Support

- **Slack**: #dev channel for technical discussions
- **Issues**: GitHub Issues for bugs and feature requests
- **Docs**: Internal Notion workspace for detailed guides

## 🎯 Current Phase

We're currently in **Phase 0: Project Initialization & Foundation**. Focus on:

- Setting up development environment
- Configuring CI/CD pipeline
- Establishing coding standards
- Preparing for MVP development

Check [Tasks.md](Tasks.md) for the complete roadmap and current priorities.

---

**Happy coding! 🎉**
