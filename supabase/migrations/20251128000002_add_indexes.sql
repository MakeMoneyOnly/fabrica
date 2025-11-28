-- Migration to add additional performance indexes
-- Focuses on JSONB queries, composite indexes, and analytics optimization

BEGIN;

-- ============================================================================
-- ANALYTICS EVENTS - JSONB OPTIMIZATION
-- ============================================================================

-- GIN index for JSONB queries on event_data
CREATE INDEX IF NOT EXISTS idx_analytics_events_event_data_gin 
    ON public.analytics_events USING gin (event_data);

-- Composite index for common analytics queries (user + time range)
CREATE INDEX IF NOT EXISTS idx_analytics_events_user_created 
    ON public.analytics_events(user_id, created_at DESC);

-- ============================================================================
-- ORDERS - COMPOSITE INDEXES FOR DASHBOARD QUERIES
-- ============================================================================

-- Composite index for creator's order history with status filter
CREATE INDEX IF NOT EXISTS idx_orders_creator_status_created 
    ON public.orders(creator_id, payment_status, created_at DESC);

-- Composite index for customer email lookups with date
CREATE INDEX IF NOT EXISTS idx_orders_customer_created 
    ON public.orders(customer_email, created_at DESC);

-- ============================================================================
-- PRODUCTS - COMPOSITE INDEXES FOR STOREFRONT
-- ============================================================================

-- Composite index for active products by creator
CREATE INDEX IF NOT EXISTS idx_products_creator_status 
    ON public.products(creator_id, status) 
    WHERE status = 'active';

-- ============================================================================
-- REFERRALS - COMPOSITE INDEXES FOR EARNINGS TRACKING
-- ============================================================================

-- Composite index for referrer's active referrals
CREATE INDEX IF NOT EXISTS idx_referrals_referrer_status 
    ON public.referrals(referrer_id, status);

-- ============================================================================
-- DOWNLOAD LINKS - EXPIRY CLEANUP
-- ============================================================================

-- Regular index on expires_at for cleanup queries
CREATE INDEX IF NOT EXISTS idx_download_links_expires 
    ON public.download_links(expires_at);

-- ============================================================================
-- USERS - SUBSCRIPTION & TRIAL TRACKING
-- ============================================================================

-- Index for trial expiry checks
CREATE INDEX IF NOT EXISTS idx_users_trial_ends 
    ON public.users(trial_ends_at) 
    WHERE trial_ends_at IS NOT NULL;

-- Index for subscription status queries
CREATE INDEX IF NOT EXISTS idx_users_subscription 
    ON public.users(subscription_plan, subscription_status);

COMMIT;
