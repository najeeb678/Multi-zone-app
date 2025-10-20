#!/usr/bin/env bash
set -euo pipefail

# fix-styled-links.sh
# Ensures a single shared `styled-components` instance by installing it in host-app
# and symlinking it into other apps' node_modules folders.

ROOT_DIR="$(cd "$(dirname "$0")" && pwd)"
HOST_APP="$ROOT_DIR/host-app"
APPS=("lastmile-app" "fulfillment-app" "shared-components")
SC_VERSION="^6.1.19"

echo "Root: $ROOT_DIR"

# Ensure host-app has styled-components
echo -e "\n[1/4] Ensuring host-app has styled-components ($SC_VERSION)"
cd "$HOST_APP"
if ! npm ls styled-components >/dev/null 2>&1; then
  echo "styled-components not found in host-app. Installing..."
  npm install "styled-components@${SC_VERSION}"
else
  echo "host-app already provides styled-components"
fi

# Create symlinks for other apps
for app in "${APPS[@]}"; do
  echo -e "\n[2/4] Linking styled-components into $app"
  TARGET_NODE_MODULES="$ROOT_DIR/$app/node_modules"
  mkdir -p "$TARGET_NODE_MODULES"

  if [ -L "$TARGET_NODE_MODULES/styled-components" ] || [ -e "$TARGET_NODE_MODULES/styled-components" ]; then
    echo "Removing existing styled-components in $app/node_modules"
    rm -rf "$TARGET_NODE_MODULES/styled-components"
  fi

  echo "Creating symlink for styled-components in $app"
  ln -s "$HOST_APP/node_modules/styled-components" "$TARGET_NODE_MODULES/styled-components"
  echo "Linked: $app -> host-app/node_modules/styled-components"
done

# Update shared-components package.json to include styled-components as peer dependency
echo -e "\n[3/4] Updating shared-components package.json"
cd "$ROOT_DIR/shared-components"

# Check if styled-components is already in peerDependencies
if ! grep -q '"styled-components"' package.json; then
  echo "Adding styled-components to peerDependencies in shared-components"
  # Use temporary file to avoid issues with inline editing
  sed -i 's/"peerDependencies": {/"peerDependencies": {\n    "styled-components": "^6.1.19",/g' package.json
  echo "Updated package.json"
else
  echo "styled-components already in peerDependencies"
fi

# Link styled-components in each app's node_modules/app-tship/node_modules
echo -e "\n[4/4] Linking styled-components in each app's app-tship module"
for app in "lastmile-app" "fulfillment-app" "host-app"; do
  APP_SHARED_PATH="$ROOT_DIR/$app/node_modules/app-tship/node_modules"
  if [ -d "$APP_SHARED_PATH" ]; then
    if [ -L "$APP_SHARED_PATH/styled-components" ] || [ -e "$APP_SHARED_PATH/styled-components" ]; then
      echo "Removing existing styled-components in $app/node_modules/app-tship/node_modules"
      rm -rf "$APP_SHARED_PATH/styled-components"
    fi

    # Create directory if it doesn't exist
    mkdir -p "$APP_SHARED_PATH"
    
    echo "Creating symlink for styled-components in $app/node_modules/app-tship/node_modules"
    ln -s "$HOST_APP/node_modules/styled-components" "$APP_SHARED_PATH/styled-components"
    echo "Linked: $app/node_modules/app-tship/node_modules -> host-app/node_modules/styled-components"
  fi
done

echo -e "\nAll done. Verify with:"
echo "  cd host-app && npm ls styled-components"
echo "  cd ../lastmile-app && npm ls styled-components" 
echo "  cd ../fulfillment-app && npm ls styled-components"
echo "  cd ../shared-components && npm ls styled-components"
echo -e "\nNow run your apps with: ./start-zones.sh"
