'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface User {
  id: string
  email: string
  name: string
}

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  signIn: () => void
  signOut: () => void
}

// Mock authentication store
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      signIn: () => {
        const mockUser: User = {
          id: '1',
          email: 'creator@fabrica.et',
          name: 'Demo Creator',
        }
        set({ user: mockUser, isAuthenticated: true })
      },
      signOut: () => {
        set({ user: null, isAuthenticated: false })
      },
    }),
    {
      name: 'fabrica-auth',
    }
  )
)

export function useAuth() {
  const { user, isAuthenticated, signIn, signOut } = useAuthStore()
  return { user, isAuthenticated, signIn, signOut }
}
