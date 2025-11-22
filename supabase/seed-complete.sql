-- Complete Seed Script for Fabrica Development Database
-- This script bypasses PostgREST schema cache issues by using direct SQL execution
-- Run this in Supabase Dashboard → SQL Editor if the TypeScript seed script fails with PGRST205 errors

BEGIN;

-- ============================================================================
-- CLEAR EXISTING SEED DATA
-- ============================================================================

DELETE FROM referral_commissions;
DELETE FROM download_links;
DELETE FROM orders;
DELETE FROM referrals;
DELETE FROM products WHERE creator_id IN (SELECT id FROM users WHERE email LIKE '%@example.com' OR clerk_user_id LIKE 'user_seed_%');
DELETE FROM storefront_settings WHERE user_id IN (SELECT id FROM users WHERE email LIKE '%@example.com' OR clerk_user_id LIKE 'user_seed_%');
DELETE FROM users WHERE email LIKE '%@example.com' OR clerk_user_id LIKE 'user_seed_%';

-- ============================================================================
-- INSERT TEST USERS
-- ============================================================================

INSERT INTO users (clerk_user_id, email, username, full_name, bio, phone, subscription_plan, subscription_status, telebirr_account, telebirr_verified, social_links, trial_ends_at)
VALUES
  ('user_seed_1', 'abeba.tesfaye@example.com', 'abeba', 'Abeba Tesfaye', 'Coffee enthusiast and digital creator sharing Ethiopian coffee culture', '+251911234567', 'creator_pro', 'active', '0911234567', true, '{"instagram":"https://instagram.com/abeba","tiktok":"https://tiktok.com/@abeba","twitter":"https://twitter.com/abeba"}'::jsonb, NULL),
  ('user_seed_2', 'daniel.mekonnen@example.com', 'daniel', 'Daniel Mekonnen', 'Business coach helping entrepreneurs grow their businesses', '+251922345678', 'creator', 'active', '0922345678', true, '{"linkedin":"https://linkedin.com/in/daniel","twitter":"https://twitter.com/daniel"}'::jsonb, NULL),
  ('user_seed_3', 'sara.alemayehu@example.com', 'sara', 'Sara Alemayehu', 'Fitness trainer and wellness coach', '+251933456789', 'trial', 'active', NULL, false, '{"instagram":"https://instagram.com/sara","youtube":"https://youtube.com/@sara"}'::jsonb, NOW() + INTERVAL '14 days'),
  ('user_seed_4', 'yohannes.hailu@example.com', 'yohannes', 'Yohannes Hailu', 'Music producer and sound engineer', '+251944567890', 'creator', 'active', '0944567890', false, '{"spotify":"https://spotify.com/artist/yohannes","instagram":"https://instagram.com/yohannes"}'::jsonb, NULL),
  ('user_seed_5', 'marta.girma@example.com', 'marta', 'Marta Girma', 'Digital artist and illustrator', '+251955678901', 'creator_pro', 'active', '0955678901', true, '{"instagram":"https://instagram.com/marta","behance":"https://behance.net/marta"}'::jsonb, NULL);

-- ============================================================================
-- INSERT PRODUCTS
-- ============================================================================

-- Abeba's products
INSERT INTO products (creator_id, type, title, description, price, currency, status, views_count, sales_count, revenue_total, external_url)
SELECT 
  id, 'digital', 'Ethiopian Coffee Guide: From Bean to Cup',
  'A comprehensive 50-page guide covering Ethiopian coffee culture, brewing methods, and traditional ceremonies. Includes recipes and cultural insights.',
  299.99, 'ETB', 'active', 245, 12, 3599.88, NULL
FROM users WHERE email = 'abeba.tesfaye@example.com'
UNION ALL
SELECT 
  id, 'digital', 'Traditional Ethiopian Recipes Collection',
  'Digital cookbook with 30 authentic Ethiopian recipes, including injera, doro wat, and more.',
  199.99, 'ETB', 'active', 189, 8, 1599.92, NULL
FROM users WHERE email = 'abeba.tesfaye@example.com'
UNION ALL
SELECT 
  id, 'link', 'Premium Coffee Subscription',
  'Monthly subscription to premium Ethiopian coffee beans delivered to your door.',
  999.99, 'ETB', 'active', 67, 3, 2999.97, 'https://coffee-subscription.example.com'
FROM users WHERE email = 'abeba.tesfaye@example.com';

-- Daniel's products
INSERT INTO products (creator_id, type, title, description, price, currency, status, views_count, sales_count, revenue_total, duration_minutes, booking_type, calendar_settings)
SELECT 
  id, 'booking', '30-Minute Business Strategy Session',
  'One-on-one consultation to help you develop a clear business strategy and action plan.',
  999.0, 'ETB', 'active', 156, 5, 4995.0, 30, 'zoom',
  '{"available_hours":["09:00","10:00","11:00","14:00","15:00","16:00"],"timezone":"Africa/Addis_Ababa"}'::jsonb
FROM users WHERE email = 'daniel.mekonnen@example.com'
UNION ALL
SELECT 
  id, 'booking', '1-Hour Deep Dive Business Coaching',
  'Extended coaching session for comprehensive business review and growth planning.',
  1999.0, 'ETB', 'active', 89, 2, 3998.0, 60, 'google_meet',
  '{"available_hours":["10:00","14:00","15:00"],"timezone":"Africa/Addis_Ababa"}'::jsonb
FROM users WHERE email = 'daniel.mekonnen@example.com'
UNION ALL
SELECT 
  id, 'digital', 'Business Plan Template & Guide',
  'Professional business plan template with step-by-step guide and examples.',
  149.99, 'ETB', 'active', 234, 15, 2249.85, NULL, NULL, NULL
FROM users WHERE email = 'daniel.mekonnen@example.com';

-- Sara's products
INSERT INTO products (creator_id, type, title, description, price, currency, status, views_count, sales_count, revenue_total, duration_minutes, booking_type, calendar_settings)
SELECT 
  id, 'digital', 'Home Workout Program: 4 Weeks',
  'Complete 4-week home workout program with video demonstrations and meal plans.',
  249.99, 'ETB', 'active', 312, 18, 4499.82, NULL, NULL, NULL
FROM users WHERE email = 'sara.alemayehu@example.com'
UNION ALL
SELECT 
  id, 'booking', 'Personal Training Session',
  'One-on-one personal training session tailored to your fitness goals.',
  799.0, 'ETB', 'active', 98, 4, 3196.0, 60, 'in_person',
  '{"available_hours":["07:00","08:00","17:00","18:00"],"timezone":"Africa/Addis_Ababa"}'::jsonb
FROM users WHERE email = 'sara.alemayehu@example.com';

-- Yohannes's products
INSERT INTO products (creator_id, type, title, description, price, currency, status, views_count, sales_count, revenue_total)
SELECT 
  id, 'digital', 'Ethiopian Music Production Sample Pack',
  'High-quality sample pack with traditional Ethiopian instruments and modern beats.',
  399.99, 'ETB', 'active', 178, 7, 2799.93
FROM users WHERE email = 'yohannes.hailu@example.com';

-- Marta's products
INSERT INTO products (creator_id, type, title, description, price, currency, status, views_count, sales_count, revenue_total, external_url)
SELECT 
  id, 'digital', 'Digital Art Brushes: Ethiopian Collection',
  'Professional digital art brushes inspired by Ethiopian patterns and textures.',
  179.99, 'ETB', 'active', 267, 11, 1979.89, NULL
FROM users WHERE email = 'marta.girma@example.com'
UNION ALL
SELECT 
  id, 'link', 'Custom Portrait Commission',
  'Commission a custom digital portrait. Click to view portfolio and pricing.',
  0, 'ETB', 'active', 145, 0, 0, 'https://marta-art.example.com/commissions'
FROM users WHERE email = 'marta.girma@example.com';

-- ============================================================================
-- CREATE REFERRAL RELATIONSHIP
-- ============================================================================

INSERT INTO referrals (referrer_id, referred_user_id, status, commission_rate)
SELECT 
  (SELECT id FROM users WHERE email = 'abeba.tesfaye@example.com'),
  (SELECT id FROM users WHERE email = 'daniel.mekonnen@example.com'),
  'active',
  20.0
ON CONFLICT DO NOTHING;

-- ============================================================================
-- INSERT ORDERS
-- ============================================================================

-- Completed orders
INSERT INTO orders (product_id, creator_id, customer_email, customer_name, customer_phone, amount, currency, payment_provider, payment_provider_id, payment_status, paid_at)
SELECT 
  p.id, p.creator_id, 'customer1@example.com', 'Teshome Bekele', '+251911111111',
  p.price, 'ETB', 'telebirr', 'telebirr_txn_001', 'completed', NOW() - INTERVAL '5 days'
FROM products p
JOIN users u ON p.creator_id = u.id
WHERE u.email = 'abeba.tesfaye@example.com' AND p.title LIKE '%Coffee Guide%'
LIMIT 1;

INSERT INTO orders (product_id, creator_id, customer_email, customer_name, customer_phone, amount, currency, payment_provider, payment_provider_id, payment_status, paid_at)
SELECT 
  p.id, p.creator_id, 'customer2@example.com', 'Alemitu Tadesse', '+251922222222',
  p.price, 'ETB', 'telebirr', 'telebirr_txn_002', 'completed', NOW() - INTERVAL '3 days'
FROM products p
JOIN users u ON p.creator_id = u.id
WHERE u.email = 'abeba.tesfaye@example.com' AND p.title LIKE '%Coffee Guide%'
LIMIT 1;

INSERT INTO orders (product_id, creator_id, customer_email, customer_name, customer_phone, amount, currency, payment_provider, payment_provider_id, payment_status, paid_at, booking_datetime, booking_timezone)
SELECT 
  p.id, p.creator_id, 'customer3@example.com', 'Mulugeta Haile', '+251933333333',
  p.price, 'ETB', 'telebirr', 'telebirr_txn_003', 'completed', NOW() - INTERVAL '2 days',
  NOW() + INTERVAL '7 days', 'Africa/Addis_Ababa'
FROM products p
JOIN users u ON p.creator_id = u.id
WHERE u.email = 'daniel.mekonnen@example.com' AND p.title LIKE '%Business Strategy%'
LIMIT 1;

INSERT INTO orders (product_id, creator_id, customer_email, customer_name, customer_phone, amount, currency, payment_provider, payment_provider_id, payment_status, paid_at)
SELECT 
  p.id, p.creator_id, 'customer4@example.com', 'Hirut Assefa', '+251944444444',
  p.price, 'ETB', 'chapa', 'chapa_txn_001', 'completed', NOW() - INTERVAL '1 day'
FROM products p
JOIN users u ON p.creator_id = u.id
WHERE u.email = 'sara.alemayehu@example.com' AND p.title LIKE '%Workout%'
LIMIT 1;

-- Pending orders
INSERT INTO orders (product_id, creator_id, customer_email, customer_name, customer_phone, amount, currency, payment_provider, payment_status)
SELECT 
  p.id, p.creator_id, 'customer5@example.com', 'Kebede Worku', '+251955555555',
  p.price, 'ETB', 'telebirr', 'pending'
FROM products p
JOIN users u ON p.creator_id = u.id
WHERE u.email = 'abeba.tesfaye@example.com' AND p.title LIKE '%Recipes%'
LIMIT 1;

-- Failed orders
INSERT INTO orders (product_id, creator_id, customer_email, customer_name, customer_phone, amount, currency, payment_provider, payment_provider_id, payment_status)
SELECT 
  p.id, p.creator_id, 'customer7@example.com', 'Getachew Mekuria', '+251977777777',
  p.price, 'ETB', 'telebirr', 'telebirr_txn_failed_001', 'failed'
FROM products p
JOIN users u ON p.creator_id = u.id
WHERE u.email = 'sara.alemayehu@example.com' AND p.title LIKE '%Training%'
LIMIT 1;

-- ============================================================================
-- CREATE DOWNLOAD LINKS
-- ============================================================================

INSERT INTO download_links (order_id, product_id, token, expires_at, max_downloads, download_count)
SELECT 
  o.id,
  o.product_id,
  'token_' || o.id::text || '_' || EXTRACT(EPOCH FROM NOW())::bigint::text,
  NOW() + INTERVAL '7 days',
  3,
  0
FROM orders o
JOIN products p ON o.product_id = p.id
WHERE o.payment_status = 'completed' AND p.type = 'digital';

-- ============================================================================
-- CREATE STOREFRONT SETTINGS
-- ============================================================================

INSERT INTO storefront_settings (user_id, theme_name, primary_color, show_fabrica_badge, seo_title, seo_description)
SELECT 
  id,
  CASE (ROW_NUMBER() OVER (ORDER BY email))
    WHEN 1 THEN 'modern'
    WHEN 2 THEN 'minimal'
    ELSE 'bold'
  END,
  CASE (ROW_NUMBER() OVER (ORDER BY email))
    WHEN 1 THEN '#22c55e'
    WHEN 2 THEN '#3b82f6'
    ELSE '#8b5cf6'
  END,
  CASE WHEN subscription_plan = 'creator_pro' THEN false ELSE true END,
  full_name || '''s Store',
  'Shop ' || full_name || '''s products and services'
FROM users
WHERE email LIKE '%@example.com'
LIMIT 3
ON CONFLICT (user_id) DO NOTHING;

COMMIT;

-- Verification
SELECT 
  (SELECT COUNT(*) FROM users WHERE email LIKE '%@example.com') as users,
  (SELECT COUNT(*) FROM products) as products,
  (SELECT COUNT(*) FROM orders) as orders,
  (SELECT COUNT(*) FROM referrals) as referrals,
  (SELECT COUNT(*) FROM download_links) as download_links,
  (SELECT COUNT(*) FROM storefront_settings) as storefront_settings;

