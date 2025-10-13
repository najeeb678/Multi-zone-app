# Multi-Zone Next.js Application

This project demonstrates a multi-zone Next.js architecture with three zones:

## Zone Architecture

```
http://localhost:5801/      → host-app (login page)
http://localhost:5801/v2    → lastmile-app
http://localhost:5801/v3    → fulfillment-app
```

## Project Structure

```
multiZone-app/
├── host-app/           # Main zone (handles routing and login)
├── lastmile-app/       # Zone v2 (lastmile operations)
├── fulfillment-app/    # Zone v3 (fulfillment operations)
└── start-zones.sh      # Startup script for all zones

```

## How Multi-Zones Work

### 1. Zone Configuration

Each zone is configured with:

- **host-app**: Main zone that handles routing via `rewrites()` in `next.config.mjs`
- **lastmile-app**: Configured with `basePath: '/v2'` and `assetPrefix: '/lastmile-static'`
- **fulfillment-app**: Configured with `basePath: '/v3'` and `assetPrefix: '/fulfillment-static'`

### 2. Routing Strategy

The host-app uses Next.js rewrites to proxy requests:

```javascript
async rewrites() {
  return [
    // Route /v2/* to lastmile-app
    {
      source: '/v2/api/:path*',
      destination: '/v2/api/:path*', // API stays in host
    },
    {
      source: '/v2/:path*',
      destination: `${process.env.LASTMILE_DOMAIN || "http://localhost:5802"}/v2/:path*`,
    },
    {
      source: '/lastmile-static/:path*',
      destination: `${process.env.LASTMILE_DOMAIN || "http://localhost:5802"}/lastmile-static/:path*`,
    },

    // Route /v3/* to fulfillment-app
    {
      source: '/v3',
      destination: `${process.env.FULFILLMENT_DOMAIN || "http://localhost:5803"}/v3`,
    },
    {
      source: '/v3/:path*',
      destination: `${process.env.FULFILLMENT_DOMAIN || "http://localhost:5803"}/v3/:path*`,
    },
    {
      source: '/fulfillment-static/:path*',
      destination: `${process.env.FULFILLMENT_DOMAIN || "http://localhost:5803"}/fulfillment-static/:path*`,
    },
  ];
}

```

### 3. Navigation Between Zones

- **Within Zone**: Use Next.js `<Link>` component for soft navigation
- **Between Zones**: Use regular `<a>` tags for hard navigation

## Quick Start

### Option 1: Use the startup script (Recommended)

```bash
# Install dependencies for all zones
cd host-app && npm install
cd ../lastmile-app && npm install
cd ../fulfillment-app && npm install
cd ..

# Start all zones
./start-zones.sh

```

### Option 2: Manual startup

```bash
# Terminal 1 - Host App (port 5801)
cd host-app
npm run dev

# Terminal 2 - Fulfillment App (port 5803)
cd fulfillment-app
npm run dev

# Terminal 3 - Lastmile App (port 5802)
cd lastmile-app
npm run dev

```

## Access Points

Once all zones are running:

- **Main Application**: http://localhost:5801
- **Lastmile Zone**: http://localhost:5801/v2
- **Fulfillment Zone**: http://localhost:5801/v3

## Development URLs (Direct Access)

For development, you can also access zones directly:

- **Host App**: http://localhost:5801
- **Fulfillment App**: http://localhost:5803/v3
- **Lastmile App**: http://localhost:5801/v2

## Key Features

1. **Shared Authentication**: Session cookies are shared across zones
2. **Independent Deployments**: Each zone can be developed and deployed separately
3. **Soft/Hard Navigation**: Proper navigation handling between zones
4. **Asset Isolation**: Each zone has its own static asset prefix to avoid conflicts

## Environment Variables

The host-app uses these environment variables for zone routing:

```bash
LASTMILE_DOMAIN=http://localhost:5801
FULFILLMENT_DOMAIN=http://localhost:5802

```

## Production Deployment

For production, update the environment variables to point to your production zone domains:

```bash
LASTMILE_DOMAIN=https://lastmile.yourdomain.com
FULFILLMENT_DOMAIN=https://fulfillment.yourdomain.com
```

## Troubleshooting

1. **Port conflicts**: Make sure ports 5801, 5802, and 5803 are available
2. **Zone routing issues**: Check that all zones are running before testing navigation
3. **Asset loading issues**: Verify `assetPrefix` configuration in zone configs
4. **Cookie sharing**: Ensure cookies are set with correct domain and path

## Architecture Benefits

- **Scalability**: Each zone can be scaled independently
- **Team Independence**: Different teams can work on different zones
- **Technology Flexibility**: Each zone could potentially use different versions or frameworks
- **Performance**: Smaller bundle sizes for each zone
- **Deployment**: Independent deployment cycles for each zone
