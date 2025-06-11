#!/bin/bash

# convenience script to bundle the beta app and run it on an Android device locally

yarn expo export:embed \
	--platform android \
	--bundle-output android/app/src/main/assets/index.android.bundle \
	--assets-dest android/app/src/main/res

cd android; ./gradlew assembleBeta
adb install -r app/build/outputs/apk/beta/app-beta.apk