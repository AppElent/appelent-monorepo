/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
    transpilePackages: ['@appelent/helpers']
  },
}

module.exports = nextConfig
