#!/bin/bash

NODE_OPTIONS=--max_old_space_size=8192

platform=$(node -e "const platform=require('os').platform();console.log(platform === 'darwin' ? 'osx-bin' : (platform === 'linux' ? 'linux64-bin' : (platform === 'win32' ? 'win64-bin' : 'unsupported-os')));")
BUNDLE_DIR="android/app/src/main/assets"

./node_modules/react-native/sdks/hermesc/$platform/hermesc \
-O -emit-binary \
-output-source-map \
-out="$BUNDLE_DIR/index.android.bundle.hbc" "$BUNDLE_DIR/index.android.bundle" \
&& rm -f "$BUNDLE_DIR/index.android.bundle" \
&& mv "$BUNDLE_DIR/index.android.bundle.hbc" "$BUNDLE_DIR/index.android.bundle"
