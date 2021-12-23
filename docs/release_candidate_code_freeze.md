# Release candidate code freeze

Due to the risky nature of mobile app releases we do a fair bit of QA on our builds before submitting them to the app store. With many developers contributing to Eigen this can present a problem. If we find a bug that needs to be fixed before launch chances are while we are fixing it other code will get into the main branch besides the bug fix. If we create a new release candidate from the main branch this code also presents a risk and to be thorough we really should kick off the QA process again. This can create a constant moving target issue and cause delayed releases and take up a fair amount of engineering time. We could pause PR merging until the bug(s) are fixed but this would be needlessly disruptive to teams contributing to Eigen. What we can do instead is utilize git tags to have a pseudo code freeze on the release candidate.

# Happy Path - No Launch Blocking Bugs Found

If there are no launch blocking bugs found during QA this means the release candidate is set to be submitted to the app store and google play store.
In the QA scripts for this release candidate you can find the version and build numbers for both the Android and iOS versions of the release candidate.
Run our fastlane script to promote these _exact_ versions to the stores

`TODO: Add fastlane script example when ready`

# Unhappy Path - Launch Blockers found during QA

Follow our instructions LINK INSTRUCTIONS for assigning DRIs to the launch blockers and wait for PRs to come in.

## Check out the tag corresponding with the release candidate version number

Whenever we create a beta we create a corresponding git tag as part of the submission that will correspond to the build number of the submission and marks the state in the repo when the beta was submitted. For our example let's say our release candidate build is 6.4.4 (2020.5.11.15)
We will want to checkout the tag 6.4.4-2020.5.11.15:

`git checkout 6.4.4-2020.5.11.15`

## Create and checkout a branch for the new release candidate

`git checkout -b brian/6.4.4-release-candidate`

## Cherry pick the squashed merge commits for the bug fix(es) into your branch

`git cherry-pick <fix-commit>`

Push up the branch for posterity:

`git push`

## Create new betas from your branch

Communicate with other devs that a release candidate will be deployed and they should hold off on deploying betas until a build is submitted for review.

`./scripts/deploy-both`

## Do bug fix QA and some smoketests and release to the app store

Follow the instructions for [deploying to app store](https://github.com/artsy/eigen/blob/main/docs/deploy_to_app_store.md) and [deploying to play store](https://github.com/artsy/eigen/blob/main/docs/deploy_to_play_store.md).

Make sure to QA the bug fix changes and test any code paths that may have been affected.

## Possibly bring back the fixes to main

The changes on the release-candidate branch might be cherry-picks only, or it might be new code. Considering the release notes files are probably changed in that branch as well, it makes sense to make a PR from that release-candidate branch to main, in order to get all the changes back to main.

## Slack thread for reference

Here is a thread from a previous time we did this:
https://artsy.slack.com/archives/C01B2P6LJUU/p1627916686040500

## Example PR

https://github.com/artsy/eigen/pull/5365
