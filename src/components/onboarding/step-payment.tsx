'use client'

import { useState } from 'react'
import { useOnboardingStore } from '@/stores/onboarding-store'
import { ArrowRight, ArrowLeft, CreditCard, Smartphone } from 'lucide-react'

export default function StepPayment() {
  const { paymentData, updatePaymentData, nextStep, prevStep } = useOnboardingStore()
  const [provider, setProvider] = useState<'chapa' | 'telebirr' | null>(
    paymentData.provider || 'chapa'
  )
  const [accountNumber, setAccountNumber] = useState(paymentData.accountNumber)
  const [accountName, setAccountName] = useState(paymentData.accountName)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    updatePaymentData({ provider, accountNumber, accountName })
    nextStep()
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900">Get Paid</h2>
        <p className="mt-2 text-gray-600">Connect your payment account to receive payouts.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div
            onClick={() => setProvider('chapa')}
            className={`cursor-pointer rounded-lg border p-4 flex flex-col items-center justify-center gap-2 transition-all
              ${provider === 'chapa' ? 'border-black bg-gray-50 ring-1 ring-black' : 'border-gray-200 hover:border-gray-300'}
            `}
          >
            <CreditCard className="h-8 w-8 text-gray-700" />
            <span className="font-medium text-sm">Bank Account</span>
          </div>
          <div
            onClick={() => setProvider('telebirr')}
            className={`cursor-pointer rounded-lg border p-4 flex flex-col items-center justify-center gap-2 transition-all
              ${provider === 'telebirr' ? 'border-black bg-gray-50 ring-1 ring-black' : 'border-gray-200 hover:border-gray-300'}
            `}
          >
            <Smartphone className="h-8 w-8 text-gray-700" />
            <span className="font-medium text-sm">Telebirr</span>
          </div>
        </div>

        {provider === 'chapa' && (
          <div className="space-y-4">
            <div>
              <label htmlFor="bankName" className="block text-sm font-medium text-gray-700">
                Bank Name
              </label>
              <select className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-black focus:ring-black py-3 sm:text-sm">
                <option>Commercial Bank of Ethiopia</option>
                <option>Dashen Bank</option>
                <option>Awash Bank</option>
                <option>Bank of Abyssinia</option>
              </select>
            </div>
            <div>
              <label htmlFor="accountNumber" className="block text-sm font-medium text-gray-700">
                Account Number
              </label>
              <input
                type="text"
                id="accountNumber"
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
                className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-black focus:ring-black py-3 sm:text-sm"
                placeholder="1000..."
                required
              />
            </div>
            <div>
              <label htmlFor="accountName" className="block text-sm font-medium text-gray-700">
                Account Holder Name
              </label>
              <input
                type="text"
                id="accountName"
                value={accountName}
                onChange={(e) => setAccountName(e.target.value)}
                className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-black focus:ring-black py-3 sm:text-sm"
                placeholder="Same as your ID"
                required
              />
            </div>
          </div>
        )}

        {provider === 'telebirr' && (
          <div className="space-y-4">
            <div>
              <label htmlFor="telebirrNumber" className="block text-sm font-medium text-gray-700">
                Telebirr Mobile Number
              </label>
              <input
                type="tel"
                id="telebirrNumber"
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
                className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-black focus:ring-black py-3 sm:text-sm"
                placeholder="09..."
                required
              />
            </div>
          </div>
        )}

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
