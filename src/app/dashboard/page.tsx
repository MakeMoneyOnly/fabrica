'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@clerk/nextjs'
import { createClient } from '@/lib/supabase/client'
import { StatsCard } from '@/components/dashboard/StatsCard'
import { ChartContainer } from '@/components/dashboard/ChartContainer'
import { StatusBadge } from '@/components/dashboard/StatusBadge'
import {
  DollarSign,
  Users,
  ShoppingBag,
  TrendingUp,
  Plus,
  ExternalLink,
  Share2,
  Loader2,
} from 'lucide-react'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  TooltipProps,
  ResponsiveContainer,
} from 'recharts'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns'

// Types
type DashboardStats = {
  totalRevenue: number
  storeVisits: number
  activeProducts: number
  conversionRate: number
  revenueTrend: number
  visitsTrend: number
  productsTrend: number
  conversionTrend: number
}

type RecentOrder = {
  id: string
  customer_name: string
  amount: number
  currency: string
  payment_status: string
  created_at: string
  products: { title: string } | null
}

const CustomTooltip = ({ active, payload, label }: TooltipProps<number, string>) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border border-gray-100 shadow-lg rounded-lg">
        <p className="text-sm font-medium text-gray-900">{label}</p>
        <p className="text-sm text-blue-600 font-semibold">
          ETB {payload[0].value?.toLocaleString()}
        </p>
      </div>
    )
  }
  return null
}

export default function DashboardPage() {
  const { userId, isLoaded } = useAuth()
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const [stats, setStats] = useState<DashboardStats>({
    totalRevenue: 0,
    storeVisits: 0,
    activeProducts: 0,
    conversionRate: 0,
    revenueTrend: 0,
    visitsTrend: 0,
    productsTrend: 0,
    conversionTrend: 0,
  })
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([])
  const [chartData, setChartData] = useState<any[]>([])

  useEffect(() => {
    async function fetchData() {
      if (!isLoaded || !userId) return

      try {
        const supabase = createClient()

        // 1. Get User UUID from Clerk ID
        const { data: user, error: userError } = await supabase
          .from('users')
          .select('id, full_name, username')
          .eq('clerk_user_id', userId)
          .single()

        if (userError || !user) {
          console.error('User not found:', userError)
          setLoading(false)
          return
        }

        setUser(user)

        // 2. Get Products Count
        const { count: productsCount } = await supabase
          .from('products')
          .select('*', { count: 'exact', head: true })
          .eq('creator_id', user.id)
          .eq('status', 'active')

        // 3. Get Orders & Revenue
        const { data: orders } = await supabase
          .from('orders')
          .select('*, products(title)')
          .eq('creator_id', user.id)
          .order('created_at', { ascending: false })

        const totalRevenue =
          orders?.reduce((sum, order) => {
            return order.payment_status === 'completed' ? sum + (order.amount || 0) : sum
          }, 0) || 0

        // 4. Prepare Chart Data
        const mockChartData = [
          { name: 'Jan', total: totalRevenue * 0.1 },
          { name: 'Feb', total: totalRevenue * 0.15 },
          { name: 'Mar', total: totalRevenue * 0.12 },
          { name: 'Apr', total: totalRevenue * 0.2 },
          { name: 'May', total: totalRevenue * 0.18 },
          { name: 'Jun', total: totalRevenue * 0.25 },
          { name: 'Jul', total: totalRevenue * 0.3 },
        ]

        setStats({
          totalRevenue,
          storeVisits: 0, // TODO: Implement analytics tracking
          activeProducts: productsCount || 0,
          conversionRate: 0, // TODO: Calculate from orders/visits
          revenueTrend: 12.5,
          visitsTrend: 8.2,
          productsTrend: productsCount ? 100 : 0,
          conversionTrend: -1.2,
        })

        setRecentOrders(orders?.slice(0, 5) || [])
        setChartData(mockChartData)
      } catch (error) {
        console.error('Error fetching dashboard data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [isLoaded, userId])

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    )
  }

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-8">
      {/* Welcome & Quick Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Good Morning, {user?.full_name?.split(' ')[0] || 'Creator'}! 👋
          </h2>
          <p className="text-gray-500">Here's what's happening with your store today.</p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/dashboard/products/new">
            <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm shadow-blue-200">
              <Plus className="w-4 h-4 mr-2" />
              Create Product
            </button>
          </Link>
          <Link href={`/${user?.username}`} target="_blank">
            <button className="flex items-center px-4 py-2 bg-white text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <ExternalLink className="w-4 h-4 mr-2" />
              View Store
            </button>
          </Link>
          <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg border border-gray-200 transition-colors">
            <Share2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Revenue"
          value={`ETB ${stats.totalRevenue.toLocaleString()}`}
          icon={DollarSign}
          trend={{ value: stats.revenueTrend, isPositive: stats.revenueTrend >= 0 }}
        />
        <StatsCard
          title="Store Visits"
          value={stats.storeVisits.toLocaleString()}
          icon={Users}
          trend={{ value: stats.visitsTrend, isPositive: stats.visitsTrend >= 0 }}
        />
        <StatsCard
          title="Active Products"
          value={stats.activeProducts.toString()}
          icon={ShoppingBag}
          trend={{ value: stats.productsTrend, isPositive: stats.productsTrend >= 0 }}
        />
        <StatsCard
          title="Conversion Rate"
          value={`${stats.conversionRate}%`}
          icon={TrendingUp}
          trend={{ value: stats.conversionTrend, isPositive: stats.conversionTrend >= 0 }}
        />
      </div>

      {/* Charts & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Revenue Chart */}
        <motion.div variants={item} className="lg:col-span-2">
          <ChartContainer
            title="Revenue Overview"
            description="Your earnings over the last 7 months"
          >
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.1} />
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#6b7280', fontSize: 12 }}
                  dy={10}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#6b7280', fontSize: 12 }}
                  tickFormatter={(value) => `ETB ${value}`}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="total"
                  stroke="#2563eb"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorTotal)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </ChartContainer>
        </motion.div>

        {/* Recent Orders */}
        <motion.div variants={item} className="lg:col-span-1">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden h-full">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Recent Orders</h3>
              <Link
                href="/dashboard/orders"
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                View All
              </Link>
            </div>
            <div className="divide-y divide-gray-100">
              {recentOrders.length > 0 ? (
                recentOrders.map((order) => (
                  <div
                    key={order.id}
                    className="p-4 hover:bg-gray-50 transition-colors flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 font-medium text-sm">
                        {order.customer_name?.charAt(0) || '?'}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {order.customer_name || 'Guest'}
                        </p>
                        <p className="text-xs text-gray-500 truncate max-w-[120px]">
                          {order.products?.title || 'Product'}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">
                        {order.amount.toLocaleString()} {order.currency}
                      </p>
                      <StatusBadge
                        status={order.payment_status}
                        type={
                          order.payment_status === 'completed'
                            ? 'success'
                            : order.payment_status === 'pending'
                              ? 'warning'
                              : order.payment_status === 'failed'
                                ? 'error'
                                : 'neutral'
                        }
                        className="mt-1"
                      />
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center text-gray-500">No orders yet.</div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}
