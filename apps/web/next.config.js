// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require('path');

const securityHeaders = [
  // force https
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload',
  },
  // don't run style sheets are scripts
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff',
  },
  // if browser suspects xss, don't access the page
  { key: 'X-XSS-Protection', value: '1; mode=block' },
  // disallow iframes
  { key: 'X-Frame-Options', value: 'deny' },
  {
    key: 'Content-Security-Policy',
    value:
      "default-src 'self'; img-src * data:; script-src 'self' 'unsafe-eval' https://challenges.cloudflare.com/; style-src 'self' 'unsafe-inline'; frame-src https://challenges.cloudflare.com https://youtube.com https://www.youtube.com; upgrade-insecure-requests;",
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
    if (process.env.NODE_ENV === 'production') {
      securityHeaders[4].value =
        "default-src 'self'; img-src * data:; script-src 'self' https://challenges.cloudflare.com/; style-src 'self' 'unsafe-inline'; frame-src https://challenges.cloudflare.com https://youtube.com https://www.youtube.com; upgrade-insecure-requests;";
    }
    return [
      {
        // Apply these headers to all routes in your application.
        source: '/:path*',
        headers: [
          ...securityHeaders,
          // prefetch dns, increases performance
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          // increase user privacy by only sending origin to us
          {
            key: 'Referrer-Policy',
            value: 'same-origin',
          },
        ],
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
