import { useQuery } from '@tanstack/react-query'

/**
 * React Query hooks for analytics operations
 * These are stubs that will be implemented when analytics APIs are ready
 */

/**
 * Fetch analytics data
 */
export function useAnalytics() {
  return useQuery({
    queryKey: ['analytics'],
    queryFn: async () => {
      // TODO: Implement when /api/analytics/overview endpoint is ready
      const response = await fetch('/api/analytics/overview')
      if (!response.ok) {
        throw new Error('Failed to fetch analytics')
      }
      const data = await response.json()
      return data.data
    },
  })
}

/**
 * Fetch stats (used by StatsSection component)
 */
export function useStats() {
  return useQuery({
    queryKey: ['stats'],
    queryFn: async () => {
      const response = await fetch('/api/stats')
      if (!response.ok) {
        throw new Error('Failed to fetch stats')
      }
      const data = await response.json()
      return data.data
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}
