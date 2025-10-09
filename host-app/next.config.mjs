/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      // Route to lastmile-app
      {
        source: "/v2",
        destination: `${process.env.LASTMILE_DOMAIN || "http://localhost:3002"}/v2`,
      },
      {
        source: "/v2/:path*",
        destination: `${process.env.LASTMILE_DOMAIN || "http://localhost:3002"}/v2/:path*`,
      },
      {
        source: "/lastmile-static/:path*",
        destination: `${process.env.LASTMILE_DOMAIN || "http://localhost:3002"}/lastmile-static/:path*`,
      },
      // Route to fulfillment-app
      {
        source: "/v3",
        destination: `${process.env.FULFILLMENT_DOMAIN || "http://localhost:3001"}/v3`,
      },
      {
        source: "/v3/:path*",
        destination: `${process.env.FULFILLMENT_DOMAIN || "http://localhost:3001"}/v3/:path*`,
      },
      {
        source: "/fulfillment-static/:path*",
        destination: `${
          process.env.FULFILLMENT_DOMAIN || "http://localhost:3001"
        }/fulfillment-static/:path*`,
      },
    ];
  },
};

export default nextConfig;
