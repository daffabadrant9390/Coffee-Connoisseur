/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    domains: ['images.unsplash.com'],
    formats: ['image/webp'],
  },
  target: 'serverless',
};

module.exports = nextConfig;
