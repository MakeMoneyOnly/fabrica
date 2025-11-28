'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useOnboardingStore } from '@/stores/onboarding-store'
import { paymentAccountSchema, type PaymentAccountFormData } from '@/lib/validations/onboarding'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Loader2, ArrowRight, ArrowLeft, Shield } from 'lucide-react'
import { useUser } from '@clerk/nextjs'
import { createClient } from '@/lib/supabase/client'
import { encrypt } from '@/lib/utils/encryption'

export default function StepPayment() {
  const { user } = useUser()
  const { paymentData, updatePaymentData, nextStep, prevStep } = useOnboardingStore()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PaymentAccountFormData>({
    resolver: zodResolver(paymentAccountSchema),
    defaultValues: {
      telebirrAccount: paymentData.accountNumber || '',
      accountHolderName: paymentData.accountName || '',
    },
  })

  const onSubmit = async (data: PaymentAccountFormData) => {
    if (!user) {
      return
    }

    setIsSubmitting(true)

    try {
      // Encrypt sensitive payment data
      const encryptedAccountNumber = encrypt(data.telebirrAccount || '')

      // Save to Supabase
      const supabase = await createClient()
      const { error } = await supabase
        .from('users')
        .update({
          payment_account: {
            provider: 'telebirr',
            encrypted_account_number: encryptedAccountNumber,
            account_name: data.accountHolderName,
          },
        })
        .eq('clerk_user_id', user.id)

      if (error) {
        console.error('Error saving payment account:', error)
        alert('Failed to save payment account. Please try again.')
        setIsSubmitting(false)
        return
      }

      // Save to store (don't store sensitive data in local storage)
      updatePaymentData({
        provider: 'telebirr',
        accountNumber: '', // Don't persist in local storage
        accountName: data.accountHolderName,
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
        <h2 className="text-3xl font-bold text-gray-900">Connect your payment account</h2>
        <p className="mt-2 text-gray-600">
          Add your Telebirr account to receive payments from customers
        </p>
      </div>

      {/* Security Notice */}
      <div className="rounded-lg bg-blue-50 p-4">
        <div className="flex">
          <Shield className="h-5 w-5 text-blue-600" />
          <div className="ml-3">
            <h3 className="text-sm font-medium text-blue-800">Your data is secure</h3>
            <p className="mt-1 text-sm text-blue-700">
              Your payment information is encrypted and stored securely. We never share your data
              with third parties.
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Account Holder Name */}
        <div>
          <label htmlFor="accountName" className="block text-sm font-medium text-gray-700">
            Account Holder Name *
          </label>
          <Input
            id="accountName"
            type="text"
            {...register('accountHolderName')}
            placeholder="Full name as registered with Telebirr"
            className="mt-1"
          />
          {errors.accountHolderName && (
            <p className="mt-1 text-sm text-red-600">{errors.accountHolderName.message}</p>
          )}
        </div>

        {/* Telebirr Account Number */}
        <div>
          <label htmlFor="accountNumber" className="block text-sm font-medium text-gray-700">
            Telebirr Phone Number *
          </label>
          <div className="mt-1 flex rounded-md shadow-sm">
            <span className="inline-flex items-center rounded-l-md border border-r-0 border-gray-300 bg-gray-50 px-3 text-sm text-gray-500">
              +251
            </span>
            <Input
              id="accountNumber"
              type="tel"
              {...register('telebirrAccount')}
              className="rounded-l-none"
              placeholder="9XXXXXXXX"
            />
          </div>
          {errors.telebirrAccount && (
            <p className="mt-1 text-sm text-red-600">{errors.telebirrAccount.message}</p>
          )}
          <p className="mt-1 text-sm text-gray-500">
            Enter your 9-digit Telebirr phone number (without +251)
          </p>
        </div>

        {/* Info Box */}
        <div className="rounded-lg bg-gray-50 p-4">
          <h4 className="text-sm font-medium text-gray-900">How payments work</h4>
          <ul className="mt-2 space-y-1 text-sm text-gray-600">
            <li>• Customers pay through Chapa (supports Telebirr, CBE Birr, and more)</li>
            <li>• Funds are transferred to your Telebirr account automatically</li>
            <li>• You can track all payments in your dashboard</li>
            <li>• Chapa charges a small transaction fee (2.5%)</li>
          </ul>
        </div>

        {/* Skip Option */}
        <div className="text-center">
          <button
            type="button"
            onClick={nextStep}
            className="text-sm text-gray-600 hover:text-gray-900 underline"
          >
            Skip for now (you can add this later)
          </button>
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
