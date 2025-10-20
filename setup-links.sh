#!/bin/bash

echo "Setting up shared components..."

# Navigate to shared-components and create link
cd shared-components
npm unlink || true  # Unlink if already linked
npm link

# Navigate to host-app and link to shared-components by package name
cd ../host-app
npm unlink app-tship || true
npm link app-tship

# Navigate to lastmile-app and link to shared-components by package name
cd ../lastmile-app
npm unlink app-tship || true
npm link app-tship

# Navigate to fulfillment-app and link to shared-components by package name
cd ../fulfillment-app
npm unlink app-tship || true
npm link app-tship

echo "Linking complete. You can now start your development servers."