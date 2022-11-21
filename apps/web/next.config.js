/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    transpilePackages: ['ui'],
  },
  images: {
    domains: ["cdn.discordapp.com"]
  }
};

module.exports = nextConfig;
