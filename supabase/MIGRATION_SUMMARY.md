# Database Migration Summary

## Migration File

`supabase/migrations/20251122143356_initial_schema.sql`

## What Was Implemented

### ✅ Core Tables (9 tables)

1. **users** - User profiles synced from Clerk
2. **products** - Product catalog (digital, booking, link types)
3. **orders** - Order transactions
4. **download_links** - Time-limited download access
5. **referrals** - Referral relationships
6. **referral_commissions** - Monthly payout records
7. **analytics_events** - Event tracking
8. **storefront_settings** - Creator customization
9. **moderation_flags** - Content moderation

### ✅ Indexes (25+ indexes)

- Performance indexes on all foreign keys
- Indexes on frequently queried fields (status, type, email, etc.)
- Composite indexes for complex queries

### ✅ Helper Functions

- `update_updated_at_column()` - Auto-update timestamps
- `generate_referral_code()` - Generate unique referral codes
- `generate_order_number()` - Generate unique order numbers (FAB-YYYYMMDD-XXXX)
- `is_admin()` - Check admin status

### ✅ Triggers

- Auto-update `updated_at` timestamps on: users, products, orders, storefront_settings

### ✅ Row Level Security (RLS)

- RLS enabled on all 9 tables
- Comprehensive policies for:
  - Users (own profile access)
  - Products (creators manage own, public view active)
  - Orders (creators view own, customers view by email)
  - Download links (customers view own)
  - Referrals (users view own relationships)
  - Referral commissions (users view own)
  - Analytics (public insert, users view own)
  - Storefront settings (public view, creators manage own)
  - Moderation flags (authenticated insert, admins full access)
- Admin policies with `is_admin()` function

### ✅ PostgreSQL Functions (RPC)

1. **process_payment(order_id, payment_provider_id, amount)**
   - Atomically processes payment
   - Updates order status to 'completed'
   - Updates product sales_count and revenue_total
   - Creates download_link for digital products
   - Returns JSONB with success/error status

2. **create_user_with_referral(clerk_user_id, email, phone, full_name, referred_by_code)**
   - Atomically creates user
   - Generates unique username from email
   - Generates unique referral code
   - Links referral if referred_by_code provided
   - Returns user record as JSONB

3. **calculate_referral_commissions(period_start, period_end)**
   - Calculates monthly commissions for active referrals
   - Creates referral_commissions records
   - Updates referral total_earned
   - Prevents duplicate commissions (unique constraint)
   - Returns summary statistics

## Security Features

- All tables have RLS enabled
- Admin access controlled via email whitelist
- Service role functions use SECURITY DEFINER for controlled bypass
- Unique constraints prevent data duplication
- Foreign key constraints maintain referential integrity

## Next Steps

1. **MCP Configuration**: See `.cursor/MCP_SETUP.md` for manual setup instructions
2. **Local Testing**: Run `supabase db reset` (requires Docker Desktop)
3. **Apply to Staging**: Use Supabase MCP or CLI to apply migration to `fabrica-staging`
4. **Unit Tests**: Create tests for RLS policies (as per Tasks.md)
5. **Storage Buckets**: Set up Supabase Storage buckets (next task)

## Notes

- Migration is wrapped in a transaction (BEGIN/COMMIT) for safety
- All RPC functions use SECURITY DEFINER to bypass RLS when needed
- RLS policies assume Clerk JWT tokens will be configured in Supabase Auth
- Admin email is set to 'admin@fabrica.et' (update in `is_admin()` function if needed)
