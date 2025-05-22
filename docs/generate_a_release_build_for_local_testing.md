# Generate a release build for local testing

## Why?

Sometimes we need to test a release build on the emulator or our local device, without generating a new beta build. One example is when we want to test for optimizations, eg. when we turn on hermes.

## iOS

- Run `yarn pod-install`, so that the jsbundle is added to your build.
- Open the project in Xcode using `open ios/Artsy.xcworkspace`.
- Select the `Artsy (Store)` scheme from the top bar.
- Tapping on the top item `Artsy` on the navigator left sidebar, then you will see the targets exactly to the right of that sidebar. Go to all targets and enable the `Automatically manage signing` checkbox, and select the `Art.sy Inc.` team. Go through all except `ArtsyTests`, click them, and on the right you go to `Signing & Capabilities` tab, and you will see the checkbox.
  - https://github.com/user-attachments/assets/6c52bb05-eb70-469f-ae70-ef6f60411c9b
- Do **not** commit these changes. Just reset them when you're done.
- Press play, and wait for the app to start on your simulator or your device.

## Android

- Download the `release.keystore` from 1Password (named `Eigen release keystore password and secret json (google play store) - release.keystore`), and put it at `eigen/android/app/release.keystore`.
- Start the packager with `yarn start`.
- You will need the `ANDROID_KEYSTORE_PASSWORD` from 1Password, so have it handy. It will be in the item named `Eigen release keystore password and secret json (google play store)`.
- First place you will need it is right now. In your terminal, run `export ANDROID_KEYSTORE_PASSWORD=<the password>`, replacing `<the password>` with the password from 1Password. The final command will look something like `export ANDROID_KEYSTORE_PASSWORD=some-password-wow-123`, no math signs `<>`.
- Uninstall the app from the emulator if it's already installed. This is needed because it's differently signed for debug and for release, and the emulator can't replace them automatically.
- In the same terminal, build the release app using `cd android; ./gradlew installRelease`.
- Verify that the built app is in `eigen/android/app/build/outputs/apk/release/app-release.apk`.
- The app should already be installed on the emulator now. If not, install it by dragging it on the emulator.
