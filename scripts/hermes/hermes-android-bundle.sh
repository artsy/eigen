#!/bin/bash

NODE_OPTIONS=--max_old_space_size=8192
BUNDLE_DIR="android/app/src/main/assets"

react-native bundle \
--dev false \
--platform android \
--entry-file index.js \
--reset-cache \
--assets-dest android/app/src/main/res \
--bundle-output $BUNDLE_DIR/index.android.bundle \
--sourcemap-output $BUNDLE_DIR/index.android.bundle.packager.map \
--minify false
