## Getting Setup

### Fork and Clone

Fork https://github.com/artsy/eigen and clone it locally.

### Ruby dependencies

Install the CocoaPods ruby gem.

```
bundle install
```

Now run `bundle exec pod install` in the root directory. This will grab all our external libraries.

Once the `pod install` is complete, it will create the `Artsy.xcworkspace` file that you should open in Xcode.
Workspaces hold Projects, and we have two projects; one for Artsy and one for CocoaPods.


### Certificates

Login as **it@artsymail.com** to [Certificates, Identities and Profiles](https://developer.apple.com/account/overview.action).

* Invite yourself as a new admin member of the team from the [Member Center](https://developer.apple.com/membercenter/index.action#allpeople).

Obtain a certificate for iOS development:

* Open Keychain Tool, Certificate Assisistant, Request a Certificate from a Certification Authority.
* Save the request to disk.
* [Create a new Certificate](https://developer.apple.com/account/ios/certificate/certificateCreate.action), use the CSR generated above.
* Have the admin approve your certificate.

Connect a device.

XCode will prompt you to join a team, then to enable the device for development. When prompted, choose the uppercase *ART.SY INC.* team.

Choose Preferences, Accounts, which should list your Apple ID and membership.

Choose Window, Organizer, which should list your device. The provisioning profile in the Provisioning Profiles tab under the device should include *iOS Team Provisioning Profile: net.artsy.artsy.dev* and *net.artsy.artsy.beta*. You may need to download these from Certificaties, Identifiers && Profiles.

### Run Tests

In Xcode/AppCode:
Tap `cmd + u` to run all tests, use `ctrl + alt + cmd + g` to run the last set you clicked on via the GUI.

Command line:
```
make clean
make
```
