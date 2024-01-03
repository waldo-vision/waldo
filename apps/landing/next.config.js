/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'waldo.vision',
      },
    ],
  },
};

module.exports = nextConfig;
