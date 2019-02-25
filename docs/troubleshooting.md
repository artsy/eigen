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

- Failed `make artsy` with

```
  [!] CocoaPods could not find compatible versions for pod "Artsy+UIFonts":
    In snapshot (Podfile.lock):
      Artsy+UIFonts (= 3.2.0, >= 1.1.0, >= 3.0.0)

    In Podfile:
      Artsy+UIFonts

      Emission (from `../`) was resolved to 1.8.3, which depends on
        Artsy+UIFonts (>= 3.0.0)
```

you need to clone Artsy UI Fonts in your Emission root folder:

```
git clone https://github.com/artsy/Artsy-UIFonts.git
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
