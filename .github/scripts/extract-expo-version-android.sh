#!/bin/bash

# Extract Android version from app.json and build.gradle for Expo CLI builds
# Outputs: version=<version_name> (<version_code>)

set -euo pipefail

# Extract version from app.json
if [ ! -f "app.json" ]; then
  echo "Error: app.json not found"
  exit 1
fi

VERSION_NAME=$(jq -r '.version' app.json)

if [ -z "$VERSION_NAME" ] || [ "$VERSION_NAME" = "null" ]; then
  echo "Error: Could not extract version from app.json"
  exit 1
fi

# Extract versionCode from build.gradle
BUILD_GRADLE="android/app/build.gradle"

if [ ! -f "$BUILD_GRADLE" ]; then
  echo "Error: build.gradle not found at $BUILD_GRADLE"
  exit 1
fi

VERSION_CODE=$(grep -E '^\s*versionCode\s+' "$BUILD_GRADLE" | awk '{print $2}' | tr -d '\n\r')

if [ -z "$VERSION_CODE" ]; then
  echo "Error: Could not extract versionCode from build.gradle"
  exit 1
fi

# Output combined version
FULL_VERSION="${VERSION_NAME} (${VERSION_CODE})"
echo "version=${FULL_VERSION}" >> $GITHUB_OUTPUT
echo "Extracted Android version: $FULL_VERSION"
