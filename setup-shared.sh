#!/bin/bash
set -euo pipefail

# setup-shared.sh
# Complete setup for multizone app with shared components and styled-components

ROOT_DIR="$(cd "$(dirname "$0")" && pwd)"
echo "Starting complete setup for multizone app at: $ROOT_DIR"

# 1. Install styled-components in all apps
echo -e "\n[1/4] Installing styled-components in all apps"

for app in "host-app" "lastmile-app" "fulfillment-app" "shared-components"; do
  echo "Installing styled-components in $app"
  cd "$ROOT_DIR/$app"
  npm install styled-components@^6.1.19
done

# 2. Link shared-components to each app
echo -e "\n[2/4] Linking shared-components to each app"
cd "$ROOT_DIR/shared-components"
npm link

for app in "host-app" "lastmile-app" "fulfillment-app"; do
  echo "Linking app-tship (shared-components) into $app"
  cd "$ROOT_DIR/$app"
  npm link app-tship
done

# 3. Update Next.js configs to ensure proper SSR
echo -e "\n[3/4] Updating Next.js configs for styled-components SSR"
for app in "host-app" "lastmile-app" "fulfillment-app"; do
  echo "Checking config for $app"
  cd "$ROOT_DIR/$app"
  
  # Ensure compiler option is set
  if ! grep -q "styledComponents: true" next.config.mjs; then
    echo "Adding styledComponents compiler option to $app/next.config.mjs"
    sed -i 's/const nextConfig = {/const nextConfig = {\n  compiler: {\n    styledComponents: true,\n  },/g' next.config.mjs
  fi
done

# 4. Verify installations
echo -e "\n[4/4] Verifying installations"
for app in "host-app" "lastmile-app" "fulfillment-app" "shared-components"; do
  echo -e "\nChecking $app"
  cd "$ROOT_DIR/$app"
  echo "styled-components:"
  npm ls styled-components || echo "Not found directly"
  
  if [ "$app" != "shared-components" ]; then
    echo "app-tship:"
    npm ls app-tship || echo "Not found"
  fi
done

echo -e "\n✅ Setup complete! You can now run your apps with: ./start-zones.sh"
echo -e "Remember to check that each app's layout.js file uses the StyledComponentsRegistry component correctly."