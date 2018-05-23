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

Before submitting to the App Store, the binary we submit *must* be tested *on-device*. Install the beta through Testflight and run through the following scenarios **on staging**:

- [ ] Review `CHANGELOG.yml` entries for the release and run through any parts of the app that seem appropriate.
- [ ] Check user registration and onboarding works.
- [ ] As a freshly created user, perform a smoke test of: 
  - [ ] Eigen's main tab view controllers (Home, Search, Inbox, and Favourites).
  - [ ] The artwork, artist, and auction view controllers.
  - [ ] Live Auctions interface (Use the `gravity-staging-create-auction-on-demand` Jenkins job to create a sale, it'll take five minute to open before the interface is accessible in Eigen).
- [ ] As a user with populated favourites, follows, etc, perform a smoke test of: 
  - [ ] Eigen's main tab view controllers (Home, Search, Inbox, and Favourites).
  - [ ] The artwork, artist, and auctions view controllers.
  - [ ] Live Auctions interface (see instructions above).
- [ ] Open a React Native view, then open a modal view controller (LAI interface, inquiry modal), and navigate back to the RN view. Make sure that [the screen isn't blank](https://github.com/artsy/eigen/issues/2439).
- [ ] Check that the app opens on the Home feed Works For You tab from a Works For You push notification (in gravity staging console, run `NewWorkPushService.notify_user(User.find_by(email: "YOUR_EMAIL@artsymail.com))`).
  - [ ] When app is running in the background
  - [ ] When app is completely inactive
- [ ] Check that the app opens with the correct conversation from a messaging push notification (find the "Invoicing Demo Partner" partner on [Vibrations](https://github.com/artsy/volt) staging, publish one one of their artworks, find it in the app, inquire on it as a non-admin, and reply to the conversation from [Volt](https://github.com/artsy/volt) to trigger a push).
  - [ ] When app is running in the background
  - [ ] When app is completely inactive
- [ ] After running the conversation push notification test and the conversation tab is populated, smoke test it.
- [ ] Check that the app opens on the correct artist page from a Safari (or other web browser) link (artsy.net/artist/someone)
  - [ ] When app is running in the background
  - [ ] When app is completely inactive
- [ ] Check that the app opens on the Home feed Works For You tab from a Works For You email (find one in your inbox) (note this is currently not working, [see this Jira ticket](https://artsyproduct.atlassian.net/browse/BUGS-176)).
  - [ ] When app is running in the background
  - [ ] When app is completely inactive
- [ ] Check that the app opens on the correct Auctions home tab when opened from a sale-opening push notification (in gravity staging console, run `NewSalePushService.notify_user(User.find_by(email: "YOUR_EMAIL@artsymail.com").id, Artist.sample(3).map(:&), 4)`).
  - [ ] When app is running in the background
  - [ ] When app is completely inactive


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
