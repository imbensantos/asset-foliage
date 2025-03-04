/** @type {import('next').NextConfig} */
module.exports = {
  images: {
    formats: ["image/avif", "image/webp"],
    // remotePatterns: [
    //   {
    //     protocol: "http",
    //     hostname: "localhost",
    //     port: "3000",
    //     pathname: "/storage/media/**",
    //   },
    // ],
    domains: [
      "localhost",
      "imbensantos-assetfoliage.vercel.app",
      "assetfoliage.imbensantos.com",
      "asset-foliage.up.railway.app",
    ],
  },
};
