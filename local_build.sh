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
dotenv -f ".env.shared" yarn eas build --local --platform ios --profile "$1"