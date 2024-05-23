#!/bin/bash
set -euxo pipefail

# Check if the correct number of arguments is provided
if [ "$#" -lt 1 ] || [ "$#" -gt 1 ]; then
  echo "Usage: $0 <rollout_percentage e.g. 50>"
  exit 1
fi

# Get the rollout_percentage option from the command-line argument
rollout_percentage=$1

bundle exec fastlane promote_codepush rollout_percentage:$rollout_percentage

# fetch the latest codepush submission tags
IOS_TAG=$(git tag -l "codepush-canary-ios-*" | tail -n 1)
ANDROID_TAG=$(git tag -l "codepush-canary-android-*" | tail -n 1)

# Create the new submission tags
NEW_IOS_TAG="${IOS_TAG}-submission"
NEW_ANDROID_TAG="${ANDROID_TAG}-submission"

# Annotate the new submission tags
git tag -am "$NEW_IOS_TAG" "$NEW_IOS_TAG"
git tag -am "$NEW_ANDROID_TAG" "$NEW_ANDROID_TAG"

# Step 7: Push the new tags to the remote repository
git push origin "$NEW_IOS_TAG"
git push origin "$NEW_ANDROID_TAG"
