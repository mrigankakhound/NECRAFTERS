/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ['@prisma/client'],
  experimental: {
    // Remove deprecated options
  },
  // Remove api configuration as it's not supported in Next.js 15
  // The payload limits will be handled by Vercel configuration
}

module.exports = nextConfig
