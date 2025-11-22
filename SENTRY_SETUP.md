# Sentry Setup Guide for Fabrica

This guide will help you set up Sentry error tracking for the Fabrica platform.

## Step 1: Create Sentry Account

1. Go to https://sentry.io/signup/
2. Sign up for a free account (or use existing account)
3. Verify your email address

## Step 2: Create a Project

1. After logging in, click **"Create Project"**
2. Select **"Next.js"** as the platform
3. Name your project: `fabrica-platform`
4. Select your organization (or create one)
5. Click **"Create Project"**

## Step 3: Get Your DSN

1. After project creation, Sentry will show you a DSN (Data Source Name)
2. It looks like: `https://xxxxx@xxxxx.ingest.sentry.io/xxxxx`
3. Copy this DSN - you'll need it for the next step

## Step 4: Configure Environment Variable

Add the DSN to your `.env.local` file:

```bash
SENTRY_DSN=https://xxxxx@xxxxx.ingest.sentry.io/xxxxx
```

Or set it in your hosting platform (Vercel):

1. Go to Project Settings → Environment Variables
2. Add `SENTRY_DSN` with your DSN value
3. Make sure to set it for Production, Preview, and Development environments

## Step 5: Verify Installation

The Sentry configuration files are already created:

- `sentry.client.config.ts` - Client-side error tracking
- `sentry.server.config.ts` - Server-side error tracking
- `sentry.edge.config.ts` - Edge runtime error tracking

These files are automatically loaded by Next.js when `SENTRY_DSN` is set.

## Step 6: Test Sentry Integration

### Option 1: Trigger a Test Error

Create a test API route to trigger an error:

```typescript
// src/app/api/test-sentry/route.ts (temporary file for testing)
export async function GET() {
  throw new Error('Test Sentry error')
}
```

Then visit `/api/test-sentry` in your browser. Check your Sentry dashboard - you should see the error appear within a few seconds.

### Option 2: Use Sentry's Test Button

1. Go to your Sentry project dashboard
2. Click on **Settings** → **Projects** → **Your Project**
3. Scroll down to find the **"Test Error"** button
4. Click it to send a test error

## Step 7: Configure Source Maps (for Production)

Source maps help Sentry show readable stack traces in production:

1. Sentry is already configured in `sentry.client.config.ts` and `sentry.server.config.ts`
2. When you deploy to production, Sentry will automatically upload source maps
3. Make sure `SENTRY_AUTH_TOKEN` is set in your CI/CD pipeline (optional, for automatic uploads)

## Step 8: Set Up Alerts (Optional)

1. Go to **Alerts** in your Sentry dashboard
2. Create alert rules for:
   - New errors
   - Error rate spikes
   - Performance issues
3. Configure email/Slack notifications

## Step 9: Integrate with Error Handling

Errors are automatically captured by Sentry through:

- `src/lib/api/middleware.ts` - API route errors
- Sentry's automatic error boundary - React component errors
- Sentry's Next.js integration - Framework errors

## Troubleshooting

### Errors Not Appearing in Sentry

1. **Check DSN is set:** Verify `SENTRY_DSN` is in your `.env.local`
2. **Check network:** Make sure your app can reach Sentry's servers
3. **Check Sentry dashboard:** Look for "Issues" tab - errors appear there
4. **Check console:** Look for Sentry initialization messages

### Source Maps Not Working

1. Make sure you're building with source maps: `npm run build`
2. Check Sentry project settings → Source Maps
3. Verify `SENTRY_AUTH_TOKEN` is set if using automatic uploads

### Too Many Errors in Development

The current config sends 100% of errors in development. To reduce:

- Edit `sentry.client.config.ts` and `sentry.server.config.ts`
- Change `tracesSampleRate` to `0.1` (10%) or `0` (disabled) for development

## Next Steps

- Set up error alerts for critical issues
- Configure release tracking for deployments
- Set up performance monitoring (already configured)
- Add user context to errors (already integrated in middleware)

## Resources

- [Sentry Next.js Documentation](https://docs.sentry.io/platforms/javascript/guides/nextjs/)
- [Sentry Dashboard](https://sentry.io)
- [Sentry Best Practices](https://docs.sentry.io/product/best-practices/)
