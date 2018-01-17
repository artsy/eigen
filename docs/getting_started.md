## Getting Setup

### Fork and Clone

Fork https://github.com/artsy/eigen and clone it locally.

### Ruby dependencies

```sh
git clone https://github.com/artsy/eigen
cd eigen
bundle install
```

### iOS Dependencies

Now that you've got the Gems, you'll need to Pods. We use CocoaPods for all our dependencies, including Emission.

```sh
bundle exec pod install
```

Once the `pod install` is complete, it will create the `Artsy.xcworkspace` file that you should open in Xcode.
Workspaces hold Projects, and we have two projects; one for Artsy and one for CocoaPods.


### Running Tests

We can only run tests in one specific environment, today that is `10.3` on an iPhone 6. This is because we use visual snapshots for UI regressions.

You can install the iOS 10 SDK by opening Xcode's preferences, going to "Components" then downloading "10.3.x". Once it's all downloaded, it will show
up in the dropdown in the top left corner.


#### To run test in Xcode

Tap `cmd + u` to run all tests, use `ctrl + alt + cmd + g` to run the last set you clicked on via the GUI. 

We run 

#### Command line

```
make clean
make
```

Then you're good to go. Learn about what things are architectually [here](https://github.com/artsy/eigen/blob/master/docs/overview.md), then move [to the blog.](http://artsy.github.io/blog/categories/eigen/).

---

### Certificates

We use Xcode's auto-codesigning. It should magically "just work" if you log in to Xcode with an iTunes account
which is on the Artsy team.

We have [cert troubleshooting here](https://github.com/artsy/eigen/blob/master/docs/certs.md)

### Connecting a device.

Xcode will prompt you to join a team, then to enable the device for development. When If you have to choose a team, choose *Art.sY Inc.*.
