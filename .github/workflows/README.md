# CI/CD Pipelines Documentation

This directory contains all GitHub Actions workflows for the Fabrica platform. These pipelines automate testing, building, security scanning, and deployment processes.

## 📋 Overview

Our CI/CD setup follows industry best practices with:

- **Trunk-based development** with feature branches
- **Automated testing** before deployment
- **Security scanning** on every commit
- **Performance monitoring** via Lighthouse CI
- **Zero-downtime deployments** to Vercel
- **Database migrations** with staging validation

## 🔄 Workflow Pipeline

```
┌─────────────────┐
│   Push/PR       │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   CI Pipeline   │◄─── Lint, Type Check, Tests, Build
└────────┬────────┘
         │
         ├───► PR ────► Preview Deployment
         │
         ├───► Staging ────► Staging Deployment
         │
         └───► Main ────► Production Deployment ────► Database Migration
```

## 📁 Workflow Files

### 1. `ci.yml` - Continuous Integration

**Triggers:** Push to `main`, `staging`, `develop` branches; Pull requests

**Jobs:**

- **lint-and-typecheck**: Runs ESLint, TypeScript type checking, and Prettier
- **test**: Runs unit tests with Vitest and uploads coverage
- **build**: Builds the Next.js application to verify it compiles
- **security-scan**: Runs npm audit and TruffleHog secret scanning
- **ci-summary**: Provides a summary of all CI checks

**Duration:** ~10-15 minutes

### 2. `deploy-production.yml` - Production Deployment

**Triggers:** Push to `main` branch; Manual workflow dispatch

**Jobs:**

- **wait-for-ci**: Waits for CI pipeline to pass
- **deploy**: Deploys to Vercel production
- **e2e-tests**: Runs end-to-end tests against production (if configured)
- **health-check**: Verifies deployment health
- **notify**: Sends Slack notifications (if configured)

**Duration:** ~15-20 minutes

**Requirements:**

- `VERCEL_TOKEN` secret
- `VERCEL_ORG_ID` secret
- `VERCEL_PROJECT_ID` secret

### 3. `deploy-staging.yml` - Staging Deployment

**Triggers:** Push to `staging` branch; Manual workflow dispatch

**Jobs:**

- **deploy**: Deploys to Vercel staging environment
- **health-check**: Verifies staging deployment
- **smoke-tests**: Runs basic smoke tests

**Duration:** ~10-15 minutes

### 4. `deploy-preview.yml` - Preview Deployments

**Triggers:** Pull requests to `main` or `staging`

**Jobs:**

- **deploy-preview**: Creates a preview deployment for each PR
- Automatically comments on PR with preview URL

**Duration:** ~5-10 minutes

**Features:**

- Each PR gets a unique preview URL
- Preview updates automatically on new commits
- Preview URL commented on PR

### 5. `database-migration.yml` - Database Migrations

**Triggers:** Push to `main` with migration files; Manual workflow dispatch

**Jobs:**

- **validate-migrations**: Validates SQL migration files
- **migrate-staging**: Applies migrations to staging database first
- **migrate-production**: Applies migrations to production (after staging success)

**Duration:** ~10-15 minutes

**Requirements:**

- `SUPABASE_ACCESS_TOKEN` secret
- `SUPABASE_PROJECT_REF` secret (production)
- `SUPABASE_STAGING_PROJECT_REF` secret (staging)

**Safety Features:**

- Migrations run on staging first
- Production migrations only run after staging success
- Prevents concurrent migrations

### 6. `security-scan.yml` - Security Scanning

**Triggers:** Push to `main`/`staging`; Pull requests; Weekly schedule

**Jobs:**

- **dependency-scan**: Runs npm audit for vulnerabilities
- **secret-scan**: Scans for hardcoded secrets using TruffleHog
- **codeql-analysis**: Runs GitHub CodeQL security analysis
- **security-summary**: Provides summary of all security scans

**Duration:** ~20-30 minutes

### 7. `performance-test.yml` - Performance Testing

**Triggers:** Pull requests; Manual workflow dispatch

**Jobs:**

- **lighthouse**: Runs Lighthouse CI performance tests
- **bundle-size**: Analyzes bundle size and checks limits

**Duration:** ~15 minutes

**Metrics Tracked:**

- Performance score (target: >85)
- Accessibility score (target: >90)
- Best practices score (target: >90)
- SEO score (target: >90)
- Core Web Vitals (LCP, FID, CLS)

## 🔐 Required Secrets

Configure these secrets in GitHub Settings → Secrets and variables → Actions:

### Vercel Deployment

- `VERCEL_TOKEN` - Vercel API token
- `VERCEL_ORG_ID` - Vercel organization ID
- `VERCEL_PROJECT_ID` - Vercel project ID

### Supabase Database

- `SUPABASE_ACCESS_TOKEN` - Supabase access token
- `SUPABASE_PROJECT_REF` - Production project reference
- `SUPABASE_STAGING_PROJECT_REF` - Staging project reference

### Application Environment Variables

These are configured in Vercel dashboard, not GitHub secrets:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
- `CLERK_SECRET_KEY`
- `CLERK_WEBHOOK_SECRET`
- `CHAPA_SECRET_KEY`
- `CHAPA_WEBHOOK_SECRET`
- `RESEND_API_KEY`
- `NEXT_PUBLIC_SENTRY_DSN`
- `SENTRY_AUTH_TOKEN`
- `NEXT_PUBLIC_POSTHOG_KEY`
- `UPSTASH_REDIS_REST_URL`
- `UPSTASH_REDIS_REST_TOKEN`
- `ENCRYPTION_KEY`

### Optional Integrations

- `SLACK_WEBHOOK` - Slack webhook URL for notifications
- `CODECOV_TOKEN` - Codecov token for coverage reporting

## 🚀 Usage Guide

### Deploying to Production

1. **Merge to main branch:**

   ```bash
   git checkout main
   git pull origin main
   git merge feature/your-feature
   git push origin main
   ```

2. **CI Pipeline runs automatically:**
   - Linting and type checking
   - Unit tests
   - Build verification
   - Security scanning

3. **Production deployment triggers:**
   - Waits for CI to pass
   - Deploys to Vercel production
   - Runs health checks
   - Sends notifications

### Deploying to Staging

1. **Push to staging branch:**

   ```bash
   git checkout staging
   git merge feature/your-feature
   git push origin staging
   ```

2. **Staging deployment runs automatically**

### Creating Preview Deployments

1. **Open a Pull Request:**

   ```bash
   git checkout -b feature/new-feature
   # Make changes
   git push origin feature/new-feature
   # Open PR on GitHub
   ```

2. **Preview deployment creates automatically:**
   - Unique URL for each PR
   - Updates on each push
   - Commented on PR

### Running Database Migrations

**Automatic (on push to main with migration files):**

```bash
# Create migration file
npx supabase migration new add_new_feature

# Edit migration file
# supabase/migrations/YYYYMMDDHHMMSS_add_new_feature.sql

# Commit and push
git add supabase/migrations/
git commit -m "Add migration for new feature"
git push origin main
```

**Manual (via workflow dispatch):**

1. Go to Actions → Database Migration
2. Click "Run workflow"
3. Select environment (staging or production)
4. Click "Run workflow"

**Important:** Migrations always run on staging first, then production.

## 🔍 Monitoring & Debugging

### Viewing Workflow Runs

1. Go to GitHub → Actions tab
2. Click on a workflow to see all runs
3. Click on a specific run to see detailed logs

### Common Issues

**Build Failures:**

- Check build logs for TypeScript errors
- Verify all environment variables are set
- Check for missing dependencies

**Deployment Failures:**

- Verify Vercel secrets are configured
- Check Vercel project settings
- Review deployment logs

**Migration Failures:**

- Check Supabase connection
- Verify migration SQL syntax
- Check Supabase project references

**Security Scan Failures:**

- Review npm audit results
- Check for hardcoded secrets
- Review CodeQL findings

### Workflow Status Badge

Add to your README.md:

```markdown
![CI Pipeline](https://github.com/your-org/fabrica/workflows/CI%20Pipeline/badge.svg)
![Production Deployment](https://github.com/your-org/fabrica/workflows/Deploy%20to%20Production/badge.svg)
```

## 📊 Performance Targets

Based on our documentation, we aim for:

| Metric               | Target | Measurement        |
| -------------------- | ------ | ------------------ |
| Performance Score    | >85    | Lighthouse CI      |
| Accessibility Score  | >90    | Lighthouse CI      |
| Best Practices Score | >90    | Lighthouse CI      |
| SEO Score            | >90    | Lighthouse CI      |
| LCP                  | <2.5s  | Core Web Vitals    |
| FID                  | <100ms | Core Web Vitals    |
| CLS                  | <0.1   | Core Web Vitals    |
| API Response (p95)   | <200ms | Vercel Analytics   |
| Database Query (p95) | <50ms  | Supabase Dashboard |

## 🔄 Workflow Best Practices

1. **Always wait for CI to pass** before merging
2. **Test on staging** before production deployment
3. **Review security scan results** regularly
4. **Monitor performance metrics** after deployments
5. **Use preview deployments** for PR reviews
6. **Run migrations on staging first** before production

## 📝 Adding New Workflows

When adding new workflows:

1. Follow naming convention: `kebab-case.yml`
2. Add timeout-minutes to prevent hanging jobs
3. Use concurrency groups to prevent conflicts
4. Add appropriate triggers (push, PR, schedule)
5. Document in this README
6. Test on a feature branch first

## 🆘 Support

For issues with CI/CD pipelines:

1. Check workflow logs in GitHub Actions
2. Review this documentation
3. Check required secrets are configured
4. Contact DevOps team

---

**Last Updated:** January 2025  
**Maintained by:** Fabrica DevOps Team
