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

Run the application from Xcode using the Artsy (QA) scheme.
(This sets necessary config in Expo.plist for example the disableAntibrickingMeasures needs to be set in order to allow channel switching).

<img src="./screenshots/expo-scheme.png"/>

Deploy an update using these [instructions](./deploy_to_expo_updates.md) and pull down using the dev menu.

### Known gotchas

#### Code changes not auto refreshing app

The QA scheme uses bundled JS. To see any changes you will need to rebuild from Xcode; even then, Expo updates tend to use the latest downloaded update and you may have to delete the app and then rebuild.

#### Update is not applied after fetch

Expo updates has a bunch of native code checks to see if the local code is newer than the update it is trying to apply. These can be manually disabled by commenting out, or you can make sure you don't change any code after shipping an update, but this makes the feedback loop painful. Ask #product-sapphire for help if you have trouble.
