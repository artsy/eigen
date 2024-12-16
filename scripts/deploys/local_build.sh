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


# Need to have env already accessible for eas builds
# This doesn't work but maybe something similar will?
# temp remove from gitignore?
# cp "./.env.shared" "./.env"


dotenv -f ".env.shared" yarn eas build --local --platform ios --profile "$1"