'use client'

import { useState } from 'react'
import { useOnboardingStore } from '@/stores/onboarding-store'
import { ArrowRight, ArrowLeft, FileText, Calendar, Link as LinkIcon } from 'lucide-react'

export default function StepProduct() {
  const { productData, updateProductData, nextStep, prevStep } = useOnboardingStore()
  const [type, setType] = useState<'digital' | 'booking' | 'link'>(productData.type || 'digital')
  const [title, setTitle] = useState(productData.title)
  const [price, setPrice] = useState(productData.price)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    updateProductData({ type, title, price })
    nextStep()
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900">Create your first product</h2>
        <p className="mt-2 text-gray-600">What do you want to sell?</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-3 gap-4">
          <div
            onClick={() => setType('digital')}
            className={`cursor-pointer rounded-lg border p-4 flex flex-col items-center justify-center gap-2 transition-all
              ${type === 'digital' ? 'border-black bg-gray-50 ring-1 ring-black' : 'border-gray-200 hover:border-gray-300'}
            `}
          >
            <FileText className="h-6 w-6 text-gray-700" />
            <span className="font-medium text-xs text-center">Digital Download</span>
          </div>
          <div
            onClick={() => setType('booking')}
            className={`cursor-pointer rounded-lg border p-4 flex flex-col items-center justify-center gap-2 transition-all
              ${type === 'booking' ? 'border-black bg-gray-50 ring-1 ring-black' : 'border-gray-200 hover:border-gray-300'}
            `}
          >
            <Calendar className="h-6 w-6 text-gray-700" />
            <span className="font-medium text-xs text-center">Booking</span>
          </div>
          <div
            onClick={() => setType('link')}
            className={`cursor-pointer rounded-lg border p-4 flex flex-col items-center justify-center gap-2 transition-all
              ${type === 'link' ? 'border-black bg-gray-50 ring-1 ring-black' : 'border-gray-200 hover:border-gray-300'}
            `}
          >
            <LinkIcon className="h-6 w-6 text-gray-700" />
            <span className="font-medium text-xs text-center">Link</span>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">
              Product Title
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-black focus:ring-black py-3 sm:text-sm"
              placeholder="e.g. My Awesome E-book"
              required
            />
          </div>

          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-700">
              Price (ETB)
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-500 sm:text-sm">ETB</span>
              </div>
              <input
                type="number"
                id="price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="block w-full pl-12 pr-12 py-3 sm:text-sm rounded-lg border-gray-300 focus:ring-black focus:border-black"
                placeholder="0.00"
                min="0"
                step="0.01"
                required
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <span className="text-gray-500 sm:text-sm">Birr</span>
              </div>
            </div>
          </div>
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
