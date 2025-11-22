'use client'

import { QueryClientProvider } from '@tanstack/react-query'
import { createQueryClient } from './config'
import { useState } from 'react'

/**
 * QueryProvider component
 * Wraps the app with React Query's QueryClientProvider
 * Provides query client to all child components
 */
export function QueryProvider({ children }: { children: React.ReactNode }) {
  // Create query client instance (singleton pattern)
  const [queryClient] = useState(() => createQueryClient())

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
}
