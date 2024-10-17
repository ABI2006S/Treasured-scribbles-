/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    appDir: true,
  },
  images: {
    domains: ['your-image-hosting-domain.com'], // Replace with your actual domain
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://your-backend-domain.com/api/:path*', // Replace with your actual backend URL
      },
    ]
  },
}

module.exports = nextConfig
