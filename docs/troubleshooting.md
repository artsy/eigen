# Troubleshooting

If things are not going right some of the things you can try are

- Pulling from main branch
- `rm -rf node_modules`
- `yarn setup:artsy`
- `yarn install:all`
- `yarn relay`
- `yarn pod-install-repo-update`
- `open ios/Artsy.xcworkspace` -> Product -> Clean Build Folder (shift + command + K) **then** build the app again
- `yarn doctor`

Still nothing?

- reinstall eigen

  ![...Have you tried turning it off and on again?](https://y.yarn.co/1ab70c93-fce1-460d-8575-3bac5a666e96_text.gif)

- No, seriously. Try turning the computer off and on again

## asdf

if your problems come from asdf package manager try

- `asdf install node x.y.z`
- `asdf local node x.y.z`

- `asdf install`
- `asdf reshim`

- remove `.nvm` if it exists also on your home environment

## Broken Hot Reloading and general DX instability

We've noticed an issue where the DX is impacted when _not_ booting the app from Xcode. For example, a common (problematic) workflow is:

- `git pull`
- `yarn open-Xcode`
- compile the app
- go back to terminal
- `yarn start`

And then the next day, since the app has already been compiled, skip the Xcode step and just run `yarn start` in the terminal and open the app in the simulator.

Following this sequence of steps, minor changes made to JS code would visibly hot reload _and then_ unexpectedly trigger a full page reload, which would often also kick you back to the main screen. Syntax errors or frequent, habitual file-saves would frequently lead to app crashes, forcing one to reboot the app in order to resume dev.

#### To fix this, always compile the app from Xcode and let the simulator launch from there.

When the terminal window automatically pops up and executes `yarn start`, let it run, and do not close it. And when you are done for the day and want to start developing the following day, remember to open Xcode and boot it from there, and not manually in the terminal. This will lead to a vastly better developer experience.

## Node not found compilation issues

When compiling if you see an error like:

`Command PhaseScriptExecution failed with a nonzero exit code ...[Codegen] [Error] Could not find node. It looks like that the .xcode.env or .xcode.env.local : command not found`

It means xcode cannot find your node installation. It reads this from a file called .xcode.env in the ios/ directory.

We mostly use asdf and if this is not working correctly it probably means something in your local setup is interfering with Xcode reading node.

As a workaround you can run this script:

`./scripts/utils/setup-xcode-local-node.sh`

This will write your local node path to a file in ios/ .xcode.env.local. It should look something like this

`export NODE_BINARY=/Users/brianbeckerle/.asdf/shims/node`

If it still does not compile or the file looks incorrect you can paste the path output from this command:

`$ which node`

into that same .xcode.env.local file.

The .xcode.env.local file is not checked in so can be specific to your setup.

## Installation Issues

- Commit failed with: "ERROR: Potential secrets about to be committed to git repo!"

This happens when you try to commit some code that looks like a secret, a key, a token, etc.
Make sure what you are committing has no sensitive data in it.
If you are sure is it _not_ sensitive data, then you can add an inline comment containing `pragma: allowlist secret`, to signify it is ok to commit. Then try to commit again, and it will work this time.

- Failed `./scripts/setup/setup-env-for-artsy` with

```
  You will need to run:
    yarn install
```

Make sure you are on proper node version and then do a

```
yarn install
```

- Failed `./scripts/setup/setup-env-for-artsy` with

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

See [Video.tsx](https://github.com/artsy/emission/blob/master/src/lib/Components/Video.tsx) for an example implementation and [here](https://facebook.github.io/react-native/docs/images#static-non-image-resources) for a list of supported file formats.

### Update native snapshots

We use [Nimble-Snapshots](https://github.com/ashfurrow/Nimble-Snapshots) to take screenshots while running tests and
these screenshots are checked in to the source control. When you change e.g. the background color of a particular
button, it calculates the diff between two screenshots and makes the test fail if the delta is above a certain
threshold.

In order to update existing screenshots, run `./scripts/record-snapshots-enable`. This will do some small edits in the `Pods/`directory. After that you can run the tests again, using `cmd+u`. They will fail again but they will generate the new snapshots. Now run the second script `./scripts/record-snapshots-disable`, which will revert the changes. Now run the tests again using `cmd+u` and tests should pass.

If you are still having some tests failing, try commenting out the failing line, run the test, and comment in the line again and run again. If that still fails, then try replacing `haveValidSnapshot` with `recordSnapshot`, run test, go back to `haveValidSnapshot`, run test again. Hopefully that would fix all your failing tests.

### Podfile.lock diffs

Many devs have reported that their `Podfile.lock` differred from the one in `main` and lots of the deps have a different checksum. This could happen for many reasons that were specified in details in this [article on our blog](https://artsy.github.io/blog/2016/05/03/podspec-checksums/).

If you encounter the same error, we suggest running the above commands for the packages where the checksum is different

```bash
cd ios
bundle exec pod update [package]
```
