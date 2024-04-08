#!/bin/bash
set -euxo pipefail

# Creates the iOS required build file inside eigen/ios/build/Build/Products/Store-iphonesimulator/Artsy.app
# Opens the Finder window inside the folder where build file is located.

# CI=1 in order to avoid including flipper in the build
CI=1 yarn pod-install

# Generate the iOS build file
yarn maestro:ios:release:build

# Open the folder where the build file is located
open ios/build/Build/Products/Store-iphonesimulator

# Please discard the diff that will be generated afterwards (Podfile.lock)