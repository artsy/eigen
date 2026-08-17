## Deploying to Expo Updates

In order to allow faster testing for typescript changes on real devices you can deploy your changes to [expo updates](https://docs.expo.dev/versions/latest/sdk/updates/).

### Prerequisites

You will need to have the latest beta downloaded from firebase in order to run expo updates. If you need help getting access please ask in the **#practice-mobile** channel.

You will need the release environment vars to deploy to expo updates as well as the cli tools in the bin directory:

```
yarn setup:releases
./scripts/setup/install-bin
```

You will need to be logged in to the `artsy_mobile` account, credentials in 1pass:

`./bin/node_modules/.bin/eas login --no-browser`

> `--no-browser` keeps the username/password prompt. Without it, eas-cli opens a browser and logs
> you in as whichever account that browser session is already signed into.

### Deploying

Make your changes in typescript, commit, and run the script to deploy.

We have 3 channels currently:

- production - only for hotfix releases to real users
- staging - the latest main changes
- canary - for developer testing off main

For testing your changes you want canary. Deploying to canary will make any previous deploys unavailable so drop a note in **#practice-mobile** to make sure you are not overwriting others work.
Then run:

```
./scripts/deploys/expo-updates/deploy-to-expo-updates canary
```

Full usage:

```
./scripts/deploys/expo-updates/deploy-to-expo-updates <deployment> [description] [rollout_percentage] [--platform ios|android|all] [--check-against-version]
```

By default an update goes out to both platforms. Pass `--platform ios` or `--platform android` to target one.

### How updates are matched to builds

An update is only delivered to a build whose `runtimeVersion` matches. We key `runtimeVersion` on the **app version** (`version` in `app.json`, e.g. `9.15.0`), so an update stays compatible with every build of that release. `runtimeVersion` is kept in sync automatically whenever the app version is bumped — you should never need to edit it by hand.

Because the app version doesn't say anything about native code, the deploy script verifies that separately: before publishing, it compares the current native [fingerprint](build_caching.md) against a reference and refuses to publish if they differ. This is what stops a JS bundle that expects new native code from reaching a build that doesn't have it (which would crash on launch).

The reference depends on the channel:

- **canary / staging** → the latest beta's fingerprint (`s3://mobile-cached-builds/eigen-expo-fingerprint/latest.txt`)
- **production** → the fingerprint of the build actually shipped for the current app version (`.../<version>.txt`, written when a beta is promoted to the store)

If native code has drifted you'll see `❌ Native code has drifted from ...` and the publish stops. That's working as intended — deploy a new beta rather than trying to force the update out.

`--check-against-version` switches canary/staging to compare against the current app version's shipped fingerprint instead of the latest beta's. Use it when you're deploying from a branch that isn't based on current main — a hotfix branch cut from an old release tag, for example. It's a no-op for production, which already does this.

### Using in app

In the latest beta from firebase open Dev Menu -> Expo Updates -> Select your channel (e.g. Canary). The app will exit. Reopen the app and your changes should be running.
