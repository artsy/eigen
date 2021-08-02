import AsyncStorage from "@react-native-community/async-storage"
import { navigate } from "lib/navigation/navigate"
import { GlobalStore, globalStoreInstance } from "lib/store/GlobalStore"
import { PendingPushNotification } from "lib/store/PendingPushNotificationModel"
import PushNotification, { ReceivedNotification } from "react-native-push-notification"
import { ASYNC_STORAGE_PUSH_NOTIFICATIONS_KEY } from "./AdminMenu"

const MAX_ELAPSED_TAPPED_NOTIFICATION_TIME = 90 // seconds

export const handlePendingNotification = (notification: PendingPushNotification) => {
  const elapsedTimeInSecs = Math.floor((Date.now() - notification.tappedAt) / 1000)
  if (elapsedTimeInSecs <= MAX_ELAPSED_TAPPED_NOTIFICATION_TIME && !!notification.data.url) {
    navigate(notification.data.url, { passProps: { ...notification.data, url: undefined } })
  }
  GlobalStore.actions.pendingPushNotification.setPendingPushNotification({ platform: "android", notification: null })
}

export const handleReceivedNotification = (notification: Omit<ReceivedNotification, "userInfo">) => {
  if (__DEV__ && !__TEST__) {
    console.log("RECIEVED NOTIFICATION", notification)
  }
  const isLoggedIn = !!globalStoreInstance().getState().auth.userAccessToken
  if (notification.userInteraction) {
    const hasUrl = !!notification.data.url
    if (isLoggedIn && hasUrl) {
      navigate(notification.data.url as string, { passProps: { ...notification.data, url: undefined } })
      return
    }
    if (!isLoggedIn) {
      // removing finish because we do not use it on android and we don't want to serialise functions at this time
      const newNotification = { ...notification, finish: undefined, tappedAt: Date.now() }
      delete newNotification.finish
      GlobalStore.actions.pendingPushNotification.setPendingPushNotification({
        platform: "android",
        notification: newNotification,
      })
      return
    }
    return
  }
  if (notification.foreground) {
    // flash notification and put it in Tray
    const typedNotification: Omit<ReceivedNotification, "userInfo"> & { title?: string } = { ...notification }
    const channelId = "net.artsy.artsy"
    PushNotification.createChannel(
      {
        channelId, // (required)
        channelName: "default", // (required)
      },
      (created) => {
        if (__DEV__) {
          // false if channel already exists
          console.log("Notification Channel Created: ", created)
        }
        PushNotification.localNotification({
          /* Android Only Properties */
          channelId, // (required) channelId, if the channel doesn't exist, notification will not trigger.
          subText: notification.subText,
          ignoreInForeground: false, // (optional) if true, the notification will not be visible when the app is in the foreground (useful for parity with how iOS notifications appear). should be used in combine with `com.dieam.reactnativepushnotification.notification_foreground` setting
          onlyAlertOnce: false, // (optional) alert will open only once with sound and notify, default: false
          userInfo: notification.data,

          /* iOS and Android properties */
          id: 0,
          message: typedNotification.title ?? "Artsy", // (required)
        })
      }
    )
  }
}

export async function configure() {
  const canInitPushNotification = await AsyncStorage.getItem(ASYNC_STORAGE_PUSH_NOTIFICATIONS_KEY)
  if (canInitPushNotification === "true") {
    PushNotification.configure({
      // (optional) Called when Token is generated (iOS and Android)
      onRegister: (token) => {
        if (__DEV__) {
          console.log("TOKEN:", token)
        }
        // TODO: Send the token to Gravity
      },

      // (required) Called when a remote is received or opened, or local notification is opened
      onNotification: handleReceivedNotification,

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
}

module.exports = {
  configure,
  handlePendingNotification,
  handleReceivedNotification,
}
