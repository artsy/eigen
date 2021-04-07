# Getting Started

## Prerequisites

You'll need [Node](https://nodejs.org/en/) and [Yarn](https://yarnpkg.com/en/) installed. The Node version should match [the `engine` version here](https://github.com/artsy/eigen/blob/master/package.json).

### Xcode

Currently we require developers to use Xcode 12, with the latest version (12.2.0) recommended. You can find all versions of Xcode from [Apple's Developer Portal 🔐](http://developer.apple.com/download/more/).

### Android Studio

Currently we use Android Studio 4.1.1. You can download it from [here](https://developer.android.com/studio#downloads).

Once that's setup, you'll want to update your `.bashrc` or `.zshrc` (or whatever tool you use to manage your terminal) with the proper `ENV` vars:

```shell
export ANDROID_HOME=$HOME/Library/Android/sdk
export PATH=$PATH:$ANDROID_HOME/emulator
export PATH=$PATH:$ANDROID_HOME/tools
export PATH=$PATH:$ANDROID_HOME/tools/bin
export PATH=$PATH:$ANDROID_HOME/platform-tools
```

Make sure to refresh/restart your terminal to include the PATH changes.

#### Create a virtual device

[Create a virtual device](https://developer.android.com/studio/run/managing-avds) on which to run the Android app.

### Clone

```
git clone https://github.com/artsy/eigen.git
cd eigen
```

### Install dependencies

<details><summary>Work at Artsy?</summary>

1. Instead of `./scripts/setup-env-for-oss` below, run `./scripts/setup-env-for-artsy`. You will need [awscli](https://formulae.brew.sh/formula/awscli) to get our ENV vars.

2. The file `Artsy/App/EchoNew.json`, which is used to toggle features, is not checked in (a sample file is included for OSS contributors). When you run `pod install`, the latest `EchoNew.json` file will be downloaded for you.
</details>

```sh
gem install bundler

bundle install --without development

./scripts/setup-env-for-oss # or ./scripts/setup-env-for-artsy

bundle exec pod install --repo-update
```

**Note**: `bundle exec pod install` may fail the first time you run it (due to a [bug](https://github.com/orta/cocoapods-keys/issues/127) in a dependency of ours). Re-running the command should work.

## Run the app

Start the react-native bundler:

```sh
yarn start
```

### Run the iOS app

Open the app in Xcode:

```sh
open Artsy.xcworkspace
```

From Xcode, run the app by hitting `Product > Run` (or ⌘R). This will start the Artsy app in an iOS simulator, pointed at Artsy's staging environment.

### Run the Android app

```sh
yarn android
```

This will start the Artsy app in an Android emulator, pointed at Artsy's staging environment.

## Running native tests

We can only run tests in one specific environment, today that is iPhone 12 Pro with the iOS 14.2 Simulator. This is because we use visual snapshots for UI regressions.

### To run tests in Xcode

Tap `cmd + u` to run all tests, use `ctrl + alt + cmd + g` to run the last set you clicked on via the GUI.

### Command line

You can run tests via the CLI using:

```sh
./scripts/test-ios
```

### Updating snapshots

We use [Nimble-Snapshots](https://github.com/ashfurrow/Nimble-Snapshots) to take screenshots while running tests and
these screenshots are checked in to the source control. When you change e.g. the background color of a particular
button, it calculates the diff between two screenshots and makes the test fail if the delta is above a certain
threshold.

In order to update existing screenshots, run './scripts/record-snapshots-enable`. This will do some small edits in the `Pods/`directory. After that you can run the tests again, using`cmd+u`. They will fail again but they will generate the new snapshots. Now run the second script `./scripts/record-snapshots-disable`, which will revert the changes. Now run the tests again using `cmd+u` and tests should pass.

If you are still having some tests failing, try commenting out the failing line, run the test, and comment in the line again and run again. If that still fails, then try replacing `haveValidSnapshot` with `recordSnapshot`, run test, go back to `haveValidSnapshot`, run test again. Hopefully that would fix all your failing tests.

## Certificates

We use Xcode's auto-codesigning. It should magically "just work" if you log in to Xcode with an iTunes account
which is on the Artsy team.

We have [cert troubleshooting here](https://github.com/artsy/eigen/blob/master/docs/certs.md)

## Connecting a device

Xcode will prompt you to join a team, then to enable the device for development. If you have to choose a team, choose _Art.sY Inc._.

## Reading more

Learn about what things are architecturally [here](https://github.com/artsy/eigen/blob/master/docs/overview.md), then move [to the blog.](http://artsy.github.io/blog/categories/eigen/) for more in-depth discussions on Eigen.
