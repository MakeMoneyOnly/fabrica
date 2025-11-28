import type { Metadata } from 'next'
import { ShoppingBag, Zap, Shield, TrendingUp, Users, Globe } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Features | Fabrica',
  description: 'Everything you need to build, grow, and monetize your online business in Ethiopia.',
}

const features = [
  {
    name: 'Beautiful Storefronts',
    description:
      'Create a stunning online store in minutes. Choose from professionally designed themes and customize to match your brand.',
    icon: ShoppingBag,
  },
  {
    name: 'Lightning Fast',
    description:
      'Built with Next.js and optimized for performance. Your store loads instantly, keeping customers engaged.',
    icon: Zap,
  },
  {
    name: 'Secure Payments',
    description:
      'Accept payments through Chapa with support for Telebirr, CBE Birr, and more. All transactions are secure and encrypted.',
    icon: Shield,
  },
  {
    name: 'Analytics Dashboard',
    description:
      'Track your sales, revenue, and customer behavior with powerful analytics. Make data-driven decisions to grow your business.',
    icon: TrendingUp,
  },
  {
    name: 'Referral Program',
    description:
      'Earn 20% recurring commission by referring other creators. Build passive income while helping others succeed.',
    icon: Users,
  },
  {
    name: 'Custom Domains',
    description:
      'Use your own domain name to build your brand. Professional and memorable URLs for your customers.',
    icon: Globe,
  },
]

export default function FeaturesPage() {
  return (
    <div className="py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Header */}
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
            Everything you need to succeed
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Fabrica provides all the tools you need to build, grow, and monetize your online
            business in Ethiopia.
          </p>
        </div>

        {/* Features Grid */}
        <div className="mx-auto mt-16 max-w-7xl">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <div
                key={feature.name}
                className="relative bg-white p-8 rounded-2xl border border-gray-200"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-600">
                    <feature.icon className="h-6 w-6 text-white" aria-hidden="true" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">{feature.name}</h3>
                </div>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="mx-auto mt-24 max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">Ready to get started?</h2>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Join thousands of creators building their business on Fabrica.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <a
              href="/sign-up"
              className="rounded-md bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
            >
              Start Free Trial
            </a>
            <a href="/pricing" className="text-sm font-semibold leading-6 text-gray-900">
              View Pricing <span aria-hidden="true">→</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
