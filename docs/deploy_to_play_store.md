# Deploy to Play Store

Play Store builds have to go through the beta process first. [Check out the beta docs](./deploy_to_beta.md) for more info.

## Test the Beta

Eigen's beta pre-submission checklist has [moved into Notion](https://www.notion.so/artsy/Pre-submission-QA-Checklist-785e3233fdcf423f95ee239ab3c22ec3).

## Ship a Final Version

1. Checkout to the release branch (eg - release/7.3.1)
1. Update [`changelogs/default.txt`](https://github.com/artsy/eigen/blob/main/fastlane/metadata/android/en-US/changelogs/default.txt) with the **user-facing** release notes for this version.
   - See [previous examples](https://github.com/artsy/eigen/commits/main/fastlane/metadata/android/en-US/changelogs/default.txt) of release notes.
   - Share the notes with the #practice-mobile channel in Slack for feedback.
   - Commit, push the changes, make a PR from your branch to main.
1. Run `./scripts/promote-beta-to-submission-android`. This will submit the **most recent beta** for Playstore Store review.
1. Warning: the Android app will be released automatically once reviewed by Google. Don't release unless you are available over the next few hours to monitor Sentry for errors.

## Check on Play Store Release

Our Play Store releases are released **automatically** once reviewed. Don't release unless you are available over the next few hours to monitor Sentry for errors.

1. Go to [Google Play Console](https://play.google.com/console/u/1/developers/6449739225222972501/app/4975007939329818983/tracks/production).
1. Select the right version of the app from the list. To make sure check the `Last updated` date.
   ![image](https://user-images.githubusercontent.com/17421923/158804276-6be13ef1-1713-4b1f-9a2f-1be4d24d6d15.png)
1. Check the update status of the app. It should initially be `In Review`
   ![image](https://user-images.githubusercontent.com/17421923/158804488-1df28736-b9cc-481a-b027-f4cd941f25d8.png)
1. It might take several hours for the new version to propagate through the Play Store to users.
1. Monitor [Sentry](https://sentry.io/artsynet/eigen/) in the #practice-mobile channel on Slack for any errors (all production errors are sent to Slack when they first occur).
1. Make sure to tell all your dev friends over at [#dev](https://artsy.slack.com/archives/C02BC3HEJ)!

## Prepare for the Next Release

1. Run `./scripts/next`. This prompts for the next version number.
1. Add and commit the changed files, typically with `-m "Preparing for development, version X.Y.Z."`.
1. PR your changes back into the `main` branch.
