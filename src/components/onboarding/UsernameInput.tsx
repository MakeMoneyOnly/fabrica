'use client'

import { useState, useEffect } from 'react'
import { Check, X, Loader2 } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { usernameSchema } from '@/lib/validations/onboarding'
import { useDebounce } from '@/hooks/useDebounce'

interface UsernameInputProps {
  value: string
  onChange: (value: string) => void
  onAvailabilityChange?: (available: boolean) => void
}

export function UsernameInput({ value, onChange, onAvailabilityChange }: UsernameInputProps) {
  const [isChecking, setIsChecking] = useState(false)
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null)
  const [error, setError] = useState<string>('')
  const [suggestions, setSuggestions] = useState<string[]>([])

  const debouncedUsername = useDebounce(value, 500)

  useEffect(() => {
    const checkAvailability = async () => {
      if (!debouncedUsername) {
        setIsAvailable(null)
        setError('')
        setSuggestions([])
        return
      }

      // Validate format first
      const validation = usernameSchema.safeParse(debouncedUsername)
      if (!validation.success) {
        setError(validation.error.issues[0].message)
        setIsAvailable(false)
        onAvailabilityChange?.(false)
        return
      }

      setIsChecking(true)
      setError('')

      try {
        const response = await fetch(
          `/api/users/check-username?username=${encodeURIComponent(debouncedUsername)}`
        )
        const data = await response.json()

        if (data.error) {
          setError(data.error)
          setIsAvailable(false)
          onAvailabilityChange?.(false)
        } else {
          setIsAvailable(data.available)
          setSuggestions(data.suggestions || [])
          onAvailabilityChange?.(data.available)
        }
      } catch (err) {
        console.error('Error checking username:', err)
        setError('Failed to check availability')
        setIsAvailable(false)
        onAvailabilityChange?.(false)
      } finally {
        setIsChecking(false)
      }
    }

    checkAvailability()
  }, [debouncedUsername, onAvailabilityChange])

  const showStatus = value && !isChecking && isAvailable !== null

  return (
    <div className="space-y-2">
      <div className="relative">
        <Input
          type="text"
          value={value}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            onChange(e.target.value.toLowerCase())
          }
          placeholder="johndoe"
          className={cn('pr-10', {
            'border-green-500 focus:border-green-500 focus:ring-green-500':
              showStatus && isAvailable,
            'border-red-500 focus:border-red-500 focus:ring-red-500': showStatus && !isAvailable,
          })}
        />

        {/* Status indicator */}
        <div className="absolute right-3 top-1/2 -translate-y-1/2">
          {isChecking && <Loader2 className="h-5 w-5 animate-spin text-gray-400" />}
          {showStatus && isAvailable && <Check className="h-5 w-5 text-green-500" />}
          {showStatus && !isAvailable && <X className="h-5 w-5 text-red-500" />}
        </div>
      </div>

      {/* Feedback messages */}
      {showStatus && isAvailable && (
        <p className="text-sm text-green-600">✓ Username is available!</p>
      )}

      {error && <p className="text-sm text-red-600">{error}</p>}

      {/* Suggestions if username is taken */}
      {showStatus && !isAvailable && suggestions.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm text-gray-600">Try these available usernames:</p>
          <div className="flex flex-wrap gap-2">
            {suggestions.map((suggestion) => (
              <button
                key={suggestion}
                type="button"
                onClick={() => onChange(suggestion)}
                className="rounded-md bg-gray-100 px-3 py-1 text-sm text-gray-700 hover:bg-gray-200"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
