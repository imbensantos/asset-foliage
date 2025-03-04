/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === "production";

module.exports = {
  images: {
    formats: ["image/avif", "image/webp"],

    // Allow images from your local and production environments
    remotePatterns: isProd
      ? [
          // For production - Railway and other deployed URLs
          {
            protocol: "https",
            hostname: "assetfoliage.imbensantos.com",
            pathname: "/storage/media/**",
          },
          {
            protocol: "https",
            hostname: "assetfoliage.up.railway.app",
            pathname: "/storage/media/**",
          },
        ]
      : [
          // For local development - localhost
          {
            protocol: "http",
            hostname: "localhost",
            port: "3000",
            pathname: "/storage/media/**",
          },
        ],

    // Domains allowed for image optimization
    domains: [
      "localhost", // Local testing
      "assetfoliage.imbensantos.com",
      "imbensantos-assetfoliage.vercel.app",
      "assetfoliage.up.railway.app",
    ],
  },

  async rewrites() {
    return [
      {
        source: "/storage/:path*",
        destination: "/storage/:path*",
      },
    ];
  },

  // Ensures Next.js works well in containers like Railway
  output: "standalone",
};