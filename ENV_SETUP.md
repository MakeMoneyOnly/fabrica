# Environment Variables Setup Guide

This document lists all required and optional environment variables for the Fabrica platform.

## Required Environment Variables

### Supabase Configuration

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

**How to get:**

1. Go to your Supabase project dashboard
2. Settings → API
3. Copy the Project URL and anon/public key
4. Copy the service_role key (keep this secret!)

### Clerk Authentication

```bash
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
CLERK_WEBHOOK_SECRET=whsec_...
```

**How to get:**

1. Go to Clerk Dashboard → API Keys
2. Copy the Publishable Key (starts with `pk_`)
3. Copy the Secret Key (starts with `sk_`)
4. Go to Webhooks → Create endpoint
5. Copy the Signing Secret (starts with `whsec_`)

### Telebirr Payment Integration

```bash
TELEBIRR_APP_ID=your-app-id
TELEBIRR_APP_KEY=your-app-key
TELEBIRR_MERCHANT_CODE=your-merchant-code
TELEBIRR_WEBHOOK_SECRET=your-webhook-secret
TELEBIRR_API_URL=https://sandbox.telebirr.et/v2
```

**How to get:**

1. Apply for Telebirr merchant account
2. Get sandbox credentials from Telebirr support
3. For production, use: `https://api.telebirr.et/v2`

## Optional Environment Variables (for Development)

### Upstash Redis (for Rate Limiting)

```bash
UPSTASH_REDIS_REST_URL=https://your-redis.upstash.io
UPSTASH_REDIS_REST_TOKEN=your-redis-token
```

**How to get:**

1. Sign up at https://upstash.com
2. Create a Redis database
3. Copy the REST URL and token
4. **Note:** Rate limiting will be disabled if these are not set

### Sentry Error Tracking

```bash
SENTRY_DSN=https://your-sentry-dsn@sentry.io/project-id
```

**How to get:**

1. Sign up at https://sentry.io
2. Create a new project (Next.js)
3. Copy the DSN from project settings
4. **Note:** Error tracking will be disabled if not set

### App URL (for production)

```bash
NEXT_PUBLIC_APP_URL=https://fabrica.et
```

**Note:** Defaults to `http://localhost:3000` in development

## Setup Instructions

1. **Copy `.env.example` to `.env.local`:**

   ```bash
   cp .env.example .env.local
   ```

2. **Fill in all required variables** in `.env.local`

3. **For production**, set these in your hosting platform (Vercel):
   - Go to Project Settings → Environment Variables
   - Add each variable with the production values

## Environment Variable Validation

The app validates all environment variables on startup. If any required variables are missing, you'll see a clear error message listing what's missing.

## Security Notes

- **Never commit `.env.local` to git** (it's already in `.gitignore`)
- **Never expose service role keys** or secret keys in client-side code
- **Use different keys** for development, staging, and production
- **Rotate keys regularly** for security

## Testing Without All Services

You can run the app without optional services:

- **Without Upstash Redis:** Rate limiting will be disabled (not recommended for production)
- **Without Sentry:** Error tracking will be disabled (errors still logged to console)
- **Without Telebirr:** Payment features won't work (but app will still run)

However, **all required variables must be set** for the app to start.
