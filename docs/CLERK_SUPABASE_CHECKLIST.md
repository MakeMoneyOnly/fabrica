# Clerk + Supabase Integration Checklist (Modern Approach)

Use this checklist to ensure you've completed all steps for the native Clerk-Supabase integration.

## ✅ Pre-Integration Checklist

- [ ] Clerk is set up and working (users can sign in/up)
- [ ] Supabase project is created
- [ ] Environment variables are configured in `.env.local`:
  - [ ] `NEXT_PUBLIC_SUPABASE_URL`
  - [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - [ ] `SUPABASE_SERVICE_ROLE_KEY`
  - [ ] `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
  - [ ] `CLERK_SECRET_KEY`

## ✅ Clerk Configuration (Native Integration)

- [ ] Logged into Clerk Dashboard
- [ ] Navigated to Integrations → Supabase (or https://dashboard.clerk.com/setup/supabase)
- [ ] Clicked "Activate Supabase integration"
- [ ] Copied Clerk domain (e.g., `https://your-app.clerk.accounts.dev`)
- [ ] Integration shows as "Active" in Clerk Dashboard

## ✅ Supabase Configuration

### Third-Party Auth Setup

- [ ] Opened Supabase Dashboard
- [ ] Navigated to Authentication → Third-Party Auth (or Sign In / Up)
- [ ] Clicked "Add provider"
- [ ] Selected "Clerk" from the provider list
- [ ] Pasted Clerk domain from Clerk Dashboard
- [ ] Saved the configuration
- [ ] Clerk appears in the list of third-party auth providers

### SQL Script Execution

- [ ] Opened Supabase Dashboard → SQL Editor
- [ ] Ran `scripts/configure-clerk-supabase.sql`
- [ ] Script executed without errors
- [ ] Verified policies created (see verification queries below)

## ✅ Code Integration

- [ ] `src/lib/supabase/client.ts` updated to use `session.getToken()` approach
- [ ] `src/hooks/useSupabaseClient.ts` updated to use `useSession()` hook
- [ ] `src/components/onboarding/AvatarUpload.tsx` uses `useSupabaseClient()`
- [ ] `src/components/onboarding/step-profile.tsx` uses `useSupabaseClient()`
- [ ] No references to deprecated `getToken({ template: 'supabase' })`

## ✅ Testing

### Basic Functionality

- [ ] Started dev server (`npm run dev`)
- [ ] Signed in with Clerk
- [ ] Session is active (check with Clerk DevTools if available)

### Avatar Upload Test

- [ ] Navigated to onboarding flow
- [ ] Selected an image file
- [ ] Upload started (loading indicator appears)
- [ ] **No "row-level security policy" error**
- [ ] Image uploaded successfully
- [ ] Public URL generated and displayed
- [ ] Image appears in Supabase Storage → avatars bucket
- [ ] Filename starts with Clerk user ID

### Profile Save Test

- [ ] Filled in profile form (name, bio, social links)
- [ ] Clicked "Continue" button
- [ ] **No "row-level security policy" error**
- [ ] Form submitted successfully
- [ ] Navigated to next onboarding step
- [ ] Data appears in Supabase → users table
- [ ] `clerk_user_id` matches Clerk user ID

### Console Verification

- [ ] Opened browser DevTools (F12)
- [ ] No JWT-related errors in console
- [ ] Saw "Upload successful" message
- [ ] Saw "Profile saved successfully" message
- [ ] No authentication errors

## ✅ Verification Queries

Run these in Supabase SQL Editor to verify:

### Check Users Table Policies

```sql
SELECT schemaname, tablename, policyname, permissive, roles, cmd
FROM pg_policies
WHERE tablename = 'users'
ORDER BY policyname;
```

**Expected policies:**

- ✅ `Public can view user profiles` (SELECT, no role restriction)
- ✅ `Users can insert own profile` (INSERT, authenticated)
- ✅ `Users can update own profile` (UPDATE, authenticated)
- ✅ `Service role has full access` (ALL, service_role)

### Check Storage Policies

```sql
SELECT schemaname, tablename, policyname, permissive, roles, cmd
FROM pg_policies
WHERE tablename = 'objects'
ORDER BY policyname;
```

**Expected policies:**

- ✅ `Anyone can view avatars and covers` (SELECT, no role restriction)
- ✅ `Authenticated users can upload images` (INSERT, authenticated)
- ✅ `Users can update own images` (UPDATE, authenticated)
- ✅ `Users can delete own images` (DELETE, authenticated)
- ✅ `Service role has full storage access` (ALL, service_role)

### Check Buckets

```sql
SELECT id, name, public, file_size_limit, allowed_mime_types
FROM storage.buckets
WHERE id IN ('avatars', 'cover-images');
```

**Expected:**

- ✅ Both buckets exist
- ✅ Both are public
- ✅ File size limit: 5242880 (5MB)
- ✅ Allowed MIME types: `{image/*}`

### Test Auth Function (After Signing In)

```sql
SELECT auth.jwt();
```

**Expected:**

- ✅ Returns a JSON object
- ✅ Contains `"sub"` field with your Clerk user ID
- ✅ Contains `"role": "authenticated"`

## 🐛 Common Issues

### Issue: "new row violates row-level security policy"

**Possible Causes:**

- Clerk not configured as third-party auth provider in Supabase
- User not signed in
- RLS policies not created

**Fix:**

1. Verify Clerk appears in Supabase → Authentication → Third-Party Auth
2. Ensure user is signed in (check session in browser)
3. Re-run SQL script to create policies

### Issue: "Invalid JWT" or "JWT verification failed"

**Possible Causes:**

- Clerk domain not configured correctly in Supabase
- Session expired

**Fix:**

1. Verify Clerk domain in Supabase matches exactly
2. Sign out and sign in again
3. Check Clerk integration is "Active"

### Issue: Upload works but save fails

**Possible Causes:**

- Storage policies work but users table policies don't
- `clerk_user_id` column missing or incorrect

**Fix:**

1. Check `users` table has `clerk_user_id` column
2. Verify column type is TEXT
3. Re-run SQL script

### Issue: Supabase client not authenticated

**Possible Causes:**

- Session not loaded yet
- Using old JWT template approach

**Fix:**

1. Check you're using `useSession()` not `useAuth()`
2. Ensure no references to `getToken({ template: 'supabase' })`
3. Wait for session to load before making requests

## 📝 Key Differences from JWT Template Approach

### What Changed

- ❌ **Removed:** JWT template creation in Clerk
- ❌ **Removed:** Sharing Supabase JWT secret with Clerk
- ❌ **Removed:** `getToken({ template: 'supabase' })`
- ✅ **Added:** Native Supabase integration in Clerk Dashboard
- ✅ **Added:** Clerk as third-party auth provider in Supabase
- ✅ **Added:** Direct `session.getToken()` usage

### Benefits

- ✅ Simpler setup (no secrets to share)
- ✅ More secure (third-party auth protocol)
- ✅ Automatic token refresh with session
- ✅ No manual token fetching needed

## 📚 Additional Verification

### Check Clerk Dashboard

- [ ] Go to Clerk Dashboard → Integrations
- [ ] Supabase integration shows "Active" status
- [ ] Clerk domain is displayed

### Check Supabase Dashboard

- [ ] Go to Supabase Dashboard → Authentication → Third-Party Auth
- [ ] Clerk is listed as a provider
- [ ] Clerk domain is configured

### Check Code

- [ ] No files contain `getToken({ template: 'supabase' })`
- [ ] `useSupabaseClient()` uses `useSession()` hook
- [ ] `createClient()` accepts a function parameter for token

## ✅ Integration Complete!

Once all items are checked, your modern Clerk + Supabase integration is complete!

### What You Can Do Now

- ✅ Users can upload avatars with proper authentication
- ✅ Users can save profiles with RLS protection
- ✅ RLS policies recognize Clerk users via `auth.jwt()`
- ✅ No need to manage JWT templates or secrets
- ✅ Automatic token refresh with Clerk sessions

### Next Steps

- Implement additional RLS policies for other tables
- Add more user data synchronization via webhooks
- Implement file upload for other features (product images, etc.)
- Add server-side Supabase client for API routes
