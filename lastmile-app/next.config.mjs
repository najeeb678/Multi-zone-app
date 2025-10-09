/** @type {import('next').NextConfig} */
const nextConfig = {
  assetPrefix: "/lastmile-static",
  basePath: "/v2",
  async rewrites() {
    return {
      beforeFiles: [
        {
          source: "/lastmile-static/_next/:path*",
          destination: "/_next/:path*",
        },
      ],
    };
  },
};

export default nextConfig;
