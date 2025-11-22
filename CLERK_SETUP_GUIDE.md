# Clerk Authentication Setup Guide

This guide will help you configure Clerk authentication so the "Build Your Store" button works properly.

## Step 1: Create a Clerk Account

1. Go to [Clerk Dashboard](https://dashboard.clerk.com/)
2. Sign up for a free account (or sign in if you already have one)
3. Click **"Create Application"**

## Step 2: Create Your Application

1. **Application Name**: Enter a name (e.g., "Fabrica" or "Fabrica Dev")
2. **Authentication Methods**: Select your preferred methods:
   - ✅ Email (recommended)
   - ✅ Phone (optional)
   - ✅ Google (optional)
   - ✅ Other social providers (optional)
3. Click **"Create Application"**

## Step 3: Get Your API Keys

1. Once your application is created, you'll be taken to the dashboard
2. In the left sidebar, click **"API Keys"**
3. You'll see two keys:

   **Publishable Key** (starts with `pk_test_` or `pk_live_`):

   ```
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   ```

   **Secret Key** (starts with `sk_test_` or `sk_live_`):

   ```
   CLERK_SECRET_KEY=sk_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   ```

4. **Copy both keys** - you'll need them in the next step

## Step 4: Configure Environment Variables

1. Open your `.env.local` file in the project root
2. Add or update these three variables:

```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your_publishable_key_here
CLERK_SECRET_KEY=sk_test_your_secret_key_here
CLERK_WEBHOOK_SECRET=whsec_your_webhook_secret_here
```

**Important Notes:**

- Replace `your_publishable_key_here` with your actual Publishable Key
- Replace `your_secret_key_here` with your actual Secret Key
- For `CLERK_WEBHOOK_SECRET`, see Step 5 below

## Step 5: Set Up Webhook (Optional but Recommended)

Webhooks allow your app to sync user data with your database when users sign up.

### For Local Development:

1. Install ngrok (if you don't have it):

   ```bash
   npm install -g ngrok
   ```

2. Start your Next.js dev server:

   ```bash
   npm run dev
   ```

3. In another terminal, expose your local server:

   ```bash
   ngrok http 3000
   ```

4. Copy the HTTPS URL (e.g., `https://abc123.ngrok.io`)

5. In Clerk Dashboard → **Webhooks** → **Add Endpoint**:
   - **Endpoint URL**: `https://your-ngrok-url.ngrok.io/api/webhooks/clerk`
   - **Subscribe to events**:
     - ✅ `user.created`
     - ✅ `user.updated`
     - ✅ `user.deleted`
   - Click **"Create"**

6. Copy the **Signing Secret** (starts with `whsec_`) and add it to `.env.local`:
   ```env
   CLERK_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   ```

### For Production/Staging:

1. In Clerk Dashboard → **Webhooks** → **Add Endpoint**
2. **Endpoint URL**: `https://your-domain.com/api/webhooks/clerk`
3. Subscribe to the same events as above
4. Copy the Signing Secret and add it to your environment variables

## Step 6: Configure Allowed Origins

1. In Clerk Dashboard, go to **Settings** → **Paths**
2. Add your allowed origins:
   - For local development: `http://localhost:3000`
   - For staging: `https://your-staging-domain.com`
   - For production: `https://your-production-domain.com`

## Step 7: Verify Configuration

1. **Restart your development server**:

   ```bash
   # Stop the server (Ctrl+C) and restart
   npm run dev
   ```

2. **Test the button**:
   - Go to `http://localhost:3000`
   - Click the **"Build Your Store"** button
   - You should see Clerk's authentication modal

3. **Verify environment variables** (optional):
   ```bash
   npm run verify:env
   ```

## Step 8: Test Authentication Flow

1. Click **"Build Your Store"** button
2. You should see Clerk's sign-up/sign-in modal
3. Create a test account:
   - Enter your email
   - Verify your email (check your inbox)
   - Complete the sign-up process
4. After signing in, clicking the button should redirect you to `/dashboard`

## Troubleshooting

### Button shows "Authentication not configured"

- Check that `.env.local` exists in the project root
- Verify the keys are correctly formatted (no extra spaces, quotes, etc.)
- Make sure keys start with `pk_test_` or `pk_live_` (publishable) and `sk_test_` or `sk_live_` (secret)
- Restart your dev server after adding environment variables

### "useUser can only be used within ClerkProvider" error

- This means ClerkProvider isn't wrapping your app
- Check that `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` is set correctly
- The key must be at least 20 characters and start with `pk_test_` or `pk_live_`
- Restart your dev server

### Modal doesn't appear

- Check browser console for errors
- Verify Clerk keys are correct
- Make sure `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` is set (note the `NEXT_PUBLIC_` prefix)
- Check that your domain is in Clerk's allowed origins

### Webhook not working

- For local development, use ngrok or similar tunneling service
- Verify the webhook URL is accessible (not behind a firewall)
- Check that `CLERK_WEBHOOK_SECRET` matches the secret in Clerk dashboard
- Check server logs for webhook errors

## Quick Reference

**Required Environment Variables:**

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
CLERK_WEBHOOK_SECRET=whsec_...  # Optional but recommended
```

**Clerk Dashboard Links:**

- Dashboard: https://dashboard.clerk.com/
- API Keys: https://dashboard.clerk.com/last-active?path=api-keys
- Webhooks: https://dashboard.clerk.com/last-active?path=webhooks
- Settings: https://dashboard.clerk.com/last-active?path=settings

## Next Steps

Once Clerk is configured:

1. ✅ "Build Your Store" button will show authentication modal
2. ✅ Users can sign up/sign in
3. ✅ Authenticated users are redirected to dashboard
4. ✅ User data syncs to Supabase (if webhook is configured)

For more information, see:

- [Clerk Documentation](https://clerk.com/docs)
- [ENV_SETUP.md](./ENV_SETUP.md) - Full environment setup guide
- [CONFIGURATION_GUIDE.md](./CONFIGURATION_GUIDE.md) - Complete configuration guide
