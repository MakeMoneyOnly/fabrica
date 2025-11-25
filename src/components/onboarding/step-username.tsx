'use client'

import { useState, useEffect } from 'react'
import { useOnboardingStore } from '@/stores/onboarding-store'
import { useUser } from '@clerk/nextjs'
import { Check, X, Loader2, ArrowRight } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

export default function StepUsername() {
  const { userData, updateUserData, nextStep } = useOnboardingStore()
  const { user } = useUser()
  const [username, setUsername] = useState(userData.username)
  const [isChecking, setIsChecking] = useState(false)
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null)
  const [error, setError] = useState<string | null>(null)
  const supabase = createClient()

  // Pre-fill from Clerk if available and not already set
  useEffect(() => {
    if (user && !userData.username) {
      // Try to get username from Clerk or generate from email
      const initialUsername = user.username || user.emailAddresses[0]?.emailAddress.split('@')[0]
      if (initialUsername) {
        setUsername(initialUsername)
        // Don't auto-check immediately to avoid spamming
      }
    }
  }, [user, userData.username])

  // Debounce check availability
  useEffect(() => {
    const checkAvailability = async () => {
      if (!username || username.length < 3) {
        setIsAvailable(null)
        setError(null)
        return
      }

      setIsChecking(true)
      setError(null)

      try {
        // Check if username exists in public users table
        // Note: We need a public RPC or policy to check this without being logged in fully?
        // Actually, we are logged in via Clerk, so we can query the users table if RLS allows.
        // The RLS "Public can view user profiles" allows SELECT on users.

        const { data, error } = await supabase
          .from('users')
          .select('username')
          .eq('username', username)
          .single()

        if (error && error.code !== 'PGRST116') {
          // PGRST116 is "no rows returned"
          console.error('Error checking username:', error)
          // If error is permission denied, we might need a specific RPC.
          // But for now assuming RLS allows reading usernames.
        }

        if (data) {
          setIsAvailable(false)
          setError('Username is already taken')
        } else {
          setIsAvailable(true)
        }
      } catch (err) {
        console.error('Failed to check username', err)
        setError('Failed to check availability')
      } finally {
        setIsChecking(false)
      }
    }

    const timer = setTimeout(checkAvailability, 500)
    return () => clearTimeout(timer)
  }, [username, supabase])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (isAvailable && !isChecking) {
      updateUserData({ username })
      nextStep()
    }
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900">Claim your link</h2>
        <p className="mt-2 text-gray-600">Choose a unique username for your Fabrica store.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="username" className="block text-sm font-medium text-gray-700">
            Username
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-500 sm:text-sm">fabrica.et/</span>
            </div>
            <input
              type="text"
              name="username"
              id="username"
              className={`block w-full pl-24 pr-10 py-3 sm:text-sm rounded-lg border-gray-300 focus:ring-black focus:border-black transition-colors
                ${isAvailable === true ? 'border-green-500 focus:border-green-500 focus:ring-green-500' : ''}
                ${isAvailable === false ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}
              `}
              placeholder="yourname"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9-_]/g, ''))
                setIsAvailable(null)
              }}
              required
              minLength={3}
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              {isChecking && <Loader2 className="h-5 w-5 text-gray-400 animate-spin" />}
              {!isChecking && isAvailable === true && <Check className="h-5 w-5 text-green-500" />}
              {!isChecking && isAvailable === false && <X className="h-5 w-5 text-red-500" />}
            </div>
          </div>
          {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
          {!error && isAvailable === true && (
            <p className="mt-2 text-sm text-green-600">That username is available!</p>
          )}
        </div>

        <button
          type="submit"
          disabled={!isAvailable || isChecking}
          className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          Continue <ArrowRight className="ml-2 h-4 w-4" />
        </button>
      </form>
    </div>
  )
}
