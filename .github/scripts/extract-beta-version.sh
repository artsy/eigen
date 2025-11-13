#!/bin/bash

# Script to extract beta version from fastlane output
# Usage: ./extract-beta-version.sh <version_file_path>

set -e

VERSION_FILE="${1}"

if [ -z "$VERSION_FILE" ]; then
  echo "Error: Version file path is required"
  echo "Usage: $0 <version_file_path>"
  exit 1
fi

if [ -f "$VERSION_FILE" ]; then
  VERSION=$(cat "$VERSION_FILE")
  if [ -z "$VERSION" ]; then
    echo "Warning: Version file is empty at: $VERSION_FILE"
    echo "beta_version=" >> $GITHUB_OUTPUT
  else
    echo "beta_version=$VERSION" >> $GITHUB_OUTPUT
    echo "Beta version: $VERSION"
  fi
else
  echo "Warning: No beta version file found at: $VERSION_FILE"
  echo "Creating empty version output"
  echo "beta_version=" >> $GITHUB_OUTPUT
fi
