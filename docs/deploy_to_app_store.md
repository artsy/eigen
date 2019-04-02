# Deploy to App Store

## Pre-deploy Checklist

1. Check out Eigen Artsy master.
1. Ensure all required/expected analytics events are in `CHANGELOG.yml`.
1. Run `make appstore`. This runs `pod install` and prompts for a release version number.
1. Update `CHANGELOG.yml` with the release number and date.
1. Add and commit the changed files, typically with `-m "Preparing for the next release, version X.Y.Z."`. PR the change.
1. Once merged, pull from master and run `make deploy`.

It takes about 45 minutes for [Circle CI](https://circleci.com/gh/artsy/eigen) to build and submit a binary (and for AppStoreConnect to process it). You'll be notified via email (and push notification, if you have the [iTunesConnect iOS app](https://itunes.apple.com/us/app/itunes-connect/id376771144?mt=8) installed.

## Test the Beta

Eigen's beta pre-submission checklist has [moved into Notion](https://www.notion.so/artsy/Pre-submission-QA-Checklist-785e3233fdcf423f95ee239ab3c22ec3).

## Preparing to Ship a Final Version

1. You'll need to update the release notes in `/fastlane/metadata/common/release_notes.txt`.
1. Then, run `make promote_beta_to_submission`.

### What about IDFA?

We _do_ use the IDFA to attribute app installations to previously service advertisements. This should be handled for you.

## Release to App Store

Our App Store releases are done manually, instead of automatically once Apple approves the app. Don't release unless you are available over the next few hours to monitor Sentry for errors.

1. Go to [AppStoreConnect](https://appstoreconnect.apple.com).
1. Navigate to Eigen.
1. Select the version.
1. Hit "Release this Version" button.
1. Monitor [Sentry](https://sentry.io/artsynet/eigen/) in the #front-end channel on Slack for any errors (all production errors are sent to Slack when they first occur).

## Prepare for the Next Release

1. Run `make next`. This runs `pod install` and prompts for the next version number.
1. Create a new version of the app in AppStoreConnect (if you don't do this, beta deployments will fail).
1. Move the release from `upcoming` to `releases` in `CHANGELOG.yml` and add a new, empty entry under `upcoming`.
1. Add and commit the changed files, typically with `-m "Preparing for development, version X.Y.Z."`. PR the changes.
