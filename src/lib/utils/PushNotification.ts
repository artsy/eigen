import PushNotification from "react-native-push-notification"

function configure() {
  PushNotification.configure({
    // (optional) Called when Token is generated (iOS and Android)
    onRegister: (token) => {
      if (__DEV__) {
        console.log("TOKEN:", token)
      }
      // TODO: Send the token to Gravity
    },

    // (required) Called when a remote is received or opened, or local notification is opened
    onNotification: (notification) => {
      if (__DEV__) {
        console.log("NOTIFICATION:", notification)
      }

      // TODO: Handle Notification | Defer handling based on auth state | Badges | etc

      // (required) Called when a remote is received or opened, or local notification is opened
      // notification.finish(PushNotificationIOS.FetchResult.NoData);
    },

    // (optional) Called when Registered Action is pressed and invokeApp is false, if true onNotification will be called (Android)
    onAction: (notification) => {
      if (__DEV__) {
        console.log("ACTION:", notification.action)
        console.log("NOTIFICATION:", notification)
      }

      // process the action
    },

    // (optional) Called when the user fails to register for remote notifications. Typically occurs when APNS is having issues, or the device is a simulator. (iOS)
    onRegistrationError: (err) => {
      if (__DEV__) {
        console.error(err?.message, err)
      }
    },

    // IOS ONLY (optional): default: all - Permissions to register.
    // permissions: {
    //   alert: true,
    //   badge: true,
    //   sound: true,
    // },

    // Should the initial notification be popped automatically
    // default: true
    popInitialNotification: true,

    /**
     * (optional) default: true
     * - Specified if permissions (ios) and token (android and ios) will requested or not,
     * - if not, you must call PushNotificationsHandler.requestPermissions() later
     * - if you are not using remote notification or do not have Firebase installed, use this:
     *     requestPermissions: Platform.OS === 'ios'
     */
    // TODO:- Update this as required when implementing for ios
    requestPermissions: true,
  })
}

module.exports = {
  configure,
}
