#!/bin/bash

platform=$(node -e "const platform=require('os').platform();console.log(platform === 'darwin' ? 'osx-bin' : (platform === 'linux' ? 'linux64-bin' : (platform === 'win32' ? 'win64-bin' : 'unsupported-os')));")
BUNDLE_DIR="dist"

./node_modules/react-native/sdks/hermesc/$platform/hermesc \
-O -emit-binary \
-output-source-map \
-out="$BUNDLE_DIR/main.jsbundle.hbc" "$BUNDLE_DIR/main.jsbundle" \
&& rm -f $BUNDLE_DIR/main.jsbundle \
&& mv $BUNDLE_DIR/main.jsbundle.hbc $BUNDLE_DIR/main.jsbundle
