# Testing Checklist - Audit Fixes

**Purpose:** Systematic checklist to verify all implementations from the audit fixes are working correctly.

**Usage:** Check off each item as you test. Document any issues found.

**Last Updated:** November 22, 2025

---

## Pre-Testing Setup

- [ ] Development server running (`npm run dev`)
- [ ] All environment variables configured (see `ENV_SETUP.md`)
- [ ] Database seeded (if needed)
- [ ] Browser DevTools open (Console, Network tabs)
- [ ] Supabase Dashboard accessible
- [ ] Clerk Dashboard accessible

---

## Phase 1: Foundation Critical Fixes

### 1.1 Clerk Webhook Handler ✅

**User Creation Sync:**

- [ ] Create new user in Clerk Dashboard
- [ ] Verify webhook event received (check logs)
- [ ] Check Supabase `users` table for new record:
  ```sql
  SELECT * FROM users ORDER BY created_at DESC LIMIT 1;
  ```
- [ ] Verify user data matches Clerk data (email, name, phone)
- [ ] Verify `clerk_user_id` is set correctly

**User Update Sync:**

- [ ] Update user email/name in Clerk Dashboard
- [ ] Check Supabase for updated record
- [ ] Verify changes synced correctly

**User Deletion:**

- [ ] Delete user in Clerk Dashboard
- [ ] Check logs for `user.deleted` event
- [ ] Verify appropriate handling (soft delete or hard delete)

**Error Handling:**

- [ ] Test with invalid webhook secret (should reject)
- [ ] Test with malformed payload (should handle gracefully)
- [ ] Check logs don't contain sensitive data

### 1.2 Currency Formatting Bug ✅

**Test Cases:**

- [ ] `formatETB(299.99)` returns `"ETB 299.99"` (not `"ETB 2.99"`)
- [ ] `formatETB(1000)` returns `"ETB 1,000.00"`
- [ ] `formatETB(0.5)` returns `"ETB 0.50"`
- [ ] `formatETB(0)` returns `"ETB 0.00"`
- [ ] Large amounts format correctly (e.g., `1000000` → `"ETB 1,000,000.00"`)

**Visual Testing:**

- [ ] Check product prices display correctly on homepage
- [ ] Check prices in cart/checkout
- [ ] Check prices in admin dashboard

**Unit Tests:**

- [ ] Run: `npm test -- currency.test.ts`
- [ ] All tests pass

### 1.3 Authentication (Clerk Integration) ✅

**Sign In:**

- [ ] Click "Sign In" button
- [ ] Complete Clerk sign-in flow
- [ ] Verify redirected after sign-in
- [ ] Check `useAuth()` hook returns user object
- [ ] Verify user data matches Clerk user

**Sign Out:**

- [ ] Click "Sign Out" button
- [ ] Verify `isAuthenticated` becomes `false`
- [ ] Verify user redirected or UI updates
- [ ] Check Clerk session cleared

**Protected Routes:**

- [ ] Access protected route while not signed in
- [ ] Verify redirect to sign-in page
- [ ] Sign in and verify access granted
- [ ] Test multiple protected routes

**User State:**

- [ ] Refresh page while signed in (session persists)
- [ ] Check user data loads correctly on page load

### 1.4 Security Headers ✅

**Browser DevTools Check:**

- [ ] Open Network tab
- [ ] Reload page
- [ ] Click on document request
- [ ] Check Response Headers:
  - [ ] `Content-Security-Policy` present
  - [ ] `X-Frame-Options: SAMEORIGIN`
  - [ ] `X-Content-Type-Options: nosniff`
  - [ ] `Referrer-Policy: strict-origin-when-cross-origin`
  - [ ] `Permissions-Policy` present

**curl Check:**

```bash
curl -I http://localhost:3000
```

- [ ] All security headers present
- [ ] Headers have correct values

---

## Phase 2: Validation & Security Foundation

### 2.1 Input Validation (Zod) ✅

**Payment API Validation:**

```bash
# Valid request
curl -X POST http://localhost:3000/api/payments/initiate \
  -H "Content-Type: application/json" \
  -d '{
    "productId": "valid-uuid",
    "customerEmail": "test@example.com",
    "customerName": "Test User",
    "customerPhone": "+251912345678"
  }'
```

- [ ] Returns 200/201 with success response

```bash
# Invalid request (should return 400)
curl -X POST http://localhost:3000/api/payments/initiate \
  -H "Content-Type: application/json" \
  -d '{
    "productId": "invalid",
    "customerEmail": "not-an-email",
    "customerPhone": "123"
  }'
```

- [ ] Returns 400 Bad Request
- [ ] Error message lists validation errors
- [ ] Error format matches standardized format

**Phone Validation:**

- [ ] `+251912345678` - Valid
- [ ] `0912345678` - Valid
- [ ] `912345678` - Valid
- [ ] `123456789` - Invalid (wrong country)
- [ ] `+1234567890` - Invalid (wrong country)

**Email Validation:**

- [ ] Valid emails accepted
- [ ] Invalid emails rejected with clear error

### 2.2 Rate Limiting ✅

**Note:** Requires Upstash Redis. If not configured, rate limiting is disabled.

**Test Rate Limit:**

```bash
# Make multiple rapid requests
for i in {1..10}; do
  curl http://localhost:3000/api/health
done
```

- [ ] First N requests succeed (check rate limit config)
- [ ] After limit exceeded, returns 429 Too Many Requests
- [ ] Response headers include:
  - [ ] `X-RateLimit-Limit`
  - [ ] `X-RateLimit-Remaining`
  - [ ] `X-RateLimit-Reset`

**Different Rate Limits:**

- [ ] Public endpoints have appropriate limits
- [ ] Authenticated endpoints have higher limits
- [ ] Payment endpoints have strict limits
- [ ] Admin endpoints have very strict limits

### 2.3 Error Handling ✅

**Test Standardized Error Format:**

```bash
# Test 404 error
curl http://localhost:3000/api/products/non-existent-id
```

- [ ] Returns JSON with standardized format:
  ```json
  {
    "success": false,
    "error": {
      "code": "NOT_FOUND",
      "message": "Resource not found"
    },
    "meta": {
      "timestamp": "..."
    }
  }
  ```

**Test Different Error Codes:**

- [ ] 400 Bad Request - validation errors
- [ ] 401 Unauthorized - authentication required
- [ ] 403 Forbidden - insufficient permissions
- [ ] 404 Not Found - resource doesn't exist
- [ ] 429 Too Many Requests - rate limit exceeded
- [ ] 500 Internal Server Error - server errors

**Error Logging:**

- [ ] Errors logged to console (development)
- [ ] Errors sent to Sentry (if configured)
- [ ] No sensitive data in error messages

---

## Phase 3: High Priority Fixes

### 3.1 Header Component ✅

**Navigation Links:**

- [ ] When not signed in: Features, Pricing, About, Contact
- [ ] When signed in: Dashboard, Products, Analytics, Settings
- [ ] Links navigate correctly
- [ ] Active link highlighted

**Mobile Menu:**

- [ ] Mobile menu opens/closes correctly
- [ ] Navigation matches desktop
- [ ] Menu is accessible (keyboard navigation)

**Branding:**

- [ ] Logo displays correctly
- [ ] Site name is "Fabrica" (not placeholder)

### 3.2 Stats Section ✅

**Data Display:**

- [ ] Stats section shows real numbers from database
- [ ] Shows 0 if no data (not errors)
- [ ] Loading state while fetching
- [ ] Error state if API fails

**Stats API:**

```bash
curl http://localhost:3000/api/stats
```

- [ ] Returns JSON:
  ```json
  {
    "success": true,
    "data": {
      "totalProducts": 0,
      "totalOrders": 0,
      "totalRevenue": 0,
      "activeCreators": 0
    }
  }
  ```

**Visual Testing:**

- [ ] Numbers formatted correctly (currency, commas)
- [ ] Copy is Fabrica-specific (not placeholder text)
- [ ] Section looks good on mobile

### 3.3 Sentry Integration ✅

**API Route Error Capture:**

```bash
curl http://localhost:3000/api/test-sentry
```

- [ ] Returns error response
- [ ] Error appears in Sentry dashboard within seconds
- [ ] Error includes stack trace
- [ ] Error includes context (URL, method, etc.)

**Frontend Error Capture:**

- [ ] Visit `http://localhost:3000/sentry-example-page`
- [ ] Click "Throw Sample Error" button
- [ ] Error appears in Sentry dashboard
- [ ] Error includes component stack trace

**Backend Error Capture:**

```bash
curl http://localhost:3000/api/sentry-example-api
```

- [ ] Error appears in Sentry dashboard
- [ ] Error includes server-side context

**Configuration:**

- [ ] `SENTRY_DSN` set in `.env.local`
- [ ] No hardcoded DSNs in code
- [ ] Source maps configured (if using)

### 3.4 Health Check Endpoint ✅

```bash
curl http://localhost:3000/api/health
```

- [ ] Returns JSON:
  ```json
  {
    "status": "healthy" | "degraded" | "unhealthy",
    "timestamp": "...",
    "services": {
      "database": { "status": "up", "responseTime": 123 },
      "storage": { "status": "up" },
      "auth": { "status": "up" }
    }
  }
  ```

**Service Checks:**

- [ ] Database connection works
- [ ] Storage connection works (if configured)
- [ ] Auth service accessible (if configured)
- [ ] Response time reasonable (< 1000ms)

### 3.5 Phone Validation Utility ✅

**Test Phone Utility:**

```typescript
import { validateEthiopianPhone, formatEthiopianPhone } from '@/lib/utils/phone'

// Valid formats
validateEthiopianPhone('+251912345678') // true
validateEthiopianPhone('0912345678') // true
validateEthiopianPhone('912345678') // true

// Invalid formats
validateEthiopianPhone('123456789') // false
validateEthiopianPhone('+1234567890') // false

// Formatting
formatEthiopianPhone('912345678') // "+251 91 234 5678"
```

- [ ] All test cases pass
- [ ] Used in forms (validates on submit)
- [ ] Error messages are clear

### 3.6 React Query ✅

**Query Caching:**

- [ ] Check Network tab - queries cached after first fetch
- [ ] Refetch on window focus works
- [ ] Stale time configured appropriately

**Stats Hook:**

```typescript
import { useStats } from '@/hooks/useAnalytics'

function TestComponent() {
  const { data, isLoading } = useStats()
  // Should fetch and cache stats
}
```

- [ ] Hook fetches data correctly
- [ ] Loading state works
- [ ] Error state works
- [ ] Data cached appropriately

---

## Phase 4: Telebirr Payment Integration

### 4.1 Telebirr SDK ✅

**Note:** Requires Telebirr sandbox credentials.

**Signature Generation:**

- [ ] Signatures generated correctly
- [ ] Signatures verified by Telebirr API

**Payment Initiation:**

```typescript
const result = await client.initiatePayment({
  orderId: 'test-order-123',
  amount: 100,
  subject: 'Test Product',
  customerName: 'Test User',
  customerPhone: '+251912345678',
  returnUrl: 'http://localhost:3000/success',
  notifyUrl: 'http://localhost:3000/api/webhooks/telebirr',
})
```

- [ ] Returns payment URL or error
- [ ] Payment URL is valid Telebirr URL

### 4.2 Payment Initiation API ✅

```bash
curl -X POST http://localhost:3000/api/payments/initiate \
  -H "Content-Type: application/json" \
  -d '{
    "productId": "your-product-uuid",
    "customerEmail": "customer@example.com",
    "customerName": "Customer Name",
    "customerPhone": "+251912345678"
  }'
```

- [ ] Returns payment URL
- [ ] Creates order in database
- [ ] Order status is "pending"
- [ ] Idempotency works (same request twice = same order)

**Error Cases:**

- [ ] Invalid product ID returns 404
- [ ] Invalid customer data returns 400
- [ ] Telebirr API errors handled gracefully

### 4.3 Telebirr Webhook ✅

**Note:** Requires webhook URL to be publicly accessible (use ngrok for local testing).

**Webhook Signature Verification:**

- [ ] Valid signature accepted
- [ ] Invalid signature rejected (401)
- [ ] Missing signature rejected (401)

**Payment Success:**

- [ ] Complete test payment in Telebirr sandbox
- [ ] Webhook receives success event
- [ ] Order status changes to "completed"
- [ ] Download link created (for digital products)
- [ ] Email notification sent (if configured)

**Payment Failure:**

- [ ] Failed payment updates order status
- [ ] Error logged appropriately
- [ ] User notified (if configured)

**Idempotency:**

- [ ] Duplicate webhook events handled correctly
- [ ] Order not processed twice

---

## Phase 5: Environment Validation

### 5.1 Environment Variable Validation ✅

**Missing Variables:**

- [ ] Remove a required env var from `.env.local`
- [ ] Try to start app: `npm run dev`
- [ ] Clear error message lists missing variables
- [ ] App doesn't start with missing variables

**Invalid Variables:**

- [ ] Set invalid URL format for `NEXT_PUBLIC_SUPABASE_URL`
- [ ] Try to start app
- [ ] Validation error shown
- [ ] Error message is clear

**All Variables Present:**

- [ ] All required variables set
- [ ] App starts successfully
- [ ] No validation errors

---

## Automated Testing

### Unit Tests ✅

```bash
npm test
```

- [ ] All unit tests pass
- [ ] Coverage meets threshold (if configured)

### Type Checking ✅

```bash
npm run type-check
```

- [ ] No TypeScript errors
- [ ] All types correct

### Linting ✅

```bash
npm run lint
```

- [ ] No linting errors
- [ ] Code follows style guide

### Build ✅

```bash
npm run build
```

- [ ] Build succeeds
- [ ] No build-time errors
- [ ] Production build optimized

---

## Integration Testing

### API Integration ✅

- [ ] All API endpoints respond correctly
- [ ] Error handling works
- [ ] Rate limiting works
- [ ] Authentication works

### Database Integration ✅

- [ ] Queries execute correctly
- [ ] Transactions work
- [ ] Migrations applied
- [ ] RLS policies work

### External Services ✅

- [ ] Clerk integration works
- [ ] Supabase integration works
- [ ] Telebirr integration works (sandbox)
- [ ] Sentry integration works
- [ ] Redis integration works (if configured)

---

## End-to-End Testing

### User Flows ✅

**Sign Up → Browse → Purchase:**

- [ ] User signs up
- [ ] User browses products
- [ ] User initiates payment
- [ ] Payment completes
- [ ] User receives product/confirmation

**Admin Flow:**

- [ ] Admin signs in
- [ ] Admin views dashboard
- [ ] Admin creates product
- [ ] Admin views analytics

### Cross-Browser Testing ✅

- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)
- [ ] Mobile Safari (iOS)
- [ ] Chrome Mobile (Android)

### Performance Testing ✅

- [ ] Page load time < 3 seconds
- [ ] API response time < 500ms (p95)
- [ ] No memory leaks
- [ ] Smooth animations

---

## Security Testing

### Input Validation ✅

- [ ] SQL injection attempts blocked
- [ ] XSS attempts blocked
- [ ] CSRF protection works
- [ ] File upload validation (if applicable)

### Authentication & Authorization ✅

- [ ] Unauthenticated users can't access protected routes
- [ ] Users can't access other users' data
- [ ] Admin-only routes protected
- [ ] Session expires correctly

### Headers & Policies ✅

- [ ] Security headers present
- [ ] CSP prevents XSS
- [ ] CORS configured correctly
- [ ] HSTS enabled (if HTTPS)

---

## Documentation

- [ ] All new features documented
- [ ] API endpoints documented
- [ ] Environment variables documented
- [ ] Deployment process documented
- [ ] Troubleshooting guide updated

---

## Sign-Off

**Tester Name:** **\*\*\*\***\_**\*\*\*\***

**Date:** **\*\*\*\***\_**\*\*\*\***

**Overall Status:**

- [ ] All tests passed
- [ ] Ready for staging deployment
- [ ] Issues found (document below)

**Issues Found:**

1.
2.
3.

---

## Next Steps

After completing this checklist:

1. ✅ Fix any issues found
2. ✅ Re-test failed items
3. ✅ Deploy to staging (see `STAGING_DEPLOYMENT_GUIDE.md`)
4. ✅ Perform staging testing
5. ✅ Deploy to production
