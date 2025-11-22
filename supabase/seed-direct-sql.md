# Direct SQL Seed Script (Bypasses PostgREST)

Since PostgREST schema cache is stuck, use this SQL script to seed data directly.

## How to Use

1. Open Supabase Dashboard → SQL Editor
2. Copy and paste the SQL below
3. Click "Run"

## Alternative: Use Supabase CLI

If you have Supabase CLI installed:

```bash
npx supabase db push
npx supabase db reset --db-url "postgresql://postgres:[PASSWORD]@[HOST]:5432/postgres"
```

## SQL Seed Script

```sql
-- Clear existing seed data
DELETE FROM referral_commissions;
DELETE FROM download_links;
DELETE FROM orders;
DELETE FROM referrals;
DELETE FROM products;
DELETE FROM storefront_settings;
DELETE FROM users WHERE email LIKE '%@example.com';

-- Insert test users
INSERT INTO users (clerk_user_id, email, username, full_name, bio, phone, subscription_plan, subscription_status, telebirr_account, telebirr_verified, social_links, trial_ends_at)
VALUES
  ('user_seed_1', 'abeba.tesfaye@example.com', 'abeba', 'Abeba Tesfaye', 'Coffee enthusiast and digital creator sharing Ethiopian coffee culture', '+251911234567', 'creator_pro', 'active', '0911234567', true, '{"instagram":"https://instagram.com/abeba","tiktok":"https://tiktok.com/@abeba","twitter":"https://twitter.com/abeba"}'::jsonb, NULL),
  ('user_seed_2', 'daniel.mekonnen@example.com', 'daniel', 'Daniel Mekonnen', 'Business coach helping entrepreneurs grow their businesses', '+251922345678', 'creator', 'active', '0922345678', true, '{"linkedin":"https://linkedin.com/in/daniel","twitter":"https://twitter.com/daniel"}'::jsonb, NULL),
  ('user_seed_3', 'sara.alemayehu@example.com', 'sara', 'Sara Alemayehu', 'Fitness trainer and wellness coach', '+251933456789', 'trial', 'active', NULL, false, '{"instagram":"https://instagram.com/sara","youtube":"https://youtube.com/@sara"}'::jsonb, NOW() + INTERVAL '14 days'),
  ('user_seed_4', 'yohannes.hailu@example.com', 'yohannes', 'Yohannes Hailu', 'Music producer and sound engineer', '+251944567890', 'creator', 'active', '0944567890', false, '{"spotify":"https://spotify.com/artist/yohannes","instagram":"https://instagram.com/yohannes"}'::jsonb, NULL),
  ('user_seed_5', 'marta.girma@example.com', 'marta', 'Marta Girma', 'Digital artist and illustrator', '+251955678901', 'creator_pro', 'active', '0955678901', true, '{"instagram":"https://instagram.com/marta","behance":"https://behance.net/marta"}'::jsonb, NULL)
RETURNING id, email, username;

-- Get user IDs for foreign key relationships
-- (Continue with products, orders, etc. using the returned IDs)
```
