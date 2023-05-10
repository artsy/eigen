#!/bin/bash

NODE_OPTIONS=--max_old_space_size=8192

react-native bundle \
--dev false \
--platform android \
--entry-file index.android.js \
--reset-cache \
--assets-dest android/app/src/main/res \
--bundle-output android/app/src/main/assets/index.android.bundle \
--sourcemap-output android/app/src/main/assets/index.android.bundle.packager.map