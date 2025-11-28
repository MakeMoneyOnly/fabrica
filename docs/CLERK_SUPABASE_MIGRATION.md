# Migration Summary: JWT Templates → Native Integration

## What Changed

Your Clerk-Supabase integration has been updated from the **deprecated JWT template approach** to the **modern native integration approach**.

## Files Modified

### 1. `src/lib/supabase/client.ts`

**Before:** Accepted a JWT token string

```typescript
export function createClient(supabaseToken?: string)
```

**After:** Accepts a token getter function

```typescript
export function createClient(getToken?: () => Promise<string | null>)
```

### 2. `src/hooks/useSupabaseClient.ts`

**Before:** Used `useAuth()` and `getToken({ template: 'supabase' })`

```typescript
const { getToken } = useAuth()
const token = await getToken({ template: 'supabase' })
```

**After:** Uses `useSession()` and `session.getToken()`

```typescript
const { session } = useSession()
return createSupabaseClient(async () => session.getToken())
```

### 3. `scripts/configure-clerk-supabase.sql`

**Updated:** Instructions now reference the native integration setup instead of JWT templates.

### 4. `docs/CLERK_SUPABASE_INTEGRATION.md`

**Updated:** Complete rewrite to reflect the modern approach.

### 5. `docs/CLERK_SUPABASE_CHECKLIST.md`

**Updated:** Checklist now covers native integration steps.

## Setup Steps Required

### Step 1: Activate Clerk Integration (5 minutes)

1. Go to [Clerk Dashboard → Supabase Integration](https://dashboard.clerk.com/setup/supabase)
2. Click **"Activate Supabase integration"**
3. Copy your **Clerk domain** (e.g., `https://your-app.clerk.accounts.dev`)

### Step 2: Configure Supabase (2 minutes)

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Navigate to **Authentication** → **Third-Party Auth**
3. Click **"Add provider"** → Select **"Clerk"**
4. Paste your **Clerk domain**
5. Click **"Save"**

### Step 3: Run SQL Script (1 minute)

1. Go to **Supabase Dashboard** → **SQL Editor**
2. Open `scripts/configure-clerk-supabase.sql`
3. Copy and paste the entire script
4. Click **"Run"**

### Step 4: Test (5 minutes)

1. Run `npm run dev`
2. Sign in with Clerk
3. Navigate to onboarding
4. Upload an avatar
5. Save your profile

✅ If both work without "row-level security policy" errors, you're done!

## Key Benefits

| Aspect               | Old (JWT Template)                    | New (Native Integration)    |
| -------------------- | ------------------------------------- | --------------------------- |
| **Setup Complexity** | High (create template, share secrets) | Low (activate integration)  |
| **Security**         | Share Supabase JWT secret with Clerk  | No secrets shared           |
| **Token Management** | Manual token fetching                 | Automatic with session      |
| **Code Complexity**  | `getToken({ template: 'supabase' })`  | `session.getToken()`        |
| **Maintenance**      | Deprecated (will stop working)        | Supported (modern approach) |

## What You Don't Need Anymore

- ❌ JWT template named "supabase" in Clerk Dashboard
- ❌ Supabase JWT Secret shared with Clerk
- ❌ Custom signing key configuration
- ❌ Manual token refresh logic

## Troubleshooting

### If you see "row-level security policy" errors:

1. **Check Clerk Integration:**
   - Go to Clerk Dashboard → Integrations
   - Verify Supabase shows "Active"

2. **Check Supabase Configuration:**
   - Go to Supabase Dashboard → Authentication → Third-Party Auth
   - Verify Clerk is listed as a provider

3. **Check RLS Policies:**
   - Run the verification queries in `configure-clerk-supabase.sql`
   - Ensure policies exist for both `users` table and `storage.objects`

4. **Check Session:**
   - Open browser DevTools
   - Run: `await window.Clerk?.session?.getToken()`
   - Should return a JWT token string

### If uploads work but saves don't:

- Check that `users` table has `clerk_user_id` column (TEXT type)
- Verify the column matches the Clerk user ID
- Re-run the SQL script

## Testing Checklist

- [ ] Clerk integration shows "Active" in Clerk Dashboard
- [ ] Clerk appears in Supabase third-party auth providers
- [ ] SQL script ran without errors
- [ ] Can sign in with Clerk
- [ ] Can upload avatar without errors
- [ ] Can save profile without errors
- [ ] Data appears in Supabase tables
- [ ] No console errors

## Next Steps

Once the integration is working:

1. **Remove old JWT template** (if you created one):
   - Go to Clerk Dashboard → JWT Templates
   - Delete the "supabase" template (no longer needed)

2. **Implement additional features**:
   - Add RLS policies for other tables
   - Set up webhooks for user synchronization
   - Implement file uploads for products

3. **Review security**:
   - Audit RLS policies
   - Test with multiple users
   - Verify data isolation

## Documentation

- 📖 Full Guide: `docs/CLERK_SUPABASE_INTEGRATION.md`
- ✅ Checklist: `docs/CLERK_SUPABASE_CHECKLIST.md`
- 🗄️ SQL Script: `scripts/configure-clerk-supabase.sql`

## Support

If you encounter issues:

1. Check the browser console for errors
2. Check Supabase logs (Dashboard → Logs)
3. Review the troubleshooting section in `CLERK_SUPABASE_INTEGRATION.md`
4. Verify all environment variables are set correctly

---

**Migration completed!** Your integration now uses the modern, supported approach. 🎉
