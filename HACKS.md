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

The Android build-path hunk can go when react-native-keys merges https://github.com/numandev1/react-native-keys/pull/117

The bridgeless/JSI hunks can go when react-native-keys supports the New Architecture without a bridge. There is no upstream PR for this yet — we should open one.

#### Explanation/Context:

Two unrelated problems in one patch:

**1. Android build path.** Because RN >= 0.80 has moved react-native from `react-native/android` to `react-native/ReactAndroid`, we need to be looking at the new folder instead of the previous one.

**2. Bridgeless (New Architecture) JSI installation.** The library installed its `secureFor` / `publicKeys` JSI host functions by reaching for `[RCTBridge currentBridge]` and casting to `RCTCxxBridge` to get the runtime. In bridgeless mode there is no bridge, so `install()` returned `false` and the globals were never defined — which breaks every consumer of `Keys` (all our env/secret access at startup).

The patch reworks this without touching the public API:

- `ios/Keys.mm` — extracts the binding setup into a shared `installKeysBindings(jsi::Runtime&)` helper, and under `RCT_NEW_ARCH_ENABLED` adopts `RCTTurboModuleWithJSIBindings` so RN calls `installJSIBindingsWithRuntime:callInvoker:` and hands us the runtime directly (no bridge or CallInvoker hacks). The JS-callable `install()` then just returns `true` when there is no bridge, and still falls back to the legacy `RCTCxxBridge` path on the old architecture.
- `android/.../KeysModule.java` — `getJavaScriptContextHolder()` is still exposed on `BridgelessReactContext` (via `@UnstableReactNativeAPI`) and returns the active `ReactInstance`'s runtime pointer, so the JSI install works; we just guard against a null/zero holder instead of crashing.

⚠️ `yarn patch <pkg>` extracts the **unpatched** source. Re-apply the existing patch before adding hunks or you will silently drop them, and run `yarn install` after `yarn patch-commit` (it does not refresh `node_modules`).

## Patch for @react-navigation/bottom-tabs

This patch allows us to animate the appearance of the bottom tabs. This is currently not supported by @react-navigation/bottom-tabs but it's something they do when the user shows/hides the keyboard.

See https://github.com/artsy/eigen/pull/12249 for more details.

## react-native-reanimated package.json flags and react-native patch

#### Explanation/Context:

`package.json` sets the following reanimated `staticFeatureFlags` to fix scroll performance. See https://docs.swmansion.com/react-native-reanimated/docs/guides/performance/#%EF%B8%8F-lower-fps-while-scrolling

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

The patch adds a guard (`if (Math.abs(y - lockPosition) < 1) return`) in `handleOnScroll`, `handleOnEndDrag`, and `handleOnMomentumEnd` to skip the `scrollTo` call when the scroll position is already at the lock position. The epsilon comparison (rather than `===`) matters because the offset that comes back from the native scroll event is a float and is not always exactly equal to the position we asked for. It also fixes a bug in `handleOnMomentumEnd` where `scrollableContentOffsetY.value` was incorrectly set to `0` instead of `lockPosition`.

Only `src/` is patched, not `lib/` — the package's `react-native` entry point is `src/index.ts`, so that is what Metro consumes.

Sentry issue: https://artsynet.sentry.io/issues/7304441200/

⚠️ **This patch has been lost once already.** It was dropped while bumping `@gorhom/bottom-sheet` 5.2.8 → 5.2.14 and re-ported afterwards. Neither half of it is upstream as of 5.2.14 (`handleOnMomentumEnd` there still sets `scrollableContentOffsetY.value = 0`), so **re-apply it on every version bump** and verify with:

```sh
grep -c "Math.abs(y - lockPosition)" node_modules/@gorhom/bottom-sheet/src/hooks/useScrollEventsHandlersDefault.ts  # expect 3
```

Note that `expo install --fix` silently strips `patch:` protocol descriptors from `package.json`, which is one way this goes missing.

## patch for @d11/react-native-fast-image

#### Explanation/Context:

Another dependency in the Expo/react-native ecosystem has brought in com.caverock:androidsvg-aar:1.4, the aar version of the library, which causes duplicate symbols errors when linking.

#### When can we remove this:

When the upstream @d11/react-native-fast-image closes and releases this PR https://github.com/dream-horizon-org/react-native-fast-image/pull/354/changes

## patch for expo-updates

#### Explanation/Context:

Two unrelated hunks:

**1. `android/.../errorrecovery/ErrorRecovery.kt` — blank screens instead of crashes.** Started seeing blank screens on android when app was crashing instead of regularly crashing the app after we enabled new architecture. In bridgeless mode `onReactInstanceException` silently swallowed the exception once expo-updates had unregistered its own handler (i.e. more than ~10s after launch). The patch keeps a fallback handler around that forwards to the thread's default uncaught-exception handler, so the app crashes properly — and gets reported — instead of showing a blank screen.

**2. `ios/EXUpdates.podspec` — `use_dev_client` wrongly enabled.** Upstream detects expo-dev-client with:

```rb
use_dev_client = File.dirname(`node --print "require.resolve('expo-dev-client/package.json', ...)"`).length > 0
```

We do not install `expo-dev-client`, so the backtick returns `""`, `File.dirname("")` is `"."`, and `".".length > 0` is **true** — so Debug builds wrongly got `-DUSE_DEV_CLIENT=1`. It also leaked a node `MODULE_NOT_FOUND` stack trace to stderr on every `pod install`. The patch checks `$?.success?` and a non-empty result instead, and silences the stderr.

#### When can we remove this:

**Hunk 1:** when the upstream expo-updates repository fixes the issue and releases a new version that properly handles crashes on Android with the new architecture. https://github.com/expo/expo/issues/41543

**Hunk 2:** when upstream fixes the `use_dev_client` detection. Still broken as of `expo-updates@57.0.21` — carry this hunk forward on every SDK bump.

## Patch for react-native-ios-utilities

#### When can we remove this:

When `react-native-ios-utilities` stops referencing the legacy-architecture-only `RCTRootContentView`. `5.2.0` is the **latest published** version, so there is no upgrade to move to — we should report this upstream. Rebuild the patch on every version bump.

#### Explanation/Context:

The iOS build failed to link with `Undefined symbols: _OBJC_CLASS_$_RCTRootContentView`, referenced from `react-native-ios-utilities` (pulled in via `react-native-ios-context-menu` / zeego).

`RCTRootContentView` is a legacy (Paper) class. RN 0.85+ removes the legacy architecture **and** ships a **prebuilt** React-Core (`RCT_USE_PREBUILT_RNCORE=1` by default) that is built with `RCT_REMOVE_LEGACY_ARCH=1`, so the symbol no longer exists in the binary we link against.

The patch removes the `closestParentReactContentView` helper and returns `nil` from its single consumer — the tail fallback of `closestParentReactTouchHandler`, which `react-native-ios-context-menu` uses to cancel a touch handler. This is safe because eigen runs the New Architecture: `RCTRootContentView` is never present in a Fabric view hierarchy, so that fallback was already dead code for us.

**Failed approach — do not retry:** setting `ENV['RCT_REMOVE_LEGACY_ARCH'] = '0'` in the Podfile. A compiler flag cannot add symbols back into a prebuilt binary; it would additionally require `RCT_USE_PREBUILT_RNCORE=0`, i.e. compiling React Native from source on every clean build.

## Patch for react-native-safe-area-context

#### When can we remove this:

When upstream drops the unused `React` import from `jest/mock.tsx`, or when our Babel/TS config no longer errors on it.

#### Explanation/Context:

`jest/mock.tsx` does `import React, { useContext } from 'react'` but never references `React` itself. Under our Jest transform this trips the unused-import/`verbatimModuleSyntax`-style handling and fails the mock. The patch is a one-liner that drops the default import and keeps `{ useContext }`.

Purely a test-time fix — it does not affect app code. Needs rebuilding on every `react-native-safe-area-context` version bump (it has already been carried across 5.6.2 → 5.7.0).

## patch for AFNetworking

#### Explanation/Context:

On XCode 26.5 we get "error Use of private header from outside its module: 'netinet6/in6.h'" breaking the iOS build.

#### When can we remove this:

When this gets addressed from Xcode side or we upgrade to a new version of AFNetworking
