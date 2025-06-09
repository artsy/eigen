#!/bin/bash

yarn expo export:embed \
	--platform android \
	--bundle-output android/app/src/main/assets/index.android.bundle \
	--assets-dest android/app/src/main/res

cd android; ./gradlew assembleBeta
adb install -r app/build/outputs/apk/beta/app-beta.apk