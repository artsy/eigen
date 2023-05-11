#!/bin/bash

NODE_OPTIONS=--max_old_space_size=8192

node ./node_modules/react-native/scripts/compose-source-maps.js \
android/app/src/main/assets/index.android.bundle.packager.map \
android/app/src/main/assets/index.android.bundle.hbc.map -o \
android/app/src/main/assets/index.android.bundle.map
