#!/bin/bash

NODE_OPTIONS=--max_old_space_size=8192
BUNDLE_DIR="dist"

react-native bundle \
--dev false \
--platform ios \
--entry-file index.ios.js \
--reset-cache \
--assets-dest $BUNDLE_DIR \
--bundle-output $BUNDLE_DIR/main.jsbundle \
--sourcemap-output $BUNDLE_DIR/main.jsbundle.map \
--minify false
