#!/bin/bash
set -euxo pipefail

# Creates the Android required build file inside path
# Opens the Finder window inside the folder where build file is located.
# Discard the changes that are generated afterwards

# Define the path to your app.json file
APP_JSON_PATH="app.json"

# changes isAndroidBeta to true in app.json for build to default to staging
if [ -f "$APP_JSON_PATH" ]; then
    # Use jq to edit the JSON file
    jq '.isAndroidBeta = true' "$APP_JSON_PATH" > "$APP_JSON_PATH.tmp" && mv "$APP_JSON_PATH.tmp" "$APP_JSON_PATH"
    echo "isAndroidBeta set to true in app.json"
else
    echo "Error: app.json not found at $APP_JSON_PATH"
    exit 1
fi

# removes codepushhash to avoid conflicts
rm -rf android/app/build/generated/assets/createBundleReleaseJsAndAssets/CodePushHash

# Generate the android aab build file
yarn maestro:android:release:build

# Generate the android apk build file
# This step will probably fail if you don't have an android emulator open but it is going to generate the apk file
# correctly. You can ignore the error and continue with the script.
yarn maestro:android:release:install

# Please discard the diff that will be generated afterwards (app.json)
