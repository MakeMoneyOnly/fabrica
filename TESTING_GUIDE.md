# Testing Guide for Audit Fixes

This guide will help you test all the implementations from the audit fixes.

## Prerequisites

Before testing, ensure you have:

1. All environment variables configured (see `ENV_SETUP.md`)
2. Supabase database running and accessible
3. Clerk account set up with webhook endpoint configured
4. Development server running: `npm run dev`

## Phase 1: Foundation Critical Fixes

### 1.1 Test Clerk Webhook Handler

**Test User Creation:**

1. Go to Clerk Dashboard → Webhooks
2. Find your webhook endpoint: `https://your-domain.com/api/webhooks/clerk`
3. Click "Send test event" → Select "user.created"
4. Check Supabase database:
   ```sql
   SELECT * FROM users ORDER BY created_at DESC LIMIT 1;
   ```
5. Verify user was created with correct email, phone, and name

**Test User Update:**

1. Update a user in Clerk Dashboard (change email or name)
2. Check Supabase database for updated record
3. Verify changes are synced

**Test User Deletion:**

1. Delete a user in Clerk Dashboard
2. Check logs (user.deleted event should be logged)

### 1.2 Test Currency Formatting

**Test in Browser Console:**

```javascript
// Import the function (adjust path as needed)
import { formatETB } from '@/lib/utils/currency'

// Test cases
formatETB(299.99) // Should return "ETB 299.99" (not "ETB 2.99")
formatETB(1000) // Should return "ETB 1,000.00"
formatETB(0.5) // Should return "ETB 0.50"
```

**Run Unit Tests:**

```bash
npm test -- currency.test.ts
```

### 1.3 Test Authentication

**Test Sign In:**

1. Navigate to your app
2. Click "Sign In" button
3. Complete Clerk sign-in flow
4. Check browser console for user data
5. Verify `useAuth()` hook returns correct user object

**Test Sign Out:**

1. While signed in, call `signOut()` from `useAuth()` hook
2. Verify `isAuthenticated` becomes `false`
3. Verify user is redirected or UI updates

**Test Protected Routes:**

1. Try accessing a protected route while not signed in
2. Verify redirect to sign-in page
3. Sign in and verify access granted

### 1.4 Test Security Headers

**Using Browser DevTools:**

1. Open your app in browser
2. Open DevTools → Network tab
3. Reload page
4. Click on any request (e.g., document request)
5. Check Response Headers:
   - `Content-Security-Policy` should be present
   - `X-Frame-Options: SAMEORIGIN`
   - `X-Content-Type-Options: nosniff`
   - `Referrer-Policy: strict-origin-when-cross-origin`

**Using curl:**

```bash
curl -I http://localhost:3000
```

## Phase 2: Validation & Security

### 2.1 Test Input Validation

**Test Payment API Validation:**

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

# Invalid request (should return 400)
curl -X POST http://localhost:3000/api/payments/initiate \
  -H "Content-Type: application/json" \
  -d '{
    "productId": "invalid",
    "customerEmail": "not-an-email",
    "customerPhone": "123"
  }'
```

### 2.2 Test Rate Limiting

**Note:** Rate limiting requires Upstash Redis. If not configured, it will be disabled.

**Test Rate Limit:**

```bash
# Make multiple rapid requests
for i in {1..10}; do
  curl http://localhost:3000/api/health
done

# After limit exceeded, should get 429 status
# Check response headers for:
# X-RateLimit-Limit
# X-RateLimit-Remaining
# X-RateLimit-Reset
```

### 2.3 Test Error Handling

**Test API Error Responses:**

```bash
# Test 404 error
curl http://localhost:3000/api/products/non-existent-id

# Should return:
# {
#   "success": false,
#   "error": {
#     "code": "NOT_FOUND",
#     "message": "Resource not found"
#   },
#   "meta": {
#     "timestamp": "..."
#   }
# }
```

## Phase 3: High Priority Fixes

### 3.1 Test Header Component

1. Navigate to homepage
2. Check navigation links:
   - When not signed in: Features, Pricing, About, Contact
   - When signed in: Dashboard, Products, Analytics, Settings
3. Check footer contact info uses constants (not hardcoded)
4. Test mobile menu (should match desktop navigation)

### 3.2 Test Stats Section

1. Navigate to homepage
2. Check stats section displays:
   - Real numbers from database (or 0 if no data)
   - Loading state while fetching
   - Error state if API fails
3. Verify copy is Fabrica-specific (not placeholder text)

**Test Stats API:**

```bash
curl http://localhost:3000/api/stats

# Should return:
# {
#   "success": true,
#   "data": {
#     "totalProducts": 0,
#     "totalOrders": 0,
#     "totalRevenue": 0,
#     "activeCreators": 0
#   }
# }
```

### 3.3 Test Sentry Integration

**Trigger Test Error:**

1. Create test route: `src/app/api/test-sentry/route.ts`
   ```typescript
   export async function GET() {
     throw new Error('Test Sentry error')
   }
   ```
2. Visit `/api/test-sentry` in browser
3. Check Sentry dashboard (should see error within seconds)
4. Delete test route after verification

### 3.4 Test Health Check Endpoint

```bash
curl http://localhost:3000/api/health

# Should return:
# {
#   "status": "healthy" | "degraded" | "unhealthy",
#   "timestamp": "...",
#   "services": {
#     "database": { "status": "up", "responseTime": 123 },
#     "storage": { "status": "up" },
#     "auth": { "status": "up" }
#   }
# }
```

### 3.5 Test Phone Validation

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

### 3.6 Test React Query

1. Check browser console for React Query DevTools (if installed)
2. Verify queries are cached (check Network tab - should see cached responses)
3. Test stats hook:

   ```typescript
   import { useStats } from '@/hooks/useAnalytics'

   function TestComponent() {
     const { data, isLoading } = useStats()
     // Should fetch and cache stats
   }
   ```

## Phase 4: Telebirr Payment Integration

### 4.1 Test Telebirr SDK

**Note:** Requires Telebirr sandbox credentials.

**Test Signature Generation:**

```typescript
import { getTelebirrClient } from '@/lib/payments/telebirr'

const client = getTelebirrClient()
// Signature generation is tested internally
```

**Test Payment Initiation:**

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

console.log(result) // Should have paymentUrl or error
```

### 4.2 Test Payment Initiation API

```bash
# Create a product first (or use existing product ID)
curl -X POST http://localhost:3000/api/payments/initiate \
  -H "Content-Type: application/json" \
  -d '{
    "productId": "your-product-uuid",
    "customerEmail": "customer@example.com",
    "customerName": "Customer Name",
    "customerPhone": "+251912345678"
  }'

# Should return payment URL or error
```

### 4.3 Test Telebirr Webhook

**Note:** Requires webhook URL to be publicly accessible (use ngrok for local testing).

**Test Webhook Signature Verification:**

1. Send test webhook from Telebirr dashboard
2. Check logs for signature verification
3. Verify order status updates in database

**Test Payment Success:**

1. Complete a test payment in Telebirr sandbox
2. Check webhook receives success event
3. Verify order status changes to 'completed'
4. Check download link created (for digital products)

## Phase 5: Environment Validation

### Test Environment Validation

**Test Missing Variables:**

1. Remove a required env var from `.env.local`
2. Try to start the app: `npm run dev`
3. Should see clear error message listing missing variables

**Test Invalid Variables:**

1. Set an invalid URL format for `NEXT_PUBLIC_SUPABASE_URL`
2. Try to start the app
3. Should see validation error

## Automated Testing

### Run All Tests

```bash
# Run unit tests
npm test

# Run type checking
npm run type-check

# Run linting
npm run lint

# Build (catches build-time errors)
npm run build
```

## Manual Testing Checklist

- [ ] Clerk webhook syncs users to database
- [ ] Currency formatting displays correct amounts
- [ ] Authentication works with Clerk
- [ ] Security headers present in responses
- [ ] Input validation rejects invalid data
- [ ] Rate limiting works (if Upstash configured)
- [ ] Error handling returns standardized format
- [ ] Header shows correct navigation
- [ ] Stats section shows real data
- [ ] Health check endpoint works
- [ ] Phone validation works
- [ ] React Query caches data
- [ ] Telebirr payment initiation works
- [ ] Telebirr webhook processes payments
- [ ] Environment validation catches missing vars

## Troubleshooting

### Common Issues

**Clerk Webhook Not Working:**

- Check webhook URL is publicly accessible
- Verify `CLERK_WEBHOOK_SECRET` matches Clerk dashboard
- Check Supabase RPC function exists: `create_user_with_referral`

**Rate Limiting Not Working:**

- Verify Upstash Redis credentials are set
- Check Redis connection in Upstash dashboard
- Rate limiting is optional - app works without it

**Sentry Not Capturing Errors:**

- Verify `SENTRY_DSN` is set
- Check Sentry dashboard for project status
- Errors still logged to console if Sentry fails

**Telebirr Integration Issues:**

- Verify all Telebirr env vars are set
- Check Telebirr sandbox is accessible
- Review Telebirr API documentation for changes

## Next Steps

After testing:

1. Fix any issues found
2. Update documentation with findings
3. Set up production environment variables
4. Deploy to staging for integration testing
5. Set up monitoring and alerts
