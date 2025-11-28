import type { Metadata } from 'next'
import Link from 'next/link'
import { Check } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Pricing | Fabrica',
  description:
    'Simple, transparent pricing for creators of all sizes. Start free, upgrade as you grow.',
}

const plans = [
  {
    name: 'Trial',
    price: 'Free',
    duration: '14 days',
    description: 'Perfect for getting started and testing the platform',
    features: [
      'Up to 5 products',
      'Basic storefront customization',
      'Chapa payment integration',
      'Email support',
      'Analytics dashboard',
    ],
    cta: 'Start Free Trial',
    href: '/sign-up',
    highlighted: false,
  },
  {
    name: 'Creator',
    price: '299',
    duration: 'per month',
    description: 'Everything you need to run a successful online business',
    features: [
      'Unlimited products',
      'Custom domain support',
      'Advanced analytics',
      'Priority support',
      'Remove Fabrica branding',
      'Discount codes',
      'Email marketing tools',
    ],
    cta: 'Get Started',
    href: '/sign-up',
    highlighted: true,
  },
  {
    name: 'Creator Pro',
    price: '599',
    duration: 'per month',
    description: 'Advanced features for power creators and businesses',
    features: [
      'Everything in Creator',
      'Course builder',
      'Membership subscriptions',
      'Affiliate program',
      'Custom CSS',
      'API access',
      'White-label solution',
      'Dedicated account manager',
    ],
    cta: 'Contact Sales',
    href: '/sign-up',
    highlighted: false,
  },
]

export default function PricingPage() {
  return (
    <div className="py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Header */}
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
            Simple, transparent pricing
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Choose the plan that's right for you. Start free, upgrade as you grow.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="mx-auto mt-16 grid max-w-lg grid-cols-1 gap-8 lg:max-w-none lg:grid-cols-3">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`flex flex-col justify-between rounded-3xl p-8 ${
                plan.highlighted
                  ? 'bg-gray-900 ring-2 ring-gray-900'
                  : 'bg-white ring-1 ring-gray-200'
              }`}
            >
              <div>
                <h3
                  className={`text-lg font-semibold leading-8 ${
                    plan.highlighted ? 'text-white' : 'text-gray-900'
                  }`}
                >
                  {plan.name}
                </h3>
                <p
                  className={`mt-4 text-sm leading-6 ${plan.highlighted ? 'text-gray-300' : 'text-gray-600'}`}
                >
                  {plan.description}
                </p>
                <p className="mt-6 flex items-baseline gap-x-1">
                  <span
                    className={`text-4xl font-bold tracking-tight ${
                      plan.highlighted ? 'text-white' : 'text-gray-900'
                    }`}
                  >
                    {plan.price === 'Free' ? plan.price : `${plan.price} ETB`}
                  </span>
                  {plan.price !== 'Free' && (
                    <span
                      className={`text-sm font-semibold ${plan.highlighted ? 'text-gray-300' : 'text-gray-600'}`}
                    >
                      /{plan.duration}
                    </span>
                  )}
                </p>
                <ul className="mt-8 space-y-3 text-sm leading-6">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex gap-x-3">
                      <Check
                        className={`h-6 w-5 flex-none ${plan.highlighted ? 'text-white' : 'text-blue-600'}`}
                        aria-hidden="true"
                      />
                      <span className={plan.highlighted ? 'text-gray-300' : 'text-gray-600'}>
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
              <Link
                href={plan.href}
                className={`mt-8 block rounded-md px-3 py-2 text-center text-sm font-semibold leading-6 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${
                  plan.highlighted
                    ? 'bg-white text-gray-900 hover:bg-gray-100 focus-visible:outline-white'
                    : 'bg-blue-600 text-white hover:bg-blue-500 focus-visible:outline-blue-600'
                }`}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="mx-auto mt-24 max-w-4xl">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 text-center mb-12">
            Frequently asked questions
          </h2>
          <dl className="space-y-8">
            <div>
              <dt className="text-lg font-semibold text-gray-900">Can I switch plans later?</dt>
              <dd className="mt-2 text-gray-600">
                Yes! You can upgrade or downgrade your plan at any time. Changes take effect
                immediately.
              </dd>
            </div>
            <div>
              <dt className="text-lg font-semibold text-gray-900">
                What payment methods do you accept?
              </dt>
              <dd className="mt-2 text-gray-600">
                We accept all major payment methods through Chapa, including Telebirr, CBE Birr, and
                bank transfers.
              </dd>
            </div>
            <div>
              <dt className="text-lg font-semibold text-gray-900">Is there a setup fee?</dt>
              <dd className="mt-2 text-gray-600">
                No setup fees. No hidden charges. Just simple, transparent pricing.
              </dd>
            </div>
            <div>
              <dt className="text-lg font-semibold text-gray-900">
                What happens after my trial ends?
              </dt>
              <dd className="mt-2 text-gray-600">
                After your 14-day trial, you'll need to choose a paid plan to continue using
                Fabrica. Your data and store will be preserved.
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  )
}
