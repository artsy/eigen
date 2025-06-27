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

> The release APK will be available at: `android/app/build/outputs/apk/release/app-release.apk`

1. Setup the local environament for generating a release build, including downloading the required keystores:
   ```bash
   yarn setup:releases
   ```
2. Set environment variables with passwords from 1Password: Go to 1Password > Engineering > `Eigen release keystore password and secret json (google play store)`
   ```bash
   export ANDROID_KEYSTORE_PASSWORD=<new keystore password (jan 9 2023)>
   export ANDROID_KEY_PASSWORD=<new key password (jan 9 2023)>
   ```

### Generate standalone APK

```bash
./android/gradlew assembleRelease
```

### Generate and install APK on emulator

1. Start the Metro bundler:

   ```bash
   yarn start
   ```

2. Uninstall existing app from emulator (required due to different signing): Go to emulator settings and uninstall the app manually

3. Build and install release app:
   ```bash
   ./android/gradlew installRelease
   ```

### Extract apk from downloaded fast lane builds

1. Run:

   ```bash
   ./scripts/deploys/create-android-apk
   ```

2. Choose the release bundle you want to use.
