/**
 * Database Seed Script for Development
 *
 * This script populates the development database with realistic sample data
 * for testing and development purposes.
 *
 * Usage:
 *   npm run db:seed
 *
 * Requirements:
 *   - NEXT_PUBLIC_SUPABASE_URL must be set (in .env.local or environment)
 *   - SUPABASE_SERVICE_ROLE_KEY must be set (in .env.local or environment)
 *
 * Note: This script will automatically load environment variables from .env.local
 *
 * Troubleshooting:
 *   If you encounter PGRST205 schema cache errors, use the alternative SQL seed script:
 *   1. Open Supabase Dashboard → SQL Editor
 *   2. Copy and paste the contents of supabase/seed-complete.sql
 *   3. Click "Run"
 *
 *   This bypasses PostgREST entirely and seeds data directly via SQL.
 */

// Load environment variables from .env.local if it exists
import dotenv from 'dotenv'
import { resolve } from 'path'

// Try to load .env.local, fallback to .env if it doesn't exist
dotenv.config({ path: resolve(process.cwd(), '.env.local') })
dotenv.config({ path: resolve(process.cwd(), '.env') })

import { getAdminClient } from '../src/lib/supabase/admin'

// Get admin client (will be initialized when seed() runs)
let supabase: ReturnType<typeof getAdminClient>

// Verify connection and schema
async function verifyConnection() {
  console.log('🔍 Verifying database connection...')
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  console.log(`   URL: ${supabaseUrl ? new URL(supabaseUrl).origin : 'NOT SET'}`)

  // Initialize client
  supabase = getAdminClient()

  // First, try to reload the PostgREST schema cache
  // This is necessary when tables are created via migrations but the cache hasn't refreshed
  console.log('   🔄 Attempting to reload PostgREST schema cache...')
  // Note: The NOTIFY command needs to be executed via direct database connection
  // For now, we'll rely on retries with delays to allow the cache to auto-refresh

  // Test connection by querying a simple table
  // Retry logic in case schema cache needs more time to refresh
  let retries = 5
  let lastError: Error | null = null

  while (retries > 0) {
    const { data, error } = await supabase.from('users').select('id').limit(1)

    if (!error) {
      console.log('   ✅ Database connection verified')
      return
    }

    // Check if it's a schema cache error
    if (error.code === 'PGRST205' || error.message?.includes('schema cache')) {
      lastError = error as Error
      retries--

      if (retries > 0) {
        console.log(`   ⚠️  Schema cache not ready, waiting... (${retries} attempts left)`)
        // Wait longer between retries for schema cache to refresh
        await new Promise((resolve) => setTimeout(resolve, 2000))

        // Try to reload schema cache again
        // Note: exec_sql RPC may not be available, so we wrap in try-catch
        // Using type assertion since this RPC may not exist in all Supabase projects
        try {
          const rpcResult = await (supabase.rpc as any)('exec_sql', {
            sql: "NOTIFY pgrst, 'reload schema';",
          })
          if (rpcResult?.error) {
            // RPC not available or failed - ignore
          }
        } catch {
          // Ignore - RPC may not exist
        }
      }
    } else {
      // Different error - don't retry
      console.error(`   ❌ Connection error: ${error.message}`)
      throw new Error(`Database connection failed: ${error.message}`)
    }
  }

  console.error(`   ❌ Schema cache error after retries: ${lastError?.message}`)
  console.error(`   Error details:`, lastError)
  console.error(`\n   💡 Troubleshooting steps:`)
  console.error(`   1. Reload the schema cache by running this SQL in Supabase SQL Editor:`)
  console.error(`      NOTIFY pgrst, 'reload schema';`)
  console.error(`   2. Or restart your Supabase project in the dashboard`)
  console.error(`   3. Wait 30-60 seconds after reloading, then try again`)
  console.error(`   4. Verify migrations have been applied: npx supabase migration list`)
  console.error(`   5. Ensure your Supabase project is active (not paused)`)
  throw new Error(
    `Database connection failed: Schema cache needs to be reloaded. See troubleshooting tips above.`
  )
}

/**
 * Main seed function
 * Creates realistic development data including users, products, orders, referrals, etc.
 */
async function seed() {
  console.log('🌱 Starting database seed...')

  try {
    // Initialize supabase client
    supabase = getAdminClient()

    // Skip PostgREST verification if schema cache is stuck
    // We'll proceed with seeding and handle errors as they occur
    console.log('⚠️  Skipping PostgREST schema cache verification (known issue with PGRST205)')
    console.log('   Proceeding with direct seeding - errors will be shown if they occur')

    // Try a simple query to check if PostgREST is working
    try {
      const testQuery = await supabase.from('users').select('id').limit(1)
      if (testQuery.error && testQuery.error.code === 'PGRST205') {
        console.log(
          "   ⚠️  PostgREST schema cache issue detected - this is OK, we'll proceed anyway"
        )
        console.log('   💡 If inserts fail, restart your Supabase project in the dashboard')
      } else if (!testQuery.error) {
        console.log('   ✅ PostgREST connection verified')
      }
    } catch (err) {
      // Ignore test query errors - we'll proceed with seeding
      console.log('   ⚠️  Could not verify connection, proceeding anyway')
    }
    // Clear existing data (optional - comment out if you want to keep existing data)
    console.log('🧹 Cleaning existing data...')
    await supabase
      .from('referral_commissions')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000')
    await supabase.from('download_links').delete().neq('id', '00000000-0000-0000-0000-000000000000')
    await supabase.from('orders').delete().neq('id', '00000000-0000-0000-0000-000000000000')
    await supabase.from('referrals').delete().neq('id', '00000000-0000-0000-0000-000000000000')
    await supabase.from('products').delete().neq('id', '00000000-0000-0000-0000-000000000000')
    await supabase
      .from('storefront_settings')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000')
    await supabase.from('users').delete().neq('id', '00000000-0000-0000-0000-000000000000')

    // Create test users
    console.log('👥 Creating test users...')

    // Handle PostgREST schema cache errors gracefully
    let users: Array<{
      id: string
      subscription_plan: string | null
      full_name: string | null
    }> | null = null
    let usersError: any = null

    try {
      const result = await supabase
        .from('users')
        .insert([
          {
            clerk_user_id: 'user_seed_1',
            email: 'abeba.tesfaye@example.com',
            username: 'abeba',
            full_name: 'Abeba Tesfaye',
            bio: 'Coffee enthusiast and digital creator sharing Ethiopian coffee culture',
            phone: '+251911234567',
            subscription_plan: 'creator_pro',
            subscription_status: 'active',
            telebirr_account: '0911234567',
            telebirr_verified: true,
            social_links: {
              instagram: 'https://instagram.com/abeba',
              tiktok: 'https://tiktok.com/@abeba',
              twitter: 'https://twitter.com/abeba',
            },
          },
          {
            clerk_user_id: 'user_seed_2',
            email: 'daniel.mekonnen@example.com',
            username: 'daniel',
            full_name: 'Daniel Mekonnen',
            bio: 'Business coach helping entrepreneurs grow their businesses',
            phone: '+251922345678',
            subscription_plan: 'creator',
            subscription_status: 'active',
            telebirr_account: '0922345678',
            telebirr_verified: true,
            social_links: {
              linkedin: 'https://linkedin.com/in/daniel',
              twitter: 'https://twitter.com/daniel',
            },
          },
          {
            clerk_user_id: 'user_seed_3',
            email: 'sara.alemayehu@example.com',
            username: 'sara',
            full_name: 'Sara Alemayehu',
            bio: 'Fitness trainer and wellness coach',
            phone: '+251933456789',
            subscription_plan: 'trial',
            subscription_status: 'active',
            trial_ends_at: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
            social_links: {
              instagram: 'https://instagram.com/sara',
              youtube: 'https://youtube.com/@sara',
            },
          },
          {
            clerk_user_id: 'user_seed_4',
            email: 'yohannes.hailu@example.com',
            username: 'yohannes',
            full_name: 'Yohannes Hailu',
            bio: 'Music producer and sound engineer',
            phone: '+251944567890',
            subscription_plan: 'creator',
            subscription_status: 'active',
            telebirr_account: '0944567890',
            telebirr_verified: false,
            social_links: {
              spotify: 'https://spotify.com/artist/yohannes',
              instagram: 'https://instagram.com/yohannes',
            },
          },
          {
            clerk_user_id: 'user_seed_5',
            email: 'marta.girma@example.com',
            username: 'marta',
            full_name: 'Marta Girma',
            bio: 'Digital artist and illustrator',
            phone: '+251955678901',
            subscription_plan: 'creator_pro',
            subscription_status: 'active',
            telebirr_account: '0955678901',
            telebirr_verified: true,
            social_links: {
              instagram: 'https://instagram.com/marta',
              behance: 'https://behance.net/marta',
            },
          },
        ])
        .select('id, subscription_plan, full_name')

      users = result.data
      usersError = result.error
    } catch (err: any) {
      usersError = err
    }

    if (usersError) {
      if (usersError.code === 'PGRST205' || usersError.message?.includes('schema cache')) {
        console.error(`\n   ❌ PostgREST schema cache error: ${usersError.message}`)
        console.error(`\n   🔧 REQUIRED FIX:`)
        console.error(`   1. Go to Supabase Dashboard → Settings → Database`)
        console.error(`   2. Click "Restart Project" (this will reload PostgREST schema cache)`)
        console.error(`   3. Wait 2-3 minutes for the project to restart`)
        console.error(`   4. Run this script again: npm run db:seed`)
        console.error(`\n   Alternative: Contact Supabase support if restart doesn't work`)
        throw new Error(`PostgREST schema cache needs project restart. See instructions above.`)
      }
      throw new Error(`Failed to create users: ${usersError.message}`)
    }

    console.log(`✅ Created ${users?.length || 0} users`)

    // Create referral relationship (Daniel referred by Abeba)
    if (users && users.length >= 2) {
      console.log('🔗 Creating referral relationships...')
      const { error: referralError } = await supabase.from('referrals').insert({
        referrer_id: users[0].id, // Abeba
        referred_user_id: users[1].id, // Daniel
        status: 'active',
        commission_rate: 20.0,
      })

      if (referralError) {
        console.warn(`⚠️ Failed to create referral: ${referralError.message}`)
      } else {
        console.log('✅ Created referral relationship')
      }
    }

    // Create products
    console.log('📦 Creating products...')
    const products: Array<{ id: string; type: string }> = []
    if (users && users.length > 0) {
      // Abeba's products
      const abebaProducts = [
        {
          creator_id: users[0].id,
          type: 'digital',
          title: 'Ethiopian Coffee Guide: From Bean to Cup',
          description:
            'A comprehensive 50-page guide covering Ethiopian coffee culture, brewing methods, and traditional ceremonies. Includes recipes and cultural insights.',
          price: 299.99,
          currency: 'ETB',
          status: 'active',
          views_count: 245,
          sales_count: 12,
          revenue_total: 3599.88,
        },
        {
          creator_id: users[0].id,
          type: 'digital',
          title: 'Traditional Ethiopian Recipes Collection',
          description:
            'Digital cookbook with 30 authentic Ethiopian recipes, including injera, doro wat, and more.',
          price: 199.99,
          currency: 'ETB',
          status: 'active',
          views_count: 189,
          sales_count: 8,
          revenue_total: 1599.92,
        },
        {
          creator_id: users[0].id,
          type: 'link',
          title: 'Premium Coffee Subscription',
          description:
            'Monthly subscription to premium Ethiopian coffee beans delivered to your door.',
          price: 999.99,
          currency: 'ETB',
          external_url: 'https://coffee-subscription.example.com',
          status: 'active',
          views_count: 67,
          sales_count: 3,
          revenue_total: 2999.97,
        },
      ]

      // Daniel's products
      const danielProducts = [
        {
          creator_id: users[1].id,
          type: 'booking',
          title: '30-Minute Business Strategy Session',
          description:
            'One-on-one consultation to help you develop a clear business strategy and action plan.',
          price: 999.0,
          currency: 'ETB',
          duration_minutes: 30,
          booking_type: 'zoom',
          calendar_settings: {
            available_hours: ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00'],
            timezone: 'Africa/Addis_Ababa',
          },
          status: 'active',
          views_count: 156,
          sales_count: 5,
          revenue_total: 4995.0,
        },
        {
          creator_id: users[1].id,
          type: 'booking',
          title: '1-Hour Deep Dive Business Coaching',
          description:
            'Extended coaching session for comprehensive business review and growth planning.',
          price: 1999.0,
          currency: 'ETB',
          duration_minutes: 60,
          booking_type: 'google_meet',
          calendar_settings: {
            available_hours: ['10:00', '14:00', '15:00'],
            timezone: 'Africa/Addis_Ababa',
          },
          status: 'active',
          views_count: 89,
          sales_count: 2,
          revenue_total: 3998.0,
        },
        {
          creator_id: users[1].id,
          type: 'digital',
          title: 'Business Plan Template & Guide',
          description: 'Professional business plan template with step-by-step guide and examples.',
          price: 149.99,
          currency: 'ETB',
          status: 'active',
          views_count: 234,
          sales_count: 15,
          revenue_total: 2249.85,
        },
      ]

      // Sara's products
      const saraProducts = [
        {
          creator_id: users[2].id,
          type: 'digital',
          title: 'Home Workout Program: 4 Weeks',
          description:
            'Complete 4-week home workout program with video demonstrations and meal plans.',
          price: 249.99,
          currency: 'ETB',
          status: 'active',
          views_count: 312,
          sales_count: 18,
          revenue_total: 4499.82,
        },
        {
          creator_id: users[2].id,
          type: 'booking',
          title: 'Personal Training Session',
          description: 'One-on-one personal training session tailored to your fitness goals.',
          price: 799.0,
          currency: 'ETB',
          duration_minutes: 60,
          booking_type: 'in_person',
          calendar_settings: {
            available_hours: ['07:00', '08:00', '17:00', '18:00'],
            timezone: 'Africa/Addis_Ababa',
          },
          status: 'active',
          views_count: 98,
          sales_count: 4,
          revenue_total: 3196.0,
        },
      ]

      // Yohannes's products
      const yohannesProducts = [
        {
          creator_id: users[3].id,
          type: 'digital',
          title: 'Ethiopian Music Production Sample Pack',
          description:
            'High-quality sample pack with traditional Ethiopian instruments and modern beats.',
          price: 399.99,
          currency: 'ETB',
          status: 'active',
          views_count: 178,
          sales_count: 7,
          revenue_total: 2799.93,
        },
      ]

      // Marta's products
      const martaProducts = [
        {
          creator_id: users[4].id,
          type: 'digital',
          title: 'Digital Art Brushes: Ethiopian Collection',
          description:
            'Professional digital art brushes inspired by Ethiopian patterns and textures.',
          price: 179.99,
          currency: 'ETB',
          status: 'active',
          views_count: 267,
          sales_count: 11,
          revenue_total: 1979.89,
        },
        {
          creator_id: users[4].id,
          type: 'link',
          title: 'Custom Portrait Commission',
          description: 'Commission a custom digital portrait. Click to view portfolio and pricing.',
          price: 0,
          currency: 'ETB',
          external_url: 'https://marta-art.example.com/commissions',
          status: 'active',
          views_count: 145,
          sales_count: 0,
          revenue_total: 0,
        },
      ]

      const allProducts = [
        ...abebaProducts,
        ...danielProducts,
        ...saraProducts,
        ...yohannesProducts,
        ...martaProducts,
      ]

      const { data: createdProducts, error: productsError } = await supabase
        .from('products')
        .insert(allProducts)
        .select()

      if (productsError) {
        throw new Error(`Failed to create products: ${productsError.message}`)
      }

      products.push(...(createdProducts || []))
      console.log(`✅ Created ${products.length} products`)
    }

    // Create orders
    console.log('🛒 Creating orders...')
    if (users && products && products.length > 0) {
      const orders = [
        // Completed orders
        {
          product_id: products[0].id,
          creator_id: users[0].id,
          customer_email: 'customer1@example.com',
          customer_name: 'Teshome Bekele',
          customer_phone: '+251911111111',
          amount: 299.99,
          currency: 'ETB',
          payment_provider: 'telebirr',
          payment_provider_id: 'telebirr_txn_001',
          payment_status: 'completed',
          paid_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
          product_id: products[0].id,
          creator_id: users[0].id,
          customer_email: 'customer2@example.com',
          customer_name: 'Alemitu Tadesse',
          customer_phone: '+251922222222',
          amount: 299.99,
          currency: 'ETB',
          payment_provider: 'telebirr',
          payment_provider_id: 'telebirr_txn_002',
          payment_status: 'completed',
          paid_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
          product_id: products[3].id,
          creator_id: users[1].id,
          customer_email: 'customer3@example.com',
          customer_name: 'Mulugeta Haile',
          customer_phone: '+251933333333',
          amount: 999.0,
          currency: 'ETB',
          payment_provider: 'telebirr',
          payment_provider_id: 'telebirr_txn_003',
          payment_status: 'completed',
          paid_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          booking_datetime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          booking_timezone: 'Africa/Addis_Ababa',
        },
        {
          product_id: products[5].id,
          creator_id: users[2].id,
          customer_email: 'customer4@example.com',
          customer_name: 'Hirut Assefa',
          customer_phone: '+251944444444',
          amount: 249.99,
          currency: 'ETB',
          payment_provider: 'chapa',
          payment_provider_id: 'chapa_txn_001',
          payment_status: 'completed',
          paid_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        },
        // Pending orders
        {
          product_id: products[1].id,
          creator_id: users[0].id,
          customer_email: 'customer5@example.com',
          customer_name: 'Kebede Worku',
          customer_phone: '+251955555555',
          amount: 199.99,
          currency: 'ETB',
          payment_provider: 'telebirr',
          payment_provider_id: null,
          payment_status: 'pending',
        },
        {
          product_id: products[4].id,
          creator_id: users[1].id,
          customer_email: 'customer6@example.com',
          customer_name: 'Selamawit Gebre',
          customer_phone: '+251966666666',
          amount: 1999.0,
          currency: 'ETB',
          payment_provider: 'telebirr',
          payment_provider_id: null,
          payment_status: 'pending',
        },
        // Failed orders
        {
          product_id: products[6].id,
          creator_id: users[2].id,
          customer_email: 'customer7@example.com',
          customer_name: 'Getachew Mekuria',
          customer_phone: '+251977777777',
          amount: 799.0,
          currency: 'ETB',
          payment_provider: 'telebirr',
          payment_provider_id: 'telebirr_txn_failed_001',
          payment_status: 'failed',
        },
      ]

      const { data: createdOrders, error: ordersError } = await supabase
        .from('orders')
        .insert(orders)
        .select()

      if (ordersError) {
        throw new Error(`Failed to create orders: ${ordersError.message}`)
      }

      console.log(`✅ Created ${createdOrders?.length || 0} orders`)

      // Create download links for completed digital product orders
      if (createdOrders) {
        const digitalOrders = createdOrders.filter(
          (order) =>
            order.payment_status === 'completed' &&
            products.find((p) => p.id === order.product_id)?.type === 'digital'
        )

        if (digitalOrders.length > 0) {
          console.log('🔗 Creating download links...')
          const downloadLinks = digitalOrders.map((order) => {
            const product = products.find((p) => p.id === order.product_id)
            const expiresAt = new Date()
            expiresAt.setDate(expiresAt.getDate() + 7) // 7 days from now

            return {
              order_id: order.id,
              product_id: order.product_id,
              token: `token_${order.id}_${Date.now()}`,
              expires_at: expiresAt.toISOString(),
              max_downloads: 3,
              download_count: 0,
            }
          })

          const { error: linksError } = await supabase.from('download_links').insert(downloadLinks)

          if (linksError) {
            console.warn(`⚠️ Failed to create download links: ${linksError.message}`)
          } else {
            console.log(`✅ Created ${downloadLinks.length} download links`)
          }
        }
      }
    }

    // Create storefront settings
    console.log('🎨 Creating storefront settings...')
    if (users && users.length > 0) {
      const storefrontSettings = users.slice(0, 3).map((user) => ({
        user_id: user.id,
        theme_name: ['modern', 'minimal', 'bold'][Math.floor(Math.random() * 3)],
        primary_color: ['#22c55e', '#3b82f6', '#8b5cf6'][Math.floor(Math.random() * 3)],
        show_fabrica_badge: user.subscription_plan === 'creator_pro' ? false : true,
        seo_title: `${user.full_name || 'User'}'s Store`,
        seo_description: `Shop ${user.full_name || 'User'}'s products and services`,
      }))

      const { error: settingsError } = await supabase
        .from('storefront_settings')
        .insert(storefrontSettings)

      if (settingsError) {
        console.warn(`⚠️ Failed to create storefront settings: ${settingsError.message}`)
      } else {
        console.log(`✅ Created ${storefrontSettings.length} storefront settings`)
      }
    }

    console.log('✅ Database seeded successfully!')
    console.log('\n📊 Summary:')
    console.log(`   - Users: ${users?.length || 0}`)
    console.log(`   - Products: ${products.length}`)
    console.log(
      `   - Orders: ${(await supabase.from('orders').select('id', { count: 'exact' })).count || 0}`
    )
  } catch (error) {
    console.error('❌ Error seeding database:', error)
    process.exit(1)
  }
}

// Run seed if this file is executed directly
seed()
  .then(() => {
    console.log('✨ Seed completed!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('💥 Seed failed:', error)
    process.exit(1)
  })

export default seed
