## Deploy to App Store

### TODOs for anyone before deploying

1. Check out eigen Artsy master.
2. Ensure all required/expected analytics events are in `docs/BETA_CHANGELOG.md`.
3. Move `docs/BETA_CHANGELOG.md` to `CHANGELOG.md`.
4. Remove dev only entries from `CHANGELOG.md`.
5. Run `make appstore`. This runs `pod install` and prompts for a release version number.
6. Update CHANGELOG with the release number.
7. Add and commit the changed files, typically with `-m "Preparing for the next release, version X.Y.Z."`.

### Provisioning Profiles

Open the project in Xcode, click on the Artsy project.

1. Change iOS Deployment Target to "iPhone only" in Info, Deployment Target.
2. Verify that the provisioning profiles under Code Signing are displayed as below in Build Settings.

IMPORTANT: We use the "Artsy Inc Account" not "ARTSY INC" - which is our enterprise account.

![](../Web/prov-profiles.png)

The provisioning profile should be _"Artsy Mobile - App Store DistrProfile"_ and when the Code Signing ( which should be automatic ) is clicked it should show  "_iPhone Distribution : Art.sy Inc"_

If you don't see the "Artsy Mobile - App Store DistrProfile" in the options above, import the Dev/Apple/Artsy AppStore Identities from the Artsy Engineering Operations 1Password vault.

If you cannot set Code Signing Identity to "Automatic", under which you'll find "iPhone Distribution: Artsy Inc.", open Xcode Preferences and add it@artsymail.com as an apple account. Also, choose the it@artsymail.com apple ID, click "Artsy Inc." and then refresh until you see two iOS Distribution signing identities, one that says "iOS Distribution (2)".

See [certs.md](certs.md) for more info on certificates.

### Prepare in iTunes Connect

1. You need to have copy for the next release, for minor releases this is just a list of notable changes.
2. Log in to [iTunes Connect](https://itunesconnect.apple.com) as it@artsymail.com ( team _Art.sy Inc_ ).
3. Manage Your Apps > Which-ever app > Add new version.
4. Fill in the copy for each localization.

### Release to AppStore

1. Install HockeyApp from http://hockeyapp.net/apps and run it.
2. In Xcode, change the target device to _iOS Device_.
3. In Xcode, hold alt (`⌥`) and go to the menu, hit _Product_ and then _Archive..._.
4. Check that the Build Configuration is set to _Store_.
5. Hit _Archive_.
6. Hit _Distribute_, it will run validations and submit.

### Upon Successful Submission

1. Return to iTunes Connect and click ‘Submit for Review’. Then answer the subequent questions as follows:
  * Have you added or made changes to encryption features since your last submission of this app?: NO
  * Does your app contain, display, or access third-party content?: YES
  * Do you have all necessary rights to that content […]?: YES
  * Does this app use the Advertising Identifier (IDFA)?: NO
3. HockeyApp will automatically see your new archive. Push Archived build to HockeyApp as a live build.
4. Make a git tag for the version with `git tag x.y.z`. Push the tags to `artsy/eigen` with `git push --tags`.

### Prepare for the Next Release

1. Run `make next`. This runs `pod install` and prompts for the next version number.
2. Add a new section to CHANGELOG called _Next_.
3. Add and commit the changed files, typically with `-m "Preparing for development, version X.Y.Z."`.
