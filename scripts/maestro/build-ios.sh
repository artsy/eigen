#!/bin/bash
set -euxo pipefail

# Creates the iOS required build file inside eigen/ios/build/Build/Products/Store-iphonesimulator/Artsy.app
# Opens the Finder window inside the folder where build file is located.

# Generate the iOS build file
yarn maestro:ios:release:build

# Navigate to the directory containing the build
cd ios/build/Build/Products/Store-iphonesimulator

# Zip the build directory
zip -r Artsy.zip Artsy.app

echo "Uploading the iOS build to maestro server"

curl https://api.copilot.mobile.dev/v2/project/$MAESTRO_IOS_PROJECT_ID/build \
    -F "file=@$PWD/Artsy.zip" \
    -F "tags=nightly" \
    -H "Authorization: Bearer $MAESTRO_COPILOT_API_KEY"

# Please discard the diff that will be generated afterwards (Podfile.lock)
