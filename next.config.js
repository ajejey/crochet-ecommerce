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
  skipTrailingSlashRedirect: true,
  // Fix for bcrypt/node-pre-gyp HTML file issue
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals.push({
        'bcrypt': 'commonjs bcrypt'
      });
    }
    // Ignore HTML files in node_modules
    config.module.rules.push({
      test: /\.html$/,
      loader: 'ignore-loader'
    });
    return config;
  },
  // Add rewrites for sitemap URLs and PostHog integration
  async rewrites() {
    return [
      {
        source: '/product-sitemap-:id.xml',
        destination: '/sitemap/:id',
      },
      {
        source: "/ingest/static/:path*",
        destination: "https://us-assets.i.posthog.com/static/:path*",
      },
      {
        source: "/ingest/:path*",
        destination: "https://us.i.posthog.com/:path*",
      },
      {
        source: "/ingest/decide",
        destination: "https://us.i.posthog.com/decide",
      },
    ];
  },
};

module.exports = withPWA(nextConfig);
