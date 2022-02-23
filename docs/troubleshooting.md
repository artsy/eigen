# Troubleshooting

## Installation Issues

- Commit failed with: "ERROR: Potential secrets about to be committed to git repo!"

This happens when you try to commit some code that looks like a secret, a key, a token, etc.
Make sure what you are committing has no sensitive data in it.
If you are sure is it _not_ sensitive data, then you can add an inline comment containing `pragma: allowlist secret`, to signify it is ok to commit. Then try to commit again, and it will work this time.

- Failed `./scripts/setup-env-for-artsy` with

```
  You will need to run:
    yarn install
```

Make sure you are on proper node version and then do a

```
yarn install
```

- Issue with installing `tipsi-stripe`

```
  [!] CocoaPods could not find compatible versions for pod "tipsi-stripe":
```

You need to run

```
bundle exec pod update tipsi-stripe
```

- Error during `bundle exec pod update tipsi-stripe`

```
  checking whether the C compiler works... no
  xcrun: error: SDK "iphoneos" cannot be located
  xcrun: error: SDK "iphoneos" cannot be located
  xcrun: error: SDK "iphoneos" cannot be located
```

You need to go to Xcode -> Preferences -> Locations and select Command Line Tools from the dropdown

- Failed `./scripts/setup-env-for-artsy` with

```
[!] CocoaPods could not find compatible versions for pod "glog":
  In snapshot (Podfile.lock):
    glog (from `../node_modules/react-native/third-party-podspecs/glog.podspec`)

  In Podfile:
    glog (from `../node_modules/react-native/third-party-podspecs/glog.podspec`)

None of your spec sources contain a spec satisfying the dependencies: `glog (from `../node_modules/react-native/third-party-podspecs/glog.podspec`), glog (from `../node_modules/react-native/third-party-podspecs/glog.podspec`)`.

You have either:
 * out-of-date source repos which you can update with `pod repo update` or with `pod install --repo-update`.
 * mistyped the name or version.
 * not added the source repo that hosts the Podspec to your Podfile.

Note: as of CocoaPods 1.0, `pod repo update` does not happen on `pod install` by default.
```

This happens when your local `Example/Pods/` is out of date. Perhaps you worked on this repo before but have not
touched it for a while. In this case, it may be a good idea to just remove the entire `Pods/` dir and re-install
dependencies from scratch:

```
rm -rf Pods/ && yarn pod-install
```

### Working with local media assets

When writing a component that refers to a local media asset

```tsx
<VideoPlayback source={require("./some-video.mp4")} />
```

note that

1. React Native's compiler will see the require path and copy the file to `Pod/Assets/path/to/location/` automatically; and
2. `require` will return an opaque reference to the file location (an integer), not the fully-resolved path. To get the fully-resolved path `resolveAssetSource` must be used:

```tsx
import resolveAssetSource from "react-native/Libraries/Image/resolveAssetSource"

const source = resolveAssetSource(this.props.source)
console.log(source) // => { uri: "pods/Assets/.../some-video.mp4" }
```

See [Video.tsx](https://github.com/artsy/emission/tree/master/src/app/Components/Video.tsx) for an example implementation and [here](https://facebook.github.io/react-native/docs/images#static-non-image-resources) for a list of supported file formats.

### Update native snapshots

We use [Nimble-Snapshots](https://github.com/ashfurrow/Nimble-Snapshots) to take screenshots while running tests and
these screenshots are checked in to the source control. When you change e.g. the background color of a particular
button, it calculates the diff between two screenshots and makes the test fail if the delta is above a certain
threshold.

In order to update existing screenshots, run `./scripts/record-snapshots-enable`. This will do some small edits in the `Pods/`directory. After that you can run the tests again, using`cmd+u`. They will fail again but they will generate the new snapshots. Now run the second script `./scripts/record-snapshots-disable`, which will revert the changes. Now run the tests again using `cmd+u` and tests should pass.

If you are still having some tests failing, try commenting out the failing line, run the test, and comment in the line again and run again. If that still fails, then try replacing `haveValidSnapshot` with `recordSnapshot`, run test, go back to `haveValidSnapshot`, run test again. Hopefully that would fix all your failing tests.
