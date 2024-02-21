/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['panic.karpatkey.com', 'localhost', 'panic.karpatkey.dev']
  },
  experimental: {
    externalDir: true
  },
  // next.config.js
  async rewrites() {
    return [
      {
        source: '/docs/:path*',
        destination: 'http://localhost:3002/docs/:path*'
      }
    ]
  }
}

module.exports = nextConfig
