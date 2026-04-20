# Setting up eigen after a long time of not using it

## Setup

```sh
yarn setup:artsy # this is `yarn setup:oss` if you're not working at Artsy
yarn install:all
yarn relay
```

### In case of Pod errors:

You might encounter some Pod errors, i.e.:

```sh
[!] Unable to find the `FlipperKit` repo. Please update the CocoaPods cache by running `pod repo update`.
```

in that case, you can try to run the following commands:

```sh
cd ios && bundle exec npx pod-install
```

This will update the stale pods on your local environment.

## Running on iOS

```sh
yarn ios
```

This will use a cached build if one is available. To force a full rebuild, use `yarn ios:no-cache`.

Alternatively, you can open Xcode with `yarn open-xcode`, clean the project with <kbd>⌘ cmd</kbd> + <kbd>⇧ shift</kbd> + <kbd>K</kbd> and then press the play button to run the app.

## Running on Android

```sh
yarn android
```

This will build the app locally, if you want to use a cached build if one is available run `yarn android:cached`.
