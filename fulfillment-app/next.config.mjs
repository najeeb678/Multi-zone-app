/** @type {import('next').NextConfig} */
const nextConfig = {
  assetPrefix: "/fulfillment-static",
  basePath: "/v3",
  async rewrites() {
    return {
      beforeFiles: [
        {
          source: "/fulfillment-static/_next/:path*",
          destination: "/_next/:path*",
        },
      ],
    };
  },
};

export default nextConfig;
