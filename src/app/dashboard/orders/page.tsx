'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@clerk/nextjs'
import { createClient } from '@/lib/supabase/client'
import { DataTable } from '@/components/dashboard/DataTable'
import { StatusBadge } from '@/components/dashboard/StatusBadge'
import {
  Search,
  Filter,
  Download,
  Eye,
  MoreHorizontal,
  Calendar as CalendarIcon,
  Loader2,
  ShoppingBag,
} from 'lucide-react'
import { motion } from 'framer-motion'
import { toast } from 'sonner'
import { format } from 'date-fns'

type Order = {
  id: string
  customer_name: string | null
  customer_email: string | null
  amount: number
  currency: string
  payment_status: string
  created_at: string
  products: { title: string } | null
}

export default function OrdersPage() {
  const { userId, isLoaded } = useAuth()
  const [loading, setLoading] = useState(true)
  const [orders, setOrders] = useState<Order[]>([])
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    async function fetchOrders() {
      if (!isLoaded || !userId) {
        return
      }

      try {
        const supabase = createClient()

        // Get user UUID from Clerk ID
        const { data: user } = await supabase
          .from('users')
          .select('id')
          .eq('clerk_user_id', userId)
          .single()

        if (!user) {
          setLoading(false)
          return
        }

        const { data, error } = await supabase
          .from('orders')
          .select('*, products(title)')
          .eq('creator_id', user.id)
          .order('created_at', { ascending: false })

        if (error) {
          throw error
        }
        setOrders(data || [])
      } catch (error) {
        console.error('Error fetching orders:', error)
        toast.error('Failed to load orders')
      } finally {
        setLoading(false)
      }
    }

    fetchOrders()
  }, [isLoaded, userId])

  const filteredOrders = orders.filter(
    (order) =>
      order.customer_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.id.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const columns = [
    {
      header: 'Order ID',
      accessorKey: 'id',
      className: 'font-medium text-gray-900 w-[120px]',
      cell: (item: Order) => (
        <span className="font-mono text-xs text-gray-500">#{item.id.slice(0, 8)}</span>
      ),
    },
    {
      header: 'Customer',
      cell: (item: Order) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold">
            {item.customer_name?.charAt(0) || '?'}
          </div>
          <div>
            <p className="font-medium text-gray-900">{item.customer_name || 'Guest'}</p>
            <p className="text-xs text-gray-500">{item.customer_email || 'No email'}</p>
          </div>
        </div>
      ),
    },
    {
      header: 'Product',
      accessorKey: 'products.title',
      className: 'text-gray-600 max-w-[200px] truncate',
      cell: (item: Order) => <span>{item.products?.title || 'Unknown Product'}</span>,
    },
    {
      header: 'Date',
      accessorKey: 'created_at',
      className: 'text-gray-500',
      cell: (item: Order) => <span>{format(new Date(item.created_at), 'MMM d, yyyy')}</span>,
    },
    {
      header: 'Amount',
      accessorKey: 'amount',
      className: 'font-medium text-gray-900',
      cell: (item: Order) => (
        <span>
          {item.amount.toLocaleString()} {item.currency}
        </span>
      ),
    },
    {
      header: 'Status',
      accessorKey: 'payment_status',
      cell: (item: Order) => (
        <StatusBadge
          status={item.payment_status}
          type={
            item.payment_status === 'completed'
              ? 'success'
              : item.payment_status === 'pending'
                ? 'warning'
                : item.payment_status === 'failed'
                  ? 'error'
                  : item.payment_status === 'refunded'
                    ? 'neutral'
                    : 'info'
          }
        />
      ),
    },
    {
      header: 'Actions',
      className: 'text-right',
      cell: () => (
        <div className="flex justify-end gap-2">
          <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
            <Eye className="w-4 h-4" />
          </button>
          <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
            <MoreHorizontal className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
        <div className="flex items-center gap-3">
          <button className="flex items-center px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors">
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="p-4 bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative flex-1 w-full sm:max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by customer or order ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-blue-100 transition-all outline-none"
          />
        </div>
        <div className="flex gap-3 w-full sm:w-auto">
          <button className="flex-1 sm:flex-none flex items-center justify-center px-4 py-2 bg-white border border-gray-200 text-gray-600 rounded-xl hover:bg-gray-50 transition-colors">
            <CalendarIcon className="w-4 h-4 mr-2" />
            Date Range
          </button>
          <button className="flex-1 sm:flex-none flex items-center justify-center px-4 py-2 bg-white border border-gray-200 text-gray-600 rounded-xl hover:bg-gray-50 transition-colors">
            <Filter className="w-4 h-4 mr-2" />
            Status
          </button>
        </div>
      </div>

      {/* Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {filteredOrders.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-200">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <ShoppingBag className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900">No orders yet</h3>
            <p className="text-gray-500">
              Your orders will appear here once you start making sales.
            </p>
          </div>
        ) : (
          <DataTable columns={columns} data={filteredOrders} />
        )}
      </motion.div>
    </div>
  )
}
