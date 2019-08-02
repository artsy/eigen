# Troubleshooting

## Installation Issues

- Failed `make artsy` with

```
  You will need to run:
    yarn install
```

make sure you are on proper node version and then do a

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

You need to go to Xcode -> Prreferences -> Locations and select Command Line Tools from the dropdown

- Failed `make artsy` with

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
rm -rf Pods/ && bundle exec pod install
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

See [Video.tsx](https://github.com/artsy/emission/tree/master/src/lib/Components/Video.tsx) for an example implementation and [here](https://facebook.github.io/react-native/docs/images#static-non-image-resources) for a list of supported file formats.
