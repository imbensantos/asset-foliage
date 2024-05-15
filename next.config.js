/** @type {import('next').NextConfig} */
module.exports = {
  images: {
    domains: ['localhost'],
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "3000",
        pathname: "/storage/media/**",
      },
    ],
  },
};