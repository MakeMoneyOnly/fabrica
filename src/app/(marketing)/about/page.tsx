import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About | Fabrica',
  description:
    'Learn about Fabrica - empowering Ethiopian creators to monetize their audience and build sustainable online businesses.',
}

export default function AboutPage() {
  return (
    <div className="py-24 sm:py-32">
      <div className="mx-auto max-w-4xl px-6 lg:px-8">
        {/* Header */}
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
            About Fabrica
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Empowering Ethiopian creators to build sustainable online businesses
          </p>
        </div>

        {/* Mission */}
        <div className="mt-16 prose prose-lg mx-auto">
          <h2 className="text-3xl font-bold text-gray-900">Our Mission</h2>
          <p className="text-gray-600">
            Fabrica is on a mission to democratize e-commerce in Ethiopia. We believe every creator,
            entrepreneur, and small business owner deserves access to world-class tools to monetize
            their skills and build a sustainable online business.
          </p>
          <p className="text-gray-600">
            We're building the infrastructure that makes it easy for Ethiopian creators to sell
            digital products, offer services, and build meaningful connections with their audience -
            all while keeping their earnings in local currency.
          </p>

          <h2 className="text-3xl font-bold text-gray-900 mt-12">Why Fabrica?</h2>
          <ul className="text-gray-600">
            <li>
              <strong>Built for Ethiopia:</strong> Native support for Birr (ETB), local payment
              methods like Telebirr, and optimized for Ethiopian internet speeds.
            </li>
            <li>
              <strong>Creator-First:</strong> We're built by creators, for creators. Every feature
              is designed with your success in mind.
            </li>
            <li>
              <strong>Fair Pricing:</strong> No hidden fees, no surprise charges. Keep more of what
              you earn.
            </li>
            <li>
              <strong>Community:</strong> Join a growing community of Ethiopian creators supporting
              each other's success.
            </li>
          </ul>

          <h2 className="text-3xl font-bold text-gray-900 mt-12">Our Values</h2>
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold text-gray-900">Transparency</h3>
              <p className="text-gray-600">
                We believe in honest, transparent communication. No hidden fees, no surprise
                changes, no fine print.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900">Empowerment</h3>
              <p className="text-gray-600">
                We're here to empower you, not control you. Your business, your rules, your success.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900">Innovation</h3>
              <p className="text-gray-600">
                We're constantly improving and adding new features based on your feedback and needs.
              </p>
            </div>
          </div>

          <h2 className="text-3xl font-bold text-gray-900 mt-12">Get in Touch</h2>
          <p className="text-gray-600">
            Have questions? Want to learn more? We'd love to hear from you.
            <br />
            Email us at:{' '}
            <a href="mailto:hello@fabrica.et" className="text-blue-600 hover:text-blue-500">
              hello@fabrica.et
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
