import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy | Fabrica',
  description: 'Privacy Policy for Fabrica - Creator Commerce Platform',
}

export default function PrivacyPage() {
  const lastUpdated = 'November 28, 2025'

  return (
    <div className="prose prose-lg max-w-none">
      <h1>Privacy Policy</h1>
      <p className="text-gray-600">Last updated: {lastUpdated}</p>

      <h2>1. Introduction</h2>
      <p>
        Fabrica ("we", "our", or "us") is committed to protecting your privacy. This Privacy Policy
        explains how we collect, use, disclose, and safeguard your information when you use our
        platform.
      </p>

      <h2>2. Information We Collect</h2>
      <h3>2.1 Information You Provide</h3>
      <p>We collect information that you voluntarily provide to us, including:</p>
      <ul>
        <li>Account information (name, email, phone number)</li>
        <li>Profile information (bio, avatar, social media links)</li>
        <li>Payment information (processed securely through our payment provider)</li>
        <li>Product information (titles, descriptions, images, prices)</li>
        <li>Customer data (for orders and transactions)</li>
      </ul>

      <h3>2.2 Automatically Collected Information</h3>
      <p>When you use Fabrica, we automatically collect certain information, including:</p>
      <ul>
        <li>Device information (browser type, operating system, device identifiers)</li>
        <li>Usage data (pages visited, features used, time spent on platform)</li>
        <li>IP address and location data</li>
        <li>Cookies and similar tracking technologies</li>
      </ul>

      <h2>3. How We Use Your Information</h2>
      <p>We use the collected information for the following purposes:</p>
      <ul>
        <li>To provide and maintain our service</li>
        <li>To process transactions and send transaction notifications</li>
        <li>To improve and personalize your experience</li>
        <li>To communicate with you about updates, features, and support</li>
        <li>To detect and prevent fraud and abuse</li>
        <li>To comply with legal obligations</li>
        <li>To analyze usage patterns and improve our platform</li>
      </ul>

      <h2>4. Information Sharing and Disclosure</h2>
      <h3>4.1 Service Providers</h3>
      <p>
        We share your information with third-party service providers who help us operate our
        platform, including:
      </p>
      <ul>
        <li>
          <strong>Clerk:</strong> Authentication and user management
        </li>
        <li>
          <strong>Supabase:</strong> Database and storage services
        </li>
        <li>
          <strong>Chapa:</strong> Payment processing
        </li>
        <li>
          <strong>Vercel:</strong> Hosting and infrastructure
        </li>
        <li>
          <strong>Sentry:</strong> Error monitoring and debugging
        </li>
      </ul>

      <h3>4.2 Public Information</h3>
      <p>
        Information you choose to make public on your storefront (name, bio, products, social links)
        is visible to anyone who visits your store.
      </p>

      <h3>4.3 Legal Requirements</h3>
      <p>
        We may disclose your information if required by law or in response to valid requests by
        public authorities.
      </p>

      <h2>5. Data Security</h2>
      <p>
        We implement appropriate technical and organizational measures to protect your personal
        information. However, no method of transmission over the internet is 100% secure, and we
        cannot guarantee absolute security.
      </p>

      <h2>6. Data Retention</h2>
      <p>
        We retain your personal information for as long as necessary to provide our services and
        comply with legal obligations. When you delete your account, we will delete or anonymize
        your personal information within 30 days, except where we are required to retain it by law.
      </p>

      <h2>7. Your Rights</h2>
      <p>You have the following rights regarding your personal information:</p>
      <ul>
        <li>
          <strong>Access:</strong> You can request a copy of your personal information
        </li>
        <li>
          <strong>Correction:</strong> You can update or correct your information through your
          account settings
        </li>
        <li>
          <strong>Deletion:</strong> You can request deletion of your account and personal
          information
        </li>
        <li>
          <strong>Portability:</strong> You can request a copy of your data in a machine-readable
          format
        </li>
        <li>
          <strong>Objection:</strong> You can object to certain processing of your information
        </li>
      </ul>

      <h2>8. Cookies and Tracking</h2>
      <p>
        We use cookies and similar tracking technologies to improve your experience. You can control
        cookies through your browser settings, but disabling cookies may affect your ability to use
        certain features of the platform.
      </p>

      <h2>9. Children's Privacy</h2>
      <p>
        Fabrica is not intended for users under the age of 18. We do not knowingly collect personal
        information from children. If you believe we have collected information from a child, please
        contact us immediately.
      </p>

      <h2>10. International Data Transfers</h2>
      <p>
        Your information may be transferred to and processed in countries other than Ethiopia. We
        ensure appropriate safeguards are in place to protect your information in accordance with
        this Privacy Policy.
      </p>

      <h2>11. Changes to This Privacy Policy</h2>
      <p>
        We may update this Privacy Policy from time to time. We will notify you of any material
        changes by posting the new Privacy Policy on this page and updating the "Last updated" date.
      </p>

      <h2>12. Contact Us</h2>
      <p>
        If you have any questions about this Privacy Policy or our privacy practices, please contact
        us at: <a href="mailto:privacy@fabrica.et">privacy@fabrica.et</a>
      </p>

      <h3>Data Protection Officer</h3>
      <p>
        For data protection inquiries, you can contact our Data Protection Officer at:{' '}
        <a href="mailto:dpo@fabrica.et">dpo@fabrica.et</a>
      </p>
    </div>
  )
}
