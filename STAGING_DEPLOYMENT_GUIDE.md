# Staging Deployment Guide

**Purpose:** Step-by-step guide for deploying Fabrica to a staging environment for testing before production.

**Last Updated:** November 22, 2025

---

## Prerequisites

Before deploying to staging, ensure:

- [ ] All code changes are committed and pushed
- [ ] All tests pass locally (`npm test`)
- [ ] Build succeeds locally (`npm run build`)
- [ ] No linting errors (`npm run lint`)
- [ ] No TypeScript errors (`npm run type-check`)
- [ ] Environment variables documented (see `ENV_SETUP.md`)

---

## Step 1: Set Up Staging Infrastructure

### 1.1 Vercel Staging Project

1. **Create Staging Project in Vercel:**
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "Add New" → "Project"
   - Import your GitHub repository
   - Name it: `fabrica-staging`
   - Set framework: Next.js
   - Set root directory: `.` (if needed)

2. **Configure Git Branch:**
   - Go to Project Settings → Git
   - Set Production Branch: `staging` (or `main` if using preview deployments)
   - Enable "Automatically deploy from Git"

3. **Set Up Preview Deployments (Alternative):**
   - Use Vercel's automatic preview deployments
   - Each PR gets its own preview URL
   - Staging = specific branch (e.g., `staging` branch)

### 1.2 Supabase Staging Database

1. **Create Staging Project:**
   - Go to [Supabase Dashboard](https://supabase.com/dashboard)
   - Click "New Project"
   - Name: `fabrica-staging`
   - Region: Choose closest to your users (or same as production)
   - Database Password: Generate strong password (save securely)

2. **Run Migrations:**

   ```bash
   # Link to staging project
   npx supabase link --project-ref your-staging-project-ref

   # Push all migrations
   npx supabase db push

   # Seed staging database (optional)
   # Use supabase/seed-complete.sql via Supabase SQL Editor
   ```

3. **Set Up Row Level Security (RLS):**
   - Verify RLS policies are enabled
   - Test policies match production expectations

### 1.3 Clerk Staging Application

1. **Create Staging Application:**
   - Go to [Clerk Dashboard](https://dashboard.clerk.com/)
   - Click "Create Application"
   - Name: `Fabrica Staging`
   - Choose authentication methods (Email, Phone, etc.)

2. **Configure Webhook:**
   - Go to Webhooks → Add Endpoint
   - URL: `https://your-staging-domain.vercel.app/api/webhooks/clerk`
   - Subscribe to: `user.created`, `user.updated`, `user.deleted`
   - Copy the Signing Secret (starts with `whsec_`)

3. **Configure Allowed Origins:**
   - Add staging domain to allowed origins
   - Add localhost for local testing

### 1.4 Other Services (Staging Credentials)

**Chapa:**

- Use Chapa test mode credentials
- Set `CHAPA_SECRET_KEY=CHASECK_TEST-xxxxx` for sandbox

**Upstash Redis:**

- Create a separate Redis instance for staging
- Or use the same instance with different key prefixes

**Sentry:**

- Create a separate Sentry project for staging
- Or use same project with environment tag: `staging`

---

## Step 2: Configure Environment Variables

### 2.1 Vercel Environment Variables

1. **Go to Vercel Dashboard → Project Settings → Environment Variables**

2. **Add All Required Variables:**

   **Supabase (Staging):**

   ```
   NEXT_PUBLIC_SUPABASE_URL=https://your-staging-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-staging-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-staging-service-role-key
   ```

   **Clerk (Staging):**

   ```
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_staging_...
   CLERK_SECRET_KEY=sk_test_staging_...
   CLERK_WEBHOOK_SECRET=whsec_staging_...
   ```

   **Chapa (Test Mode):**

   ```
   CHAPA_SECRET_KEY=CHASECK_TEST-your_test_secret_key
   CHAPA_WEBHOOK_SECRET=your_test_webhook_secret
   ```

   **Optional:**

   ```
   UPSTASH_REDIS_REST_URL=https://your-staging-redis.upstash.io
   UPSTASH_REDIS_REST_TOKEN=your-staging-redis-token
   SENTRY_DSN=https://your-sentry-dsn@sentry.io/project-id
   NEXT_PUBLIC_APP_URL=https://your-staging-domain.vercel.app
   ```

3. **Set Environment Scope:**
   - For staging branch: Select "Staging" or "Preview"
   - For production: Select "Production"
   - For all: Select "All Environments"

### 2.2 Verify Environment Variables

Create a test endpoint to verify all variables are set:

```bash
# After deployment, test:
curl https://your-staging-domain.vercel.app/api/health

# Should return healthy status with all services connected
```

---

## Step 3: Deploy to Staging

### 3.1 Initial Deployment

**Option A: Deploy via Git Push**

```bash
# Create and push staging branch
git checkout -b staging
git push origin staging

# Vercel will automatically deploy
```

**Option B: Deploy via Vercel CLI**

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Link project
vercel link

# Deploy to staging
vercel --env=staging
```

### 3.2 Verify Deployment

1. **Check Build Logs:**
   - Go to Vercel Dashboard → Deployments
   - Click on latest deployment
   - Verify build completed successfully
   - Check for any warnings

2. **Test Basic Functionality:**

   ```bash
   # Health check
   curl https://your-staging-domain.vercel.app/api/health

   # Homepage loads
   curl -I https://your-staging-domain.vercel.app

   # Check security headers
   curl -I https://your-staging-domain.vercel.app | grep -i "content-security-policy"
   ```

---

## Step 4: End-to-End Testing

Follow the comprehensive testing guide: `TESTING_GUIDE.md`

### 4.1 Critical Paths to Test

**Authentication Flow:**

- [ ] User sign-up works
- [ ] User sign-in works
- [ ] User sign-out works
- [ ] Clerk webhook syncs users to Supabase
- [ ] Protected routes redirect correctly

**Payment Flow:**

- [ ] Payment initiation API works
- [ ] Chapa payment page loads
- [ ] Webhook receives payment callbacks
- [ ] Order status updates correctly
- [ ] Email notifications sent (if configured)

**Core Features:**

- [ ] Homepage loads correctly
- [ ] Stats section displays data
- [ ] Navigation works
- [ ] Forms validate input
- [ ] Error handling works

### 4.2 Performance Testing

```bash
# Test response times
curl -w "@curl-format.txt" -o /dev/null -s https://your-staging-domain.vercel.app

# Check Core Web Vitals
# Use Lighthouse in Chrome DevTools
# Or use PageSpeed Insights: https://pagespeed.web.dev/
```

### 4.3 Security Testing

- [ ] Security headers present (CSP, X-Frame-Options, etc.)
- [ ] Rate limiting works (if configured)
- [ ] Input validation rejects invalid data
- [ ] SQL injection attempts blocked
- [ ] XSS attempts blocked
- [ ] CSRF protection works

### 4.4 Monitoring Setup

**Sentry:**

- [ ] Errors are captured
- [ ] Error context includes useful information
- [ ] Alerts configured for critical errors

**Vercel Analytics:**

- [ ] Analytics enabled (if using)
- [ ] Performance metrics visible

---

## Step 5: Pre-Production Checklist

Before promoting staging to production:

- [ ] All tests pass
- [ ] No critical errors in Sentry
- [ ] Performance metrics acceptable
- [ ] Security headers verified
- [ ] All environment variables configured
- [ ] Database migrations tested
- [ ] Webhooks tested end-to-end
- [ ] Payment flow tested (sandbox)
- [ ] Email notifications tested
- [ ] Mobile responsiveness verified
- [ ] Browser compatibility tested
- [ ] Documentation updated

---

## Step 6: Promote to Production

### 6.1 Update Production Environment Variables

1. Go to Vercel Dashboard → Production Project → Environment Variables
2. Update all variables with production credentials:
   - Supabase production project
   - Clerk production application
   - Chapa production credentials
   - Production Redis instance
   - Production Sentry project

### 6.2 Deploy to Production

```bash
# Merge staging to main
git checkout main
git merge staging
git push origin main

# Or deploy directly
vercel --prod
```

### 6.3 Post-Deployment Verification

- [ ] Production site loads
- [ ] Health check passes
- [ ] Critical flows work
- [ ] Monitoring shows no errors
- [ ] Performance is acceptable

---

## Troubleshooting

### Build Failures

**Issue:** Build fails with environment variable errors
**Solution:**

- Check all required env vars are set in Vercel
- Verify variable names match exactly (case-sensitive)
- Check for typos

**Issue:** Build fails with TypeScript errors
**Solution:**

- Run `npm run type-check` locally first
- Fix all TypeScript errors before deploying

### Runtime Errors

**Issue:** Database connection errors
**Solution:**

- Verify Supabase URL and keys are correct
- Check Supabase project is active
- Verify network connectivity

**Issue:** Webhook not receiving events
**Solution:**

- Verify webhook URL is publicly accessible
- Check webhook secret matches
- Verify Clerk/Supabase webhook configuration

### Performance Issues

**Issue:** Slow page loads
**Solution:**

- Check Vercel Analytics for bottlenecks
- Optimize images and assets
- Check database query performance
- Review API response times

---

## Rollback Procedure

If staging deployment has critical issues:

1. **Revert Git Commit:**

   ```bash
   git revert HEAD
   git push origin staging
   ```

2. **Revert Vercel Deployment:**
   - Go to Vercel Dashboard → Deployments
   - Find last working deployment
   - Click "..." → "Promote to Production"

3. **Rollback Database (if needed):**
   ```bash
   # Revert last migration
   npx supabase migration repair --status reverted
   ```

---

## Next Steps

After successful staging deployment:

1. ✅ Complete all testing (see `TESTING_GUIDE.md`)
2. ✅ Fix any issues found
3. ✅ Update documentation
4. ✅ Get stakeholder approval
5. ✅ Deploy to production (follow same steps with production credentials)

---

## Resources

- [Vercel Deployment Docs](https://vercel.com/docs/deployments)
- [Supabase Migration Guide](https://supabase.com/docs/guides/cli/local-development#database-migrations)
- [Clerk Webhook Setup](https://clerk.com/docs/integrations/webhooks/overview)
- `TESTING_GUIDE.md` - Comprehensive testing guide
- `ENV_SETUP.md` - Environment variables reference
