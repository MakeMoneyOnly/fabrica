-- Migration to optimize RLS policies and fix performance warnings
-- Replaces auth.uid() and auth.jwt() with (select auth.uid()) and (select auth.jwt())
-- Consolidates some policies to reduce overhead

BEGIN;

-- ============================================================================
-- USERS TABLE
-- ============================================================================

DROP POLICY IF EXISTS "Users can view own profile" ON public.users;
CREATE POLICY "Users can view own profile"
    ON public.users FOR SELECT
    USING (clerk_user_id = (select auth.jwt() ->> 'sub'));

DROP POLICY IF EXISTS "Users can update own profile" ON public.users;
CREATE POLICY "Users can update own profile"
    ON public.users FOR UPDATE
    USING (clerk_user_id = (select auth.jwt() ->> 'sub'));

-- Optimize Service Role policy if it exists (often created by default or previous migrations)
DROP POLICY IF EXISTS "Service role has full access" ON public.users;
DROP POLICY IF EXISTS "Service role can insert users" ON public.users;
CREATE POLICY "Service role can manage users"
    ON public.users FOR ALL
    USING ((select auth.role()) = 'service_role')
    WITH CHECK ((select auth.role()) = 'service_role');

-- ============================================================================
-- PRODUCTS TABLE
-- ============================================================================

DROP POLICY IF EXISTS "Creators can manage own products" ON public.products;
DROP POLICY IF EXISTS "Users can delete their own products" ON public.products;
DROP POLICY IF EXISTS "Users can view their own products" ON public.products;
DROP POLICY IF EXISTS "Users can create their own products" ON public.products;
DROP POLICY IF EXISTS "Users can update their own products" ON public.products;

CREATE POLICY "Creators can manage own products"
    ON public.products FOR ALL
    USING (
        creator_id = (
            SELECT id FROM public.users 
            WHERE clerk_user_id = (select auth.jwt() ->> 'sub')
        )
    );

-- ============================================================================
-- ORDERS TABLE
-- ============================================================================

DROP POLICY IF EXISTS "Creators can view own orders" ON public.orders;
CREATE POLICY "Creators can view own orders"
    ON public.orders FOR SELECT
    USING (
        creator_id = (
            SELECT id FROM public.users 
            WHERE clerk_user_id = (select auth.jwt() ->> 'sub')
        )
    );

DROP POLICY IF EXISTS "Customers can view own orders" ON public.orders;
CREATE POLICY "Customers can view own orders"
    ON public.orders FOR SELECT
    USING (customer_email = (select auth.jwt() ->> 'email'));

DROP POLICY IF EXISTS "Creators can update own orders" ON public.orders;
CREATE POLICY "Creators can update own orders"
    ON public.orders FOR UPDATE
    USING (
        creator_id = (
            SELECT id FROM public.users 
            WHERE clerk_user_id = (select auth.jwt() ->> 'sub')
        )
    );

-- ============================================================================
-- DOWNLOAD LINKS TABLE
-- ============================================================================

DROP POLICY IF EXISTS "Customers can view own download links" ON public.download_links;
CREATE POLICY "Customers can view own download links"
    ON public.download_links FOR SELECT
    USING (
        order_id IN (
            SELECT id FROM public.orders 
            WHERE customer_email = (select auth.jwt() ->> 'email')
        )
    );

-- ============================================================================
-- REFERRALS TABLE
-- ============================================================================

DROP POLICY IF EXISTS "Users can view own referrals" ON public.referrals;
DROP POLICY IF EXISTS "Users can view their own referrals" ON public.referrals;
DROP POLICY IF EXISTS "Users can update their own referrals" ON public.referrals;

CREATE POLICY "Users can view own referrals"
    ON public.referrals FOR SELECT
    USING (
        referrer_id = (
            SELECT id FROM public.users 
            WHERE clerk_user_id = (select auth.jwt() ->> 'sub')
        )
        OR referred_user_id = (
            SELECT id FROM public.users 
            WHERE clerk_user_id = (select auth.jwt() ->> 'sub')
        )
    );

-- ============================================================================
-- REFERRAL COMMISSIONS TABLE
-- ============================================================================

DROP POLICY IF EXISTS "Users can view own commissions" ON public.referral_commissions;
CREATE POLICY "Users can view own commissions"
    ON public.referral_commissions FOR SELECT
    USING (
        referral_id IN (
            SELECT id FROM public.referrals 
            WHERE referrer_id = (
                SELECT id FROM public.users 
                WHERE clerk_user_id = (select auth.jwt() ->> 'sub')
            )
        )
    );

-- ============================================================================
-- ANALYTICS EVENTS TABLE
-- ============================================================================

DROP POLICY IF EXISTS "Users can view own analytics events" ON public.analytics_events;
DROP POLICY IF EXISTS "Users can view their own analytics" ON public.analytics_events;

CREATE POLICY "Users can view own analytics events"
    ON public.analytics_events FOR SELECT
    USING (
        user_id = (
            SELECT id FROM public.users 
            WHERE clerk_user_id = (select auth.jwt() ->> 'sub')
        )
    );

-- ============================================================================
-- STOREFRONT SETTINGS TABLE
-- ============================================================================

DROP POLICY IF EXISTS "Creators can manage own storefront settings" ON public.storefront_settings;
CREATE POLICY "Creators can manage own storefront settings"
    ON public.storefront_settings FOR ALL
    USING (
        user_id = (
            SELECT id FROM public.users 
            WHERE clerk_user_id = (select auth.jwt() ->> 'sub')
        )
    );

-- ============================================================================
-- MODERATION FLAGS TABLE
-- ============================================================================

DROP POLICY IF EXISTS "Authenticated users can flag content" ON public.moderation_flags;
CREATE POLICY "Authenticated users can flag content"
    ON public.moderation_flags FOR INSERT
    WITH CHECK (
        flagged_by = (
            SELECT id FROM public.users 
            WHERE clerk_user_id = (select auth.jwt() ->> 'sub')
        )
    );

DROP POLICY IF EXISTS "Users can view own flags" ON public.moderation_flags;
CREATE POLICY "Users can view own flags"
    ON public.moderation_flags FOR SELECT
    USING (
        flagged_by = (
            SELECT id FROM public.users 
            WHERE clerk_user_id = (select auth.jwt() ->> 'sub')
        )
    );

-- ============================================================================
-- BOOKINGS TABLE
-- ============================================================================

-- Fix warnings for bookings table policies
DROP POLICY IF EXISTS "Users can view bookings for their products" ON public.bookings;
DROP POLICY IF EXISTS "Users can update bookings for their products" ON public.bookings;
DROP POLICY IF EXISTS "bookings_admin_bypass" ON public.bookings;

CREATE POLICY "Creators can view own bookings"
    ON public.bookings FOR SELECT
    USING (
        creator_id = (
            SELECT id FROM public.users 
            WHERE clerk_user_id = (select auth.jwt() ->> 'sub')
        )
    );

CREATE POLICY "Creators can update own bookings"
    ON public.bookings FOR UPDATE
    USING (
        creator_id = (
            SELECT id FROM public.users 
            WHERE clerk_user_id = (select auth.jwt() ->> 'sub')
        )
    );

COMMIT;
