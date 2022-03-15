# Adding a New Key

Keys are stored in `.env.shared` file, accessed through [`react-native-config`](https://github.com/luggit/react-native-config). You need to rebuild in Xcode for changes to the file to take effect.

.env.shared is for artsy people to be able to work and compile.
Is in .gitignore, and is downloaded by developers using the yarn setup:artsy script.
It is also the main file that the app gets all the real env vars, keys etc.

.env.example is for open source people to be able to work and compile and see what env vars need/use.
It is committed in git, and we try to keep the exact layout copied over from .env.shared, but without any actual keys, we replace them with "-" or similar.

On the React Native side:

```ts
import Config from "react-native-config"

// ...

Config.KEY_NAME
```

On the native iOS side:

```objc
#import <react-native-config/ReactNativeConfig.h>

// ...

[ReactNativeConfig envFor:@"KEY_NAME"]
```

On the native android side:

```java
BuildConfig.KEY_NAME;
```

You'll need to update the keys in [`emission.d.ts`](https://github.com/artsy/eigen/blob/869d35e0d83d4afae2cb62ebeab924f420944b0f/typings/emission.d.ts#L58-L72) and [`setupJest.ts`](https://github.com/artsy/eigen/blob/4654bacbcdc8624fb2799e9f86ad7717c5ab604b/src/setupJest.ts#L319-L331).
