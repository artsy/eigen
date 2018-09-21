# Troubleshooting

### Working with local media assets

When writing a component that refers to a local media asset

```tsx
<VideoPlayback source={require("./some-video.mp4")} />
```

note that

1. React Native's compiler will see the require path and copy the file to `pods/Assets/path/to/location/` automatically; and
2. `require` will return an opaque reference to the file location (an integer), not the fully-resolved path. To get the fully-resolved path `resolveAssetSource` must be used:

```tsx
import resolveAssetSource from "react-native/Libraries/Image/resolveAssetSource"

const source = resolveAssetSource(this.props.source)
console.log(source) // => { uri: "pods/Assets/.../some-video.mp4" }
```

See [Video.tsx](https://github.com/artsy/emission/tree/master/src/lib/Components/Video.tsx) for an example implementation and [here](https://facebook.github.io/react-native/docs/images#static-non-image-resources) for a list of supported file formats.
