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

#### Explanation/Context:

The Artsy fork (`artsy/Interstellar`, branch `observable-unsubscribe`) exists solely to add `unsubscribe()` to `ObserverToken`, which is called throughout the native Live Auctions view controllers (`LiveAuctionViewController`, `LiveAuctionLotListViewController`, etc.). The upstream repo added this same feature to master after the 2.2.0 CocoaPods release, but has never cut a new release. The Artsy fork's branch is 18 commits behind upstream master and only 3 ahead — all three of those commits exist in some form upstream — so if needed, we could switch to `JensRavens/Interstellar` master directly (same pattern, true upstream).

## Modular headers for firebase deps in Podfile

#### When can we remove this:

When we switch to `use_frameworks! :linkage => :static` globally (the recommended setup for Expo + Firebase). This requires removing the per-pod `:modular_headers => true` entries and adding `$RNFirebaseAsStaticFramework = true`. See https://rnfirebase.io/#altering-cocoapods-to-use-frameworks

#### Explanation/Context:

Flipper is gone, but we still can't use `use_frameworks! :linkage => :static` globally — which is what rnfirebase actually recommends. PR #11550 implemented this correctly, but it was reverted in PR #11898 because enabling static linkage for all pods significantly blew up iOS build times. The `:modular_headers => true` entries are the workaround that lets Firebase compile correctly without global static linkage.

As the iOS pod count decreases, the build time penalty becomes more acceptable and this should be revisited. Alternatively, this could be managed via the `expo-build-properties` plugin (`useFrameworks: "static"` in app.json) rather than a manual Podfile entry. Removing this hack would also allow removing the Braze prebuilt-static podspec hack.

## Custom lane google_play_track_rollout_percentages in fastlane dir + associated monkey patches in Fastfile

#### When can we remove this:

When this pr is accepted upstream or another way to fetch this data is supported by fastlane:
https://github.com/fastlane/fastlane/pull/22029

#### Explanation/Context:

This info is needed to automate our android rollout but not currently supported by fastlane.

## Custom supply command and associated patches in fastlane dir and Fastfile

#### When can we remove this:

When this pr is accepted upstream or another way to promote historical builds is supported by fastlane:
https://github.com/fastlane/fastlane/pull/22025

#### Explanation/Context:

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

- `ios/Keys.mm` — extracts the binding setup into a shared `installKeysBindings(jsi::Runtime&)` helper, and under `RCT_NEW_ARCH_ENABLED` adopts `RCTTurboModuleWithJSIBindings` so RN calls `installJSIBindingsWithRuntime:callInvoker:` and hands us the runtime directly (no bridge or CallInvoker hacks). The JS-callable `install()` then just returns `true` under the New Architecture, and only compiles the legacy `RCTCxxBridge` path on the old architecture (React Native 0.88 removed `RCTCxxBridge`, so that path no longer compiles with `RCT_NEW_ARCH_ENABLED`).
- `android/.../KeysModule.java` — `getJavaScriptContextHolder()` is still exposed on `BridgelessReactContext` (via `@UnstableReactNativeAPI`) and returns the active `ReactInstance`'s runtime pointer, so the JSI install works; we just guard against a null/zero holder instead of crashing.

⚠️ `yarn patch <pkg>` extracts the **unpatched** source. Re-apply the existing patch before adding hunks or you will silently drop them, and run `yarn install` after `yarn patch-commit` (it does not refresh `node_modules`).

## Patch for @react-navigation/bottom-tabs

#### When can we remove this:

When `@react-navigation/bottom-tabs` supports animating the tab bar's appearance itself. There is no upstream issue or PR tracking this yet — we should open one. Rebuild the patch on every version bump (last rebuilt for `7.22.0`).

#### Explanation/Context:

This patch allows us to animate the appearance of the bottom tabs. This is currently not supported by @react-navigation/bottom-tabs but it's something they do when the user shows/hides the keyboard.

See https://github.com/artsy/eigen/pull/12249 for more details.

## react-native-reanimated `staticFeatureFlags` in package.json

#### When can we remove this:

When reanimated turns these on by default (both are still `false` by default in `4.7.1`).

#### Explanation/Context:

`package.json` turns on two reanimated static feature flags. They apply non-layout style updates (`opacity`, `transform`, …) directly on the UI thread instead of committing a new shadow tree, which makes animations smoother when many run at once. See https://docs.swmansion.com/react-native-reanimated/docs/guides/feature-flags/

- `ANDROID_SYNCHRONOUSLY_UPDATE_UI_PROPS`
- `IOS_SYNCHRONOUSLY_UPDATE_UI_PROPS`

Caveat from the reanimated docs: React Native's own `Pressable` inside an `Animated.View` can fire `onPressIn` but drop `onPress` during or right after an animation, because Fabric's touch handling doesn't see these updates. Use gesture-handler's `Pressable` / `Touchable` / `GestureDetector` there.

The scroll-FPS fix the docs recommend (`USE_COMMIT_HOOK_ONLY_FOR_REACT_COMMITS`) has been on by default since reanimated `4.3`, so we don't set it.

**Removed in the SDK 58 upgrade — `DISABLE_COMMIT_PAUSING_MECHANISM` and the `react-native` patch.** We used to also set `DISABLE_COMMIT_PAUSING_MECHANISM` and patch `ReactNativeFeatureFlagsDefaults.h` so `preventShadowTreeCommitExhaustion()` returned `true`. The docs say the reanimated flag is only safe with that React Native flag on; otherwise React commits can be starved and the app can freeze. The patch never took effect: iOS links a prebuilt React Native (since SDK 57 / React Native 0.86), whose compiled default still returns `false`, and Android reads its defaults from the prebuilt library and `ReactNativeFeatureFlagsDefaults.kt`, never from the C++ header. So we dropped both. If sticky headers start to jitter while scrolling, the fix to watch is React Native's `enableFabricCommitBranching` flag (off by default in 0.88). Turning `preventShadowTreeCommitExhaustion` on would need a runtime override from native code at startup, not a header patch.

## react-native-webview passing constant for decelerationRate prop

#### When can we remove this:

When this is merged and we update react-native-webview to a version that contains it:
https://github.com/react-native-webview/react-native-webview/pull/3885

Still needed as of `react-native-webview@14.0.1` (only `WebView.ios.tsx` converts the string constants; Android passes the prop straight through as a number).

#### Explanation/Context:

This is a bug on the new architecture on Android with this prop and react-native-webview. The workaround lives in `src/app/Components/ArtsyWebView.tsx` — we pass the numeric constant `0.985` on Android instead of the `"fast"` string.

## patch for expo-build-disk-cache

#### When can we remove this:

When the upstream expo-build-disk-cache repository fixes the logging behavior and releases a new version that properly checks remote cache before logging cache misses.

#### Explanation/Context:

The original code had a logging issue where it would log a "cache miss" message immediately after checking the local disk cache, even before checking the remote cache plugin (S3 in our case). This resulted in false-negative messages showing cache misses when the cache was actually available remotely.

The patch:

- Moves the `logger.log(texts.read.miss)` call to after the remote plugin check
- Fixes the control flow so that the cache miss is only logged if both disk AND remote caches fail
- Improves the conditional logic around remote plugin downloading to properly return the cache path on success

This ensures accurate logging when using remote cache plugins like our S3 build cache implementation.

## Patch for react-native-ios-context-menu

#### When can we remove this:

When https://github.com/dominicstop/react-native-ios-context-menu/pull/140 is merged and we upgrade to a version that includes it.

#### Explanation/Context:

Fatal crash (EIGEN-AZB4) on New Architecture where iOS requests a `UITargetedPreview` during context menu dismissal but Fabric has already detached the underlying view from the window. The fix guards `menuTargetedPreview` to return `nil` when `window` is `nil`, letting iOS fall back to a fade-out dismissal instead of crashing.

See: https://github.com/dominicstop/react-native-ios-context-menu/issues/103

A second hunk (React Native 0.88): the two view managers used a quoted `#import "RCTBridge.h"`, which only resolved through React Native's old header search paths. With 0.88's prebuilt `React.framework` it fails with "'RCTBridge.h' file not found", so the patch switches to `#import <React/RCTBridge.h>`. Drop this hunk once upstream uses framework imports.

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

#### When can we remove this:

When the upstream @d11/react-native-fast-image closes and releases this PR https://github.com/dream-horizon-org/react-native-fast-image/pull/354/changes

#### Explanation/Context:

Another dependency in the Expo/react-native ecosystem has brought in com.caverock:androidsvg-aar:1.4, the aar version of the library, which causes duplicate symbols errors when linking.

## patch for expo-updates

#### When can we remove this:

When the upstream expo-updates repository fixes the issue and releases a new version that properly handles crashes on Android with the new architecture. https://github.com/expo/expo/issues/41543

Still needed as of `expo-updates@58.0.22`.

#### Explanation/Context:

**`android/.../errorrecovery/ErrorRecovery.kt` — blank screens instead of crashes.** Started seeing blank screens on android when app was crashing instead of regularly crashing the app after we enabled new architecture. In bridgeless mode `onReactInstanceException` silently swallowed the exception once expo-updates had unregistered its own handler (i.e. more than ~10s after launch). The patch keeps a fallback handler around that forwards to the thread's default uncaught-exception handler, so the app crashes properly — and gets reported — instead of showing a blank screen.

We used to carry a second hunk for `ios/EXUpdates.podspec` (`use_dev_client` wrongly detected as `true` when `expo-dev-client` is not installed). `expo-updates@58` fixed that upstream (it now silences stderr, strips the output and checks `empty?`), so the hunk was dropped.

## Patch for react-native-ios-utilities

#### When can we remove this:

When `react-native-ios-utilities` stops referencing the legacy-architecture-only `RCTRootContentView`. `5.2.0` is the **latest published** version, so there is no upgrade to move to — we should report this upstream. Rebuild the patch on every version bump.

#### Explanation/Context:

The iOS build failed to link with `Undefined symbols: _OBJC_CLASS_$_RCTRootContentView`, referenced from `react-native-ios-utilities` (pulled in via `react-native-ios-context-menu` / zeego).

`RCTRootContentView` is a legacy (Paper) class. RN 0.85+ removes the legacy architecture **and** ships a **prebuilt** React-Core (`RCT_USE_PREBUILT_RNCORE=1` by default) that is built with `RCT_REMOVE_LEGACY_ARCH=1`, so the symbol no longer exists in the binary we link against.

The patch removes the `closestParentReactContentView` helper and returns `nil` from its single consumer — the tail fallback of `closestParentReactTouchHandler`, which `react-native-ios-context-menu` uses to cancel a touch handler. This is safe because eigen runs the New Architecture: `RCTRootContentView` is never present in a Fabric view hierarchy, so that fallback was already dead code for us.

A second hunk (React Native 0.88): `RNIUtilitiesModule.mm`'s `installHostObjectIfNeeded` cast `[RCTBridge currentBridge]` to `RCTCxxBridge` to reach the JS runtime, and 0.88 no longer declares `RCTCxxBridge`. The patch compiles that path only on the old architecture and returns early under `RCT_NEW_ARCH_ENABLED`. We believe the bridgeless app never had an `RCTCxxBridge` there, so the path already returned early — but if `currentBridge` used to return the bridge proxy, the host object is no longer installed. Verify context menus (zeego / `react-native-ios-context-menu`) on device.

A third hunk (React Native 0.88): `RNIImageRemoteURLMaker.swift` typed its image loader as `RCTImageLoaderWithAttributionProtocol`, which 0.88 dropped from the `React` umbrella header, so Swift can't see it. The patch types it as `RCTImageLoaderProtocol`, which declares the `loadImage(with:callback:)` it actually calls.

More React Native 0.88 hunks: 0.88 builds with `RCT_REMOVE_LEGACY_ARCH`, which compiles `RCTSurfacePresenterBridgeAdapter` out. `-[UIApplication reactBridgeAdapter]`, `-reactSurfacePresenter` and the New Architecture branch of `-[UIView reactGetPaperBridge]` now return `nil` under that flag. That matches what eigen could ever get: upstream's `reactBridgeAdapter` recursed into itself whenever the app delegate wasn't an `RCTAppDelegate` (ours is an `ExpoAppDelegate`), so it was never reachable without crashing. Quoted RN imports (`"RCTBridge.h"`, `"RCTFabricComponentsPlugins.h"`, `"RCTFollyConvert.h"`) are also switched to `<React/…>` framework imports for the prebuilt `React.framework`.

**Failed approach — do not retry:** setting `ENV['RCT_REMOVE_LEGACY_ARCH'] = '0'` in the Podfile. A compiler flag cannot add symbols back into a prebuilt binary; it would additionally require `RCT_USE_PREBUILT_RNCORE=0`, i.e. compiling React Native from source on every clean build.

## Patch for react-native-reanimated (Jest)

#### When can we remove this:

When `JSReanimated.setCSSEventHandler` stops throwing, or `initializers.native.ts` stops calling it under Jest. Still broken in `react-native-reanimated@4.7.2`.

#### Explanation/Context:

Under Jest, reanimated resolves `initializers.native.ts` (platform `ios`) but uses `JSReanimated` as its module (`IS_JEST`). The native initializer unconditionally calls `setCSSEventHandler`, which `JSReanimated` implements as `throw`, so every suite that imports reanimated — including through `react-native-reanimated/mock` — failed with "`setCSSEventHandler` is not available in JSReanimated". The patch makes it a no-op. The web initializer (`initializers.ts`) never calls it, so this only affects tests.

## Patch for react-native-webview (types)

#### When can we remove this:

When `react-native-webview` changes `declare class WebView<P = undefined>` in `index.d.ts` back to a default that intersects cleanly (e.g. `{}`). Still broken in `14.0.1`.

#### Explanation/Context:

`14.x` declares `class WebView<P = undefined> extends Component<WebViewProps & P>`. `WebViewProps & undefined` reduces to `never`, so every `<WebView …/>` fails to type-check ("Type 'true' is not assignable to type 'never'"). The patch restores the `13.x` default `P = {}`. Types only, no runtime change.

## Patch for react-native-blob-util (Android `proguard-android.txt`)

#### When can we remove this:

When we bump to a version whose `android/build.gradle` no longer uses `getDefaultProguardFile('proguard-android.txt')` — fixed upstream in `react-native-blob-util@0.24+`.

#### Explanation/Context:

AGP 9 (React Native 0.87+) refuses to configure a module that references `proguard-android.txt` ("no longer supported since it includes `-dontoptimize`"). blob-util sets `minifyEnabled false` for its own release build type, so the file is never used; the patch swaps it for `proguard-android-optimize.txt` so Gradle can configure. We didn't take the upstream fix in the SDK 58 upgrade because it's a large jump (five 0.x minors).

`@rnmapbox/maps` had the same problem (plus React Native 0.88 iOS `LayoutMetrics` and Android Kotlin errors) and carried a patch for a while during the SDK 58 upgrade. We dropped it by upgrading to `10.3.18`, which has all of those fixes; that upgrade also moved the native Mapbox SDK from 11.20 to 11.33.

## Android Gradle Plugin 9 opt-outs and `kspVersion` (`android/gradle.properties`, `android/build.gradle`)

#### When can we remove this:

- `android.builtInKotlin=false` / `android.newDsl=false`: before AGP 10, which removes both opt-outs. Every library we build must support AGP 9's built-in Kotlin and new DSL first.
- `kspVersion`: when we apply Expo's `expo-root-project` Gradle plugin (which sets it for us), or when expo-updates stops falling back to an old KSP.

#### Explanation/Context:

React Native 0.87+ moves to AGP 9, which turns on built-in Kotlin and the new DSL by default. We opt out of both so the existing Gradle setup of the app and our native dependencies keeps configuring unchanged; moving to them is its own piece of work.

`kspVersion` has to match `kotlinVersion` (see Expo's `KSPLookup`). We don't apply `expo-root-project`, which would set it, so without it expo-updates falls back to KSP 1.9.24 and fails to configure. Update it whenever `kotlinVersion` changes.

## Jest `setImmediate` / `clearImmediate` and `requestIdleCallback` shims (`src/setupJest.tsx`)

#### When can we remove this:

- `setImmediate` / `clearImmediate`: when we drop legacy fake timers (see `@jest/fake-timers` above), or when the Jest environment provides both globals.
- `requestIdleCallback`: when the Jest environment / `@react-native/jest-preset` provides it.

#### Explanation/Context:

React Native 0.88's `NativeAnimatedHelper` calls `clearImmediate` unconditionally. jsdom doesn't define it, and legacy fake timers capture the missing value when the environment is created and restore it as `undefined` on `useRealTimers()`. The shim makes both globals accessors that fall back to Node's `timers` whenever they're unset.

React Native 0.87 removed `InteractionManager`, so app code now defers work with `requestIdleCallback` (`app/utils/runAfterInteractions`). Jest doesn't provide it, so the setup file polyfills it with `setTimeout(…, 0)`.

## Patch for @stripe/stripe-react-native (Android release lint, `play-services-tapandpay`)

#### When can we remove this:

When we upgrade to `@stripe/stripe-react-native@0.82+`, which has the same exclude upstream (https://github.com/stripe/stripe-react-native/issues/2728). That upgrade is its own piece of work: from `0.78` the Stripe iOS SDK is resolved through Swift Package Manager and needs `use_frameworks! :linkage => :dynamic`, and `0.84` drops CocoaPods resolution entirely.

#### Explanation/Context:

Stripe declares `compileOnly "com.stripe:stripe-android-issuing-push-provisioning:1.1.0"`, which depends on Google's private `play-services-tapandpay` SDK (not on any public Maven repository). Android Gradle Plugin 9 resolves `compileOnly` dependencies for the release lint check (`lintVitalAnalyzeRelease`), so `assembleRelease` failed with "Could not find com.google.android.gms:play-services-tapandpay:17.1.2". The patch excludes `play-services-tapandpay` from that dependency, the same fix as upstream. We don't use push provisioning, so nothing at runtime changes.

## Patch for @react-native-menu/menu (iOS imports)

#### When can we remove this:

When we can upgrade `@react-native-menu/menu` past `1.2.2` — zeego pins exactly `1.2.2` as a peer, so this waits on a zeego upgrade.

#### Explanation/Context:

`MenuViewManager.mm` and `NewArch/MenuView.mm` used quoted imports (`#import "RCTBridge.h"`, `#import "RCTFabricComponentsPlugins.h"`) that only resolved through React Native's old header search paths. With React Native 0.88's prebuilt `React.framework` they fail with "'RCTBridge.h' file not found". The patch switches them to framework imports (`<React/RCTBridge.h>`), which is where the prebuilt headers live.

## Legacy React Native TypeScript types (`tsconfig.json` customConditions)

#### When can we remove this:

Before upgrading past React Native 0.88 — the `react-native-legacy-deep-imports` condition (and `types_DEPRECATED`) is removed after 0.88.

#### Explanation/Context:

React Native 0.88 makes the [Strict TypeScript API](https://reactnative.dev/docs/strict-typescript-api) the default. Our code still types refs as component names (`useRef<ScrollView>`, `useRef<TextInput>`), uses removed type exports (`ViewToken`, `ViewabilityConfig`) and `Image` style types that no longer accept view styles — about 200 errors. `"customConditions": ["react-native-legacy-deep-imports", "react-native"]` keeps the legacy types until we migrate (mostly `ScrollViewInstance` / `TextInputInstance` style refs).

## patch for AFNetworking

#### When can we remove this:

When this gets addressed from Xcode side or we upgrade to a new version of AFNetworking

#### Explanation/Context:

On XCode 26.5 we get "error Use of private header from outside its module: 'netinet6/in6.h'" breaking the iOS build.

## patch for react-native-collapsible-tab-view

#### When can we remove this:

When `react-native-collapsible-tab-view` makes the tab-sync frame window configurable, or tunes it per platform itself. There is no upstream issue for this yet — we should open one. `9.0.0-rc.0` is a pre-release, so re-apply the patch on every bump.

#### Explanation/Context:

`Container.tsx` runs a `useFrameCallback` (`syncScrollFrame`) that keeps the non-focused tabs' scroll offsets in sync with the focused one after a tab switch, and stops itself after a fixed 1500ms. On Android that window is far too long: the frame callback keeps firing while the user is already scrolling the new tab, which competes with the scroll and makes it feel janky.

The patch shortens the window to 300ms on Android and leaves iOS at 1500ms. Added while enabling the New Architecture (https://github.com/artsy/eigen/pull/12825).

## Patch for react-native-drax

#### When can we remove this:

When the fix is present in a new published version of `react-native-drax`. It is already in the upstream repo, but no new version has been published since March 2026 (`1.1.0`).

#### Explanation/Context:

React Native 0.86 removed `StyleSheet.absoluteFillObject`, but drax `1.1.0` still spreads it into the styles of `HoverLayer` and `DebugOverlay`. Spreading `undefined` silently drops `position: absolute`, so the hover layer (the floating copy of the item being dragged) becomes a zero-height view at the bottom of the `DraxProvider`. While a stop is dragged on the City Guide itinerary screen, the original row is hidden and its copy renders off-screen, so the row looks like it disappears. Reordering still works.

The patch replaces `StyleSheet.absoluteFillObject` with `StyleSheet.absoluteFill` in both files, in `src/` (what Metro bundles, through the package's `react-native` entry point) and in `lib/module/`.

## ORStackView patch in ios/patches

#### When can we remove this:

When `ORStackView` publishes a release newer than 2.0.3 with the missing `UIKit` imports, or when the native screens that use it (Live Auctions, City Guide) are rewritten in React Native and we can drop the pod.

#### Explanation/Context:

`ios/patches/ORStackView+2.0.3.diff` is applied by the `cocoapods-patch` plugin (`plugin 'cocoapods-patch'` in `ios/Podfile`, gem pinned in the `Gemfile`), the same mechanism as the AFNetworking patch above.

ORStackView's public headers (`ORStackView.h`, `ORStackScrollView.h`, `ORSplitStackView.h`, `ORTagBasedAutoStackView.h`, `ORStackView+Private.h`) reference `UIView` / `UIScrollView` without importing UIKit, relying on it being pulled in transitively by the prefix header. Under modular/framework builds that no longer holds and the pod fails to compile. The patch just adds `#import <UIKit/UIKit.h>` to each header.
