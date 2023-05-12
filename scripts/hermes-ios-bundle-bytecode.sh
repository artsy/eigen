#!/bin/bash

BUNDLE_DIR="dist"

ios/Pods/hermes-engine/destroot/bin/hermesc \
-O -emit-binary \
-output-source-map \
-out="$BUNDLE_DIR/main.jsbundle.hbc" "$BUNDLE_DIR/main.jsbundle" \
&& rm -f $BUNDLE_DIR/main.jsbundle \
&& mv $BUNDLE_DIR/main.jsbundle.hbc $BUNDLE_DIR/main.jsbundle
