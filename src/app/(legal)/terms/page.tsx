import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Terms of Service | Fabrica',
  description: 'Terms of Service for Fabrica - Creator Commerce Platform',
}

export default function TermsPage() {
  const lastUpdated = 'November 28, 2025'

  return (
    <div className="prose prose-lg max-w-none">
      <h1>Terms of Service</h1>
      <p className="text-gray-600">Last updated: {lastUpdated}</p>

      <h2>1. Acceptance of Terms</h2>
      <p>
        By accessing and using Fabrica ("the Platform"), you accept and agree to be bound by the
        terms and provision of this agreement. If you do not agree to these Terms of Service, please
        do not use the Platform.
      </p>

      <h2>2. Description of Service</h2>
      <p>
        Fabrica provides a platform for creators to build online storefronts, sell digital products,
        offer services, and manage their online business. The service includes but is not limited
        to:
      </p>
      <ul>
        <li>Storefront creation and customization</li>
        <li>Product management (digital products, bookings, external links)</li>
        <li>Payment processing through integrated payment providers</li>
        <li>Analytics and reporting tools</li>
        <li>Customer management features</li>
      </ul>

      <h2>3. User Accounts</h2>
      <h3>3.1 Account Creation</h3>
      <p>
        To use Fabrica, you must create an account by providing accurate and complete information.
        You are responsible for maintaining the confidentiality of your account credentials.
      </p>
      <h3>3.2 Account Responsibilities</h3>
      <p>You are responsible for all activities that occur under your account. You agree to:</p>
      <ul>
        <li>Provide accurate, current, and complete information</li>
        <li>Maintain and update your information to keep it accurate and current</li>
        <li>Notify us immediately of any unauthorized use of your account</li>
        <li>Not share your account credentials with others</li>
      </ul>

      <h2>4. Payments and Fees</h2>
      <h3>4.1 Subscription Plans</h3>
      <p>
        Fabrica offers various subscription plans with different features and pricing. All fees are
        stated in Ethiopian Birr (ETB) and are subject to change with 30 days notice.
      </p>
      <h3>4.2 Transaction Fees</h3>
      <p>
        Payment processing fees are charged by our payment provider (Chapa) and are separate from
        Fabrica subscription fees. These fees are deducted from each transaction.
      </p>
      <h3>4.3 Refunds</h3>
      <p>
        Subscription fees are non-refundable except as required by law. You may cancel your
        subscription at any time, and cancellation will take effect at the end of your current
        billing period.
      </p>

      <h2>5. Content and Conduct</h2>
      <h3>5.1 Your Content</h3>
      <p>
        You retain all rights to the content you upload to Fabrica. By uploading content, you grant
        Fabrica a non-exclusive, worldwide license to host, store, and display your content as
        necessary to provide the service.
      </p>
      <h3>5.2 Prohibited Content</h3>
      <p>You agree not to upload, post, or transmit content that:</p>
      <ul>
        <li>Is illegal, harmful, or violates any laws or regulations</li>
        <li>Infringes on intellectual property rights of others</li>
        <li>Contains malware, viruses, or harmful code</li>
        <li>Is fraudulent, deceptive, or misleading</li>
        <li>Promotes violence, discrimination, or hate speech</li>
      </ul>

      <h2>6. Intellectual Property</h2>
      <p>
        The Fabrica platform, including its design, features, and functionality, is owned by Fabrica
        and protected by copyright, trademark, and other intellectual property laws. You may not
        copy, modify, or distribute any part of the platform without our express written permission.
      </p>

      <h2>7. Termination</h2>
      <p>
        We reserve the right to suspend or terminate your account at any time for violation of these
        Terms of Service or for any other reason at our sole discretion. Upon termination, your
        right to use the Platform will immediately cease.
      </p>

      <h2>8. Limitation of Liability</h2>
      <p>
        Fabrica is provided "as is" without warranties of any kind. We are not liable for any
        indirect, incidental, special, or consequential damages arising from your use of the
        platform.
      </p>

      <h2>9. Governing Law</h2>
      <p>
        These Terms of Service are governed by the laws of the Federal Democratic Republic of
        Ethiopia. Any disputes arising from these terms will be resolved in the courts of Addis
        Ababa, Ethiopia.
      </p>

      <h2>10. Changes to Terms</h2>
      <p>
        We reserve the right to modify these Terms of Service at any time. We will notify you of any
        material changes via email or through the platform. Your continued use of Fabrica after such
        changes constitutes acceptance of the new terms.
      </p>

      <h2>11. Contact Information</h2>
      <p>
        If you have any questions about these Terms of Service, please contact us at:{' '}
        <a href="mailto:legal@fabrica.et">legal@fabrica.et</a>
      </p>
    </div>
  )
}
