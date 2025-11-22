/**
 * Alternative Seed Script Using Direct SQL Execution
 *
 * This script bypasses PostgREST schema cache issues by using direct SQL execution
 * via Supabase MCP tools. Use this if the regular seed script fails with PGRST205 errors.
 *
 * Usage:
 *   This script is designed to be run manually via MCP tools or can be adapted
 *   to use a direct PostgreSQL connection.
 *
 * Note: This requires direct database access, not available via Supabase JS client
 */

// This is a reference implementation showing how to seed via direct SQL
// The actual execution should be done via MCP Supabase tools or psql

export const seedSQL = `
-- Clear existing seed data
DELETE FROM referral_commissions WHERE id IS NOT NULL;
DELETE FROM download_links WHERE id IS NOT NULL;
DELETE FROM orders WHERE id IS NOT NULL;
DELETE FROM referrals WHERE id IS NOT NULL;
DELETE FROM products WHERE id IS NOT NULL;
DELETE FROM storefront_settings WHERE id IS NOT NULL;
DELETE FROM users WHERE email LIKE '%@example.com';

-- Insert test users
INSERT INTO users (clerk_user_id, email, username, full_name, bio, phone, subscription_plan, subscription_status, telebirr_account, telebirr_verified, social_links)
VALUES
  ('user_seed_1', 'abeba.tesfaye@example.com', 'abeba', 'Abeba Tesfaye', 'Coffee enthusiast and digital creator sharing Ethiopian coffee culture', '+251911234567', 'creator_pro', 'active', '0911234567', true, '{"instagram":"https://instagram.com/abeba","tiktok":"https://tiktok.com/@abeba","twitter":"https://twitter.com/abeba"}'::jsonb),
  ('user_seed_2', 'daniel.mekonnen@example.com', 'daniel', 'Daniel Mekonnen', 'Business coach helping entrepreneurs grow their businesses', '+251922345678', 'creator', 'active', '0922345678', true, '{"linkedin":"https://linkedin.com/in/daniel","twitter":"https://twitter.com/daniel"}'::jsonb),
  ('user_seed_3', 'sara.alemayehu@example.com', 'sara', 'Sara Alemayehu', 'Fitness trainer and wellness coach', '+251933456789', 'trial', 'active', NULL, false, '{"instagram":"https://instagram.com/sara","youtube":"https://youtube.com/@sara"}'::jsonb),
  ('user_seed_4', 'yohannes.hailu@example.com', 'yohannes', 'Yohannes Hailu', 'Music producer and sound engineer', '+251944567890', 'creator', 'active', '0944567890', false, '{"spotify":"https://spotify.com/artist/yohannes","instagram":"https://instagram.com/yohannes"}'::jsonb),
  ('user_seed_5', 'marta.girma@example.com', 'marta', 'Marta Girma', 'Digital artist and illustrator', '+251955678901', 'creator_pro', 'active', '0955678901', true, '{"instagram":"https://instagram.com/marta","behance":"https://behance.net/marta"}'::jsonb)
RETURNING id, email, username;

-- Note: Continue with products, orders, etc. using the returned user IDs
`
