'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useOnboardingStore } from '@/stores/onboarding-store'
import { profileSchema, type ProfileFormData } from '@/lib/validations/onboarding'
import { AvatarUpload } from '@/components/onboarding/AvatarUpload'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Loader2, ArrowRight, ArrowLeft, UserCircle } from 'lucide-react'
import { useUser } from '@clerk/nextjs'
import { useSupabaseClient } from '@/hooks/useSupabaseClient'
import { motion } from 'framer-motion'

export default function StepProfile() {
  const { user } = useUser()
  const supabase = useSupabaseClient()
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
        instagram: userData.socialLinks?.instagram || '',
        tiktok: userData.socialLinks?.tiktok || '',
        facebook: userData.socialLinks?.facebook || '',
        twitter: userData.socialLinks?.twitter || '',
      },
    },
  })

  const avatarUrl = watch('avatarUrl')

  const onSubmit = async (data: ProfileFormData) => {
    if (!user || !supabase) {
      return
    }

    setIsSubmitting(true)

    try {
      // Upsert profile in Supabase (insert or update)

      const profileData = {
        clerk_user_id: user.id,
        email: user.primaryEmailAddress?.emailAddress || '',
        full_name: data.fullName,
        bio: data.bio,
        avatar_url: data.avatarUrl,
        social_links: data.socialLinks,
        phone: user.primaryPhoneNumber?.phoneNumber || null,
      }

      console.log('Saving profile data:', profileData)

      // First, try to upsert the user
      const { error: upsertError } = await supabase.from('users').upsert(profileData, {
        onConflict: 'clerk_user_id',
      })

      if (upsertError) {
        console.error('Error saving profile:', {
          message: upsertError.message,
          details: upsertError.details,
          hint: upsertError.hint,
          code: upsertError.code,
        })
        alert(
          `Failed to save profile: ${upsertError.message}\n\nPlease check the console for more details.`
        )
        setIsSubmitting(false)
        return
      }

      console.log('Profile saved successfully')

      // Save to store and proceed
      updateUserData({
        fullName: data.fullName,
        bio: data.bio || '',
        avatarUrl: data.avatarUrl || null,
        socialLinks: data.socialLinks,
      })
      nextStep()
    } catch (error: any) {
      console.error('Unexpected error:', error)
      alert(`An unexpected error occurred: ${error.message || 'Unknown error'}`)
    } finally {
      setIsSubmitting(false)
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
          <UserCircle className="h-6 w-6 text-amber-600" />
        </div>
        <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Tell us about yourself</h2>
        <p className="text-slate-500 text-lg max-w-sm mx-auto">
          This will be displayed on your store profile.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 max-w-xl mx-auto">
        {/* Avatar Upload */}
        <div className="flex justify-center">
          <AvatarUpload value={avatarUrl} onChange={(url) => setValue('avatarUrl', url)} />
        </div>

        <div className="space-y-6 bg-white/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-100 shadow-sm">
          {/* Full Name */}
          <div>
            <label htmlFor="fullName" className="block text-sm font-semibold text-gray-700 mb-2">
              Full Name <span className="text-red-500">*</span>
            </label>
            <Input
              id="fullName"
              type="text"
              {...register('fullName')}
              placeholder="e.g. Abebe Bikila"
              className={errors.fullName ? 'border-red-300 focus:ring-red-500' : ''}
            />
            {errors.fullName && (
              <p className="mt-1 text-sm text-red-600 font-medium">{errors.fullName.message}</p>
            )}
          </div>

          {/* Bio */}
          <div>
            <label htmlFor="bio" className="block text-sm font-semibold text-gray-700 mb-2">
              Bio <span className="text-red-500">*</span>
            </label>
            <textarea
              id="bio"
              {...register('bio')}
              rows={4}
              className={`block w-full rounded-xl border-gray-200 px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:border-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900/10 transition-all duration-200 resize-none ${
                errors.bio ? 'border-red-300 focus:ring-red-500' : ''
              }`}
              placeholder="Tell your audience who you are and what you do..."
            />
            <div className="mt-1 flex justify-between items-center">
              {errors.bio ? (
                <p className="text-sm text-red-600 font-medium">{errors.bio.message}</p>
              ) : (
                <span />
              )}
              <p className="text-xs text-gray-400 font-medium">{watch('bio')?.length || 0} / 500</p>
            </div>
          </div>
        </div>

        {/* Social Links */}
        <div className="space-y-5 bg-white/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-100 shadow-sm">
          <h3 className="text-base font-semibold text-gray-900 flex items-center">
            Social Media Links{' '}
            <span className="ml-2 text-xs font-normal text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
              Optional
            </span>
          </h3>

          <div className="grid gap-5">
            {/* Instagram */}
            <div>
              <label htmlFor="instagram" className="block text-sm font-medium text-gray-700 mb-1.5">
                Instagram
              </label>
              <div className="flex rounded-xl shadow-sm transition-all duration-200 focus-within:ring-2 focus-within:ring-gray-900/10">
                <span className="inline-flex items-center rounded-l-xl border border-r-0 border-gray-200 bg-gray-50/50 px-4 text-sm text-gray-500 font-medium">
                  instagram.com/
                </span>
                <Input
                  id="instagram"
                  type="text"
                  {...register('socialLinks.instagram')}
                  className="rounded-l-none border-l-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                  placeholder="username"
                />
              </div>
              {errors.socialLinks?.instagram && (
                <p className="mt-1 text-sm text-red-600 font-medium">
                  {errors.socialLinks.instagram.message}
                </p>
              )}
            </div>

            {/* TikTok */}
            <div>
              <label htmlFor="tiktok" className="block text-sm font-medium text-gray-700 mb-1.5">
                TikTok
              </label>
              <div className="flex rounded-xl shadow-sm transition-all duration-200 focus-within:ring-2 focus-within:ring-gray-900/10">
                <span className="inline-flex items-center rounded-l-xl border border-r-0 border-gray-200 bg-gray-50/50 px-4 text-sm text-gray-500 font-medium">
                  tiktok.com/@
                </span>
                <Input
                  id="tiktok"
                  type="text"
                  {...register('socialLinks.tiktok')}
                  className="rounded-l-none border-l-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                  placeholder="username"
                />
              </div>
            </div>

            {/* Facebook */}
            <div>
              <label htmlFor="facebook" className="block text-sm font-medium text-gray-700 mb-1.5">
                Facebook
              </label>
              <div className="flex rounded-xl shadow-sm transition-all duration-200 focus-within:ring-2 focus-within:ring-gray-900/10">
                <span className="inline-flex items-center rounded-l-xl border border-r-0 border-gray-200 bg-gray-50/50 px-4 text-sm text-gray-500 font-medium">
                  facebook.com/
                </span>
                <Input
                  id="facebook"
                  type="text"
                  {...register('socialLinks.facebook')}
                  className="rounded-l-none border-l-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                  placeholder="username"
                />
              </div>
            </div>

            {/* Twitter */}
            <div>
              <label htmlFor="twitter" className="block text-sm font-medium text-gray-700 mb-1.5">
                Twitter/X
              </label>
              <div className="flex rounded-xl shadow-sm transition-all duration-200 focus-within:ring-2 focus-within:ring-gray-900/10">
                <span className="inline-flex items-center rounded-l-xl border border-r-0 border-gray-200 bg-gray-50/50 px-4 text-sm text-gray-500 font-medium">
                  twitter.com/
                </span>
                <Input
                  id="twitter"
                  type="text"
                  {...register('socialLinks.twitter')}
                  className="rounded-l-none border-l-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                  placeholder="username"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex gap-4 pt-4">
          <Button
            type="button"
            onClick={prevStep}
            variant="outline"
            disabled={isSubmitting}
            className="flex-1 h-12 rounded-xl border-gray-200 hover:bg-gray-50 hover:text-gray-900"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 h-12 rounded-xl bg-gray-900 hover:bg-gray-800 text-white shadow-lg hover:shadow-xl transition-all duration-200 hover:-translate-y-0.5"
          >
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
    </motion.div>
  )
}
