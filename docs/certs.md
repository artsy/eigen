### Certificates & Profiles

#### Dev

For running Eigen on the sim, you don't need to code sign.
To run Eigen on your phone, we use Xcode's [Automatic code signing](https://developer.apple.com/library/content/qa/qa1814/_index.html). You will need to join the Artsy Apple developer account, we use "Art.sy Inc" (we have another account, "ART SY" which is for enterprise).

You can find our shared admin account details in 1password.

#### Deploy

We use Fastlane with [match](https://docs.fastlane.tools/actions/match/) with all the details in [this repo](https://github.com/artsy/mobile_fastlane_match).
