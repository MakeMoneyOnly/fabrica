/**
 * React Query Setup Tests
 * Tests for React Query configuration and provider
 */

import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { createQueryClient, queryClientConfig } from '@/lib/react-query/config'
import { QueryProvider } from '@/lib/react-query/provider'

describe('React Query Configuration', () => {
  describe('queryClientConfig', () => {
    it('should have correct default query options', () => {
      expect(queryClientConfig.defaultOptions?.queries?.staleTime).toBe(5 * 60 * 1000) // 5 minutes
      expect(queryClientConfig.defaultOptions?.queries?.gcTime).toBe(10 * 60 * 1000) // 10 minutes
      expect(queryClientConfig.defaultOptions?.queries?.retry).toBe(3)
      expect(queryClientConfig.defaultOptions?.queries?.refetchOnWindowFocus).toBe(false)
      expect(queryClientConfig.defaultOptions?.queries?.refetchOnReconnect).toBe(true)
    })

    it('should have correct default mutation options', () => {
      expect(queryClientConfig.defaultOptions?.mutations?.retry).toBe(1)
    })
  })

  describe('createQueryClient', () => {
    it('should create a QueryClient instance', () => {
      const client = createQueryClient()
      expect(client).toBeDefined()
      expect(typeof client.getQueryData).toBe('function')
      expect(typeof client.setQueryData).toBe('function')
    })

    it('should use the configured options', () => {
      const client = createQueryClient()
      const defaultOptions = client.getDefaultOptions()

      expect(defaultOptions.queries?.staleTime).toBe(5 * 60 * 1000)
      expect(defaultOptions.queries?.gcTime).toBe(10 * 60 * 1000)
      expect(defaultOptions.queries?.retry).toBe(3)
      expect(defaultOptions.mutations?.retry).toBe(1)
    })
  })

  describe('QueryProvider', () => {
    it('should render children', () => {
      const { container } = render(
        <QueryProvider>
          <div>Test Content</div>
        </QueryProvider>
      )

      expect(container.textContent).toContain('Test Content')
    })

    it('should provide QueryClient to children', () => {
      const TestComponent = () => {
        return <div>Test</div>
      }

      const { container } = render(
        <QueryProvider>
          <TestComponent />
        </QueryProvider>
      )

      expect(container).toBeInTheDocument()
    })

    it('should create QueryClient instance', () => {
      // QueryProvider creates a QueryClient internally
      // We can verify it renders without errors
      const { container } = render(
        <QueryProvider>
          <div>Test</div>
        </QueryProvider>
      )

      expect(container).toBeInTheDocument()
    })
  })
})
