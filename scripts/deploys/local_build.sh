#!/bin/bash

set -e

# Add bundled Ruby executables to PATH
# TODO: dynamically get ruby version
# export PATH="./.vendor/ruby/3.1.0/bin:$PATH"

# echo "Installing Ruby gems..."
# bundle install

# echo "Installing CocoaPods dependencies..."
# pushd ios
# bundle exec pod install
# popd

echo "Starting EAS build..."

# Generate easignore that has files needed to build excluded by default
./scripts/deploys/generate_easignore.sh

# Run with dotenv so podfile has access to env vars
dotenv -f ".env.shared" yarn eas build --local --platform ios --profile "$1"