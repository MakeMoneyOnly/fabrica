/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['localhost', 'api.flexpay.et', 'staging-api.flexpay.et', 'images.unsplash.com'],
    qualities: [75, 100],
  },
  async rewrites() {
    // Default API URL if environment variable is not set
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api/v1';

    return [
      {
        source: '/api/:path*',
        destination: apiUrl + '/:path*',
      },
    ];
  },
};

module.exports = nextConfig;
