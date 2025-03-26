/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === "production";

module.exports = {
  images: {
    loader: "default",
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 60, // Cache for 1 minute
    deviceSizes: [640, 750, 1080, 1920, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],

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
      "imbensantos-assetfoliage.up.railway.app",
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
};