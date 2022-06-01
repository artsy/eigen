# Generating a release build for local testing

## Why?

Sometimes we need to test a release build on the emulator or our local device, without generating a new beta build. One example is when we want to test for optimizations, eg. when we turn on hermes.

## iOS

- Start the packager with `yarn start`.
- In another terminal, run `yarn bundle:ios` to generate the jsbundle.
- Run `yarn pod-install`, so that the jsbundle is added to your build.
- Open the eigen project in Xcode.
- Select the `Artsy (Release build)` scheme from the top bar.
- Press play, and wait for the app to start on the simulator.

## Android

- Download the `release.keystore` from 1Password (named `Eigen release keystore password and secret json (google play store) - release.keystore`), and put it at `eigen/android/app/release.keystore`.
- Start the packager with `yarn start`.
- You will need the `ANDROID_KEYSTORE_PASSWORD` from 1Password, so have it handy. It will be in the item named `Eigen release keystore password and secret json (google play store)`.
- First place you will need it is right now. In your terminal, run `export ANDROID_KEYSTORE_PASSWORD=<the password>`, replacing `<the password>` with the password from 1Password. The final command will look something like `export ANDROID_KEYSTORE_PASSWORD=some-password-wow-123`, no math signs `<>`.
- In the same terminal, build the release app using `cd android; ./gradlew bundleRelease`.
- Verify that the built app is in `eigen/android/app/build/outputs/bundle/release/app-release.aab`.
- You need a tool called bundletool, that you can get by running `brew install bundletool`.
- After installing the tool, run `bundletool build-apks --bundle=./app/build/outputs/bundle/release/app-release.aab --output=./release-build.apks --mode=universal --ks=./app/release.keystore --ks-key-alias=release`. This will ask for the keystore password. It's the one from a few steps above. Paste it in here when it is asked.
- Once that is finished, you will have a `eigen/android/release-build.apks` file. Rename this to `release-build.zip`.
- Unzip that file.
- In the unzipped folder, you will find a `release-build.apk` file.
- Install the app by dragging it on the emulator.
