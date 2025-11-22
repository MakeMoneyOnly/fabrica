import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

/**
 * React Query hooks for product operations
 * These are stubs that will be implemented when product APIs are ready
 */

/**
 * Fetch all products
 */
export function useProducts() {
  return useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      // TODO: Implement when /api/products endpoint is ready
      const response = await fetch('/api/products')
      if (!response.ok) {
        throw new Error('Failed to fetch products')
      }
      const data = await response.json()
      return data.data
    },
  })
}

/**
 * Fetch a single product by ID
 */
export function useProduct(id: string) {
  return useQuery({
    queryKey: ['products', id],
    queryFn: async () => {
      // TODO: Implement when /api/products/:id endpoint is ready
      const response = await fetch(`/api/products/${id}`)
      if (!response.ok) {
        throw new Error('Failed to fetch product')
      }
      const data = await response.json()
      return data.data
    },
    enabled: !!id,
  })
}

/**
 * Create a new product
 */
export function useCreateProduct() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (productData: unknown) => {
      // TODO: Implement when POST /api/products endpoint is ready
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData),
      })
      if (!response.ok) {
        throw new Error('Failed to create product')
      }
      const data = await response.json()
      return data.data
    },
    onSuccess: () => {
      // Invalidate products query to refetch
      queryClient.invalidateQueries({ queryKey: ['products'] })
    },
  })
}

/**
 * Update an existing product
 */
export function useUpdateProduct() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, ...productData }: { id: string; [key: string]: unknown }) => {
      // TODO: Implement when PATCH /api/products/:id endpoint is ready
      const response = await fetch(`/api/products/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData),
      })
      if (!response.ok) {
        throw new Error('Failed to update product')
      }
      const data = await response.json()
      return data.data
    },
    onSuccess: (_, variables) => {
      // Invalidate both products list and specific product
      queryClient.invalidateQueries({ queryKey: ['products'] })
      queryClient.invalidateQueries({ queryKey: ['products', variables.id] })
    },
  })
}

/**
 * Delete a product
 */
export function useDeleteProduct() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      // TODO: Implement when DELETE /api/products/:id endpoint is ready
      const response = await fetch(`/api/products/${id}`, {
        method: 'DELETE',
      })
      if (!response.ok) {
        throw new Error('Failed to delete product')
      }
    },
    onSuccess: () => {
      // Invalidate products query to refetch
      queryClient.invalidateQueries({ queryKey: ['products'] })
    },
  })
}
