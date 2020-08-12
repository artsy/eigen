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
