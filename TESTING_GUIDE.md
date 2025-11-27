# Testing Guide for Phase 1.2 Onboarding Features

## 1. Environment Setup (5 minutes)

### Add the Encryption Key

Add this to your `.env.local` file:

```env
# Encryption key for sensitive data (payment accounts)
ENCRYPTION_KEY=654ea2e9d60aeb3e756a771abd0a0ae7fd3b76aad4dc2b907afbedffdf5fb732
```

**Important:** This key was generated using Node's crypto module. It's a 64-character hex string (32 bytes). Keep this secret and never commit it to git!

### Verify Other Required Environment Variables

Make sure you have these in `.env.local`:

```env
# Clerk (should already be set)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
CLERK_WEBHOOK_SECRET=whsec_...

# Supabase (should already be set)
NEXT_PUBLIC_SUPABASE_URL=https://...
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...

# Resend (should already be set)
RESEND_API_KEY=re_...

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## 2. Start the Development Server

```bash
npm run dev
```

The app should start at `http://localhost:3000`

## 3. Testing the Onboarding Flow

### Prerequisites

- Clear your browser's local storage for localhost:3000
- Sign out of Clerk if you're already signed in

### Step-by-Step Testing

#### Test 1: Sign Up & Username Selection

1. Go to `http://localhost:3000`
2. Click "Sign Up" or navigate to the sign-up page
3. Create a new account with Clerk (use email or phone)
4. You should be redirected to `/onboarding`

**Test Username Step:**

- Try entering an invalid username (e.g., `123abc`, `_test`, `ab`)
  - Should show validation errors
- Enter a valid username (e.g., `testuser123`)
  - Should show a checkmark when available
  - Should show an X and suggestions if taken
- Click "Continue"
  - Should save to Supabase and move to Step 2

**Verify in Supabase:**

- Go to your Supabase dashboard
- Check the `users` table
- Your user should have the username you entered

#### Test 2: Profile Setup

**Test Avatar Upload:**

1. Click "Upload Photo"
2. Try uploading a large file (>5MB)
   - Should show error message
3. Try uploading a non-image file
   - Should show error message
4. Upload a valid image (JPG/PNG, <5MB)
   - Should show preview
   - Should upload to Supabase Storage

**Test Form Fields:**

1. Enter your full name (required)
2. Enter a bio (optional, max 500 chars)
3. Add social media links (optional)
   - Try invalid URLs - should show errors
   - Enter valid Instagram/TikTok/Facebook/Twitter URLs

4. Click "Continue"

**Verify in Supabase:**

- Check `users` table - should have `full_name`, `bio`, `avatar_url`, `social_links`
- Check Storage bucket `user-uploads/avatars/` - should have your uploaded image

#### Test 3: Payment Account

**Test Telebirr Account:**

1. Enter account holder name
2. Enter phone number:
   - Try invalid format (e.g., `123`) - should show error
   - Try valid format (e.g., `911234567`) - should accept
3. Click "Continue"

**Verify in Supabase:**

- Check `users` table
- Look at `payment_account` column
- The `encrypted_account_number` should be encrypted (not readable)
- The `account_name` should be plain text

**Test Skip Option:**

- Click "Skip for now" instead
- Should move to next step without saving payment info

#### Test 4: Create First Product

**Test Product Type Selection:**

1. Click each product type (Digital, Booking, Link)
   - Should highlight the selected type

**Test Form:**

1. Enter product title (required)
2. Enter description (optional)
3. Enter price:
   - Try less than 10 - should show error
   - Enter valid price (e.g., `99.99`)
4. Click "Continue"

**Verify in Supabase:**

- Check `products` table
- Should have your product with:
  - `creator_id` matching your user
  - `type`, `title`, `description`, `price`
  - `is_active` = true

**Test Skip Option:**

- Click "Skip for now"
- Should move to preview without creating product

#### Test 5: Preview & Launch

**Verify Preview:**

1. Should show your avatar (if uploaded)
2. Should show your name and username
3. Should show your bio
4. Should show your product (if created)
5. Should show your storefront URL

**Test Launch:**

1. Click "Launch My Store!"
2. Should mark onboarding as complete in Supabase
3. Should redirect to `/dashboard`

**Verify in Supabase:**

- Check `users` table
- `onboarding_completed` should be `true`
- `onboarding_completed_at` should have a timestamp

## 4. Testing Navigation

### Test Back Button

1. Start onboarding again (clear local storage)
2. Go through steps 1-3
3. Click "Back" button
4. Should navigate to previous step
5. Data should be preserved in the form

### Test Direct URL Access

1. Try accessing `/onboarding` when already completed
   - Should redirect to dashboard (if middleware is configured)
2. Try accessing individual steps directly
   - Should work if onboarding not complete

## 5. Testing Edge Cases

### Test Username Availability

1. Create a user with username `testuser1`
2. Sign out and create another account
3. Try using `testuser1` again
   - Should show "Username is already taken"
   - Should show suggestions like `testuser11`, `testuser1_official`

### Test Avatar Upload Errors

1. Disconnect internet
2. Try uploading avatar
   - Should show error message
3. Reconnect and try again
   - Should work

### Test Form Validation

1. Leave required fields empty
2. Try to continue
   - Should show validation errors
3. Fill fields with invalid data
   - Should show specific error messages

## 6. Testing Email Functionality

### Test Welcome Email

1. Create a new user account
2. Check your email (or Resend dashboard in test mode)
3. Should receive welcome email with:
   - Personalized greeting
   - Onboarding link
   - Help center link

**Note:** In test mode, emails go to `onboarding@resend.dev` and can be viewed in Resend dashboard.

## 7. Debugging Tips

### Check Browser Console

- Open DevTools (F12)
- Look for errors in Console tab
- Check Network tab for failed API calls

### Check Supabase Logs

- Go to Supabase Dashboard > Logs
- Check for any database errors
- Verify RLS policies allow operations

### Check Server Logs

- Look at your terminal where `npm run dev` is running
- Should show API calls and any server errors

### Common Issues

**"Failed to save" errors:**

- Check Supabase connection
- Verify environment variables
- Check RLS policies

**Avatar upload fails:**

- Verify Supabase Storage bucket `user-uploads` exists
- Check bucket permissions/RLS policies

**Encryption errors:**

- Verify `ENCRYPTION_KEY` is set in `.env.local`
- Key should be 64 characters (hex)

**Username not saving:**

- Check Clerk webhook is configured
- Verify `CLERK_WEBHOOK_SECRET` is correct

## 8. Quick Test Checklist

- [ ] Environment variables set (especially `ENCRYPTION_KEY`)
- [ ] Dev server running (`npm run dev`)
- [ ] Can sign up with Clerk
- [ ] Username step works and saves to Supabase
- [ ] Avatar upload works
- [ ] Profile data saves to Supabase
- [ ] Payment account encrypts and saves
- [ ] Product creation works
- [ ] Preview shows all data correctly
- [ ] Launch completes onboarding
- [ ] Redirects to dashboard
- [ ] Data persists in Supabase

## 9. No Remote Push Needed!

You can test everything locally:

- ✅ All features work on `localhost:3000`
- ✅ Supabase is already remote (cloud database)
- ✅ Clerk is already remote (cloud auth)
- ✅ No need to deploy to test

**When to push remotely:**

- After local testing is successful
- When you want to test on staging environment
- Before merging to main branch

## 10. Next Steps After Testing

Once testing is complete:

```bash
# Commit any fixes
git add .
git commit -m "fix: address testing feedback"

# Push to remote
git push origin feature/phase-1.2-user-auth-onboarding

# Create pull request for review
# Merge to staging for team testing
# Deploy to production after approval
```
