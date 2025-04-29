#!/bin/bash

NODE_OPTIONS=--max_old_space_size=8192
BUNDLE_DIR="dist"

npx expo export:embed \
--dev false \
--platform ios \
--entry-file index.js \
--reset-cache \
--assets-dest $BUNDLE_DIR \
--bundle-output $BUNDLE_DIR/main.jsbundle \
--sourcemap-output $BUNDLE_DIR/main.jsbundle.map \
--minify false
