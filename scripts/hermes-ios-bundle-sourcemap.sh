#!/bin/bash

BUNDLE_DIR="dist"

mv $BUNDLE_DIR/main.jsbundle.map $BUNDLE_DIR/main.jsbundle.packager.map

node node_modules/react-native/scripts/compose-source-maps.js \
$BUNDLE_DIR/main.jsbundle.packager.map \
$BUNDLE_DIR/main.jsbundle.hbc.map -o \
$BUNDLE_DIR/main.jsbundle.map
