const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  swcMinify: true,
  experimental: {
    outputFileTracingRoot: path.join(__dirname, '../../'),
    transpilePackages: ['ui'],
  },
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.discordapp.com',
        pathname: '/**',
      },
    ],
  },
  images: {
    domains: ['cdn.discordapp.com'],
  },
  i18n: {
    locales: ['en-US'],
    defaultLocale: 'en-US',
  },
};

module.exports = nextConfig;
