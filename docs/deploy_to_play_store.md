# Deploy to Play Store

Play Store builds have to go through the beta process first. [Check out the beta docs](./deploy_to_beta.md) for more info.

## Test the Beta

Eigen's beta pre-submission checklist has [moved into Notion](https://www.notion.so/artsy/Pre-submission-QA-Checklist-785e3233fdcf423f95ee239ab3c22ec3).

## Preparing to Ship a Final Version

1. Start a branch from master.
1. Update [`changelogs/default.txt`](https://github.com/artsy/eigen/blob/master/fastlane/metadata/android/en-US/changelogs/default.txt) with the **user-facing** release notes for this version.
   - See [previous examples](https://github.com/artsy/eigen/commits/master/fastlane/metadata/android/en-US/changelogs/default.txt) of release notes.
   - Share the notes with the #practice-mobile channel in Slack for feedback.
   - Commit, push the changes, make a PR from your branch to master.
1. Run `./scripts/promote-beta-to-submission-android`. This will submit the **most recent beta** for Playstore Store review

## Release to Play Store

Our Play Store releases are done manually and are available to users **immediately**. Google might review the app later, but it's not a requirement to publish a release. Don't release unless you are available over the next few hours to monitor Sentry for errors.

1. Go to [Google Play Console](https://play.google.com/console/u/1/developers/6449739225222972501/app/4975007939329818983/tracks/production).
1. Select the version.
1. Hit "Release this Version" button. It might take several hours for the new version to propagate through the Play Store to users. // TODO: is that step right?
1. Monitor [Sentry](https://sentry.io/artsynet/eigen/) in the #practice-mobile channel on Slack for any errors (all production errors are sent to Slack when they first occur).
1. Make sure to tell all your dev friends over at [#dev](https://artsy.slack.com/archives/C02BC3HEJ)!

## Prepare for the Next Release

1. Run `./scripts/next`. This prompts for the next version number.
1. Move the release from `upcoming` to `releases` in `CHANGELOG.yml` and add a new, empty entry under `upcoming`. Make sure the `date` is accurate. [Here is a previous commit](https://github.com/artsy/eigen/commit/580db98fa1165e01f81070e9bbc77598a47bcfc9#diff-96801928eca93eea4a5b44f359b868b5).
1. Add and commit the changed files, typically with `-m "Preparing for development, version X.Y.Z."`.
1. PR your changes back into the `master` branch.
