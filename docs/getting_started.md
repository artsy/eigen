# Getting Started

### Prerequisites

You'll need [Node](https://nodejs.org/en/), [Yarn](https://yarnpkg.com/en/) and Watchman installed (`brew install watchman`).

> The Node version should match [the `engine` version here](https://github.com/artsy/eigen/blob/main/package.json).

### Set up iOS

Download Xcode version 13. You can find all available versions of Xcode at [Apple's Developer Portal 🔐](http://developer.apple.com/download/more/).

Ask your mentor to add you on the [firebase.console](https://console.firebase.google.com/project/eigen-a7d3b/settings/iam) to be able to release.

<details><summary>NOTE: After installing Xcode</summary>

Check that Command Line Tools version is added in the Locations tab. Xcode>Preferences>Locations:
<img width="375" alt="" src="https://user-images.githubusercontent.com/29984068/123970729-6009cf00-d987-11eb-933a-1603ba4d6ae8.png">

</details>

### Set up Android

1. Android development environment: Follow the [official docs](https://reactnative.dev/docs/environment-setup). Select "React Native CLI Quickstart" tab

1. [Create a virtual device](https://developer.android.com/studio/run/managing-avds) on which to run the Android app.

## Run Eigen

### Get eigen

```
git clone https://github.com/artsy/eigen.git
cd eigen
```

### Install the dependencies

<details><summary>Work at Artsy?</summary>

1. Run

```
yarn setup:artsy
yarn install:all
```

You will need [awscli](https://formulae.brew.sh/formula/awscli) to get our ENV vars.

1. `Artsy/App/EchoNew.json` is used to toggle features and it is not checked in (a sample file is included for OSS contributors). When you run `pod install`, the latest `EchoNew.json` file will be downloaded for you.
</details>

<details><summary>Independent Contributor?</summary>

```sh
yarn setup:oss # this is `yarn setup:artsy` if you're working at Artsy
yarn install:all

```

</details>

**Note**: `yarn pod-install` (which is included in `yarn install:all`) may fail the first time you run it (due to a [bug](https://github.com/orta/cocoapods-keys/issues/127) in a dependency of ours). Re-running the command should work.

## Contribute

We welcome independent contributions! Feel free to open an issue and open a PR and assign one of [Brian Beckerle](https://github.com/brainbicycle) [Pavlos Vinieratos](https://github.com/pvinis) [Mounir Dhahri](https://github.com/MounirDhahri) as a reviewer or anyone else listed [here](https://github.com/artsy/eigen#meta).

If you work at Artsy you can find a ticket on [CX backlog](https://artsyproduct.atlassian.net/jira/software/c/projects/CX/boards/77/backlog?issueLimit=100) and look for a **#good-first-issue**

## Run the app

Start the react-native bundler:

```sh
yarn start
```

### Run the iOS app

Ask for your apple developer account to be added on the project and login with your apple id under settings/accounts/apple Id

Open the app in Xcode:

```sh
open ios/Artsy.xcworkspace
```

From Xcode, run the app by hitting `Product > Run` (or ⌘R). This will start the Artsy app in an iOS simulator, pointed at Artsy's staging environment.

#### Flipper

Once you've built & run the app through Xcode once, you can use [Flipper](https://fbflipper.com/) to run/debug the iOS app locally. This is typically much faster than running through Xcode.

Make sure Flipper is running, then start the iOS simulator directly via your terminal:

```sh
yarn open-sim
```

The simulator that opens should include the Artsy app even if you don’t have xcode running, and then you can use Flipper's dev tools for inspecting log output.

Occasionally you'll need to rebuild the app in Xcode for Flipper. The most likely scenario that requires a rebuild is that you’ve pulled latest, run bundle exec pod install, and dependency versions were updated in Podfile.lock.

**Note**: You'll want to confirm that the above command started the same simulator that you last ran in xcode, i.e. iPhone 12 vs iPhone 12 max. If it didn't, you can choose the correct simulator from `File|Open|…`

**Note**: The Artsy app icon is on the _second_ screen of the simulator, not the first, so make sure you swipe over to find it.

### Run the Android app

```sh
yarn android
```

This will start the Artsy app in an Android emulator, pointed at Artsy's staging environment.

## Run native tests

We can only run tests in one specific environment, today that is iPhone 12 Pro with the iOS 14.2 Simulator. This is because we use visual snapshots for UI regressions.

### Run tests in Xcode

Tap `cmd + u` to run all tests, use `ctrl + alt + cmd + g` to run the last set you clicked on via the GUI.

### Run tests via command line

You can run tests via the CLI using:

```sh
./scripts/test-ios
```

## Certificates

We use Xcode's auto-codesigning. It should magically "just work" if you log in to Xcode with an iTunes account
which is on the Artsy team.

We have [cert troubleshooting here](https://github.com/artsy/eigen/blob/main/docs/certs.md)

## Connect a device

### iOS

When you connect an iPhone to your machine, Xcode will prompt you to join a team, then to enable the device for development. If you have to choose a team, choose _Art.sY Inc._.

### Android

1. On your Android device go to Settings > About Phone
2. Find the 'Build number' menu item and tap it 7 times to enable developer mode.
3. Now go to Settings > System > Developer Options, and turn on 'USB Debugging'
4. Connect your device to your computer via USB cable. After a moment the device should show a prompt for you to allow USB debugging for your computer. Press yes.
5. After that run `yarn android` from within the eigen directory. This will build the app, install it on your device, and run it.

## Read more

Learn about what things are architecturally [here](https://github.com/artsy/eigen/blob/main/docs/overview.md), then move [to the blog.](http://artsy.github.io/blog/categories/eigen/) for more in-depth discussions on Eigen.
