/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
    transpilePackages: ["@appelent/helpers"],
  },
  reactStrictMode: false,
};

module.exports = nextConfig;
