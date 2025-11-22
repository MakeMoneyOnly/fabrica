import { QueryClient } from '@tanstack/react-query'

/**
 * React Query client configuration
 * Sets default options for all queries and mutations
 */
export const queryClientConfig = {
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes - data is fresh for 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes - cache time (formerly cacheTime)
      retry: 3, // Retry failed requests 3 times
      refetchOnWindowFocus: false, // Don't refetch when window regains focus
      refetchOnReconnect: true, // Refetch when network reconnects
    },
    mutations: {
      retry: 1, // Retry failed mutations once
    },
  },
}

/**
 * Create a new QueryClient instance with configured options
 */
export function createQueryClient() {
  return new QueryClient(queryClientConfig)
}
