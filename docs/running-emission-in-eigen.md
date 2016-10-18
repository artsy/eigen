# Using Emission in Eigen

Note: This is not something you should be doing for day-to-day development,
the Example App inside this repo should provide enough to work with, and can
be worked on to expand on specific for development.

However, in the end, you may want to test your work inside Eigen itself.

### Switching to Local Packager in Eigen

In Eigen, inside the Simulator, hit `~` to open the Admin panel. Inside the panel
tap `Use local Emission packaging server` - it will tell you to read this doc, then reset.

### Switching to the local Emission pod

Two points:

* You want to ensure that Eigen is using your local folder for Emission.
* The development version of React Native also requires that you include an extra CocoaPods subspec.

Inside your emission dir, run

```sh
pwd
```

You'll need this path inside the Podfile.

Amend Eigen's Podfile to

```
  pod 'Emission', :path => "[the_path_above]"
  pod 'React', :subspecs => %w(RCTWebSocket)
```

Then run `bundle exec pod update Emission Extraction React/Core --no-repo-update` to update them.

Your local Emission should be usable inside Eigen.

### Undoing all this

Inside Eigen:

``` sh
# Undo your Podfile changes
git checkout Podfile Podfile.lock
# Undo your Pods folder changes
bundle exec pod install
```