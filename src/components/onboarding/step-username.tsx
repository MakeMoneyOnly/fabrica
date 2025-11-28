'use client'

import { useState, useEffect } from 'react'
import { useOnboardingStore } from '@/stores/onboarding-store'
import { useUser, useSession } from '@clerk/nextjs'
import { Check, X, Loader2, ArrowRight, Sparkles } from 'lucide-react'
import { useSupabaseClient } from '@/hooks/useSupabaseClient'
import { createClient as createSupabaseClient } from '@/lib/supabase/client'
import { motion, AnimatePresence } from 'framer-motion'

export default function StepUsername() {
  const { userData, updateUserData, nextStep } = useOnboardingStore()
  const { user } = useUser()
  const { session, isLoaded: sessionLoaded } = useSession()
  const supabase = useSupabaseClient()
  // Use unauthenticated client for username checking since policies allow public access
  const publicSupabase = createSupabaseClient()
  const [username, setUsername] = useState(userData.username)
  const [isChecking, setIsChecking] = useState(false)
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null)
  const [error, setError] = useState<string | null>(null)

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
      // Don't check if session isn't loaded yet
      if (!sessionLoaded || !session) {
        return
      }

      if (!username || username.length < 3) {
        setIsAvailable(null)
        setError(null)
        return
      }

      setIsChecking(true)
      setError(null)

      try {
        console.log('🔍 Using publicSupabase client for username check')
        // Use public client for username availability check (policies allow public SELECT)
        const { data, error } = await publicSupabase
          .from('users')
          .select('username')
          .eq('username', username)
          .limit(1)

        if (error) {
          console.error('Error checking username:', error)
          setError('Unable to check availability. Please try again.')
          return
        }

        // Check if any rows were returned (username exists)
        if (data && data.length > 0) {
          setIsAvailable(false)
          setError('Username is already taken')
        } else {
          setIsAvailable(true)
          setError(null) // Clear any previous error
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
  }, [username, publicSupabase, sessionLoaded, session])

  console.log('🚀 StepUsername component rendered with publicSupabase:', !!publicSupabase)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Ensure session is loaded
    if (!sessionLoaded || !session) {
      setError('Please wait for authentication to load...')
      return
    }

    if (isAvailable && !isChecking && user) {
      try {
        // Create or update user in Supabase
        // We use upsert to handle both new and existing users
        const { error: upsertError } = await supabase.from('users').upsert(
          {
            clerk_user_id: user.id,
            email: user.emailAddresses[0]?.emailAddress,
            username: username,
            full_name: user.fullName || '',
            avatar_url: user.imageUrl,
            updated_at: new Date().toISOString(),
          },
          {
            onConflict: 'clerk_user_id',
          }
        )

        if (upsertError) {
          console.error('Error creating user:', upsertError)
          setError('Failed to save username. Please try again.')
          return
        }

        // Update local store
        updateUserData({ username })
        nextStep()
      } catch (err) {
        console.error('Unexpected error:', err)
        setError('An unexpected error occurred')
      }
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-8"
    >
      <div className="text-center space-y-2">
        <div className="inline-flex items-center justify-center p-3 bg-amber-50 rounded-full mb-4">
          <Sparkles className="h-6 w-6 text-amber-600" />
        </div>
        <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Claim your link</h2>
        <p className="text-slate-500 text-lg max-w-sm mx-auto">
          Choose a unique username for your Fabrica store. This will be your personal URL.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 max-w-md mx-auto">
        <div className="relative group">
          <label htmlFor="username" className="block text-sm font-semibold text-slate-700 mb-2">
            Username
          </label>
          <div className="relative rounded-xl shadow-sm transition-all duration-200">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <span className="text-slate-400 font-medium sm:text-sm">fabrica.et/</span>
            </div>
            <input
              type="text"
              name="username"
              id="username"
              className={`block w-full pl-24 pr-12 py-4 text-slate-900 font-medium rounded-xl border-2 transition-all duration-200 outline-none
                ${
                  isAvailable === true
                    ? 'border-emerald-500 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10'
                    : isAvailable === false
                      ? 'border-rose-300 focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10 bg-rose-50/30'
                      : 'border-slate-200 focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 hover:border-slate-300'
                }
              `}
              placeholder="yourname"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9-_]/g, ''))
                setIsAvailable(null)
              }}
              required
              minLength={3}
              autoComplete="off"
            />
            <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
              <AnimatePresence mode="wait">
                {isChecking ? (
                  <motion.div
                    key="loading"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                  >
                    <Loader2 className="h-5 w-5 text-amber-500 animate-spin" />
                  </motion.div>
                ) : isAvailable === true ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                  >
                    <Check className="h-5 w-5 text-emerald-500" />
                  </motion.div>
                ) : isAvailable === false ? (
                  <motion.div
                    key="error"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                  >
                    <X className="h-5 w-5 text-rose-500" />
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </div>
          </div>

          <div className="h-6 mt-2">
            <AnimatePresence mode="wait">
              {error && (
                <motion.p
                  key="error-msg"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="text-sm text-rose-600 font-medium flex items-center"
                >
                  <X className="h-3 w-3 mr-1" />
                  {error}
                </motion.p>
              )}
              {!error && isAvailable === true && (
                <motion.p
                  key="success-msg"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="text-sm text-emerald-600 font-medium flex items-center"
                >
                  <Check className="h-3 w-3 mr-1" />
                  That username is available!
                </motion.p>
              )}
            </AnimatePresence>
          </div>
        </div>

        <button
          type="submit"
          disabled={!isAvailable || isChecking}
          className="w-full group relative flex justify-center items-center py-4 px-4 border border-transparent rounded-xl shadow-lg text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-900 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none transition-all duration-200 hover:-translate-y-0.5"
        >
          <span className="flex items-center">
            Continue
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </span>
        </button>
      </form>
    </motion.div>
  )
}
