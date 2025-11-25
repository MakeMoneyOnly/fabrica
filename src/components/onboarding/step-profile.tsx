'use client'

import { useState } from 'react'
import { useOnboardingStore } from '@/stores/onboarding-store'
import { ArrowRight, ArrowLeft } from 'lucide-react'

export default function StepProfile() {
  const { userData, updateUserData, nextStep, prevStep } = useOnboardingStore()
  const [fullName, setFullName] = useState(userData.fullName)
  const [bio, setBio] = useState(userData.bio)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    updateUserData({ fullName, bio })
    nextStep()
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900">Tell us about yourself</h2>
        <p className="mt-2 text-gray-600">This will be displayed on your store profile.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
            Full Name
          </label>
          <input
            type="text"
            id="fullName"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-black focus:ring-black py-3 sm:text-sm"
            placeholder="e.g. Abebe Bikila"
            required
          />
        </div>

        <div>
          <label htmlFor="bio" className="block text-sm font-medium text-gray-700">
            Bio
          </label>
          <textarea
            id="bio"
            rows={4}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-black focus:ring-black py-3 sm:text-sm"
            placeholder="Tell your audience who you are and what you do..."
            maxLength={160}
          />
          <p className="mt-2 text-xs text-gray-500 text-right">{bio.length}/160</p>
        </div>

        <div className="flex gap-4">
          <button
            type="button"
            onClick={prevStep}
            className="flex-1 flex justify-center items-center py-3 px-4 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black transition-all"
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Back
          </button>
          <button
            type="submit"
            className="flex-1 flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black transition-all"
          >
            Continue <ArrowRight className="ml-2 h-4 w-4" />
          </button>
        </div>
      </form>
    </div>
  )
}
