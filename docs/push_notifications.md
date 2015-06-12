# Sending a push notification to your development build

Sorry open-sorcerers, this requires specialised provisioning profiles and private certificates, so these steps won’t work for you.

1. Get the required ‘Artsy Development APN’ certificate from the 1Password vault or
   [the Gravity repo](https://github.com/artsy/gravity/raw/master/config/apns/net.artsy.artsy.dev.pem)
   and store it somewhere locally.

   _Do **NOT** commit this file to the Eigen repository, but, just in case, the file `net.artsy.artsy.dev.pem` in the
   root of the repo is ignored._

2. On startup, the app will register with APN and log the current device token, which will look like:

       Got device notification token: b37e50cedcd3e3f1ff64f4afc0422084ae694253cf399326868e07a35f4a45fb

3. Ensure the app is not currently active. (Notifications for active applications are not shown.)

4. Send a notification, using the locally stored certificate and your current device token:

       $ bundle exec apn push [TOKEN] --environment development --certificate path/to/certificate.pem --alert 'The “earth” without “art” is just “eh.”'

5. For more options, such as app icon badge number, sounds, etc, see:

       $ bundle exec apn push --help


### Troubleshooting

If the application does not deploy to your device:

* Ensure the right provisioning profile is being used for the debug build (‘iOSTeam Provisioning Profile: net.artsy.artsy.dev’)

* Ensure your device is listed in that provisioning profile with:

      $ security cms -D -i ~/Library/MobileDevice/Provisioning\ Profiles/UUID.mobileprovision > /tmp/net.artsy.artsy.dev.profile
      $ /usr/libexec/PlistBuddy /tmp/net.artsy.artsy.dev.profile -c 'Print :ProvisionedDevices'

  (You can locate the profile by going into Xcode > Preferences > Accounts > ‘ART SY INC’, right-click it, select
  ‘Show in Finder’, and drag it to your terminal.)
