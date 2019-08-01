## Using Emission via `yarn start` in Emission

When trying to work on some more complex interactions between Emission and Eigen, it can help
to skip the Emission release setup in favour of having Eigen talk to the React Native server.

You enable this by hitting <kbd>cmd</kbd> + <kbd>alt</kbd> + <kbd>z</kbd> to bring up the Eigen
admin panel. In here is an option "Use local Emission packager" - select this. What this option
does is change the path for Emissions' JS from a statically compiled file (which gets shipped with
the app) to `http://localhost:8081/Example/Emission/index.ios.bundle?platform=ios&dev=true`

This kills the app, open Eigen back up and you should see the green status bar indicating it's compiling
some Emission dynamically.

Because both Eigen and React Native use the shake gesture, the React Native shake gesture is disabled
but you can trigger it via the Eigen admin menu.

## Running Objective-C Changes from Emission in Eigen

The above steps only link Eigen to Emission's _JavaScript_. But what if you want to link to Emission's _Objective-C_? Well lucky you, it's very straightforward.

First, follow the steps above so you're running against Emission's RNP. You'll now need to edit Eigen's `Podfile`. Don't commit these changes, they're just for developing. The change will look something like:

```diff
-  pod 'Emission', '~> 1.12'
+  pod 'Emission', path: '../emission' # Point to the directory where you have Emission cloned.
```

Now run `bundle exec pod update Emission` from Eigen's directory. This points Eigen to your local Emission. You can open Eigen in Xcode and edit Emission's Objective-C files there – you'll be editing the files in your local Emission clone.
