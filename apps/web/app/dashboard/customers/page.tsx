import { Customers } from '@/components/dashboard/customers';
import { Users, Sparkles, Star, Heart } from 'lucide-react';

export default function CustomersPage() {
  return (
    <div className="space-y-12">
      {/* Modern Hero Section */}
      <section className="text-center space-y-6">
        <div className="space-y-4">
          <h1 className="text-4xl md:text-6xl font-light text-gray-900 leading-tight">
            Customer Management
          </h1>
          <p className="text-xl md:text-2xl font-light text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Build relationships and grow your community with insights
          </p>
        </div>

        <div className="flex items-center justify-center gap-6 text-sm text-gray-500">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span>Real-time Updates</span>
          </div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4" />
            <span>AI Customer Insights</span>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mt-12">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200/60 p-8">
            <div className="text-center">
              <div className="text-4xl font-light text-gray-900 mb-2">3,421</div>
              <div className="text-sm text-gray-600 uppercase tracking-wider">Total Customers</div>
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200/60 p-8">
            <div className="text-center">
              <div className="text-4xl font-light text-gray-900 mb-2">4.8</div>
              <div className="text-sm text-gray-600 uppercase tracking-wider">Avg Rating</div>
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200/60 p-8">
            <div className="text-center">
              <div className="text-4xl font-light text-gray-900 mb-2">$2,450</div>
              <div className="text-sm text-gray-600 uppercase tracking-wider">Avg Order Value</div>
            </div>
          </div>
        </div>

        {/* Customer Engagement Stats */}
        <div className="flex items-center justify-center gap-4 mt-8">
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-pink-50 border border-pink-200/60">
            <Heart className="w-4 h-4 text-pink-600" />
            <span className="text-sm font-medium text-pink-700">92% Satisfaction</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-yellow-50 border border-yellow-200/60">
            <Star className="w-4 h-4 text-yellow-600" />
            <span className="text-sm font-medium text-yellow-700">4.8/5 Rating</span>
          </div>
        </div>
      </section>

      {/* Customers Component */}
      <Customers />
    </div>
  );
} 