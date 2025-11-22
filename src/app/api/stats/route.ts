import { createAdminClient } from '@/lib/supabase/admin'
import { successResponse } from '@/lib/api/response'
import { handleApiError } from '@/lib/api/middleware'

/**
 * GET /api/stats
 * Returns platform statistics for the stats section
 */
export async function GET() {
  try {
    const supabase = createAdminClient()

    // Fetch real stats from database
    const [productsResult, ordersResult, revenueResult, creatorsResult] = await Promise.all([
      // Total products created
      supabase.from('products').select('id', { count: 'exact', head: true }),
      // Total orders completed
      supabase
        .from('orders')
        .select('id', { count: 'exact', head: true })
        .eq('payment_status', 'completed'),
      // Total revenue (sum of completed orders)
      supabase.from('orders').select('amount').eq('payment_status', 'completed'),
      // Active creators (users with at least one product)
      supabase
        .from('users')
        .select('id', { count: 'exact', head: true })
        .not('username', 'is', null),
    ])

    // Calculate revenue
    const revenue = revenueResult.data?.reduce((sum, order) => sum + (order.amount || 0), 0) || 0

    const stats = {
      totalProducts: productsResult.count || 0,
      totalOrders: ordersResult.count || 0,
      totalRevenue: revenue,
      activeCreators: creatorsResult.count || 0,
    }

    return successResponse(stats)
  } catch (error) {
    return handleApiError(error)
  }
}
