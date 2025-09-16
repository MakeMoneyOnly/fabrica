'use client';

/**
 * Ethiopian Query Provider
 * Wraps the application with React Query client optimized for Ethiopian network conditions
 */

import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useNetworkStatus } from '@/lib/ethiopian-hooks';
import { createEthiopianQueryClient } from '@/lib/ethiopian-query-client';
import { ReactNode } from 'react';

interface EthQueryProviderProps {
  children: ReactNode;
}

export function EthQueryProvider({ children }: EthQueryProviderProps) {
  const { isOnline, connectionSpeed } = useNetworkStatus();
  const queryClient = createEthiopianQueryClient(connectionSpeed, isOnline);

  return (
    <QueryClientProvider client={queryClient}>
      {children}

      {/* Only show devtools in development */}
      {process.env.NODE_ENV === 'development' && (
        <ReactQueryDevtools
          initialIsOpen={false}
          position="bottom-right"
          buttonPosition="bottom-left"
        />
      )}
    </QueryClientProvider>
  );
}
