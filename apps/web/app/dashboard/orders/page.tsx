import { Orders } from '@/components/dashboard/orders';
import { ShoppingBag, Sparkles, Clock, CheckCircle } from 'lucide-react';

export default function OrdersPage() {
  return (
    <div className="space-y-12">
      {/* Modern Hero Section */}
      <section className="text-center space-y-6">
        <div className="space-y-4">
          <h1 className="text-4xl md:text-6xl font-light text-gray-900 leading-tight">
            Order Management
          </h1>
          <p className="text-xl md:text-2xl font-light text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Track and manage customer orders with real-time updates
          </p>
        </div>

        <div className="flex items-center justify-center gap-6 text-sm text-gray-500">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span>Live Updates</span>
          </div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4" />
            <span>Automated Processing</span>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mt-12">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200/60 p-8">
            <div className="text-center">
              <div className="text-4xl font-light text-gray-900 mb-2">1,247</div>
              <div className="text-sm text-gray-600 uppercase tracking-wider">Total Orders</div>
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200/60 p-8">
            <div className="text-center">
              <div className="text-4xl font-light text-gray-900 mb-2">23</div>
              <div className="text-sm text-gray-600 uppercase tracking-wider">Pending</div>
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200/60 p-8">
            <div className="text-center">
              <div className="text-4xl font-light text-gray-900 mb-2">98%</div>
              <div className="text-sm text-gray-600 uppercase tracking-wider">Success Rate</div>
            </div>
          </div>
        </div>

        {/* Quick Status Overview */}
        <div className="flex items-center justify-center gap-4 mt-8">
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-green-50 border border-green-200/60">
            <CheckCircle className="w-4 h-4 text-green-600" />
            <span className="text-sm font-medium text-green-700">1,189 Completed</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-amber-50 border border-amber-200/60">
            <Clock className="w-4 h-4 text-amber-600" />
            <span className="text-sm font-medium text-amber-700">23 Processing</span>
          </div>
        </div>
      </section>

      {/* Orders Component */}
      <Orders />
    </div>
  );
} 