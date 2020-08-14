# Adding a New Key

Keys are stored in a `.env` file, accessed through [`react-native-config`](https://github.com/luggit/react-native-config). You need to rebuild in Xcode for changes to the file to take effect.

On the native side:

```objc
#import <react-native-config/ReactNativeConfig.h>

// ...

[ReactNativeConfig envFor:@"KEY_NAME"]
```

On the React Native side:

```ts
import Config from "react-native-config"

// ...

Config.KEY_NAME
```

You'll need to update the keys in [`emission.d.ts`](https://github.com/artsy/eigen/blob/869d35e0d83d4afae2cb62ebeab924f420944b0f/typings/emission.d.ts#L58-L72) and [`setupJest.ts`](https://github.com/artsy/eigen/blob/4654bacbcdc8624fb2799e9f86ad7717c5ab604b/src/setupJest.ts#L319-L331).
