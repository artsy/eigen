# Deploy to Play Store

Play Store builds have to go through the beta process first. [Check out the beta docs](./deploy_to_beta.md) for more info.

## Test the Beta

QA happens against the release-candidate beta, in the Mobile App QA document that CI creates for each release. The full runbook is [Release Captain Tasks 🔐](https://app.notion.com/p/artsy/Release-Captain-Tasks-3b3cab0764a08079bba8ffd86843072a); see also [release candidate code freeze](release_candidate_code_freeze.md) for the branch mechanics.

## Ship a Final Version

1. Check out the release-candidate branch for this release (eg - `rc-v9.15.0`). Everything for the release lives on that branch so the code we submit is the code we QA'd.
1. Update [`changelogs/default.txt`](https://github.com/artsy/eigen/blob/main/fastlane/metadata/android/en-US/changelogs/default.txt) with the **user-facing** release notes for this version.
   - See [previous examples](https://github.com/artsy/eigen/commits/main/fastlane/metadata/android/en-US/changelogs/default.txt) of release notes.
   - The release notes are gathered in a #practice-mobile thread the day before code freeze; ask there for a final copy if anything is unclear.
   - Commit and push to the release-candidate branch.
1. Run `./scripts/deploys/promote-beta-to-submission-android`. This submits the **most recent Android beta** for Play Store review — so make sure the most recent beta is the one you QA'd, i.e. that nobody deployed a beta off `main` after the release candidate was built. Check with `./scripts/deploys/latest-betas` if you're unsure. Fastlane tags the submission (`android-<version>-<code>-submission`) and pushes the tag as part of this lane.
1. Warning: the Android app will be released automatically once reviewed by Google. Don't release unless you are available over the next few hours to monitor Sentry for errors.

## Check on Play Store Release

Our Play Store releases are released **automatically** once reviewed. Don't release unless you are available over the next few hours to monitor Sentry for errors.

1. Go to [Google Play Console 🔐](https://play.google.com/console/u/1/developers/6449739225222972501/app/4975007939329818983/tracks/production).
1. Select the right version of the app from the list. To make sure check the `Last updated` date.
   ![image](https://user-images.githubusercontent.com/17421923/158804276-6be13ef1-1713-4b1f-9a2f-1be4d24d6d15.png)
1. Check the update status of the app. It should initially be `In Review`
   ![image](https://user-images.githubusercontent.com/17421923/158804488-1df28736-b9cc-481a-b027-f4cd941f25d8.png)
1. It might take several hours for the new version to propagate through the Play Store to users.
1. Monitor [Sentry 🔐](https://sentry.io/artsynet/eigen/) in the #practice-mobile channel on Slack for any errors (all production errors are sent to Slack when they first occur).
1. Make sure to tell all your dev friends over at [#dev 🔐](https://artsy.slack.com/archives/C02BC3HEJ)!

## Staged Rollout

Android releases go out to a fraction of users first. `./scripts/deploys/update-android-rollout-if-needed` runs nightly on CI (the `nightly` workflow in `.circleci/config.yml`) and bumps the rollout percentage for you as the release proves stable — you do not normally need to touch it. If you released manually, or the rollout looks stuck, bump it yourself with "Update rollout" in the Play Console.

## Prepare for the Next Release

**This is normally automatic** — `./scripts/deploys/create-next-version-if-needed` runs nightly on CI and opens the version-bump PR, announced in #practice-mobile. Merge that PR and you're done.

<details>
<summary>Manual fallback</summary>

1. Run `./scripts/deploys/next`. This prompts for the next version number.
1. Add and commit the changed files, typically with `-m "Preparing for development, version X.Y.Z."`.
1. PR your changes back into the `main` branch.

</details>
