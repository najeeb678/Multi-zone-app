#!/bin/bash

echo "Setting up shared components..."

# Navigate to shared-components and create link
cd shared-components
npm unlink || true  # Unlink if already linked
npm link

# Navigate to host-app and link to shared-components
cd ../host-app
npm unlink shared-components || true
npm link shared-components

# Navigate to lastmile-app and link to shared-components
cd ../lastmile-app
npm unlink shared-components || true
npm link shared-components

# Navigate to fulfillment-app and link to shared-components
cd ../fulfillment-app
npm unlink shared-components || true
npm link shared-components

echo "Linking complete. You can now start your development servers."