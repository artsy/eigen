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

## android Input placeholder measuring hack

#### When can we remove this:

Once https://github.com/facebook/react-native/pull/29664 is merged or https://github.com/facebook/react-native/issues/29663 solved.

#### Explanation/Context:

As you can see in the PR and issue, android doesn't use ellipsis on the placeholder of a TextInput. That makes for a funky cut-off.

We added a workaround on Input, to accept an array of placeholders, from longest to shortest, so that android can measure which one fits in the TextInput as placeholder, and it uses that. When android can handle a long placeholder and use ellipsis or if we don't use long placeholders anymore, this can go.

## `React-Native-Image-Crop-Picker` App restarting when photo is taken. Fix is in `ArtsyNativeModule.clearCache`.

#### When can we remove this:

When we fix the actual issue. https://artsyproduct.atlassian.net/browse/MOPLAT-196

#### Explanation/Context:

The app restarts when the user takes a picture to pass to `react-native-image-crop-picker` (https://github.com/ivpusic/react-native-image-crop-picker/issues/1704). We do not know exactly why this is happening. And it seems to happen on random devices, but mostly on android-10 and android-11s. This hack silently clears the cache on android before taking the photo.

## ParentAwareScrollView

#### When can we remove this:

When all `InfiniteScrollArtworksGrid` callers have been migrated to `MasonryFlashList` (from `@shopify/flash-list`), at which point `ParentAwareScrollView` and `InfiniteScrollArtworksGrid`'s ScrollView path become unused and can be deleted.

#### Explanation/Context:

`InfiniteScrollArtworksGrid` renders its masonry layout inside a `ScrollView` (not a `VirtualizedList`), and on Android wraps it in `ParentAwareScrollView` to detect when it's nested inside an outer scroll view of the same orientation and forward scroll events accordingly.

`MasonryFlashList` now provides a virtualized masonry layout, and several scenes have migrated to it, but `InfiniteScrollArtworksGrid` is still used in ~40 places.

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

## Patch for sift-react-native

#### When can we remove this:

Just adds a type, so likely doesn't need to be removed. But if they officially add it
([see this issue](https://github.com/SiftScience/sift-react-native/issues/6)), we could drop this
patch.

#### Explanation/Context:

This package includes a `setPageName` method on `SiftReactNative`, but no corresponding type.
I patched it to add the type.

## Artsy fork of Interstellar in Podfile

#### When can we remove this:

Either when:

- The upstream `JensRavens/Interstellar` publishes a new CocoaPods release that includes `unsubscribe()` on `ObserverToken` (added in master after 2.2.0, the last published version), **or**
- We rewrite Live Auctions in React Native, at which point we can drop Interstellar entirely — it is only used by the native Live Auctions view controllers.

#### Explanation/Context

The Artsy fork (`artsy/Interstellar`, branch `observable-unsubscribe`) exists solely to add `unsubscribe()` to `ObserverToken`, which is called throughout the native Live Auctions view controllers (`LiveAuctionViewController`, `LiveAuctionLotListViewController`, etc.). The upstream repo added this same feature to master after the 2.2.0 CocoaPods release, but has never cut a new release. The Artsy fork's branch is 18 commits behind upstream master and only 3 ahead — all three of those commits exist in some form upstream — so if needed, we could switch to `JensRavens/Interstellar` master directly (same pattern, true upstream).

## Modular headers for firebase deps in Podfile

#### When we can remove this

When we switch to `use_frameworks! :linkage => :static` globally (the recommended setup for Expo + Firebase). This requires removing the per-pod `:modular_headers => true` entries and adding `$RNFirebaseAsStaticFramework = true`. See https://rnfirebase.io/#altering-cocoapods-to-use-frameworks

#### Explanation/Context

Flipper is gone, but we still can't use `use_frameworks! :linkage => :static` globally — which is what rnfirebase actually recommends. PR #11550 implemented this correctly, but it was reverted in PR #11898 because enabling static linkage for all pods significantly blew up iOS build times. The `:modular_headers => true` entries are the workaround that lets Firebase compile correctly without global static linkage.

As the iOS pod count decreases, the build time penalty becomes more acceptable and this should be revisited. Alternatively, this could be managed via the `expo-build-properties` plugin (`useFrameworks: "static"` in app.json) rather than a manual Podfile entry. Removing this hack would also allow removing the Braze prebuilt-static podspec hack.

## Custom lane google_play_track_rollout_percentages in fastlane dir + associated monkey patches in Fastfile

#### When we can remove this:

When this pr is accepted upstream or another way to fetch this data is supported by fastlane:
https://github.com/fastlane/fastlane/pull/22029

####

This info is needed to automate our android rollout but not currently supported by fastlane.

## Custom supply command and associated patches in fastlane dir and Fastfile

#### When we can remove this:

When this pr is accepted upstream or another way to promote historical builds is supported by fastlane:
https://github.com/fastlane/fastlane/pull/22025

####

We want to be able to promote past android builds to prod because we are creating betas often and a release candidate may not be
the latest. The developer APIs for google play only return the latest release and fastlane verifies that a release exists before allowing
promotion. We added custom logic to work around this.

## Patch for react-native-keys

#### When can we remove this:

When react-native-keys merges this PR
https://github.com/numandev1/react-native-keys/pull/117

#### Explanation/Context:

Because RN >= 0.80 has moved react-native from `react-native/android` to `react-native/ReactAndroid`, we need to be looking at the new folder instead of the previous one

## Patch for @react-navigation/bottom-tabs

This patch allows us to animate the appearance of the bottom tabs. This is currently not supported by @react-navigation/bottom-tabs but it's something they do when the user shows/hides the keyboard.

See https://github.com/artsy/eigen/pull/12249 for more details.

## patch for react-native RCTEventEmitter

#### Explanation/Context:

We use a singleton pattern for our ARNotificationsManagerModule, which is also an RCTEventEmitter for things like push notification handling, there is a bug in react native where stopObserving is called when bridge is invalidated but listenerCount is
not reset. This causes the module to never start listening again causing events not to be sent over the bridge.

#### When can we remove this:

It can be removed once if we stop using the singleton pattern or get rid of ARNotificationsManagerModule, or it is fixed upstream.

## react-native-reanimated package.json flags and react-native patch

#### Explanation/Context:

`package.json` sets the following reanimated `staticFeatureFlags` to fix scroll performance. See https://docs.swmansion.com/react-native-reanimated/docs/guides/performance/#%EF%B8%8F-lower-fps-while-scrolling

- `USE_COMMIT_HOOK_ONLY_FOR_REACT_COMMITS`
- `DISABLE_COMMIT_PAUSING_MECHANISM`
- `ANDROID_SYNCHRONOUSLY_UPDATE_UI_PROPS`
- `IOS_SYNCHRONOUSLY_UPDATE_UI_PROPS`

We also patch `react-native` (`ReactNativeFeatureFlagsDefaults.h`) to flip `preventShadowTreeCommitExhaustion()` to return `true`, which is required for these flags to behave correctly.

#### When can we remove this:

When reanimated adopts these by default.

## react-native-webview passing constant for decelerationRate prop

#### Explanation/Context:

This is a bug on the new architecture on Android with this prop and react-native-webview.

#### When can we remove this:

When this is merged and we update react-native-webview to a version that contains it:
https://github.com/react-native-webview/react-native-webview/pull/3885

## patch for expo-build-disk-cache

#### Explanation/Context:

The original code had a logging issue where it would log a "cache miss" message immediately after checking the local disk cache, even before checking the remote cache plugin (S3 in our case). This resulted in false-negative messages showing cache misses when the cache was actually available remotely.

The patch:

- Moves the `logger.log(texts.read.miss)` call to after the remote plugin check
- Fixes the control flow so that the cache miss is only logged if both disk AND remote caches fail
- Improves the conditional logic around remote plugin downloading to properly return the cache path on success

This ensures accurate logging when using remote cache plugins like our S3 build cache implementation.

#### When we can remove this:

When the upstream expo-build-disk-cache repository fixes the logging behavior and releases a new version that properly checks remote cache before logging cache misses.

## patch for react-native

#### Explanation/Context:

Probably related with this sentry issue https://artsynet.sentry.io/issues/7043718518/events/0e89b1ce77cd4dfe95c45feefea1ed22/ EXC_BAD_ACCESS crash on iOS. This patch is attempting to fix the crash and was found in this reanimated issue (but is a react-native patch): https://github.com/software-mansion/react-native-reanimated/issues/7666#issuecomment-3053014969

#### When can we remove this:

When they address this issue on react native main repo

## Patch for react-native-ios-context-menu

#### When can we remove this:

When https://github.com/dominicstop/react-native-ios-context-menu/pull/140 is merged and we upgrade to a version that includes it.

#### Explanation/Context:

Fatal crash (EIGEN-AZB4) on New Architecture where iOS requests a `UITargetedPreview` during context menu dismissal but Fabric has already detached the underlying view from the window. The fix guards `menuTargetedPreview` to return `nil` when `window` is `nil`, letting iOS fall back to a fade-out dismissal instead of crashing.

See: https://github.com/dominicstop/react-native-ios-context-menu/issues/103

## patch for expo-updates

#### Explanation/Context:

Started seeing blank screens on android when app was crashing instead of regularly crashing the app after we enabled new architecture. This patch attempts to fix that.

#### When can we remove this:

When the upstream expo-updates repository fixes the issue and releases a new version that properly handles crashes on Android with the new architecture. https://github.com/expo/expo/issues/41543

## Braze prebuilt-static podspecs in Podfile

#### When can we remove this:

When Braze publishes a static variant to the main CocoaPods spec, or when Expo's module system no longer requires static linkage for Braze pods. Track: https://github.com/braze-inc/braze-swift-sdk

#### Explanation/Context:

During the Expo integration (PR #11938), Braze's standard dynamic frameworks conflicted with Expo's app delegate module import system. Using the `braze-swift-sdk-prebuilt-static` repo forces static linkage for BrazeKit, BrazeUI, and BrazeLocation without enabling `use_frameworks! :linkage => :static` globally (which breaks other pods). The version must be updated manually when upgrading Braze.

## Patch for @gorhom/bottom-sheet (scrollTo infinite loop on Fabric)

#### When can we remove this:

When @gorhom/bottom-sheet ships a fix for the infinite `scrollTo` loop on Fabric (New Architecture). Track these upstream issues:
https://github.com/gorhom/react-native-bottom-sheet/issues/2546
https://github.com/gorhom/react-native-bottom-sheet/issues/2547

#### Explanation/Context:

On Fabric, reanimated's `scrollTo` uses `dispatchCommand` which forces a native commit cycle that re-triggers `onScroll` even when the scroll offset hasn't changed. In `useScrollEventsHandlersDefault`, when the scrollable state is `LOCKED`, `handleOnScroll` calls `scrollTo` to enforce the lock position, which fires another `onScroll`, which calls `scrollTo` again — creating an infinite recursion that crashes with "Maximum call stack size exceeded (native stack depth)".

The patch adds a guard (`if (y === lockPosition) return`) in `handleOnScroll`, `handleOnEndDrag`, and `handleOnMomentumEnd` to skip the `scrollTo` call when the scroll position is already at the lock position. It also fixes a bug in `handleOnMomentumEnd` where `scrollableContentOffsetY.value` was incorrectly set to `0` instead of `lockPosition`.

Sentry issue: https://artsynet.sentry.io/issues/7304441200/

## patch for @d11/react-native-fast-image

#### Explanation/Context:

Another dependency in the Expo/react-native ecosystem has brought in com.caverock:androidsvg-aar:1.4, the aar version of the library, which causes duplicate symbols errors when linking.

#### When can we remove this:

When the upstream @d11/react-native-fast-image closes and releases this PR https://github.com/dream-horizon-org/react-native-fast-image/pull/354/changes
