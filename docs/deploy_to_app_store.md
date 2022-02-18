# Deploy to App Store

App Store builds have to go through the beta process first. [Check out the beta docs](./deploy_to_beta.md) for more info.

## Test the Beta

Eigen's beta pre-submission checklist has [moved into Notion](https://www.notion.so/artsy/Pre-submission-QA-Checklist-785e3233fdcf423f95ee239ab3c22ec3).

## Preparing to Ship a Final Version

1. Start a branch from main.
1. Update [`release_notes.txt`](https://github.com/artsy/eigen/blob/main/fastlane/metadata/en-US/release_notes.txt) with the **user-facing** release notes for this version.
   - See [previous examples](https://github.com/artsy/eigen/commits/main/fastlane/metadata/en-US/release_notes.txt) of release notes.
   - Share the notes with the #practice-mobile channel in Slack for feedback.
   - Commit, push the changes, make a PR from your branch to main.
1. Run `./scripts/promote-beta-to-submission-ios`. This will submit the **most recent beta** for App Store review

### What about IDFA?

We _do_ use the IDFA to attribute app installations to previously service advertisements. This should be handled for you.

## Release to App Store

Our App Store releases are done manually, instead of automatically once Apple approves the app. Don't release unless you are available over the next few hours to monitor Sentry for errors.

> _When the app is approved for release, a slack message is sent to notify the #practice-mobile channel and an email from Apple Store Connect is sent to mobile [at] artsymail [dot] com_

1. Run `./scripts/release-ios-app`
2. Monitor [Sentry](https://sentry.io/artsynet/eigen/) in the #practice-mobile channel on Slack for any errors (all production errors are sent to Slack when they first occur).
3. Make sure to let the team know over at [#dev](https://artsy.slack.com/archives/C02BC3HEJ)!. Don't forget to thank everyone who contributed 💜

## Prepare for the Next Release

1. Run `./scripts/next`. This prompts for the next version number. **Use the same version as the previous step**.
2. Add and commit the changed files, typically with `-m "Preparing for development, version X.Y.Z."`.
3. Run `./scripts/deploy-ios` to trigger a new beta. (When we add a new version, the first beta goes through additional TestFlight review by Apple. By trigger the beta now, we go through that review early, and avoid delaying future QA sessions.)
4. PR your changes back into the `main` branch.
