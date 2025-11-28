'use client'

import { BarChart3, TrendingUp, Users, DollarSign } from 'lucide-react'

export default function AnalyticsPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center py-20">
        <div className="w-20 h-20 bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <BarChart3 className="w-10 h-10 text-blue-600" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Advanced Analytics</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
          Get deep insights into your store performance, customer behavior, and revenue trends.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto mb-12">
          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
            <TrendingUp className="w-8 h-8 text-blue-600 mb-3 mx-auto" />
            <h3 className="font-semibold text-gray-900 mb-2">Traffic Analytics</h3>
            <p className="text-sm text-gray-500">
              Track visits, unique visitors, and traffic sources
            </p>
          </div>
          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
            <DollarSign className="w-8 h-8 text-green-600 mb-3 mx-auto" />
            <h3 className="font-semibold text-gray-900 mb-2">Revenue Insights</h3>
            <p className="text-sm text-gray-500">Analyze sales trends and revenue patterns</p>
          </div>
          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
            <Users className="w-8 h-8 text-purple-600 mb-3 mx-auto" />
            <h3 className="font-semibold text-gray-900 mb-2">Customer Data</h3>
            <p className="text-sm text-gray-500">Understand customer behavior and retention</p>
          </div>
        </div>

        <div className="inline-flex items-center px-6 py-3 bg-blue-50 text-blue-700 rounded-full border border-blue-100">
          <span className="font-medium">Coming Soon</span>
          <span className="ml-2 text-sm">
            • Advanced analytics will be available in the next update
          </span>
        </div>
      </div>
    </div>
  )
}
