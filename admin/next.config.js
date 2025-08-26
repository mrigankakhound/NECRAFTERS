/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ['@prisma/client'],
  },
  api: {
    bodyParser: {
      sizeLimit: '50mb',
    },
    responseLimit: '50mb',
  },
  // Increase the maximum payload size for server actions
  serverRuntimeConfig: {
    maxPayloadSize: '50mb',
  },
}

module.exports = nextConfig
