# Deploy a hotfix build

Occasionally a bug is found in a live release that requires a quick mitigation. For these cases we can deploy a build outside our normal release cadence with _only_ the critical bug fix added. Note this build will still need to go through the review process and user's will need to update so this is only a mitigation not an immediate fix. If a faster release is necessary you can request an expedited review for the app store but this should be done sparingly and is not guaranteed to be approved. Google Play does not offer expedited reviews but their review process is typically faster.

## Check out the tag corresponding with the last release of Eigen

All our live release versions should have a corresponding tag in git that will end in `-submission`.
The exact build version and number can be found in app store connect. Android will have a similar tag,
but unless we had an unusual release they should be equivalent. You can double check in the compare view
in github but you should be safe to choose one.
Ask for help in `#mobile-practice` if you have trouble finding this
information.

For our example let's say our last released build is `7.2.0 (2022.2.3.14)`
We will want to checkout the tag `ios-7.2.0-2022.02.03.14-submission`:

`git checkout ios-7.2.0-2022.02.03.14-submission`

## Create a branch for your hotfix

`git branch 7.2.0-hotfix`

`git checkout 7.2.0-hotfix`

## Cherry-pick the pr with the fix

`git cherry-pick <hot-fix-commit-hash>`

## Update the version number of the app to match next release

Since the hotfix branch is a past release the app version will need to be updated to submit to Apple and Google Play. The next release version can be found in app store connect and is generally the previous release's version number incremented by 1. In this example it is 7.2.1

`./scripts/next`

`What is the new human-readable release version? 7.2.1`

Commit the version changes.

`git add -A`

`git commit -m "Update version for hotfix"`

## Deploy a beta with the hotfix

Communicate with other devs that a hotfix will be deployed and they should hold off on deploying betas until a build is submitted for review.

`./scripts/deploy-both` (or `./scripts/deploy-ios` or `./scripts/deploy-android` for individual releases)

## Run through QA script and release to the app store

Follow the instructions for [deploying to app store](https://github.com/artsy/eigen/blob/main/docs/deploy_to_app_store.md) and [deploying to play store](https://github.com/artsy/eigen/blob/main/docs/deploy_to_play_store.md).

Make sure to QA the bug fix changes and run through the QA script before releasing to users.
