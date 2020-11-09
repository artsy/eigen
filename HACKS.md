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

- react-native-haptic-feedback

  When this is merged: https://github.com/junina-de/react-native-haptic-feedback/pull/60.

  We use this type in our code, so we need it exported.
