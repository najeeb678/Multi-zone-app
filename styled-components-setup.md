# Styled Components in Next.js Multi-Zone App with SSR

This document explains the implementation of styled-components with proper server-side rendering (SSR) in our multi-zone Next.js application.

## Understanding the Problem

When using styled-components in a multi-zone Next.js application with a shared components library, you may encounter these issues:

1. **"There are several instances of styled-components initialized in this application"** - Caused by multiple instances of the styled-components library being loaded.
2. **"Module not found: Can't resolve 'styled-components'"** - When a shared component package can't find styled-components.
3. **Flash of unstyled content (FOUC)** - When styles are initially missing and then applied after client-side hydration.

## Solution Implemented

We've implemented a comprehensive solution that ensures:

1. A single shared instance of styled-components across all zones
2. Proper server-side rendering (SSR) of styled components
3. No flash of unstyled content on initial load

### How It Works

1. **Single styled-components Instance**:

   - Install styled-components only in the host-app
   - Create symlinks in all other apps to point to the host-app's instance
   - Also link styled-components in shared-components package

2. **Proper Next.js Configuration**:

   - Each zone has `compiler: { styledComponents: true }` for SSR support
   - Webpack alias configuration to force resolution to a single instance
   - transpilePackages: ["app-tship"] to ensure shared components are processed correctly

3. **Shared Components Setup**:
   - styled-components added as a peerDependency
   - Each app has access to the same physical styled-components instance

## Setup Scripts

Two scripts are provided to maintain this setup:

1. `setup-shared.sh` - Initial setup for the entire multi-zone app
2. `fix-styled-links.sh` - Maintains the symlinks between apps

## Common Issues

- If you see "Module not found: Can't resolve 'styled-components'" errors, run `./fix-styled-links.sh` to repair the symlinks
- If you see "There are several instances of styled-components initialized", ensure that each app is using the same physical instance

## Key Implementation Details

Each app's Next.js config includes:

```javascript
// Import required for ES modules
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["app-tship"],
  compiler: {
    styledComponents: true,
  },
  webpack: (config, { isServer }) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      "styled-components": path.resolve(__dirname, "node_modules/styled-components"),
    };
    return config;
  },
  // ...other configuration
};
```

## Verification

To verify everything is working correctly:

1. Check that each app uses the same physical styled-components instance:

   ```bash
   cd host-app && npm ls styled-components
   cd ../lastmile-app && npm ls styled-components
   cd ../fulfillment-app && npm ls styled-components
   cd ../shared-components && npm ls styled-components
   ```

2. Start all zones and verify there are no styled-components errors in the console:

   ```bash
   ./start-zones.sh
   ```

3. Check that styles are present immediately on initial page load (no FOUC)
