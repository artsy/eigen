## Getting Setup

### Fork and Clone

Fork https://github.com/artsy/eigen and clone it locally.

### Ruby dependencies

Install the CocoaPods ruby gem or use the App.

```
bundle install
```

Now run `bundle exec pod install` in the root directory. This will grab all our external libraries.

Once the `pod install` is complete, it will create the `Artsy.xcworkspace` file that you should open in Xcode.
Workspaces hold Projects, and we have two projects; one for Artsy and one for CocoaPods.


### Running Tests

In Xcode/AppCode:
Tap `cmd + u` to run all tests, use `ctrl + alt + cmd + g` to run the last set you clicked on via the GUI. Tests _need_ to be ran on an iPhone 6 in iOS 9.

To get the iOS9 SDK: open the prefs `cmd + ,` go to Components, then select 9.3.

Command line:
```
make clean
make
```

Then you're good to go. Learn about what things are architectually [here](https://github.com/artsy/eigen/blob/master/docs/overview.md), then move [to the blog.](http://artsy.github.io/blog/categories/eigen/).

---

### Certificates

Login as **it@artsymail.com** to [Certificates, Identities and Profiles](https://developer.apple.com/account/overview.action). The password is in 1password.

This is only needed for building to a device, which is a _really_ arduous process.

Run `make certs`.

We have [cert troubleshooting here](https://github.com/artsy/eigen/blob/master/docs/certs.md)

### Connecting a device.

Xcode will prompt you to join a team, then to enable the device for development. When prompted, choose the uppercase *ART.SY INC.* team.

Choose Preferences, Accounts, which should list your Apple ID and membership.

Choose Window, Organizer, which should list your device. The provisioning profile in the Provisioning Profiles tab under the device should include *iOS Team Provisioning Profile: net.artsy.artsy.dev* and *net.artsy.artsy.beta*. You may need to download these from Certificaties, Identifiers && Profiles.
