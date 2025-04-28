#!/bin/bash

NODE_OPTIONS=--max_old_space_size=8192
BUNDLE_DIR="android/app/src/main/assets"

mv $BUNDLE_DIR/index.android.bundle.map $BUNDLE_DIR/index.android.bundle.packager.map

node ./node_modules/react-native/scripts/compose-source-maps.js \
$BUNDLE_DIR/index.android.bundle.packager.map \
$BUNDLE_DIR/index.android.bundle.hbc.map -o \
$BUNDLE_DIR/index.android.bundle.map
