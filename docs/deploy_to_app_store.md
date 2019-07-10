# Deploy to App Store

AppStore builds have to go through the beta process first. [Check out the beta docs](./deploy_to_beta.md) for more info.

## Test the Beta

Eigen's beta pre-submission checklist has [moved into Notion](https://www.notion.so/artsy/Pre-submission-QA-Checklist-785e3233fdcf423f95ee239ab3c22ec3).

## Preparing to Ship a Final Version

1. Update [`release_notes.txt`](https://github.com/artsy/eigen/blob/master/fastlane/metadata/en-US/release_notes.txt) with the **user-facing** release notes for this version. Commit the changes.
1. Run `make promote_beta_to_submission`. This will submit the **most recent beta** for App Store review

### What about IDFA?

We _do_ use the IDFA to attribute app installations to previously service advertisements. This should be handled for you.

## Release to App Store

Our App Store releases are done manually, instead of automatically once Apple approves the app. Don't release unless you are available over the next few hours to monitor Sentry for errors.

1. Go to [AppStoreConnect](https://appstoreconnect.apple.com).
1. Navigate to Eigen.
1. Select the version.
1. Hit "Release this Version" button. It will take several hours for the new version to propagate through the AppStore to users.
1. Monitor [Sentry](https://sentry.io/artsynet/eigen/) in the #front-end channel on Slack for any errors (all production errors are sent to Slack when they first occur).

## Prepare for the Next Release

1. Create a new version of the app in AppStoreConnect (if you don't do this, beta deployments will fail).
  - Go to "My Apps", click Eigen ("Artsy: Buy & Sell Original Art"), click "+ version or platform", click "iOS", and enter version number.
1. Run `make next`. This prompts for the next version number. **Use the same version** as the previous step.
1. Move the release from `upcoming` to `releases` in `CHANGELOG.yml` and add a new, empty entry under `upcoming`. Make sure the `date` and `emission_version` entries are accurate. [Here is a previous commit](https://github.com/artsy/eigen/commit/580db98fa1165e01f81070e9bbc77598a47bcfc9#diff-96801928eca93eea4a5b44f359b868b5).
1. Add and commit the changed files, typically with `-m "Preparing for development, version X.Y.Z."`.
1. Run `make deploy` to trigger a new beta. (When we add a new version, the first beta goes through additional TestFlight review by Apple. By trigger the beta now, we go through that review early, and avoid delaying future QA sessions.)
1. PR your changes back into the `master` branch.
