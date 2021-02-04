<!-- Template

- Title

  Tell us when we can remove this hack.

  Explain why the hack was added.

-->

- "cheerio" resolution

  Remove after `enzyme` is removed.

  This is an existing resolution at the creation of HACKS.md. For what I gathered, it is required by enzyme. It requires ~1.0.0, but we need 0.22.0.
  We use it in `renderToString` which takes something like `<Image />` and gives us `<image />`. Using 0.22.0 that works, but when enzyme uses ~1.0.0 it gives `<img />`, which breaks tests.
  Using enzyme we created `renderUntil`. To replace that, we probably need @testing-library/react or something to replace it. Then we can remove enzyme and cheerio resolution as well.

- EchoNew.json

  Maybe sometime end of 2020, we can change the file EchoNew.json back to Echo.json.

  Context: https://artsy.slack.com/archives/CDU4AH60Z/p1600737384008500?thread_ts=1600642583.000100&cid=CDU4AH60Z
  There was a case where echo returns 401 when a user asks for the latest echo options. This might be caused by some key misconfiguration, or it might not. Right now we have figured out that the app was storing broken Echo.json when the status was 401, and this caused the app to crash. As the simplest way to get around that we decided to rename the file, so in the next app update we would force all users to grab a new echo json file (this time named EchoNew.json). We have also added code to make sure we don't store broken echo json files locally anymore.

  After a few months we should be safe to return to the old name if we want. If we decide to do that, we should make sure to remove the old file that might have been sitting on users' phones.

- react-native-image-crop-picker getRootVC patch

  Remove when we stop swizzling UIWindow via ARWindow or react-native-image-crop-picker provides a more robust way
  of finding the viewController to present on.

  Context: https://github.com/ivpusic/react-native-image-crop-picker/pull/1354
  We do some swizzling in our AppDelegate that causes [[UIApplication sharedApplication] delegate] window] to return nil, this is used by image-crop-picker to find the currently presented viewController to present the picker onto. This patch looks for our custom window subclass (ARWindow) instead and uses that to find the presented viewController. Note we cannot reliably use the lastWindow rather than checking for our custom subclass because in some circumstances this is not our window but an apple window for example UIInputWindow used for managing the keyboard.

- react-native-haptic-feedback patch-package

  When this is merged: https://github.com/junina-de/react-native-haptic-feedback/pull/60.

  We use this type in our code, so we need it exported.

- react-native patch-package (stacktrace-parser part only).

  When this is merged: https://github.com/facebook/react-native/pull/30345.

  For some reason CircleCI kept giving an error when running tests `TypeError: stacktraceParser.parse is not a function`. Once I moved the require higher up, things started working again.

- hardcode mapbox version to at least 6.3.0 using $ReactNativeMapboxGLIOSVersion

  When @react-native-mapbox-gl/maps uses mapbox-ios at least 6.3.0

  Version 6.3 added support for Xcode 12 and iOS 14. Without this hardcoding we get version 5.7. Let's keep the hardcode, at least until they give us at least that version with the npm package.
  To check which version comes with, either remove `$ReactNativeMapboxGLIOSVersion` and after `pod install` check the `Podfile.lock` for version, or look on github https://github.com/react-native-mapbox-gl/maps/blob/master/CHANGELOG.md for versions bundle with an npm version.

- exporting MockResolverContext (@types/relay-test-utils patch-package)

  Not really needed to be removed, unless it causes problems.

  We use this type in out code for our tests and the `mockEnvironmentPayload`, so we exported it.

- Delay modal display after LoadingModal is dismissed

  Doesn't really need to be removed but can be if view hierarchy issue is fixed in RN or our LoadingModal see PR for more
  details: https://github.com/artsy/eigen/pull/4283

  We have a modal for showing a loading state and a onDismiss call that optionally displays an alert message, on iOS 14 we came across an issue where the alert was not displaying because when onDismiss was called the LoadingModal was still in the view heirarchy. The delay is a workaround.

- react-native-config patch-package

  Now.

  react-native-config loads the `.env` file by default. We wanted to use `.env.shared` and `.env.ci` instead. We did that by using a patch-package patch, to add our customization.
  We can do this better using https://github.com/luggit/react-native-config#ios-1. Take a look at https://artsyproduct.atlassian.net/browse/CX-949.

- react-native-share patch-package

  When we make a PR and it's merged about this.

  We need this patch because the lib by itself doesn't set the background colors when we send a backgroundImage, even though Instagram supports it. We add it here as a package because we use it.

- @react-navigation/core patch-package

  react-navigation has a bug with nested independent `NavigationContainer` instances. https://github.com/react-navigation/react-navigation/issues/8611

  Our patch alleviates the issue in our case, but would not work as an upstream PR.

  To remove this hack we can do one of two things:

  - Stop using nested navigation containers.
  - Fix `@react-navigation/core` properly upstream.
