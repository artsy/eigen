# Testing Push Notifications in Eigen

## Types of Push Notifications

Our push notifications can mostly be divided into 2 categories:

**Internal or transactional push notifications**: These are push notifications that happen in response to some event in our systems. Things like, an auction opening a user is registered for, a work is published matching a saved alert for a user, a users order gets shipped. These are sent through [pulse](https://github.com/artsy/pulse)
**Marketing and recommendations push notifications**: These are push notifications sent by marketing and editorial either as one offs or on a scheduled basis. They can be things like recommended artworks based on user preferences, an announcement of a big artworld event coverage like vanguard or curated editorial content.

## iOS

### Sandbox vs Production Environments

There are 2 different environments pushes can be sent on and tokens can be registered on.

**Production**: environment used to send pushes to Testflight and AppStore builds.
**Sandbox**: environment used to send pushes to dev builds on physical devices.

### Obtaining a push token

For most push testing you will need a push token for your device.
To avoid issues with stale tokens from the wrong environment we recommend deleting and reinstalling the application
for the environment you are testing in.

For **production** that is Testflight.
For **sandbox** that is a build onto your physical device from Xcode.

Install the application, sign in, you should see a pair of dialogs asking you to grant push permissions.
Grant access and a new push token will be registered with our backend. You can copy it to your clipboard from the
[Dev Menu](./dev_menu.md).

### Testing Internal Push Notifications

This is covered in the documentation in [Pulse 🔐](https://github.com/artsy/pulse/blob/main/doc/push_notifications.md).
Note that this only works in the **production** environment. Meaning you cannot send to a dev build this way.
See **Testing Push Notifications using PushNotifications app** for alternatives.

### Testing Braze Push Notifications

We have test campaigns set up for this purpose.
They will only send notifications to the mobileqa2 user.
Find credentials in 1pass, follow instructions above for **Obtaining a push token** again for this user.
You will also need a braze api key, also found in 1pass under **Braze Push Notifications API Key**.

`./scripts/utils/send_braze_push_ios.sh <API_KEY>`
`./scripts/utils/send_braze_push_android.sh <API_KEY>`

Note that this only works in the **production** environment. Meaning you cannot send to a dev build this way.
TODO: We could have campaign in the staging env and send to dev builds that way.

### Testing Push Notifications using PushNotifications app (Recommended Method in most cases)

There is an open source app that allows sending to both production and sandbox environments with any push payload you
want. There are instructions for configuration and an example push payload in 1pass under: **Eigen iOS Push Notifications Testing**
https://github.com/onmyway133/PushNotifications

### Testing Push Notifications in Simulator

If you only need to test push lifecycle or display for a push payload you can send a dummy push to a simulator.
You can see an example payload in 1pass under **Eigen iOS Push Notifications Testing** other-test-push.apns.

`./scripts/utils/send_sim_push_ios.sh <LOCAL_PATH>/other-test-push.apns`
