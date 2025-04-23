# Debugging Expo Updates

This is a condensed version of the expo docs [here](https://docs.expo.dev/eas-update/debug/#ios-local-builds). Check the official docs if anything does not work.

### Local debug iOS build with expo updates

Set the debug flag in terminal and reinstall pods:

```
export EX_UPDATES_NATIVE_DEBUG=1
npx pod-install
```

Set flag in project to create a js bundle on every build:

```
sed -i '' 's/SKIP_BUNDLING/FORCE_BUNDLING/g;' ios/Artsy.xcodeproj/project.pbxproj
```

Add disableAntibrickingMeasures flag to Expo.plist:

```
	<key>EXUpdatesDisableAntiBrickingMeasures</key>
	<true/>
```

Rebuild the app:

```
bundle exec npx expo run:ios
```
