## Deploy to App Store

### Pre-deploy Checklist

1. Check out Eigen Artsy master.
1. Ensure all required/expected analytics events are in `CHANGELOG.yml`.
1. Run `make appstore`. This runs `pod install` and prompts for a release version number.
1. Update `CHANGELOG.yml` with the release number and date.
1. Add and commit the changed files, typically with `-m "Preparing for the next release, version X.Y.Z."`. PR the change.
1. Once merged, pull from master and run `make deploy`.

It takes about 45 minutes for [Circle CI](https://circleci.com/gh/artsy/eigen) to build and submit a binary (and for iTunesConnect to process it). You'll be notified via email (and push notification, if you have the [iTunesConnect iOS app](https://itunes.apple.com/us/app/itunes-connect/id376771144?mt=8) installed.

### Test the Beta

Before submitting to the App Store, the binary we submit *must* be tested *on-device*. Install the beta through Testflight and run through the following scenarios:

- [ ] Check user registration and onboarding works.
- [ ] Test the inqury flow. As an Artsy admin, you will be prevented from _actually_ sending an inquiry.
- [ ] As a freshly created user, perform a smoke test of: 
  - [ ] Eigen's main tab view controllers (Search, Home, Explore, You, Notifications).
  - [ ] The artwork, artist, and auctions view controllers.
  - [ ] Live Auctions interface.
- [ ] As a user with populated favourites, follows, etc, perform a smoke test of: 
  - [ ] Eigen's main tab view controllers (Search, Home, Explore, You, Notifications).
  - [ ] The artwork, artist, and auctions view controllers.
  - [ ] Live Auctions interface.
- [ ] Review `CHANGELOG.yml` entries for the release and run through any parts of the app that seem appropriate.
- [ ] Open a React Native view, then open a modal view controller (LAI interface, inquiry modal), and navigate back to the RN view. Make sure that [the screen isn't blank](https://github.com/artsy/eigen/issues/2439).

It is *critical* that we catch bugs before we submit to the App Store. If a bug gets out, it can take days or weeks for Apple to review any fix. As the submitter, you are the last line of defence – the whole team is counting on you.

### Prepare in iTunesConnect

1. You need to have copy for the next release, for minor releases this is just a list of notable changes.
1. Log in to [iTunesConnect](https://itunesconnect.apple.com) as it@artsymail.com (team _Art.sy Inc_).
1. Manage Your Apps > Which-ever app > select the version.
1. Fill in the copy for each localization.
1. Add "what's new in this version" information.
1. About halfway down the page, select the binary to submit, and save your changes.
1. Click 'Submit for Review'. Then answer the subsequent questions as follows:
  * Have you added or made changes to encryption features since your last submission of this app?: *NO*
  * Does your app contain, display, or access third-party content?: *YES*
  * Do you have all necessary rights to that content […]?: *YES*
  * Does this app use the Advertising Identifier (IDFA)?: *NO*

### Release to App Store

Our App Store releases are done manually, instead of automatically once Apple approves the app. Don't release unless you are available over the next few hours to monitor Sentry for errors.

1. Go to [iTunesConnect](https://itunesconnect.apple.com).
1. Navigate to Eigen.
1. Select the version.
1. Hit "Release this Version" button.
1. Monitor [Sentry](https://sentry.io/artsynet/eigen/) in the #front-end channel on Slack for any errors (all production errors are sent to Slack when they first occur).

### Prepare for the Next Release

1. Run `make next`. This runs `pod install` and prompts for the next version number.
1. Create a new version of the app in iTunesConnect (if you don't do this, beta deployments will fail).
1. Move the release from `upcoming` to `releases` in `CHANGELOG.yml` and add a new, empty entry under `upcoming`.
1. Add and commit the changed files, typically with `-m "Preparing for development, version X.Y.Z."`. PR the changes.
