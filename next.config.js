// next.config.js
const withPWA = require("next-pwa")({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
  register: true,
  skipWaiting: true,
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ["images.unsplash.com", "firebasestorage.googleapis.com", "cloud.appwrite.io", "cloud.appwrite.io"],
  },
  // Add rewrites for sitemap URLs
  async rewrites() {
    return [
      {
        source: '/product-sitemap-:id.xml',
        destination: '/sitemap/:id',
      },
    ];
  },
};

module.exports = withPWA(nextConfig);