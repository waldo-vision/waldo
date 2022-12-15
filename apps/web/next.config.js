/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
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
