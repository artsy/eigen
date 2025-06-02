## Deploying to Expo Updates

In order to allow faster testing for typescript changes on real devices you can deploy your changes to [expo updates](https://docs.expo.dev/versions/latest/sdk/updates/).

### Prerequisites

You will need to have the latest beta downloaded from firebase in order to run expo updates. If you need help getting access please ask in the **#practice-mobile** channel.

You will need the release environment vars to deploy to expo updates:

```
yarn setup:releases
```

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

### Using in app

In the latest beta from firebase open Dev Menu -> Expo Updates -> Select your channel (e.g. Canary). The app will exit. Reopen the app and your changes should be running.
