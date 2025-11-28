# Clerk + Supabase Integration - Quick Start

## 🚀 Quick Setup (15 minutes)

### 1. Activate Clerk Integration

- Go to https://dashboard.clerk.com/setup/supabase
- Click "Activate Supabase integration"
- Copy your Clerk domain

### 2. Configure Supabase

- Go to Supabase Dashboard → Authentication → Third-Party Auth
- Add Clerk as a provider
- Paste your Clerk domain

### 3. Run SQL Script

- Open Supabase SQL Editor
- Run `scripts/configure-clerk-supabase.sql`

### 4. Test

```bash
npm run dev
```

- Sign in
- Upload avatar
- Save profile

✅ **Done!** No "row-level security policy" errors = success!

## 📚 Documentation

- **Full Guide:** [`docs/CLERK_SUPABASE_INTEGRATION.md`](./CLERK_SUPABASE_INTEGRATION.md)
- **Checklist:** [`docs/CLERK_SUPABASE_CHECKLIST.md`](./CLERK_SUPABASE_CHECKLIST.md)
- **Migration Info:** [`docs/CLERK_SUPABASE_MIGRATION.md`](./CLERK_SUPABASE_MIGRATION.md)

## 🔧 How It Works

```tsx
// In your component
import { useSupabaseClient } from '@/hooks/useSupabaseClient'

function MyComponent() {
  const supabase = useSupabaseClient()

  // Session token is automatically included in all requests
  const { data } = await supabase.from('users').select('*')
}
```

## ❓ Troubleshooting

**Error: "row-level security policy"**

- Verify Clerk integration is "Active" in Clerk Dashboard
- Check Clerk appears in Supabase third-party auth providers
- Re-run SQL script

**See full troubleshooting guide:** [`docs/CLERK_SUPABASE_INTEGRATION.md`](./CLERK_SUPABASE_INTEGRATION.md#troubleshooting)

## 🎯 What This Fixes

- ✅ Avatar uploads work with proper authentication
- ✅ Profile saves work with RLS protection
- ✅ No need to share JWT secrets
- ✅ Automatic token refresh
- ✅ Modern, supported approach (no deprecated JWT templates)
