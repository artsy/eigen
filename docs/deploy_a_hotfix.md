# Deploy a hotfix build

Occasionally a bug is found in an app store release that requires a quick mitigation. For these cases we can deploy a build outside our normal release cadence with _only_ the critical bug fix added. Note this build will still need to go through apples review process and user's will need to update so this is only a mitigation not an immediate fix. If a faster release is necessary you can request an expedited review but this should be done sparingly and is not guaranteed to be approved.

## Check out the tag corresponding with the last app store release of Eigen

All our app store release versions should have a corresponding tag in git.
The exact build version and number can be found in app store connect.
Ask an engineer on MX team if you have trouble finding this
information.

For our example let's say our last released build is 6.4.4 (2020.5.11.15)
We will want to checkout the tag 6.4.4-2020.5.11.15:

`git checkout 6.4.4-2020.5.11.15`

## Create a branch for your hotfix

`git branch 6.4.4-hotfix`

`git checkout 6.4.4-hotfix`

## Cherry-pick the pr with the fix

`git cherry-pick <hot-fix-commit-hash>`

## Update the version number of the app to match next release

Since the hotfix branch is a past release the app version will need to be updated to submit to apple. The next release version can be found in app store connect and is generally the previous release's version number incremented by 1. In this example it is 6.4.5

`make next`

`What is the new human-readable release version? 6.4.5`

## Update CHANGELOG.md

Our changelog is used to generate testflight notes and will need to be updated for this hotfix. Move the upcoming release (in this case 6.4.4) to releases section. Add an upcoming release for the next version to be deployed.

In this example the changelog should look something like this after the changes:

```
upcoming:
  version: 6.4.5
  date: TBD
  dev:
    -
  user_facing:
    - Fix for some critical bug

releases:
  - version: 6.4.4
    date: TBD
    dev:
```

Commit the version and changelog changes.

`git add -A`

`git commit -m "Update changelog and version for hotfix"`

## Deploy a beta with the hotfix

Communicate with other devs that a hotfix will be deployed and they should hold off on deploying testflights until a build is submitted for review.

`make deploy`

## Run through QA script and release to the app store

Follow the instructions for [deploying to app store](https://github.com/artsy/eigen/blob/master/docs/deploy_to_app_store.md).

Make sure to QA the bug fix changes and run through the QA script before releasing to users.
