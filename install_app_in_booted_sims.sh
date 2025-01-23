#!/bin/bash

# Path to your .app file
APP_PATH="./Artsy.app"

# Get a list of all booted simulator UUIDs
BOOTED_SIMULATORS=$(xcrun simctl list devices booted | grep -oE "[A-F0-9-]{36}")

# Install the .app file on each booted simulator
for SIMULATOR in $BOOTED_SIMULATORS; do
  echo "Installing $APP_PATH on simulator $SIMULATOR..."
  xcrun simctl install $SIMULATOR "$APP_PATH"
done

echo "Installation completed on all booted simulators!"