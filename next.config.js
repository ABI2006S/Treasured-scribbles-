/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    appDir: true,
  },
  images: {
    domains: ['a_x.__.nmemories.com'], // Your domain
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://api.a_x.__.nmemories.com/api/:path*', // Assuming API is on the same domain
      },
    ]
  },
}

module.exports = nextConfig
