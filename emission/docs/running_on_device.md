# How to run the Emission test app on device

(**Note**: these instructions are for running the _Emission_ app on-device. To run _Eigen_ on device linked to Emission, [check out the Eigen docs](https://github.com/artsy/eigen/blob/master/docs/getting_started.md).)

So, you have something that can only really be tested on real hardware. Lucky you.

You need three things:

1. Hook up your Apple account in Xcode, so you can sign builds
2. Build Emission on to your Phone
3. Get your Phone talking to the React Native Packager

### Apple Accounts

If you press `cmd + ,` in Xcode, it will open the preferences. In there, go to "Accounts". In the bottom left, hit the plus and enter your Apple ID which is signed up to the Artsy Apple developer org. That hooks it up for all Xcode projects.

Then to make it work with Emission, you need to click on the word "Emission", next to the blue project icon in the far top right of Xcode. If you don't see it, make sure the weird tab-like icons has the first one selected (the folder.)

Clicking that brings up this kinda table of stuff. You need to make sure the top left icon, a Square with a line filled - is selected. You'll see a column that says "PROJECT" Emission, then "TARGETS" Emission, EmissionTests etc.

Select Emission under "TARGETS." This is kinda like the app overview, where you set the name, icon and version. We want to make sure that "Automatically manage signing" is turned on. If it's off, hitting the tick box should say "Automatically manage signing will reset build settings" - this is fine. do it.

Now you should have it say something like:

> Team: Artsy Inc
> Provisioning Profile: Xcode Managed Profile
> Signing Certificate: iPhone Developer: Caroline Lau

That means you can sign builds. If you don't see it, double check the "Users" section of AppStore Connect to make sure the "Developer Resources – Access to Certificates, Identifiers & Profiles" checkbox is selected.

### Building for a Device

Up in the top left, but the play and stop button - there is the simulator selector. It has a cute blue/black icon and probably is telling you the name of some phone. Make sure your phone is plugged in, and click that icon. It's a dropdown menu of a million phones below you, but above you (if you scroll up) there should be your phone. There'll be a section in the popover called "Device" - if you don't see that, re-plug-in your phone and make sure you've hit all the popovers etc.

Troubleshooting:

- Get entitlements issues? Try deleting the Emission app from your phone and re-run the app from Xcode.

### Working on a Device

Now that you have a native build running, you want to scroll down to the bottom of the admin and there should be a button that says something like: "Use RNP with 10.12.4.180.xip.io"

What's happening is that during the build in Xcode, React Native sends through an IP it can use to get back to the main computer which it is talking to. This allows it to connect to the React Native Packager and let's you work on your computer, but test on the device.

For more info see: https://facebook.github.io/react-native/docs/running-on-device.html
