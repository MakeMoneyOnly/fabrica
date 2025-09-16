/**
 * Ethiopian Query Client Configuration
 * Optimized for Ethiopian creator platform with network-aware caching and Ethiopian data patterns
 */

import { QueryClient } from '@tanstack/react-query';
import { ethiopianTokens } from './design-tokens';

// Query keys for Ethiopian platform data
export const QUERY_KEYS = {
  creators: ['creators'],
  creator: (id: string) => ['creators', id],
  creatorProducts: (id: string) => ['creators', id, 'products'],
  creatorAnalytics: (id: string) => ['creators', id, 'analytics'],

  products: ['products'],
  product: (id: string) => ['products', id],
  productCategories: ['products', 'categories'],

  stores: ['stores'],
  store: (id: string) => ['stores', id],
  storeOrders: (id: string) => ['stores', id, 'orders'],

  payments: ['payments'],
  paymentMethods: ['payments', 'methods'],
  paymentHistory: (userId: string) => ['payments', 'history', userId],

  orders: ['orders'],
  order: (id: string) => ['orders', id],

  analytics: ['analytics'],
  dashboard: ['analytics', 'dashboard'],

  ethiopian: {
    neighborhoods: ['ethiopian', 'neighborhoods'],
    regions: ['ethiopian', 'regions'],
    exchangeRate: ['ethiopian', 'exchange-rate'],
    stories: ['ethiopian', 'stories'],
    recommendations: ['ethiopian', 'recommendations'],
  },
} as const;

// Network condition-based stale time configuration
const getNetworkConditionBasedStaleTime = (connectionSpeed: 'slow' | 'medium' | 'fast' = 'medium') => {
  switch (connectionSpeed) {
    case 'slow':
      // Ethiopian 2G/Edge connections - cache longer to reduce data usage
      return 1000 * 60 * 30; // 30 minutes
    case 'medium':
      // Ethiopian 3G connections
      return 1000 * 60 * 15; // 15 minutes
    case 'fast':
    default:
      // Ethiopian fast connections
      return 1000 * 60 * 5; // 5 minutes
  }
};

// Optimized retry configuration for Ethiopian network conditions
const getRetryConfig = (isOnline: boolean) => ({
  retry: isOnline
    ? (failureCount: number, error: any) => {
        // Don't retry on 4xx errors except 429 (rate limiting)
        if (error?.status >= 400 && error?.status < 500 && error?.status !== 429) {
          return false;
        }
        // Retry up to 3 times for other errors
        return failureCount < 3;
      }
    : false, // No retries when offline
  retryDelay: (attemptIndex: number) => {
    // Ethiopian-friendly exponential backoff with max delay
    return Math.min(1000 * 2 ** attemptIndex, 30000); // Max 30 seconds
  },
});

// Create Ethiopian-optimized Query Client
export const createEthiopianQueryClient = (
  connectionSpeed: 'slow' | 'medium' | 'fast' = 'medium',
  isOnline: boolean = true
) => {
  const staleTime = getNetworkConditionBasedStaleTime(connectionSpeed);
  const retryConfig = getRetryConfig(isOnline);

  return new QueryClient({
    defaultOptions: {
      queries: {
        // Ethiopian network optimization
        staleTime,
        gcTime: staleTime * 4, // Cache for 4x stale time (cacheTime renamed to gcTime in v5)

        // Network condition aware refetch
        refetchOnWindowFocus: connectionSpeed !== 'slow',
        refetchOnReconnect: 'always',
        refetchOnMount: true,

        // Retry configuration
        ...retryConfig,

        // Error boundary integration (useErrorBoundary renamed in v5)
        throwOnError: false,

        // Placeholder data to improve UX on slow connections
        placeholderData: undefined, // Will be handled at component level
      },
      mutations: {
        // Only retry mutations if online
        retry: isOnline,

        // Ethiopian mutation error handling
        onError: (error: Error, variables: unknown, context: unknown) => {
          // Ethiopian-specific error logging and handling
          console.error('Ethiopian Mutation Error:', error, variables, context);
        },
      },
    },

    // Global error handler for Ethiopian platform
    errorLogger: (error: Error) => {
      // Ethiopian error reporting - can integrate with local error tracking
      console.error('Ethiopian Query Error:', error);
    },
  });
};

// Ethiopian-specific query hooks patterns
export const useEthiopianQueryPatterns = () => {
  const queryClient = createEthiopianQueryClient();

  // Prefetch creator data for Ethiopian regions
  const preFetchCreatorRegion = (regionId: string) =>
    queryClient.prefetchQuery({
      queryKey: ['creators', 'region', regionId],
      staleTime: 1000 * 60 * 10, // Cache region data longer
    });

  // Prefetch payment methods for Ethiopian user
  const preFetchEthiopianPaymentMethods = () =>
    queryClient.prefetchQuery({
      queryKey: QUERY_KEYS.paymentMethods,
      staleTime: 1000 * 60 * 60, // Cache payment methods for an hour
    });

  // Ethiopian data invalidation patterns
  const invalidateStoreCache = (storeId: string) =>
    queryClient.invalidateQueries({
      predicate: (query) =>
        query.queryKey[0] === 'stores' && query.queryKey[1] === storeId,
    });

  // Ethiopian exchange rate updates
  const updateExchangeRate = (newRate: number) => {
    queryClient.setQueryData(['ethiopian', 'exchange-rate'], {
      rate: newRate,
      timestamp: Date.now(),
      currency: ethiopianTokens.currency
    });
  };

  return {
    queryClient,
    preFetchCreatorRegion,
    preFetchEthiopianPaymentMethods,
    invalidateStoreCache,
    updateExchangeRate,
  };
};

// Ethiopian offline optimistic updates
export const ethiopianOptimisticUpdate = {
  // Update local order status optimistically
  updateOrderStatus: (orderId: string, status: string) => ({
    id: orderId,
    status,
    lastModified: Date.now(),
    // Add Ethiopian-specific metadata
    ethiopianTimestamp: Date.now(),
    localUpdate: true,
  }),

  // Update local product views for analytics
  updateProductViews: (productId: string, incrementalViews: number) => ({
    id: productId,
    views: incrementalViews,
    // Ethiopian view tracking
    ethiopianViewSource: 'creator-dashboard',
    timestamp: Date.now(),
  }),

  // Update creator earnings optimistically
  updateCreatorEarnings: (creatorId: string, amount: number, currency: string = 'ETB') => ({
    creatorId,
    amount,
    currency,
    earnings: amount,
    // Ethiopian earnings tracking
    ethiopianEarnings: true,
    timestamp: Date.now(),
  }),
};
