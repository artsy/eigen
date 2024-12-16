#!/bin/bash

# Define paths
GITIGNORE_PATH="./.gitignore"
EASIGNORE_PATH="./.easignore"

# Files to include in EAS that are excluded by .gitignore
FILES_TO_INCLUDE=(
  "!GoogleService-Info.plist"
  "!AppCenter-Config.plist"
  "!google-services.json"
  "!eigen-firebase-app-distribution.json"
  "!.env.shared"
  "!android/app/src/main/assets/fonts/*"
  "!ios/Artsy/fonts/*"
  "!ios/Artsy/View_Controllers/Live_Auctions/Resources/Artsy/fonts/*"
)

# Check if .gitignore exists
if [[ ! -f "$GITIGNORE_PATH" ]]; then
  echo "Error: .gitignore not found at $GITIGNORE_PATH"
  exit 1
fi

# Read .gitignore
GITIGNORE_CONTENT=$(cat "$GITIGNORE_PATH")

# Append custom exclusions to .easignore
{
  echo "$GITIGNORE_CONTENT"
  for FILE in "${FILES_TO_INCLUDE[@]}"; do
    echo "$FILE"
  done
} > "$EASIGNORE_PATH"

echo ".easignore generated from .gitignore with additional rules:"
echo "${FILES_TO_INCLUDE[@]}"