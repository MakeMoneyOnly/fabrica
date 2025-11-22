# Environment Variables Setup Guide

This guide will help you configure all required and optional environment variables for the Fabrica platform.

## Quick Start

1. Copy the example file:

   ```bash
   cp .env.example .env.local
   ```

2. Fill in your values (see sections below for where to get each value)

3. Verify configuration:
   ```bash
   npm run verify:env
   ```

## Required Variables

### Supabase Database

**Where to get:**

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project (or create a new one)
3. Go to **Settings** → **API**
4. Copy the following:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Notes:**

- `NEXT_PUBLIC_SUPABASE_URL`: Your project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Public/anonymous key (safe to expose)
- `SUPABASE_SERVICE_ROLE_KEY`: Service role key (keep secret - bypasses RLS)

**Verification:**

- Run database migrations: `npm run db:migrate` (if available)
- Seed database: `npm run db:seed`
- Check health endpoint: `curl http://localhost:3000/api/health`

### Clerk Authentication

**Where to get:**

1. Go to [Clerk Dashboard](https://dashboard.clerk.com/)
2. Select your application (or create a new one)
3. Go to **API Keys**
4. Copy the following:

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxxxx
CLERK_SECRET_KEY=sk_test_xxxxx
```

**Webhook Secret:**

1. Go to **Webhooks** → **Endpoints**
2. Create endpoint: `https://your-domain.com/api/webhooks/clerk`
3. Copy the **Signing Secret**:

```env
CLERK_WEBHOOK_SECRET=whsec_xxxxx
```

**Notes:**

- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`: Safe to expose (used in client-side)
- `CLERK_SECRET_KEY`: Keep secret (server-side only)
- `CLERK_WEBHOOK_SECRET`: Used to verify webhook signatures

**Verification:**

- Test sign-in flow in the app
- Check webhook receives events (check logs)
- Verify users sync to Supabase database

### Telebirr Payment Integration

**Where to get:**

1. Contact Telebirr support for developer credentials
2. Request sandbox credentials for testing
3. Get production credentials when ready to launch

```env
TELEBIRR_APP_ID=your_app_id
TELEBIRR_APP_KEY=your_app_key
TELEBIRR_MERCHANT_CODE=your_merchant_code
TELEBIRR_WEBHOOK_SECRET=your_webhook_secret
TELEBIRR_API_URL=https://api.telebirr.com/api/v1
```

**Sandbox (for testing):**

```env
TELEBIRR_API_URL=https://sandbox-api.telebirr.com/api/v1
```

**Notes:**

- All Telebirr variables are required
- Use sandbox URL for development/testing
- Webhook URL must be publicly accessible (use ngrok for local testing)

**Verification:**

- Test payment initiation: `POST /api/payments/initiate`
- Check Telebirr dashboard for payment attempts
- Test webhook signature verification

## Optional Variables

### Upstash Redis (Rate Limiting)

**Where to get:**

1. Go to [Upstash Console](https://console.upstash.com/)
2. Create a new Redis database (free tier available)
3. Copy **REST URL** and **REST Token**:

```env
UPSTASH_REDIS_REST_URL=https://xxxxx.upstash.io
UPSTASH_REDIS_REST_TOKEN=xxxxx
```

**Notes:**

- Optional for development (rate limiting disabled without it)
- Required for production (distributed rate limiting)
- Free tier: 10,000 commands/day

**Verification:**

- Rate limiting will work automatically if configured
- Test by making rapid requests to any API endpoint
- Check response headers: `X-RateLimit-Limit`, `X-RateLimit-Remaining`

### Sentry Error Tracking

**Where to get:**

1. Go to [Sentry.io](https://sentry.io/)
2. Create a new project (select Next.js)
3. Copy the **DSN**:

```env
SENTRY_DSN=https://xxxxx@sentry.io/xxxxx
```

**Notes:**

- Optional for development
- Recommended for production
- Errors still logged to console if Sentry fails

**Verification:**

- Visit: `http://localhost:3000/api/test-sentry`
- Check Sentry dashboard for error report
- Visit: `http://localhost:3000/sentry-example-page` (frontend errors)

### Application URL

```env
NEXT_PUBLIC_APP_URL=https://your-domain.com
```

**Notes:**

- Optional (defaults to `http://localhost:3000` in development)
- Required for production
- Used for webhook URLs and redirects

## Environment Validation

The app validates all environment variables on startup using Zod schemas. If any required variable is missing or invalid, you'll see a clear error message:

```
Environment variable validation failed:
NEXT_PUBLIC_SUPABASE_URL: Invalid Supabase URL
CLERK_SECRET_KEY: Clerk secret key is required
```

## Verification Script

Run the verification script to check your configuration:

```bash
npm run verify:env
```

This will:

- Check all required variables are set
- Validate variable formats (URLs, etc.)
- Test connections (Supabase, Clerk, etc.)
- Report any issues

## Troubleshooting

### "Environment variable validation failed"

**Solution:**

1. Check `.env.local` file exists
2. Verify all required variables are set
3. Check for typos in variable names
4. Ensure URLs are valid (start with `http://` or `https://`)

### "Supabase connection failed"

**Solution:**

1. Verify `NEXT_PUBLIC_SUPABASE_URL` is correct
2. Check `SUPABASE_SERVICE_ROLE_KEY` is valid
3. Ensure Supabase project is active
4. Check network connectivity

### "Clerk authentication not working"

**Solution:**

1. Verify all Clerk keys are correct
2. Check `CLERK_WEBHOOK_SECRET` matches dashboard
3. Ensure webhook endpoint is publicly accessible
4. Check Clerk dashboard for errors

### "Rate limiting not working"

**Solution:**

1. Verify Upstash Redis credentials are set
2. Check Redis database is active
3. Rate limiting is optional - app works without it
4. Check response headers for rate limit info

### "Sentry not capturing errors"

**Solution:**

1. Verify `SENTRY_DSN` is correct
2. Check Sentry project is active
3. Test with `/api/test-sentry` endpoint
4. Check browser console for Sentry initialization
5. Errors still logged to console if Sentry fails

## Production Checklist

Before deploying to production:

- [ ] All required variables set
- [ ] Production Supabase project configured
- [ ] Production Clerk application configured
- [ ] Telebirr production credentials obtained
- [ ] Upstash Redis configured (for rate limiting)
- [ ] Sentry configured (for error tracking)
- [ ] `NEXT_PUBLIC_APP_URL` set to production domain
- [ ] Webhook URLs updated to production domain
- [ ] All secrets stored securely (not in code)
- [ ] Environment variables set in deployment platform (Vercel, etc.)

## Security Notes

**Never commit these files:**

- `.env.local`
- `.env`
- Any file containing secrets

**Safe to expose (NEXT*PUBLIC*\*):**

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
- `NEXT_PUBLIC_APP_URL`

**Keep secret:**

- `SUPABASE_SERVICE_ROLE_KEY`
- `CLERK_SECRET_KEY`
- `CLERK_WEBHOOK_SECRET`
- `TELEBIRR_APP_KEY`
- `TELEBIRR_WEBHOOK_SECRET`
- `UPSTASH_REDIS_REST_TOKEN`
- `SENTRY_DSN` (contains auth token)

## Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Clerk Documentation](https://clerk.com/docs)
- [Telebirr Developer Portal](https://developer.telebirr.com/)
- [Upstash Documentation](https://docs.upstash.com/)
- [Sentry Documentation](https://docs.sentry.io/)
