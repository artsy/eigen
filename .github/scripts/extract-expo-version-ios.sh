#!/bin/bash

# Extract iOS version from app.json and Info.plist for Expo CLI builds
# Outputs: version=<version_name> (<build_number>)

set -euo pipefail

# Extract version from app.json
if [ ! -f "app.json" ]; then
  echo "Error: app.json not found"
  exit 1
fi

VERSION=$(jq -r '.version' app.json)

if [ -z "$VERSION" ] || [ "$VERSION" = "null" ]; then
  echo "Error: Could not extract version from app.json"
  exit 1
fi

# Extract build number from Info.plist
INFO_PLIST="ios/Artsy/App_Resources/Info.plist"

if [ ! -f "$INFO_PLIST" ]; then
  echo "Error: Info.plist not found at $INFO_PLIST"
  exit 1
fi

BUILD_NUMBER=$(/usr/libexec/PlistBuddy -c "Print :CFBundleVersion" "$INFO_PLIST")

if [ -z "$BUILD_NUMBER" ]; then
  echo "Error: Could not extract CFBundleVersion from Info.plist"
  exit 1
fi

# Output combined version
FULL_VERSION="${VERSION} (${BUILD_NUMBER})"
echo "version=${FULL_VERSION}" >> $GITHUB_OUTPUT
echo "Extracted iOS version: $FULL_VERSION"
