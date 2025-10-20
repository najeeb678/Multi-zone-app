/** @type {import('next').NextConfig} */
const nextConfig = {
  // Transpile the shared component package so its styled-components usage
  // is properly handled by Next's compiler and SSR'd.
  transpilePackages: ["app-tship"],
  compiler: {
    // Enable the SWC styled-components transform for SSR support and better class names
    styledComponents: true,
  },
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
