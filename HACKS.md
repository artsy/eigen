<!-- Template

## Title

#### When can we remove this:
Tell us when we can remove this hack.

#### Explanation/Context:
Explain why the hack was added.

-->

👀 See comment on top of file for template.

## "cheerio" resolution

#### When can we remove this:

Remove after `enzyme` is removed as a dependency.

#### Explanation/Context:

This is an existing resolution at the creation of HACKS.md. For what I gathered, it is required by enzyme. It requires ~1.0.0, but we need 0.22.0.

We use it in `renderToString` which takes something like `<Image />` and gives us `<image />`. Using 0.22.0 that works, but when enzyme uses ~1.0.0 it gives `<img />`, which breaks tests.

Using enzyme we created `renderUntil`. To replace that, we probably need @testing-library/react or something to replace it. Then we can remove enzyme and cheerio resolution as well.

## EchoNew.json

#### When can we remove this:

Maybe sometime end of 2020, we can change the file EchoNew.json back to Echo.json.

#### Explanation/Context:

https://artsy.slack.com/archives/CDU4AH60Z/p1600737384008500?thread_ts=1600642583.000100&cid=CDU4AH60Z

There was a case where echo returns 401 when a user asks for the latest echo options. This might be caused by some key misconfiguration, or it might not. Right now we have figured out that the app was storing broken Echo.json when the status was 401, and this caused the app to crash. As the simplest way to get around that we decided to rename the file, so in the next app update we would force all users to grab a new echo json file (this time named EchoNew.json). We have also added code to make sure we don't store broken echo json files locally anymore.

After a few months we should be safe to return to the old name if we want. If we decide to do that, we should make sure to remove the old file that might have been sitting on users' phones.

## react-native-image-crop-picker getRootVC patch

#### When can we remove this:

Remove when we stop swizzling UIWindow via ARWindow or react-native-image-crop-picker provides a more robust way of finding the viewController to present on.

#### Explanation/Context:

https://github.com/ivpusic/react-native-image-crop-picker/pull/1354

We do some swizzling in our AppDelegate that causes [[UIApplication sharedApplication] delegate] window] to return nil, this is used by image-crop-picker to find the currently presented viewController to present the picker onto. This patch looks for our custom window subclass (ARWindow) instead and uses that to find the presented viewController. Note we cannot reliably use the lastWindow rather than checking for our custom subclass because in some circumstances this is not our window but an apple window for example UIInputWindow used for managing the keyboard.

## react-native-haptic-feedback patch-package

#### When can we remove this:

When this is merged: https://github.com/junina-de/react-native-haptic-feedback/pull/60.

#### Explanation/Context:

We use this type in our code, so we need it exported.

## react-native patch-package (stacktrace-parser part only).

#### When can we remove this:

When this is merged: https://github.com/facebook/react-native/pull/30345.

#### Explanation/Context:

For some reason CircleCI kept giving an error when running tests `TypeError: stacktraceParser.parse is not a function`. Once I moved the require higher up, things started working again.

## hardcode mapbox version to at least 6.3.0 using $ReactNativeMapboxGLIOSVersion

#### When can we remove this:

When @react-native-mapbox-gl/maps uses mapbox-ios at least 6.3.0

#### Explanation/Context:

Version 6.3 added support for Xcode 12 and iOS 14. Without this hardcoding we get version 5.7. Let's keep the hardcode, at least until they give us at least that version with the npm package.

To check which version comes with, either remove `$ReactNativeMapboxGLIOSVersion` and after `pod install` check the `Podfile.lock` for version, or look on github https://github.com/react-native-mapbox-gl/maps/blob/master/CHANGELOG.md for versions bundle with an npm version.

## exporting MockResolverContext (@types/relay-test-utils patch-package)

#### When can we remove this:

Not really needed to be removed, unless it causes problems.

#### Explanation/Context:

We use this type in out code for our tests and the `mockEnvironmentPayload`, so we exported it.

## Delay modal display after LoadingModal is dismissed

#### When can we remove this:

Doesn't really need to be removed but can be if view hierarchy issue is fixed in RN or our LoadingModal see PR for more details: https://github.com/artsy/eigen/pull/4283

#### Explanation/Context:

We have a modal for showing a loading state and a onDismiss call that optionally displays an alert message, on iOS 14 we came across an issue where the alert was not displaying because when onDismiss was called the LoadingModal was still in the view heirarchy. The delay is a workaround.

## react-native-config patch-package

#### When can we remove this:

Now.

#### Explanation/Context:

react-native-config loads the `.env` file by default. We wanted to use `.env.shared` and `.env.ci` instead. We did that by using a patch-package patch, to add our customization.

We can do this better using https://github.com/luggit/react-native-config#ios-1. Take a look at https://artsyproduct.atlassian.net/browse/CX-949.

## react-native-share patch-package

#### When can we remove this:

When we make a PR and it's merged about this.

#### Explanation/Context:

We need this patch because the lib by itself doesn't set the background colors when we send a backgroundImage, even though Instagram supports it. We add it here as a package because we use it.

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

## react-native-mapbox-gl/maps - 8.2.0-beta2 postinstall script

#### When can we remove this:

Now.

#### Explanation/Context:

We had issues with our archive becoming invalid and failing to export when we updated mapbox and cocoapods

- mapbox released a beta version that fixed the issue for our setup
- this also required a patch to fix types
- See issues here: https://github.com/CocoaPods/CocoaPods/issues/10385, https://github.com/react-native-mapbox-gl/maps/issues/1097
- we should update to a non-beta version ASAP

## react-native-screens patch

#### When can we remove this:

Once a new react-native-screens version is released (anything above 3.2.0), we can remove our patch and use it instead.

#### Explanation/Context:

We had issues on the android app where whenever we navigate from a screen to an other screen by dispatching a native event action, the default orientation gets overwritten. This fix makes sure that we are maintaining the default orientation.

react-native-screens already created a fix for this that can be found here and should be released in the next build. See https://github.com/software-mansion/react-native-screens/issues/836

# android Input placeholder measuring hack

#### When can we remove this:

Once https://github.com/facebook/react-native/pull/29664 is merged or https://github.com/facebook/react-native/issues/29663 solved.

#### Explanation/Context:

As you can see in the PR and issue, android doesn't use ellipsis on the placeholder of a TextInput. That makes for a funky cut-off.

We added a workaround on Input, to accept an array of placeholders, from longest to shortest, so that android can measure which one fits in the TextInput as placeholder, and it uses that. When android can handle a long placeholder and use ellipsis or if we don't use long placeholders anymore, this can go.
