-- Fabrica Initial Database Schema Migration
-- This migration creates all core tables, indexes, functions, triggers, RLS policies, and RPC functions
-- for the Fabrica creator commerce platform.

BEGIN;

-- ============================================================================
-- HELPER FUNCTIONS
-- ============================================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to generate unique referral code
CREATE OR REPLACE FUNCTION generate_referral_code()
RETURNS TEXT AS $$
DECLARE
    code TEXT;
    exists_check BOOLEAN;
BEGIN
    LOOP
        -- Generate a random 8-character alphanumeric code
        code := UPPER(substring(md5(random()::text) from 1 for 8));
        
        -- Check if code already exists
        SELECT EXISTS(SELECT 1 FROM users WHERE referral_code = code) INTO exists_check;
        
        -- Exit loop if code is unique
        EXIT WHEN NOT exists_check;
    END LOOP;
    
    RETURN code;
END;
$$ LANGUAGE plpgsql;

-- Function to generate unique order number (FAB-YYYYMMDD-XXXX)
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TEXT AS $$
DECLARE
    date_part TEXT;
    random_part TEXT;
    order_num TEXT;
    exists_check BOOLEAN;
BEGIN
    -- Get date part in YYYYMMDD format
    date_part := TO_CHAR(NOW(), 'YYYYMMDD');
    
    LOOP
        -- Generate random 4-character alphanumeric suffix
        random_part := UPPER(substring(md5(random()::text) from 1 for 4));
        
        -- Construct order number
        order_num := 'FAB-' || date_part || '-' || random_part;
        
        -- Check if order number already exists
        SELECT EXISTS(SELECT 1 FROM orders WHERE order_number = order_num) INTO exists_check;
        
        -- Exit loop if order number is unique
        EXIT WHEN NOT exists_check;
    END LOOP;
    
    RETURN order_num;
END;
$$ LANGUAGE plpgsql;

-- Function to check if user is admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM users
        WHERE clerk_user_id = auth.jwt() ->> 'sub'
        AND email IN ('admin@fabrica.et')
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- CORE TABLES
-- ============================================================================

-- Users table (synced from Clerk via webhook)
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    clerk_user_id TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone TEXT,
    full_name TEXT,
    username TEXT UNIQUE,
    avatar_url TEXT,
    bio TEXT,
    social_links JSONB DEFAULT '{}',
    subscription_plan TEXT DEFAULT 'trial', -- trial, creator, creator_pro, inactive
    subscription_status TEXT DEFAULT 'active', -- active, past_due, canceled
    trial_ends_at TIMESTAMP,
    subscription_current_period_end TIMESTAMP,
    telebirr_account TEXT,
    telebirr_verified BOOLEAN DEFAULT FALSE,
    referral_code TEXT UNIQUE NOT NULL DEFAULT generate_referral_code(),
    referred_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Products table
CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    creator_id UUID REFERENCES users(id) ON DELETE CASCADE,
    type TEXT NOT NULL, -- digital, booking, link
    title TEXT NOT NULL,
    description TEXT,
    price DECIMAL(10,2), -- ETB, null for free products
    currency TEXT DEFAULT 'ETB',
    cover_image_url TEXT,
    status TEXT DEFAULT 'active', -- active, draft, archived

    -- Digital product specific
    file_url TEXT,
    file_size BIGINT,
    file_type TEXT,
    external_url TEXT,

    -- Booking specific
    duration_minutes INTEGER,
    booking_type TEXT, -- zoom, google_meet, phone, in_person
    calendar_settings JSONB,

    -- Analytics
    views_count INTEGER DEFAULT 0,
    sales_count INTEGER DEFAULT 0,
    revenue_total DECIMAL(10,2) DEFAULT 0,

    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Orders table
CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_number TEXT UNIQUE NOT NULL DEFAULT generate_order_number(),
    product_id UUID REFERENCES products(id),
    creator_id UUID REFERENCES users(id),

    -- Customer info
    customer_email TEXT NOT NULL,
    customer_name TEXT NOT NULL,
    customer_phone TEXT,

    -- Payment info
    amount DECIMAL(10,2) NOT NULL,
    currency TEXT DEFAULT 'ETB',
    payment_provider TEXT NOT NULL, -- chapa (primary), telebirr (via Chapa)
    payment_provider_id TEXT, -- Transaction ID from provider
    payment_status TEXT DEFAULT 'pending', -- pending, completed, failed, refunded

    -- Booking specific
    booking_datetime TIMESTAMP,
    booking_timezone TEXT DEFAULT 'Africa/Addis_Ababa',

    -- Metadata
    metadata JSONB DEFAULT '{}', -- Store additional data
    ip_address INET,
    user_agent TEXT,

    -- Timestamps
    paid_at TIMESTAMP,
    refunded_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Download Links (time-limited signed URLs)
CREATE TABLE download_links (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    token TEXT UNIQUE NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    download_count INTEGER DEFAULT 0,
    max_downloads INTEGER DEFAULT 3,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Referrals table
CREATE TABLE referrals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    referrer_id UUID REFERENCES users(id) ON DELETE CASCADE,
    referred_user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    status TEXT DEFAULT 'pending', -- pending, active, inactive
    commission_rate DECIMAL(5,2) DEFAULT 20.00, -- 20%
    total_earned DECIMAL(10,2) DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(referrer_id, referred_user_id)
);

-- Referral Commissions (monthly payouts)
CREATE TABLE referral_commissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    referral_id UUID REFERENCES referrals(id) ON DELETE CASCADE,
    amount DECIMAL(10,2) NOT NULL,
    period_start DATE NOT NULL,
    period_end DATE NOT NULL,
    status TEXT DEFAULT 'pending', -- pending, paid, failed
    paid_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(referral_id, period_start, period_end) -- Prevent duplicate commissions for same period
);

-- Analytics Events (for tracking)
CREATE TABLE analytics_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    event_type TEXT NOT NULL, -- page_view, product_view, checkout_started, purchase, etc.
    event_data JSONB DEFAULT '{}',
    session_id TEXT,
    ip_address INET,
    user_agent TEXT,
    referrer TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Storefront Customization
CREATE TABLE storefront_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    theme_name TEXT DEFAULT 'modern',
    primary_color TEXT DEFAULT '#000000',
    custom_css TEXT,
    show_fabrica_badge BOOLEAN DEFAULT TRUE,
    domain_forwarding TEXT,
    seo_title TEXT,
    seo_description TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Admin Moderation
CREATE TABLE moderation_flags (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    flagged_by UUID REFERENCES users(id),
    target_type TEXT NOT NULL, -- user, product
    target_id UUID NOT NULL,
    reason TEXT NOT NULL,
    status TEXT DEFAULT 'pending', -- pending, reviewed, actioned
    admin_notes TEXT,
    actioned_by UUID REFERENCES users(id),
    actioned_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================================================
-- INDEXES
-- ============================================================================

-- Users indexes
CREATE INDEX idx_users_clerk_id ON users(clerk_user_id);
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_referral_code ON users(referral_code);
CREATE INDEX idx_users_referred_by ON users(referred_by);

-- Products indexes
CREATE INDEX idx_products_creator ON products(creator_id);
CREATE INDEX idx_products_status ON products(status);
CREATE INDEX idx_products_type ON products(type);

-- Orders indexes
CREATE INDEX idx_orders_creator ON orders(creator_id);
CREATE INDEX idx_orders_product ON orders(product_id);
CREATE INDEX idx_orders_customer_email ON orders(customer_email);
CREATE INDEX idx_orders_payment_status ON orders(payment_status);
CREATE INDEX idx_orders_created_at ON orders(created_at DESC);
CREATE INDEX idx_orders_order_number ON orders(order_number);

-- Download links indexes
CREATE INDEX idx_download_links_token ON download_links(token);
CREATE INDEX idx_download_links_expires_at ON download_links(expires_at);
CREATE INDEX idx_download_links_order ON download_links(order_id);
CREATE INDEX idx_download_links_product ON download_links(product_id);

-- Referrals indexes
CREATE INDEX idx_referrals_referrer ON referrals(referrer_id);
CREATE INDEX idx_referrals_referred ON referrals(referred_user_id);
CREATE INDEX idx_referrals_status ON referrals(status);

-- Referral commissions indexes
CREATE INDEX idx_commissions_referral ON referral_commissions(referral_id);
CREATE INDEX idx_commissions_status ON referral_commissions(status);
CREATE INDEX idx_commissions_period ON referral_commissions(period_start, period_end);

-- Analytics indexes
CREATE INDEX idx_analytics_user ON analytics_events(user_id);
CREATE INDEX idx_analytics_type ON analytics_events(event_type);
CREATE INDEX idx_analytics_created_at ON analytics_events(created_at DESC);
CREATE INDEX idx_analytics_session ON analytics_events(session_id);

-- Moderation indexes
CREATE INDEX idx_moderation_status ON moderation_flags(status);
CREATE INDEX idx_moderation_target ON moderation_flags(target_type, target_id);
CREATE INDEX idx_moderation_flagged_by ON moderation_flags(flagged_by);

-- ============================================================================
-- TRIGGERS
-- ============================================================================

-- Updated_at triggers
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_products_updated_at
    BEFORE UPDATE ON products
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at
    BEFORE UPDATE ON orders
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_storefront_settings_updated_at
    BEFORE UPDATE ON storefront_settings
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE download_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE referral_commissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE storefront_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE moderation_flags ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- RLS POLICIES - USERS
-- ============================================================================

-- Users can view their own profile
CREATE POLICY "Users can view own profile"
    ON users FOR SELECT
    USING (clerk_user_id = auth.jwt() ->> 'sub');

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
    ON users FOR UPDATE
    USING (clerk_user_id = auth.jwt() ->> 'sub');

-- Public can view user profiles (for storefront display) - limited fields
CREATE POLICY "Public can view user profiles"
    ON users FOR SELECT
    USING (true); -- All users visible for storefronts

-- Service role can insert users (via webhook)
CREATE POLICY "Service role can insert users"
    ON users FOR INSERT
    WITH CHECK (true); -- Will be restricted by service role key

-- Admins have full access
CREATE POLICY "Admins have full access to users"
    ON users FOR ALL
    USING (is_admin());

-- ============================================================================
-- RLS POLICIES - PRODUCTS
-- ============================================================================

-- Creators can manage their own products
CREATE POLICY "Creators can manage own products"
    ON products FOR ALL
    USING (
        creator_id = (
            SELECT id FROM users 
            WHERE clerk_user_id = auth.jwt() ->> 'sub'
        )
    );

-- Public can view active products
CREATE POLICY "Public can view active products"
    ON products FOR SELECT
    USING (status = 'active');

-- Admins have full access
CREATE POLICY "Admins have full access to products"
    ON products FOR ALL
    USING (is_admin());

-- ============================================================================
-- RLS POLICIES - ORDERS
-- ============================================================================

-- Creators can view orders for their products
CREATE POLICY "Creators can view own orders"
    ON orders FOR SELECT
    USING (
        creator_id = (
            SELECT id FROM users 
            WHERE clerk_user_id = auth.jwt() ->> 'sub'
        )
    );

-- Customers can view orders by email (for order confirmation)
CREATE POLICY "Customers can view own orders"
    ON orders FOR SELECT
    USING (customer_email = auth.jwt() ->> 'email');

-- Service role can insert orders (via payment API)
CREATE POLICY "Service role can insert orders"
    ON orders FOR INSERT
    WITH CHECK (true); -- Will be restricted by service role key

-- Creators can update order status (for refunds)
CREATE POLICY "Creators can update own orders"
    ON orders FOR UPDATE
    USING (
        creator_id = (
            SELECT id FROM users 
            WHERE clerk_user_id = auth.jwt() ->> 'sub'
        )
    );

-- Admins have full access
CREATE POLICY "Admins have full access to orders"
    ON orders FOR ALL
    USING (is_admin());

-- ============================================================================
-- RLS POLICIES - DOWNLOAD LINKS
-- ============================================================================

-- Customers can view download links for their orders
CREATE POLICY "Customers can view own download links"
    ON download_links FOR SELECT
    USING (
        order_id IN (
            SELECT id FROM orders 
            WHERE customer_email = auth.jwt() ->> 'email'
        )
    );

-- Service role can insert download links (via payment webhook)
CREATE POLICY "Service role can insert download links"
    ON download_links FOR INSERT
    WITH CHECK (true); -- Will be restricted by service role key

-- Admins have full access
CREATE POLICY "Admins have full access to download links"
    ON download_links FOR ALL
    USING (is_admin());

-- ============================================================================
-- RLS POLICIES - REFERRALS
-- ============================================================================

-- Users can view their own referral relationships
CREATE POLICY "Users can view own referrals"
    ON referrals FOR SELECT
    USING (
        referrer_id = (
            SELECT id FROM users 
            WHERE clerk_user_id = auth.jwt() ->> 'sub'
        )
        OR referred_user_id = (
            SELECT id FROM users 
            WHERE clerk_user_id = auth.jwt() ->> 'sub'
        )
    );

-- Service role can insert/update referrals (via user creation)
CREATE POLICY "Service role can manage referrals"
    ON referrals FOR ALL
    WITH CHECK (true); -- Will be restricted by service role key

-- Admins have full access
CREATE POLICY "Admins have full access to referrals"
    ON referrals FOR ALL
    USING (is_admin());

-- ============================================================================
-- RLS POLICIES - REFERRAL COMMISSIONS
-- ============================================================================

-- Users can view their own commission records
CREATE POLICY "Users can view own commissions"
    ON referral_commissions FOR SELECT
    USING (
        referral_id IN (
            SELECT id FROM referrals 
            WHERE referrer_id = (
                SELECT id FROM users 
                WHERE clerk_user_id = auth.jwt() ->> 'sub'
            )
        )
    );

-- Service role can insert/update commissions (via cron job)
CREATE POLICY "Service role can manage commissions"
    ON referral_commissions FOR ALL
    WITH CHECK (true); -- Will be restricted by service role key

-- Admins have full access
CREATE POLICY "Admins have full access to commissions"
    ON referral_commissions FOR ALL
    USING (is_admin());

-- ============================================================================
-- RLS POLICIES - ANALYTICS EVENTS
-- ============================================================================

-- Public can insert analytics events (for tracking)
CREATE POLICY "Public can insert analytics events"
    ON analytics_events FOR INSERT
    WITH CHECK (true);

-- Users can view their own analytics events
CREATE POLICY "Users can view own analytics events"
    ON analytics_events FOR SELECT
    USING (
        user_id = (
            SELECT id FROM users 
            WHERE clerk_user_id = auth.jwt() ->> 'sub'
        )
    );

-- Admins have full access
CREATE POLICY "Admins have full access to analytics"
    ON analytics_events FOR ALL
    USING (is_admin());

-- ============================================================================
-- RLS POLICIES - STOREFRONT SETTINGS
-- ============================================================================

-- Public can view storefront settings (for display)
CREATE POLICY "Public can view storefront settings"
    ON storefront_settings FOR SELECT
    USING (true);

-- Creators can manage their own storefront settings
CREATE POLICY "Creators can manage own storefront settings"
    ON storefront_settings FOR ALL
    USING (
        user_id = (
            SELECT id FROM users 
            WHERE clerk_user_id = auth.jwt() ->> 'sub'
        )
    );

-- Admins have full access
CREATE POLICY "Admins have full access to storefront settings"
    ON storefront_settings FOR ALL
    USING (is_admin());

-- ============================================================================
-- RLS POLICIES - MODERATION FLAGS
-- ============================================================================

-- Authenticated users can insert moderation flags
CREATE POLICY "Authenticated users can flag content"
    ON moderation_flags FOR INSERT
    WITH CHECK (
        flagged_by = (
            SELECT id FROM users 
            WHERE clerk_user_id = auth.jwt() ->> 'sub'
        )
    );

-- Users can view flags they created
CREATE POLICY "Users can view own flags"
    ON moderation_flags FOR SELECT
    USING (
        flagged_by = (
            SELECT id FROM users 
            WHERE clerk_user_id = auth.jwt() ->> 'sub'
        )
    );

-- Admins have full access
CREATE POLICY "Admins have full access to moderation flags"
    ON moderation_flags FOR ALL
    USING (is_admin());

-- ============================================================================
-- POSTGRESQL FUNCTIONS (RPC)
-- ============================================================================

-- Function: process_payment
-- Atomically processes a payment, updates order status, product stats, and creates download link
CREATE OR REPLACE FUNCTION process_payment(
    p_order_id UUID,
    p_payment_provider_id TEXT,
    p_amount DECIMAL
)
RETURNS JSONB AS $$
DECLARE
    v_order orders%ROWTYPE;
    v_product products%ROWTYPE;
    v_download_token TEXT;
    v_result JSONB;
BEGIN
    -- Start transaction (implicit in function)
    
    -- Fetch order
    SELECT * INTO v_order FROM orders WHERE id = p_order_id;
    
    IF NOT FOUND THEN
        RETURN jsonb_build_object(
            'success', false,
            'error', 'Order not found'
        );
    END IF;
    
    -- Check if already processed
    IF v_order.payment_status = 'completed' THEN
        RETURN jsonb_build_object(
            'success', false,
            'error', 'Order already processed'
        );
    END IF;
    
    -- Fetch product
    SELECT * INTO v_product FROM products WHERE id = v_order.product_id;
    
    IF NOT FOUND THEN
        RETURN jsonb_build_object(
            'success', false,
            'error', 'Product not found'
        );
    END IF;
    
    -- Update order status
    UPDATE orders
    SET 
        payment_status = 'completed',
        paid_at = NOW(),
        payment_provider_id = p_payment_provider_id,
        updated_at = NOW()
    WHERE id = p_order_id;
    
    -- Update product statistics
    UPDATE products
    SET 
        sales_count = sales_count + 1,
        revenue_total = revenue_total + p_amount,
        updated_at = NOW()
    WHERE id = v_product.id;
    
    -- Create download link for digital products
    IF v_product.type = 'digital' AND v_product.file_url IS NOT NULL THEN
        -- Generate secure token
        v_download_token := encode(gen_random_bytes(32), 'hex');
        
        -- Create download link (expires in 7 days, max 3 downloads)
        INSERT INTO download_links (
            order_id,
            product_id,
            token,
            expires_at,
            max_downloads
        ) VALUES (
            p_order_id,
            v_product.id,
            v_download_token,
            NOW() + INTERVAL '7 days',
            3
        );
        
        v_result := jsonb_build_object(
            'success', true,
            'order_id', p_order_id,
            'download_token', v_download_token
        );
    ELSE
        v_result := jsonb_build_object(
            'success', true,
            'order_id', p_order_id
        );
    END IF;
    
    RETURN v_result;
    
EXCEPTION
    WHEN OTHERS THEN
        -- Rollback will happen automatically
        RETURN jsonb_build_object(
            'success', false,
            'error', SQLERRM
        );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function: create_user_with_referral
-- Atomically creates a user with referral code and links referral if provided
CREATE OR REPLACE FUNCTION create_user_with_referral(
    p_clerk_user_id TEXT,
    p_email TEXT,
    p_phone TEXT DEFAULT NULL,
    p_full_name TEXT DEFAULT NULL,
    p_referred_by_code TEXT DEFAULT NULL
)
RETURNS JSONB AS $$
DECLARE
    v_user_id UUID;
    v_referrer_id UUID;
    v_referral_code TEXT;
    v_username TEXT;
    v_result JSONB;
BEGIN
    -- Generate unique referral code
    v_referral_code := generate_referral_code();
    
    -- Generate username from email (before @ symbol)
    v_username := lower(split_part(p_email, '@', 1));
    
    -- Make username unique by appending random suffix if needed
    WHILE EXISTS (SELECT 1 FROM users WHERE username = v_username) LOOP
        v_username := v_username || '-' || substring(md5(random()::text) from 1 for 4);
    END LOOP;
    
    -- Create user
    INSERT INTO users (
        clerk_user_id,
        email,
        phone,
        full_name,
        username,
        referral_code,
        subscription_plan,
        trial_ends_at
    ) VALUES (
        p_clerk_user_id,
        p_email,
        p_phone,
        p_full_name,
        v_username,
        v_referral_code,
        'trial',
        NOW() + INTERVAL '14 days'
    ) RETURNING id INTO v_user_id;
    
    -- Link referral if referred_by_code provided
    IF p_referred_by_code IS NOT NULL THEN
        -- Find referrer by referral code
        SELECT id INTO v_referrer_id 
        FROM users 
        WHERE referral_code = p_referred_by_code;
        
        IF v_referrer_id IS NOT NULL THEN
            -- Create referral relationship
            INSERT INTO referrals (
                referrer_id,
                referred_user_id,
                status
            ) VALUES (
                v_referrer_id,
                v_user_id,
                'active'
            ) ON CONFLICT (referrer_id, referred_user_id) DO NOTHING;
        END IF;
    END IF;
    
    -- Return user data
    SELECT row_to_json(u.*)::jsonb INTO v_result
    FROM users u
    WHERE u.id = v_user_id;
    
    RETURN jsonb_build_object(
        'success', true,
        'user', v_result
    );
    
EXCEPTION
    WHEN unique_violation THEN
        RETURN jsonb_build_object(
            'success', false,
            'error', 'User already exists'
        );
    WHEN OTHERS THEN
        RETURN jsonb_build_object(
            'success', false,
            'error', SQLERRM
        );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function: calculate_referral_commissions
-- Calculates monthly referral commissions for a given period
CREATE OR REPLACE FUNCTION calculate_referral_commissions(
    p_period_start DATE,
    p_period_end DATE
)
RETURNS JSONB AS $$
DECLARE
    v_referral RECORD;
    v_commission_amount DECIMAL(10,2);
    v_total_commissions DECIMAL(10,2) := 0;
    v_commissions_count INTEGER := 0;
    v_subscription_amount DECIMAL(10,2);
BEGIN
    -- Loop through all active referrals
    FOR v_referral IN 
        SELECT r.*, u.subscription_plan, u.subscription_status
        FROM referrals r
        JOIN users u ON u.id = r.referred_user_id
        WHERE r.status = 'active'
        AND u.subscription_status = 'active'
        AND u.subscription_plan IN ('creator', 'creator_pro')
    LOOP
        -- Calculate commission based on subscription plan
        IF v_referral.subscription_plan = 'creator' THEN
            v_subscription_amount := 899.00; -- ETB
        ELSIF v_referral.subscription_plan = 'creator_pro' THEN
            v_subscription_amount := 2999.00; -- ETB
        ELSE
            CONTINUE; -- Skip if plan not recognized
        END IF;
        
        -- Calculate commission (20% default)
        v_commission_amount := v_subscription_amount * (v_referral.commission_rate / 100.0);
        
        -- Create commission record if it doesn't exist for this period
        INSERT INTO referral_commissions (
            referral_id,
            amount,
            period_start,
            period_end,
            status
        ) VALUES (
            v_referral.id,
            v_commission_amount,
            p_period_start,
            p_period_end,
            'pending'
        ) ON CONFLICT (referral_id, period_start, period_end) DO NOTHING;
        
        -- Update referral total earned
        UPDATE referrals
        SET total_earned = total_earned + v_commission_amount
        WHERE id = v_referral.id;
        
        v_total_commissions := v_total_commissions + v_commission_amount;
        v_commissions_count := v_commissions_count + 1;
    END LOOP;
    
    RETURN jsonb_build_object(
        'success', true,
        'total_commissions', v_total_commissions,
        'commissions_count', v_commissions_count,
        'period_start', p_period_start,
        'period_end', p_period_end
    );
    
EXCEPTION
    WHEN OTHERS THEN
        RETURN jsonb_build_object(
            'success', false,
            'error', SQLERRM
        );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMIT;

