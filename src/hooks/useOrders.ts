import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

/**
 * React Query hooks for order operations
 * These are stubs that will be implemented when order APIs are ready
 */

/**
 * Fetch user's orders
 */
export function useOrders() {
  return useQuery({
    queryKey: ['orders'],
    queryFn: async () => {
      // TODO: Implement when /api/orders endpoint is ready
      const response = await fetch('/api/orders')
      if (!response.ok) {
        throw new Error('Failed to fetch orders')
      }
      const data = await response.json()
      return data.data
    },
  })
}

/**
 * Fetch a single order by ID
 */
export function useOrder(id: string) {
  return useQuery({
    queryKey: ['orders', id],
    queryFn: async () => {
      // TODO: Implement when /api/orders/:id endpoint is ready
      const response = await fetch(`/api/orders/${id}`)
      if (!response.ok) {
        throw new Error('Failed to fetch order')
      }
      const data = await response.json()
      return data.data
    },
    enabled: !!id,
  })
}

/**
 * Refund an order
 */
export function useRefundOrder() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      orderId,
      reason,
      amount,
    }: {
      orderId: string
      reason: string
      amount?: number
    }) => {
      // TODO: Implement when POST /api/orders/:id/refund endpoint is ready
      const response = await fetch(`/api/orders/${orderId}/refund`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason, amount }),
      })
      if (!response.ok) {
        throw new Error('Failed to refund order')
      }
      const data = await response.json()
      return data.data
    },
    onSuccess: (_, variables) => {
      // Invalidate both orders list and specific order
      queryClient.invalidateQueries({ queryKey: ['orders'] })
      queryClient.invalidateQueries({ queryKey: ['orders', variables.orderId] })
    },
  })
}
