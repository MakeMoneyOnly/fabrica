# Configuration & Testing Guide

This guide helps you configure and test all features of the Fabrica platform.

## Quick Start

1. **Set up environment variables:**

   ```bash
   cp .env.example .env.local
   # Edit .env.local with your values
   ```

2. **Verify configuration:**

   ```bash
   npm run verify:env
   ```

3. **Start development server:**

   ```bash
   npm run dev
   ```

4. **Run tests:**

   ```bash
   npm test
   ```

5. **Test API endpoints:**
   ```bash
   bash scripts/test-api.sh
   ```

## Configuration Steps

### 1. Environment Variables Setup

See [ENV_SETUP.md](./ENV_SETUP.md) for detailed instructions on setting up:

- Supabase database credentials
- Clerk authentication keys
- Telebirr payment integration
- Upstash Redis (optional)
- Sentry error tracking (optional)

### 2. Verify Configuration

Run the verification script to check your setup:

```bash
npm run verify:env
```

This will:

- ✅ Check all required variables are set
- ✅ Validate variable formats
- ✅ Report missing or invalid variables
- ✅ Show optional variables status

### 3. Database Setup

**Run migrations:**

```bash
# If you have migration scripts
npm run db:migrate
```

**Seed database:**

```bash
npm run db:seed
```

**Note:** If you encounter PostgREST schema cache errors (PGRST205), use the SQL seed script instead:

1. Open Supabase Dashboard → SQL Editor
2. Copy and paste contents of `supabase/seed-complete.sql`
3. Click "Run"

### 4. Clerk Webhook Setup

1. Go to Clerk Dashboard → Webhooks
2. Create endpoint: `https://your-domain.com/api/webhooks/clerk`
3. Select events: `user.created`, `user.updated`, `user.deleted`
4. Copy the signing secret to `.env.local` as `CLERK_WEBHOOK_SECRET`

**For local testing:**

- Use [ngrok](https://ngrok.com/) to expose localhost
- Or use Clerk's webhook testing tool

### 5. Telebirr Webhook Setup

1. Contact Telebirr support for webhook configuration
2. Set webhook URL: `https://your-domain.com/api/webhooks/telebirr`
3. Copy webhook secret to `.env.local` as `TELEBIRR_WEBHOOK_SECRET`

**For local testing:**

- Use ngrok to expose localhost
- Test with Telebirr sandbox

## Testing Procedures

### Automated Testing

**Run all tests:**

```bash
npm test
```

**Run with UI:**

```bash
npm test:ui
```

**Run with coverage:**

```bash
npm test:coverage
```

**Run type checking:**

```bash
npm run type-check
```

**Run linting:**

```bash
npm run lint
```

**Run everything:**

```bash
npm run test:all
```

### Manual Testing

**Test API endpoints:**

```bash
bash scripts/test-api.sh
```

Or test individually:

**Health Check:**

```bash
curl http://localhost:3000/api/health
```

**Stats:**

```bash
curl http://localhost:3000/api/stats
```

**Sentry Test:**

```bash
curl http://localhost:3000/api/test-sentry
```

**Payment Initiation (with validation):**

```bash
curl -X POST http://localhost:3000/api/payments/initiate \
  -H "Content-Type: application/json" \
  -d '{
    "productId": "invalid-uuid",
    "customerEmail": "not-an-email",
    "customerName": "A",
    "customerPhone": "123"
  }'
```

### Phase-by-Phase Testing

Follow the [TESTING_GUIDE.md](./TESTING_GUIDE.md) for detailed phase-by-phase testing:

1. **Phase 1: Foundation Critical Fixes**
   - Clerk webhook handler
   - Currency formatting
   - Authentication
   - Security headers

2. **Phase 2: Validation & Security**
   - Input validation
   - Rate limiting
   - Error handling

3. **Phase 3: High Priority Fixes**
   - Header component
   - Stats section
   - Sentry integration
   - Health check
   - Phone validation
   - React Query

4. **Phase 4: Telebirr Payment Integration**
   - Telebirr SDK
   - Payment initiation API
   - Telebirr webhook

5. **Phase 5: Environment Validation**
   - Environment variable validation

## Testing Checklist

Use [TESTING_CHECKLIST.md](./TESTING_CHECKLIST.md) for systematic verification:

- [ ] Environment variables configured
- [ ] Database seeded
- [ ] Clerk webhook working
- [ ] Authentication flow working
- [ ] API endpoints responding
- [ ] Error handling working
- [ ] Rate limiting working (if configured)
- [ ] Sentry capturing errors (if configured)
- [ ] Payment integration working (if configured)

## Troubleshooting

### Environment Variables

**Issue:** "Environment variable validation failed"

**Solution:**

1. Check `.env.local` exists
2. Run `npm run verify:env`
3. Fix any reported issues
4. See [ENV_SETUP.md](./ENV_SETUP.md) for details

### Database Connection

**Issue:** "Supabase connection failed"

**Solution:**

1. Verify Supabase project is active
2. Check `NEXT_PUBLIC_SUPABASE_URL` is correct
3. Verify `SUPABASE_SERVICE_ROLE_KEY` is valid
4. Check network connectivity
5. Restart Supabase project if needed

### Clerk Authentication

**Issue:** "Clerk authentication not working"

**Solution:**

1. Verify all Clerk keys are correct
2. Check webhook secret matches dashboard
3. Ensure webhook endpoint is publicly accessible
4. Check Clerk dashboard for errors
5. Verify `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` is set

### Rate Limiting

**Issue:** "Rate limiting not working"

**Solution:**

1. Rate limiting is optional - app works without it
2. If you want rate limiting:
   - Set up Upstash Redis account
   - Add credentials to `.env.local`
   - Restart dev server
3. Check response headers for `X-RateLimit-*`

### Sentry Error Tracking

**Issue:** "Sentry not capturing errors"

**Solution:**

1. Verify `SENTRY_DSN` is set correctly
2. Test with `/api/test-sentry` endpoint
3. Check Sentry dashboard for project status
4. Verify network requests aren't blocked
5. Errors still logged to console if Sentry fails

### Payment Integration

**Issue:** "Telebirr payment not working"

**Solution:**

1. Verify all Telebirr env vars are set
2. Check Telebirr sandbox is accessible
3. Verify webhook URL is publicly accessible
4. Check Telebirr dashboard for errors
5. Review Telebirr API documentation

## Production Checklist

Before deploying to production:

- [ ] All environment variables set in deployment platform
- [ ] Production Supabase project configured
- [ ] Production Clerk application configured
- [ ] Telebirr production credentials obtained
- [ ] Upstash Redis configured (for rate limiting)
- [ ] Sentry configured (for error tracking)
- [ ] `NEXT_PUBLIC_APP_URL` set to production domain
- [ ] Webhook URLs updated to production domain
- [ ] All secrets stored securely (not in code)
- [ ] Database migrations run
- [ ] Health check endpoint monitored
- [ ] Error tracking alerts configured

## Additional Resources

- [ENV_SETUP.md](./ENV_SETUP.md) - Detailed environment setup
- [TESTING_GUIDE.md](./TESTING_GUIDE.md) - Comprehensive testing guide
- [TESTING_CHECKLIST.md](./TESTING_CHECKLIST.md) - Testing checklist
- [STAGING_DEPLOYMENT_GUIDE.md](./STAGING_DEPLOYMENT_GUIDE.md) - Staging deployment guide

## Support

If you encounter issues:

1. Check the troubleshooting section above
2. Review error messages in console/logs
3. Check service dashboards (Supabase, Clerk, etc.)
4. Review documentation files
5. Check GitHub issues (if applicable)
