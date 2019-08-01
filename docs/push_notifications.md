# Sending a push notification to your beta/development build

Sorry open-sorcerers, this requires our APNS certificate, so these steps won’t work for you.

1.  Get the required ‘Eigen Apple Push Notification Certificate’ certificate from the 1Password vault or
    [the Gravity repo](https://github.com/artsy/gravity/raw/master/config/apns/net.artsy.artsy.pem)
    and store it somewhere locally.

    _Do **NOT** commit this file to the Eigen repository, but, just in case, the file `net.artsy.artsy.pem` in the
    root of the repo is ignored._

2.  Either retrieve your device token

    - from a beta build by opening the developer menu (by shaking your device) and select ‘Copy Push Notification Token’,
      which stores the token on your device’s pasteboard.
    - or from a development build by searching the console logs for `Got device notification token: <token>`.

3.  If you wish to test iOS notifications coming in and/or test the app icon badge count updating, ensure the app is not
    currently active. (Notifications for active applications are not shown.)
    If you wish to test the Eigen custom notification banner, ensure the app is currently active.

4.  Send a notification, using the locally stored certificate and your current device token:

         $ bundle exec lowdown <token> --certificate path/to/certificate.pem --alert "Hello World!" --badge 42 --data url=https://www.artsy.net/artwork/brian-kernighan-hello-world

    If you are testing against a development build, be sure to add `--environment development` to the above command.

### Further reading

- [Gravity-side docs](https://github.com/artsy/gravity/blob/master/doc/PushNotifications.md)
- Troubleshooting and information on how to reset the alert asking the user for permission:
  https://developer.apple.com/library/ios/technotes/tn2265/_index.html#//apple_ref/doc/uid/DTS40010376-CH1-TNTAG21
