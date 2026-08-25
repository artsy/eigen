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

#### Diagram

```
flowchart TD
  A["Running deploy-to-expo-updates"] --> B{"Which reference \n fingerprint to use?"}
  B -->|"channel=canary OR staging"| C["latest.txt \n\n fingerprint of `main`"]
  B -->|"channel=production OR \n with `--check-against-version`"| D["{version}.txt \n\n fingerprint of the build \n actually shipped for \n `app.json` version"]
  C --> E["Generate current fingerprint using \n `npx @expo/fingerprint`"]
  D --> E
  E --> F{"current == reference?"}
  F -->|"no"| G["BLOCKED 🚫 \n \n Native code has drifted. \n Deploy a native beta instead."]
  F -->|"yes"| H["PASS ✅  \n\n runs `fastlane deploy_to_expo_updates`"]

  classDef pass fill:#e4f1e9,stroke:#2f7a4f,color:#1b4a2f;
  classDef block fill:#f8e3e0,stroke:#a63a32,color:#6b2019;
  classDef ref fill:#e2eeee,stroke:#0e6e73,color:#0d3a3c;
  class G block;
  class H pass;
  class C,D ref;

```

An update is only delivered to a build whose `runtimeVersion` matches. We key `runtimeVersion` on the **app version** (`version` in `app.json`, e.g. `9.15.0`), so an update stays compatible with every build of that release. `runtimeVersion` is kept in sync automatically whenever the app version is bumped — you should never need to edit it by hand.

Because the app version doesn't say anything about native code, the deploy script verifies that separately: before publishing, it compares the current native [fingerprint](build_caching.md) against a reference and refuses to publish if they differ. This is what stops a JS bundle that expects new native code from reaching a build that doesn't have it (which would crash on launch).

The reference depends on the channel:

- **canary / staging** → the latest beta's fingerprint (`s3://mobile-cached-builds/eigen-expo-fingerprint/latest.txt`)
- **production** → the fingerprint of the build actually shipped for the current app version (`.../<version>.txt`, written when a beta is promoted to the store)

If native code has drifted you'll see `❌ Native code has drifted from ...` and the publish stops. That's working as intended — deploy a new beta rather than trying to force the update out.

`--check-against-version` switches canary/staging to compare against the current app version's shipped fingerprint instead of the latest beta's. Use it when you're deploying from a branch that isn't based on current main — a hotfix branch cut from an old release tag, for example. It's a no-op for production, which already does this.

### Where does the reference fingerprint comes from?

#### Diagram

```
flowchart TD
  subgraph MAIN["On every push to `main`"]
    M["Generate fingerprint"] --> N{"differs from \n `latest.txt`?"}
    N -->|"no"| O["No native build or fingerprint update needed."]
    N -->|"yes"| P["Trigger new native builds \n (unless already on S3)"]
    N -->|"yes"| Q["Update `latest.txt`"]
  end

  subgraph BETA["On every beta"]
    R["Compute fingerprint \n before building"] --> S["git tag ios-9.16.0-2408\nfingerprint:&lt;sha1&gt;"]
  end

  subgraph STORE["On store submission"]
    T["Find that build's tag on GitHub"] --> U["Read fingerprint from\nthe tag message"]
    U --> V["Write `{version}.txt`"]
  end

  S -.->|"the tag is the record of\nwhat each binary was built from"| T
  Q ==>|"read by channel=canary OR channel=staging"| GATE["How updates are matched to builds"]
  V ==>|"read by channel=production OR with `--check-against-version`"| GATE

  classDef ref fill:#e2eeee,stroke:#0e6e73,color:#0d3a3c;
  classDef gate fill:#fff3d9,stroke:#8a5b00,color:#553800;
  class Q,V ref;
  class GATE gate;
```

We have two types of fingerprints that we keep track of in S3, `latest.txt` and `{version}.txt`

- `latest.txt` reflects the fingerprint of `main`, and is rewritten whenever `main`'s native code changes — independently of whether a rebuild was actually needed.
- `{version}.txt` tracks what has been shipped with that version number.

Since we can't calculate the fingerprint on submission time, we do the calculation at beta building time, and store that fingerprint with the build tag on GitHub (example)
At the time of shipping
Since a fingerprint can't be computed at submission time, so it's recovered from the annotated ship tag written when that beta was built.

### Using in app

In the latest beta from firebase open Dev Menu -> Expo Updates -> Select your channel (e.g. Canary). The app will exit. Reopen the app and your changes should be running.
