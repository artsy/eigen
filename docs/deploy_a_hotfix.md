# Deploy a hotfix build

Occasionally a bug is found in a live release that requires a quick mitigation. For these cases we can deploy a build outside our normal release cadence with _only_ the critical bug fix added.

There are 2 methods of deploying hot fixes depending on the issue:

1. **Expo Updates (js) Releases**: If the issue only affects javascript code we can deploy a hotfix with Expo updates and users will get the update automatically on the next run of the app.

2. **Native Releases**: If the issue affects native code we must deploy new build and send through the app review process as normal. Note this build will still need to go through the review process and user's will need to update so this is only a mitigation not an immediate fix. If a faster release is necessary you can request an expedited review for the app store but this should be done sparingly and is not guaranteed to be approved. Google Play does not offer expedited reviews but their review process is typically faster.

## Get the release files and environment variables

Run:

```
yarn setup:releases
```

## Check out the tag corresponding with the last release of Eigen

All our live release versions should have a corresponding tag in git that will end in `-submission`.

You can find the latest release tags using the script:

`./scripts/deploys/latest-submissions`

This will output the latest submission tags:

```
Latest iOS submission: ios-8.34.0-2024.03.07.11-submission
Latest Android submission: android-8.34.0-1674645623-submission
```

If it was a typical release they should be equivalent code and you should be safe to choose one, but if you have doubts you can confirm in the compare view in github.

For our example let's say our last released build is `7.2.0 (2022.2.3.14)`
We will want to checkout the tag `ios-7.2.0-2022.02.03.14-submission`:

`git checkout ios-7.2.0-2022.02.03.14-submission`

## Create a branch for the hotfix

`git branch 7.2.0-hotfix`

`git checkout 7.2.0-hotfix`

## Apply the fix(es) using the script

Get the commit hash for the bug fix you want to release in the hotfix. If it was merged into main you want the hash of the merge commit.
You can find it in the github ui or by checking out main after the merge and running `git log --oneline`.

Run the script `./scripts/deploys/expo-updates/apply-fix <commit-hash>`
Passing the commit hash of the fix, if there are multiple you can run multiple times.

If you see output like: `Warning: native code changed you cannot use expo updates for this hotfix, please follow the native beta deployment steps.`
The changes affected native code and cannot be deployed through codepush, please follow the `Native release hotfix process` section of this document.
Otherwise follow the steps in `Expo updates release hotfix process`.

> [!IMPORTANT]
> Expo Updates is not yet available for hotfixes, please follow the `Native release hotfix process`

<details>
  <summary>Expo updates release hotfix process</summary>

## Check if there is already a hot fix targeting this app version

Ask #practice-mobile if anything has been deployed as a hot fix previously targeting this app version. If so you will want to pull the commits in from this hot fix to your branch to make sure all fixes are present.

## Install dependencies

Since the branch you are on is older than main it is likely some node deps are out of date locally. You will need to update your local deps otherwise the
deployment to expo updates will fail.

`yarn setup:artsy`

`yarn install:all`

You will also need the release vars and bin deps:

```
yarn setup:releases
./scripts/setup/install-bin
```

You will need to be logged in to the `artsy_mobile` account, credentials in 1pass:

`./bin/node_modules/.bin/eas login`

> ⚠️ **IMPORTANT:** If the install results in changes to Podfile.lock you must do a Native Release Hotfix. Please refer to that section of the docs.

## Deploy your change to expo updates canary channel

Let `#practice-mobile` know you will be deploying a hotfix and to hold off deploying to expo updates or betas.

Run the script to deploy the hotfix to the canary channel:
`./scripts/deploys/expo-updates/deploy-to-expo-updates 'canary' 'hotfix description'`

## Test your update in the firebase equivalent of the production app

Find and download the equivalent build in firebase app tester to the production app, it should have the same build number as the latest submissions found in step 1.

Enable the dev menu and download the expo updates bundle from the staging deployment.
Test that the fix is working as intended and do some basic QA to make sure the app is functioning correctly.

## Deploy the update to production

If QA goes well run the script to promote the bundle to production.
Make sure to monitor the app as it rolls out to users.

> ⚠️ **IMPORTANT:** This will deploy the code from your local branch to production. Make sure you are on the branch with the changes you want to deploy and _only_ the changes you want to deploy!

`./scripts/deploys/expo-updates/deploy-to-production <rollout_percentage>`

For example if you wanted to rollout to 50% of users you would pass `50` for rollout_percentage. If it is critical to get the fix out fast
you can pass `100` otherwise it is suggested you pass `50` and monitor before updating to 100%.

### Update rollout

If all looks good with the fix you can update the rollout to all users:

`./scripts/deploys/expo-updates/update-rollout`

This will start an interactive dialog where you can choose the release you want to update the rollout for. Remember to update for both iOS and Android!

</details>

<details>
  <summary>Native release hotfix process</summary>

## Update the version number of the app to match next release

Since the hotfix branch is a past release the app version will need to be updated to submit to Apple and Google Play. The next release version can be found in app store connect and is generally the previous release's version number incremented by 1. In this example it is 7.2.1

`./scripts/deploys/next`

`What is the new human-readable release version? 7.2.1`

Commit the version changes.

`git add -A`

`git commit -m "Update version for hotfix"`

## Deploy a beta with the hotfix

Communicate with other devs that a hotfix will be deployed and they should hold off on deploying betas until a build is submitted for review.

`./scripts/deploys/deploy-beta-both` (or `./scripts/deploys/deploy-beta-ios` or `./scripts/deploys/deploy-beta-android` for individual releases)

## Run through QA script and release to the app store

Follow the instructions for [deploying to app store](https://github.com/artsy/eigen/blob/main/docs/deploy_to_app_store.md) and [deploying to play store](https://github.com/artsy/eigen/blob/main/docs/deploy_to_play_store.md).

Make sure to QA the bug fix changes and run through the QA script before releasing to users.

</details>

## Gotchas and FAQS

**The expo update was deployed but I am still not seeing my app update. What's going on?**

Updates aren't instant in mobile, even with expo updates, but users on the latest should get updated over a few days automatically with the rollout. If you want to try to force the update you can make sure you are on the latest version of the app in the app store and then kill and restart your app.

**I want to deploy to expo-updates and target multiple versions to get more users updated. How do I do that?**

You probably should not, expo updates will prioritize the latest mandatory update so releasing multiple will affect roll outs of the others and slow down how fast fixes get to users. Most users will update fairly quickly once a release is rolled out completely so it is best to target the latest and wait in most cases. If something is critical we can talk about options in the #practice-mobile channel. Most things are not critical and remember we do releases every 2 weeks.

**The latest version of the app is still rolling out so many users won't get updated if we target the latest with expo updates. What do I do?**

You have a couple options, check metrics for latest release:

**Option 1 - if things look stable**:

- Update the rollout in play store and app store to release the app to all users
- Send out your update targeting the latest release as usual and users should get updated over the next few days

**Option 2 - if things look unstable**:

- Halt the rollout of the latest release
- Do a native hotfix release fixing instability and the issue being addressed
