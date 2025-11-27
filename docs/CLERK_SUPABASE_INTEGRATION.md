# Clerk + Supabase Integration Guide (Modern Approach)

This guide walks you through integrating Clerk authentication with Supabase using Clerk's **native third-party auth integration** (not the deprecated JWT template approach).

## Overview

This integration allows Supabase to recognize authenticated users from Clerk by:

1. Configuring Clerk as a third-party auth provider in Supabase
2. Using Clerk session tokens directly in Supabase requests
3. Setting up RLS policies that use `auth.jwt()` to access user information

**Benefits over the deprecated JWT template approach:**

- ✅ No need to share your Supabase JWT secret with Clerk
- ✅ No need to fetch a new token for each request
- ✅ Simpler setup and maintenance
- ✅ Better security

## Prerequisites

- ✅ Clerk application set up and working
- ✅ Supabase project created
- ✅ Environment variables configured in `.env.local`

## Step 1: Activate Clerk's Supabase Integration

### 1.1 In Clerk Dashboard

1. Go to [Clerk Dashboard](https://dashboard.clerk.com)
2. Select your application
3. Navigate to **Integrations** → **Supabase** (or visit https://dashboard.clerk.com/setup/supabase)
4. Click **Activate Supabase integration**
5. Copy your **Clerk domain** (it will look like `https://your-app.clerk.accounts.dev`)

### 1.2 In Supabase Dashboard

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Navigate to **Authentication** → **Third-Party Auth** (or **Sign In / Up**)
4. Click **Add provider**
5. Select **Clerk** from the list
6. Paste your **Clerk domain** from step 1.1
7. Click **Save**

That's it! Supabase can now verify Clerk session tokens automatically.

## Step 2: Run the Supabase Configuration Script

1. Go to your **Supabase Dashboard**
2. Navigate to **SQL Editor**
3. Click **+ New query**
4. Copy the entire contents of `scripts/configure-clerk-supabase.sql`
5. Paste it into the SQL editor
6. Click **Run** (or press Ctrl/Cmd + Enter)

This script will:

- Set up RLS policies on the `users` table
- Configure storage bucket policies for `avatars` and `cover-images`
- Enable proper authentication checks using `auth.jwt()`

## Step 3: Verify the Integration

### 3.1 Test in Your Application

1. Start your development server:

   ```bash
   npm run dev
   ```

2. Sign in with Clerk
3. Navigate to the onboarding flow
4. Try uploading an avatar image
5. Try saving your profile

### 3.2 Check Browser Console

Open your browser's Developer Tools (F12) and check the Console tab. You should see:

- "Uploading to path: [filename]" when uploading
- "Upload successful, public URL: [url]" after successful upload
- "Profile saved successfully" after saving profile
- **No "row-level security policy" errors**

### 3.3 Verify in Supabase

1. Go to **Supabase Dashboard** → **Table Editor** → **users**
2. You should see your user record with the profile data
3. Go to **Storage** → **avatars**
4. You should see your uploaded avatar image

## How It Works

### Client-Side Flow

1. User signs in with Clerk
2. Component calls `useSupabaseClient()` hook
3. Hook uses `useSession()` to get the Clerk session
4. For each Supabase request, `session.getToken()` is called
5. The session token is added to the request's `Authorization` header
6. Supabase verifies the token (because Clerk is configured as a third-party auth provider)
7. RLS policies can access `auth.jwt() ->> 'sub'` to get the Clerk user ID

### Code Example

```tsx
import { useSupabaseClient } from '@/hooks/useSupabaseClient'

function MyComponent() {
  const supabase = useSupabaseClient()

  const saveProfile = async () => {
    const { data, error } = await supabase
      .from('users')
      .update({ bio: 'New bio' })
      .eq('clerk_user_id', user.id)

    // The session token is automatically included
    // RLS policies can verify this is the correct user
  }
}
```

### RLS Policy Example

```sql
-- Only allow users to update their own profile
CREATE POLICY "Users can update own profile"
ON public.users
FOR UPDATE
TO authenticated
USING (auth.jwt() ->> 'sub' = clerk_user_id)
WITH CHECK (auth.jwt() ->> 'sub' = clerk_user_id);
```

This policy:

- `TO authenticated`: Only applies to authenticated requests
- `USING`: Checks if the current row belongs to the authenticated user
- `WITH CHECK`: Ensures the updated data still belongs to the authenticated user
- `auth.jwt() ->> 'sub'`: Extracts the Clerk user ID from the session token
- `clerk_user_id`: The column in your users table that stores the Clerk user ID

## Troubleshooting

### Error: "new row violates row-level security policy"

**Possible Causes:**

1. Clerk integration not activated in Supabase
2. Clerk domain not configured correctly
3. User not signed in
4. RLS policies not created correctly

**Solutions:**

1. Verify Clerk is listed in Supabase → Authentication → Third-Party Auth
2. Double-check the Clerk domain matches exactly
3. Ensure user is signed in before accessing protected resources
4. Re-run the SQL script to recreate policies

### Error: "Invalid JWT"

**Possible Causes:**

1. Clerk integration not properly configured in Supabase
2. Session token expired

**Solutions:**

1. Verify the Clerk domain in Supabase settings
2. Sign out and sign in again to get a fresh token
3. Check that the Clerk integration is "Active" in Clerk Dashboard

### Images upload but profile save fails

**Cause:** Storage policies are working but users table policies are not.

**Solutions:**

1. Verify the `users` table has a `clerk_user_id` column
2. Check that the RLS policies reference `clerk_user_id` correctly
3. Run the SQL script again to ensure all policies are created

### Supabase client returns null or undefined

**Cause:** Session not loaded yet.

**Solution:**
The `useSupabaseClient()` hook now returns a client immediately (either authenticated or unauthenticated). If you need to wait for authentication, check the session:

```tsx
import { useSession } from '@clerk/nextjs'
import { useSupabaseClient } from '@/hooks/useSupabaseClient'

function MyComponent() {
  const { session, isLoaded } = useSession()
  const supabase = useSupabaseClient()

  if (!isLoaded) {
    return <div>Loading...</div>
  }

  if (!session) {
    return <div>Please sign in</div>
  }

  // Now you can safely use supabase with authentication
}
```

## Key Differences from JWT Template Approach

| Aspect         | JWT Template (Deprecated)            | Native Integration (Current)            |
| -------------- | ------------------------------------ | --------------------------------------- |
| Setup          | Create JWT template in Clerk         | Activate integration in Clerk Dashboard |
| Secret Sharing | Share Supabase JWT secret with Clerk | No secrets shared                       |
| Token Fetching | `getToken({ template: 'supabase' })` | `session.getToken()`                    |
| Token Refresh  | Manual token refresh needed          | Automatic with session                  |
| Security       | Less secure (shared secret)          | More secure (third-party auth)          |

## Security Best Practices

1. **Always use RLS policies** - Never rely on client-side checks alone
2. **Use specific policies** - Create targeted policies for each table and operation
3. **Validate on both sides** - Use Zod schemas on the client AND database constraints
4. **Limit token lifetime** - Clerk sessions expire automatically
5. **Use service role sparingly** - Only use the service role key for admin operations and webhooks

## Additional Resources

- [Clerk Supabase Integration Docs](https://clerk.com/docs/integrations/databases/supabase)
- [Supabase Third-Party Auth](https://supabase.com/docs/guides/auth/third-party/overview)
- [Supabase RLS Documentation](https://supabase.com/docs/guides/auth/row-level-security)
- [Clerk Session Management](https://clerk.com/docs/guides/sessions/overview)

## Migration from JWT Templates

If you previously used JWT templates, here's what changed:

### Old Approach (Deprecated)

```tsx
import { useAuth } from '@clerk/nextjs'

const { getToken } = useAuth()
const token = await getToken({ template: 'supabase' })
const supabase = createClient(token)
```

### New Approach (Current)

```tsx
import { useSession } from '@clerk/nextjs'
import { useSupabaseClient } from '@/hooks/useSupabaseClient'

const supabase = useSupabaseClient()
// Token is automatically included in all requests
```

The new approach is simpler and more secure!

## Need Help?

If you're still experiencing issues:

1. Check the browser console for detailed error messages
2. Check the Supabase logs in Dashboard → Logs
3. Verify all environment variables are set correctly in `.env.local`
4. Ensure Clerk integration is "Active" in both Clerk and Supabase dashboards
