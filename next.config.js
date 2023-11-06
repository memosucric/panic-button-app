/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['panic.karpatkey.com', 'localhost', 'panic.karpatkey.dev']
  },
  experimental: {
    externalDir: true
  }
}

module.exports = nextConfig
