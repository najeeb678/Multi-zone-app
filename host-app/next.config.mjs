/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["shared-components"],
  async rewrites() {
    return [
      // Route to lastmile-app
      // ✅ Host should handle all API routes (do NOT rewrite these)

      // When the user visits source,
      // host internally load content from destination, but keep the browser URL the same
      {
        source: "/v2/api/:path*",
        destination: "/v2/api/:path*",
      },
      // ✅ Send only UI/Frontend routes to Lastmile zone
      {
        source: "/v2/:path*",
        destination: `${process.env.LASTMILE_DOMAIN || "http://localhost:5802"}/v2/:path*`,
      },
      {
        source: "/lastmile-static/:path*",
        destination: `${process.env.LASTMILE_DOMAIN || "http://localhost:5802"}/lastmile-static/:path*`,
      },
      // Route to fulfillment-app
      {
        source: "/v3",
        destination: `${process.env.FULFILLMENT_DOMAIN || "http://localhost:5803"}/v3`,
      },
      {
        source: "/v3/:path*",
        destination: `${process.env.FULFILLMENT_DOMAIN || "http://localhost:5803"}/v3/:path*`,
      },
      {
        source: "/fulfillment-static/:path*",
        destination: `${
          process.env.FULFILLMENT_DOMAIN || "http://localhost:5803"
        }/fulfillment-static/:path*`,
      },
    ];
  },
};

export default nextConfig;

// const nextConfig = {
//   async rewrites() {
//     return [
//       // ✅ All APIs handled by host
//       {
//         source: "/v2/api/:path*",
//         destination: "/v2/api/:path*", // stay in host app
//       },

//       // ✅ Lastmile zone
//       {
//         source: "/v2/last-mile/:path*",
//         destination: `${process.env.LASTMILE_DOMAIN}/v2/last-mile/:path*`,
//       },

//       // ✅ Finance zone
//       {
//         source: "/v2/finance/:path*",
//         destination: `${process.env.FINANCE_DOMAIN}/v2/finance/:path*`,
//       },

//       // ✅ Fulfillment zone
//       {
//         source: "/v2/fulfillment/:path*",
//         destination: `${process.env.FULFILLMENT_DOMAIN}/v2/fulfillment/:path*`,
//       },
//     ];
//   },
// };
