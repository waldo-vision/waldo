// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require('path');

const securityHeaders = [
  { key: 'Strict-Transport-Security', value: 'max-age=63072000' },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff',
  },
  { key: 'X-XSS-Protection', value: '1; mode=block' },
  { key: 'X-Frame-Options', value: 'deny' },
  {
    key: 'Content-Security-Policy',
    value:
      "default-src 'self'; img-src *; script-src 'self' 'unsafe-eval' https://challenges.cloudflare.com/; style-src 'self' 'unsafe-inline'; frame-src https://challenges.cloudflare.com https://youtube.com https://www.youtube.com ;",
  },
];

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  swcMinify: true,
  experimental: {
    outputFileTracingRoot: path.join(__dirname, '../../'),
    transpilePackages: ['ui'],
  },
  images: {
    domains: ['cdn.discordapp.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.discordapp.com',
        pathname: '/**',
      },
    ],
  },
  i18n: {
    locales: ['en-US'],
    defaultLocale: 'en-US',
  },
  async headers() {
    return [
      {
        // Apply these headers to all routes in your application.
        source: '/:path*',
        headers: securityHeaders,
      },
    ];
  },
  async redirects() {
    return [
      {
        source: '/chat',
        destination: 'https://discord.gg/MPAV4qP8Hx',
        permanent: false,
      },
    ];
  },
};

module.exports = nextConfig;
