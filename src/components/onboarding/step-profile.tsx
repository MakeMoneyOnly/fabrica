'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useOnboardingStore } from '@/stores/onboarding-store'
import { profileSchema, type ProfileFormData } from '@/lib/validations/onboarding'
import { AvatarUpload } from '@/components/onboarding/AvatarUpload'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Loader2, ArrowRight, ArrowLeft } from 'lucide-react'
import { useUser } from '@clerk/nextjs'
import { createClient } from '@/lib/supabase/client'

export default function StepProfile() {
  const { user } = useUser()
  const { userData, updateUserData, nextStep, prevStep } = useOnboardingStore()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullName: userData.fullName || '',
      bio: userData.bio || '',
      avatarUrl: userData.avatarUrl || '',
      socialLinks: {
        instagram: '',
        tiktok: '',
        facebook: '',
        twitter: '',
      },
    },
  })

  const avatarUrl = watch('avatarUrl')

  const onSubmit = async (data: ProfileFormData) => {
    if (!user) return

    setIsSubmitting(true)

    try {
      // Update profile in Supabase
      const supabase = await createClient()
      const { error } = await supabase
        .from('users')
        .update({
          full_name: data.fullName,
          bio: data.bio,
          avatar_url: data.avatarUrl,
          social_links: data.socialLinks,
        })
        .eq('clerk_user_id', user.id)

      if (error) {
        console.error('Error updating profile:', error)
        alert('Failed to save profile. Please try again.')
        setIsSubmitting(false)
        return
      }

      // Save to store and proceed
      updateUserData({
        fullName: data.fullName,
        bio: data.bio || '',
        avatarUrl: data.avatarUrl || null,
      })
      nextStep()
    } catch (error) {
      console.error('Error:', error)
      alert('An error occurred. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900">Tell us about yourself</h2>
        <p className="mt-2 text-gray-600">This will be displayed on your store profile.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Avatar Upload */}
        <div>
          <AvatarUpload value={avatarUrl} onChange={(url) => setValue('avatarUrl', url)} />
        </div>

        {/* Full Name */}
        <div>
          <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
            Full Name *
          </label>
          <Input
            id="fullName"
            type="text"
            {...register('fullName')}
            placeholder="e.g. Abebe Bikila"
            className="mt-1"
          />
          {errors.fullName && (
            <p className="mt-1 text-sm text-red-600">{errors.fullName.message}</p>
          )}
        </div>

        {/* Bio */}
        <div>
          <label htmlFor="bio" className="block text-sm font-medium text-gray-700">
            Bio *
          </label>
          <textarea
            id="bio"
            {...register('bio')}
            rows={4}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900"
            placeholder="Tell your audience who you are and what you do..."
          />
          {errors.bio && <p className="mt-1 text-sm text-red-600">{errors.bio.message}</p>}
          <p className="mt-1 text-sm text-gray-500 text-right">
            {watch('bio')?.length || 0} / 500 characters
          </p>
        </div>

        {/* Social Links */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-gray-900">Social Media Links (Optional)</h3>

          {/* Instagram */}
          <div>
            <label htmlFor="instagram" className="block text-sm text-gray-700">
              Instagram
            </label>
            <div className="mt-1 flex rounded-md shadow-sm">
              <span className="inline-flex items-center rounded-l-md border border-r-0 border-gray-300 bg-gray-50 px-3 text-sm text-gray-500">
                instagram.com/
              </span>
              <Input
                id="instagram"
                type="text"
                {...register('socialLinks.instagram')}
                className="rounded-l-none"
                placeholder="username"
              />
            </div>
            {errors.socialLinks?.instagram && (
              <p className="mt-1 text-sm text-red-600">{errors.socialLinks.instagram.message}</p>
            )}
          </div>

          {/* TikTok */}
          <div>
            <label htmlFor="tiktok" className="block text-sm text-gray-700">
              TikTok
            </label>
            <div className="mt-1 flex rounded-md shadow-sm">
              <span className="inline-flex items-center rounded-l-md border border-r-0 border-gray-300 bg-gray-50 px-3 text-sm text-gray-500">
                tiktok.com/@
              </span>
              <Input
                id="tiktok"
                type="text"
                {...register('socialLinks.tiktok')}
                className="rounded-l-none"
                placeholder="username"
              />
            </div>
          </div>

          {/* Facebook */}
          <div>
            <label htmlFor="facebook" className="block text-sm text-gray-700">
              Facebook
            </label>
            <div className="mt-1 flex rounded-md shadow-sm">
              <span className="inline-flex items-center rounded-l-md border border-r-0 border-gray-300 bg-gray-50 px-3 text-sm text-gray-500">
                facebook.com/
              </span>
              <Input
                id="facebook"
                type="text"
                {...register('socialLinks.facebook')}
                className="rounded-l-none"
                placeholder="username"
              />
            </div>
          </div>

          {/* Twitter */}
          <div>
            <label htmlFor="twitter" className="block text-sm text-gray-700">
              Twitter/X
            </label>
            <div className="mt-1 flex rounded-md shadow-sm">
              <span className="inline-flex items-center rounded-l-md border border-r-0 border-gray-300 bg-gray-50 px-3 text-sm text-gray-500">
                twitter.com/
              </span>
              <Input
                id="twitter"
                type="text"
                {...register('socialLinks.twitter')}
                className="rounded-l-none"
                placeholder="username"
              />
            </div>
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex gap-4">
          <Button
            type="button"
            onClick={prevStep}
            variant="outline"
            disabled={isSubmitting}
            className="flex-1"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>

          <Button type="submit" disabled={isSubmitting} className="flex-1">
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                Continue
                <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}
