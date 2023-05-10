#!/bin/bash

NODE_OPTIONS=--max_old_space_size=8192

platform=$(node -e "const platform=require('os').platform();console.log(platform === 'darwin' ? 'osx-bin' : (platform === 'linux' ? 'linux64-bin' : (platform === 'win32' ? 'win64-bin' : 'unsupported-os')));")

./node_modules/react-native/sdks/hermesc/$platform/hermesc \
-O -emit-binary \
-output-source-map \
-out=android/app/src/main/assets/index.android.bundle.hbc android/app/src/main/assets/index.android.bundle \
&& rm -f android/app/src/main/assets/index.android.bundle \
&& mv android/app/src/main/assets/index.android.bundle.hbc android/app/src/main/assets/index.android.bundle
