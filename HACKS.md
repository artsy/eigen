<!-- Template

## Title

#### When can we remove this:

Tell us when we can remove this hack.

#### Explanation/Context:

Explain why the hack was added.

-->

👀 See comment on top of file for template.

## EchoNew.json

#### When can we remove this:

Maybe sometime end of 2020, we can change the file EchoNew.json back to Echo.json.

#### Explanation/Context:

https://artsy.slack.com/archives/CDU4AH60Z/p1600737384008500?thread_ts=1600642583.000100&cid=CDU4AH60Z

There was a case where echo returns 401 when a user asks for the latest echo options. This might be caused by some key misconfiguration, or it might not. Right now we have figured out that the app was storing broken Echo.json when the status was 401, and this caused the app to crash. As the simplest way to get around that we decided to rename the file, so in the next app update we would force all users to grab a new echo json file (this time named EchoNew.json). We have also added code to make sure we don't store broken echo json files locally anymore.

After a few months we should be safe to return to the old name if we want. If we decide to do that, we should make sure to remove the old file that might have been sitting on users' phones.

## @segment+analytics-react-native-appboy patch

### When can we remove this:

When we upgrade to a version of `@segment/analytics-react-native` that includes an updated kotlin version compatible with the version of kotlin we need for React Native.

### Explanation/Context:

When updating to rn-0.69.10 we had to patch this due to kotlin version missmatch.

## react-native patch

### react-native prop-types patch

#### When can we remove this:

When we upgrade our deps to a version of react-native that includes removal of deprecated PropTypes.

#### Explanation/Context:

When updating to rn-0.69.10 we had to patch this due to deprecation of PropTypes. For this reason we also installed `deprecated-react-native-prop-types` to avoid errors and we patched the `react-native` package to use the deprecated PropTypes coming from the `deprecated-react-native-prop-types` package.

## deprecated-react-native-prop-types dependency

#### When can we remove this:

When we upgrade our deps to a version of react-native that includes removal of deprecated PropTypes.

#### Explanation/Context:

When updating to rn-0.69.10 we had to patch this due to deprecation of PropTypes. For this reason we also installed `deprecated-react-native-prop-types` to avoid errors and we patched the `react-native` package to use the deprecated PropTypes coming from the `deprecated-react-native-prop-types` package.

## react-native-credit-card-input

#### When can we remove this:

When we upgrade our deps to a version of react-native that includes removal of deprecated PropTypes.

#### Explanation/Context:

When updating to rn-0.69.10 we had to patch this due to deprecation of PropTypes. For this reason we also installed `deprecated-react-native-prop-types` to avoid errors and we patched the `react-native` package to use the deprecated PropTypes coming from the `deprecated-react-native-prop-types` package.

## react-native-image-crop-picker getRootVC patch

#### When can we remove this:

Remove when we stop swizzling UIWindow via ARWindow or react-native-image-crop-picker provides a more robust way of finding the viewController to present on.

#### Explanation/Context:

https://github.com/ivpusic/react-native-image-crop-picker/pull/1354

We do some swizzling in our AppDelegate that causes [[UIApplication sharedApplication] delegate] window] to return nil, this is used by image-crop-picker to find the currently presented viewController to present the picker onto. This patch looks for our custom window subclass (ARWindow) instead and uses that to find the presented viewController. Note we cannot reliably use the lastWindow rather than checking for our custom subclass because in some circumstances this is not our window but an apple window for example UIInputWindow used for managing the keyboard.

## react-native-mapbox-gl/maps - postinstall script

#### When can we remove this:

When react-native-mapbox adds the events framework as dependency, tried removed in 8.4.0 and was getting a crash on startup do to missing framework.

#### Explanation/Context:

We had issues with our archive becoming invalid and failing to export when we updated mapbox and cocoapods

- mapbox released a beta version that fixed the issue for our setup
- See issues here: https://github.com/CocoaPods/CocoaPods/issues/10385, https://github.com/react-native-mapbox-gl/maps/issues/1097

## react-native-mapbox-gl/maps - generic types patch

#### When can we remove this:

When react-native-mapbox/maps fixes the type issue here.

#### Explanation/Context:

Typescript complains about some invalid type definitions for generic values. Next time we update mapbox we should try removing the patch, run yarn type-check and if it succeeds you can get rid of the patch.

## react-native-mapbox-gl/maps - MGLGlyphsRasterizationMode

#### When can we remove this:

We should try removing it next time we update our mapbox dependencies (at time of writing 8.4.0). If you remove the plist value and open a map (City guide) and don't see a warning about falling back to a local rasterization you should be good to go.

#### Explanation/Context:

There is an issue here that explains the issue and suggests setting explicity in plist: https://github.com/mapbox/mapbox-gl-native-ios/issues/589

## exporting MockResolverContext (@types/relay-test-utils patch-package)

#### When can we remove this:

Not really needed to be removed, unless it causes problems.

#### Explanation/Context:

We use this type in out code for our tests and the `resolveMostRecentRelayOperation`, so we exported it.

## Delay modal display after LoadingModal is dismissed

#### When can we remove this:

Doesn't really need to be removed but can be if view hierarchy issue is fixed in RN or our LoadingModal see PR for more details: https://github.com/artsy/eigen/pull/4283

#### Explanation/Context:

We have a modal for showing a loading state and a onDismiss call that optionally displays an alert message, on iOS 14 we came across an issue where the alert was not displaying because when onDismiss was called the LoadingModal was still in the view heirarchy. The delay is a workaround.

## @react-navigation/core patch-package

#### When can we remove this:

react-navigation has a bug with nested independent `NavigationContainer` instances. https://github.com/react-navigation/react-navigation/issues/8611

#### Explanation/Context:

Our patch alleviates the issue in our case, but would not work as an upstream PR.

To remove this hack we can do one of two things:

- Stop using nested navigation containers.
- Fix `@react-navigation/core` properly upstream.

## relay-compiler

#### When can we remove this:

We can remove these hacks when they don't matter anymore. Neither are likely to be fixed by facebook.

#### Explanation/Context:

There are two hacks here:

- We hack the output of the compiler to provide clickable links for error messages. Relay assumes that you put your `__generated__` folder in the root of your project, but we put it in `src`.
- We make sure that files which do not change are not overwritten. This prevents excessive reloading by metro.

## react-native-credit-card-input

#### When can we remove this:

We can remove these hacks once we switch to Stripe's forthcoming official react-native library.

#### Explanation/Context:

These are fairly superficial styling hacks for

- focused/error border states
- shrinking the icon size to work nicely with our inputs
- aligning inner inputs nicely
- icon animation to work properly on android
- palette v3 colors

# android Input placeholder measuring hack

#### When can we remove this:

Once https://github.com/facebook/react-native/pull/29664 is merged or https://github.com/facebook/react-native/issues/29663 solved.

#### Explanation/Context:

As you can see in the PR and issue, android doesn't use ellipsis on the placeholder of a TextInput. That makes for a funky cut-off.

We added a workaround on Input, to accept an array of placeholders, from longest to shortest, so that android can measure which one fits in the TextInput as placeholder, and it uses that. When android can handle a long placeholder and use ellipsis or if we don't use long placeholders anymore, this can go.

# `react-native-screens` fragment crash on open from background on Android

#### When can we remove this:

Once https://github.com/software-mansion/react-native-screens/issues/17 is solved or we use another library for screen management.

#### Explanation/Context:

There is a known issue in react-native-screens that causes the app to crash on restoring from background. The react-native-screens team recommends the following workaround to be
added to the MainActivity class on Android https://github.com/software-mansion/react-native-screens/issues/17#issuecomment-424704067.

This has the UX downside of not allowing state restore from background but this is an unsolved problem for RN apps.

## typings/styled-components.native.d.ts

#### When can we remove this:

When we upgrade styled-components to a version with types that don't complain when we run `yarn type-check`.

#### Explanation/Context:

I wasn't the one to add this file, so I don't have all the context, but I do know that styled-component types are missing and/or causing problems when we don't have that file.

The latest change I did was add the `ThemeContext` in there, because the version of styled-components we use has that, but the types are not exposing that, so I had to manually add it there.

# `react-native-push-notification` Requiring unknown module on ios

#### When can we remove this:

Once we want to use react-native-push-notification on iOS

#### Explanation/Context:

This is happening because react-native-push-notification requires @react-native-community/push-notification-ios. We are not
adding this dependency at this time because it is unnecessary and we do not use react-native-push-notification on iOS. Also,
we do not want unnecessary conflicts between our native push notification implementation and @react-native-community/push-notification-ios's.

# `PropsStore` pass functions as props inside navigate() on iOS

#### When can we remove this:

Once we no longer use our native implementation of pushView on iOS

#### Explanation/Context:

We cannot pass functions as props because `navigate.ts` on ios uses the native obj-c definition of pushView in `ARScreenPresenterModule.m`.
React native is not able to convert js functions so this is passed as null to the underlying native method
See what can be converted: https://github.com/facebook/react-native/blob/main/React/Base/RCTConvert.h

PropsStore allows us to temporarily hold on the props and reinject them back into the destination view or module.

# `ORStackView` patch (add UIKit import)

#### When can we remove this:

Once we remove ORStackView or the upstream repo adds the import. May want to proactively open a PR for this.

#### Explanation/Context:

The Pod does not compile when imported as is without hack due to missing symbols from UIKit.

# `Map` manual prop update in `PageWrapper`

#### When can we remove this:

We should see if it is still necessary when we remove the old native navigation on iOS. To check: go into City Guide, leave, enter again and then try to change the city. If it works without this code it can be removed.
If it is still an issue with old native navigation gone this can either be removed when we remove or rebuild City Guide or if we change how props are saved in PageWrapper.

#### Explanation/Context:

City Guide is a mixture of native components and react components, prop updates from the native side are not updating the component on the react native side without this manual check and update. See the PR here for the change in the AppRegistry:
https://github.com/artsy/eigen/pull/6348

# `React-Native-Image-Crop-Picker` App restarting when photo is taken. Fix is in `ArtsyNativeModule.clearCache`.

#### When can we remove this:

When we fix the actual issue. https://artsyproduct.atlassian.net/browse/MOPLAT-196

#### Explanation/Context:

The app restarts when the user takes a picture to pass to `react-native-image-crop-picker` (https://github.com/ivpusic/react-native-image-crop-picker/issues/1704). We do not know exactly why this is happening. And it seems to happen on random devices, but mostly on android-10 and android-11s. This hack silently clears the cache on android before taking the photo.

## ParentAwareScrollView

#### When can we remove this:

To remove this, we need to change our InfiniteScrollArtworksGrid to use a FlatList or any VirtualizedList. We haven't done that yet, because we need the masonry layout.
We either need to find a library that gives us masonry layout using a VirtualizedList, or we need to make our own version of this.

#### Explanation/Context:

Currently our masonry layout (in InfiniteScrollArtworksGrid `render()`) is using a ScrollView, which is not a VirtualizedList.
Also, currently, the parent that is the FlatList, comes from StickyTabPageFlatList.

## Podfile postinstall code_signing_required = NO

#### When can we remove this:

Maybe we don't? We can try to remove it at any point, and see if it works. Try with newer cocoapods versions.

#### Explanation/Context:

This is needed because xcode 14 says that React-Core-AccessibilityResources and some other pods require a development team.
We don't really need a dev team for these. Probably some future version of cocoapods will fix this.

## @jest/fake-timers

#### When can we remove this:

Once we can figure out how to mock `global.setImmediate` with `global.setTimeout`, preferrably in jest setup file

#### Explanation/Context:

After upgrading to Jest 29, our use of jest.useFakeTimers() became somewhat funky. In most cases passing `legacyFakeTimers: true` to the function fixes it, but in other cases it breaks @jest/fake-timers at this line. Not sure why. To elaborate more, when jest runs tests it errors out saying that `setImmediate` isn't a function (this was removed from Jest 28); however, when trying to mock it with `global.setImmediate = global.setTimeout` it doesn't work. So ran a patch and replaced it manually in the code, which appears harmless since `setImmediate` is the same as `setTimeout(..., 0)`.

## Providers.tsx LegacyTheme

#### When can we remove this:

Once we have removed the `palette` directory from eigen.

#### Explanation/Context:

Look at the tech plan here: https://www.notion.so/artsy/palette-mobile-in-eigen-c5e3396302734f0a921aed3978f5dbeb

## Patch-package for sift-react-native

#### When can we remove this:

Just adds a type, so likely doesn't need to be removed. But if they officially add it
([see this issue](https://github.com/SiftScience/sift-react-native/issues/6)), we could drop this
patch.

#### Explanation/Context:

This package includes a `setPageName` method on `SiftReactNative`, but no corresponding type.
I patched it to add the type.

## Patch-package for react-native-reanimated

#### When can we remove this:

When we upgrade to Reanimated 3.4.0

#### Explanation/Context:

Fixes some issues on Android when Reanimated stops. https://github.com/software-mansion/react-native-reanimated/issues/4626

## Patch-package for @react-navigation/native

#### When we can remove this:

When we upgrade to 6.0.14 or higher, should do shortly but requires fixing a fair few type issues.

### Explanation/Context

React native removed removeEventListener which this library uses and causes jest tests to fail with type errors. This commit fixes the issue:
https://github.com/react-navigation/react-navigation/commit/6e9da7304127a7c33cda2da2fa9ea1740ef56604

## Patch-package for react-native-device-info

#### When we can remove this:

When this discussion is settled and we update to a compliant release with either a privacy manifest or this code removed:
https://github.com/react-native-device-info/react-native-device-info/issues/1622

#### Explanation/Context

Apples has started requiring apps and 3rd party libraries declare in a privacy manifest why they use some apis, and only certain reasons are allowed.
Device info uses disk space apis that are not justified by these reasons currently.
https://developer.apple.com/documentation/bundleresources/privacy_manifest_files/describing_use_of_required_reason_api?language=objc

## Git link in podfile for SwiftyJSON

#### When we can remove this:

When this issue is resolved and version 5.0.2 or above is published on Cocoapods.
https://github.com/SwiftyJSON/SwiftyJSON/issues/1154

#### Explanation/Context

Apples has started requiring apps and certain 3rd party libraries declare in a privacy manifest why they use some apis, SwiftyJSON is one of them. The
privacy manifest has been added in 5.0.2 but the version has not been published to cocoapods.

## Patch-package for react-native-fast-image

#### When we can remove this:

When the library uses the latest SDWebImage that includes privacy manifests, a version >= 5.19
https://github.com/DylanVann/react-native-fast-image/issues/1031

####

Apples has started requiring apps and certain 3rd party libraries declare in a privacy manifest why they use some apis. SDWebImage is one of those,
SDWebImage has been updated to include a privacy manifest but the wrapper we use, react-native-fast-image, has not.
https://developer.apple.com/documentation/bundleresources/privacy_manifest_files/describing_use_of_required_reason_api?language=objc

## Modular headers for firebase deps in Podfile

#### When we can remove this

When we stop using flipper or this issue is resolved: https://github.com/invertase/react-native-firebase/issues/6425

#### Explanation/Context

The latest versions of react-native-firebase require using static frameworks, and unfortunately this breaks flipper.
https://rnfirebase.io/#altering-cocoapods-to-use-frameworks
The author of react-native-firebase basically said that people should just remove flipper since it is no longer going to be supported by
react native in the future but a bit tough to pull off that bandaid so soon. If flipper does end up supporting this config: 1. remove the entries in the podfile
that have `:modular_headers => true` and add the static frameworks line from the docs above.
