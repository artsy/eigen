# Adding a New Key

Keys accessed within the app are stored in `keys.shared.json` file, accessed through [`react-native-keys`](https://github.com/numandev1/react-native-keys). You need to rebuild in Xcode for changes to the file to take effect.

keys.shared.json is for artsy people to be able to work and compile.
Is in .gitignore, and is downloaded by developers using the yarn setup:artsy script.
It is also the main file that the app gets all the real env vars, keys etc.

keys.example.json is for open source people to be able to work and compile and see what env vars need/use.
It is committed in git, and we try to keep the exact layout copied over from keys.shared.json, but without any actual keys, we replace them with "-" or similar.

On the React Native side follow these [docs](https://github.com/numandev1/react-native-keys?tab=readme-ov-file#javascript)

On the native iOS side follow these [docs](https://github.com/numandev1/react-native-keys?tab=readme-ov-file#ios-1)

On the native android side follow these [docs](https://github.com/numandev1/react-native-keys?tab=readme-ov-file#android-)

You'll need to update the keys in setupJest.ts, look for the mock for react-native-keys.
