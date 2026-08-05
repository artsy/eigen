# Release candidate code freeze

Mobile releases are risky, so we QA a build before submitting it to the stores. With many people
contributing to eigen, `main` keeps moving while we QA — so if we cut a fresh build from `main` every
time a bug fix lands, we would have to restart QA against new, untested code. Instead we freeze the
release on a dedicated release-candidate branch, QA the build from that branch, and cherry-pick only
the launch-blocking fixes into it.

This is the branch mechanics only. The captain's process — QA, triage, Applause, submission — is in
[Release Captain Tasks 🔐](https://www.notion.so/artsy/Release-Captain-Tasks-7ca3e6f5d16e41079a1fb1b1706bd018).

# The branch is created for you

On code-freeze day the [release-lookout](https://github.com/artsy/release-lookout) bot cuts
`rc-v<version>` from `main` and opens a `chore(release): v<version> RC` PR, labelled "Do not merge".
That PR is the code freeze: the branch does not move except for cherry-picks, so the build we QA is
the build we submit. Opening it also triggers
[`rc-release-automation.yml`](../.github/workflows/rc-release-automation.yml), which builds the betas
off the RC branch.

Don't create the branch by hand unless the bot failed — the automation keys off the `rc-v` prefix.

# Happy Path - No Launch Blocking Bugs Found

Submit the exact betas that were QA'd, from the release candidate branch:

```sh
./scripts/deploys/promote-beta-to-submission-ios
./scripts/deploys/promote-beta-to-submission-android
```

Fastlane creates and pushes the submission tags as part of these lanes.

# Unhappy Path - Launch Blockers found during QA

## Cherry pick the squashed merge commits for the bug fix(es) onto the release candidate branch

There is no second branch and no new PR — the fixes go onto the branch that is already frozen.

```sh
git fetch origin && git checkout rc-v<version>
git cherry-pick <fix-commit>
git push
```

## Create new betas from the release candidate branch

Communicate with other devs that a release candidate will be deployed and they should hold off on
deploying betas until a build is submitted for review.

`./scripts/deploys/deploy-beta-both`

## Do bug fix QA and some smoketests and release to the app store

Follow the instructions for [deploying to app store](deploy_to_app_store.md) and
[deploying to play store](deploy_to_play_store.md).

Make sure to QA the bug fix changes and test any code paths that may have been affected.

## Possibly bring back the fixes to main

The changes on the release-candidate branch might be cherry-picks only, or it might be new code.
Considering the release notes files are probably changed in that branch as well, it makes sense to
make a PR from that release-candidate branch to main, in order to get all the changes back to main.
This is a _different_ PR from the bot's "Do not merge" one, which stays open for tracking only.

## Slack thread for reference

Here is a thread from a previous time we did this:
[Slack Thread 🔐](https://artsy.slack.com/archives/C01B2P6LJUU/p1627916686040500)
