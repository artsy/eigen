# Deploy to Play Store

PlayStore builds have to go through the beta process first. [Check out the beta docs](./deploy_to_beta.md) for more info.

## Test the Beta

Eigen's beta pre-submission checklist has [moved into Notion](https://www.notion.so/artsy/Pre-submission-QA-Checklist-785e3233fdcf423f95ee239ab3c22ec3).

## Preparing to Ship a Final Version

1. Update [`changelogs/default.txt`](https://github.com/artsy/eigen/blob/master/fastlane/metadata/android/en-US/changelogs/default.txt) with the **user-facing** release notes for this version.
   - See [previous examples](https://github.com/artsy/eigen/commits/master/fastlane/metadata/android/en-US/changelogs/default.txt) of release notes.
   - Share the notes with the #product-collector-experience channel in Slack for feedback.
   - Commit & push the changes.
1. Run `./scripts/promote-beta-to-submission-android`. This will submit the **most recent beta** for App Store review
