## Using the Eigen Beta

You can switch between staging and production environments via the admin menu mentioned below though. This means that data may have differences, as staging is copied from production once a week. However, being on staging means you can't break anything ;)

While on staging, the bottom tab bar of the app is purple. This lets us know which environment a screenshot was taken on.

### The admin menu

The admin menu is comprised of several sections:

- Useful actions, for example switching between staging and production
- Lab settings, which are toggles for specific features within Eigen
- Developer API settings (useful for web/platform developers)

To access it, do the following steps:

1. Run the app in the simulator or a real device.
   - Developer mode should be on in you are developing (`__DEV__` is true, or you are logged in with an artsy email). Make sure it is, by going to Profile > About. If "Version" has a one pixel purple line on the right, then you are good to go. If not, then you need to tap "Version" 7 times quickly, to enable developer mode.
2. Simulate a ‘shake’ event (<kbd>^⌘Z</kbd>), which will bring up the dev menu.
3. Choose the ‘Debug JS Remotely’ option, which should open Chrome.
4. In the new Chrome window, open the Developer Tools (<kbd>⌘⌥J</kbd>).

If you are an admin or using an artsy email, you can access the admin menu quickly:

- Just shake your device.
- Otherwise, go to Safari and type `artsy:///admin2` into the address bar (note the triple-slash).
