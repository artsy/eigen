import AsyncStorage from "@react-native-community/async-storage"
import { getCurrentEmissionState, unsafe__getEnvironment } from "lib/store/GlobalStore"
import { getDeviceName } from "react-native-device-info"
import PushNotification from "react-native-push-notification"
import { ASYNC_STORAGE_PUSH_NOTIFICATIONS_KEY } from "./AdminMenu"

export const IOS_PUSH_NOTIFICATION_TOKEN = "IOS_PUSH_NOTIFICATION_TOKEN"
export const ANDROID_PUSH_NOTIFICATION_TOKEN = "ANDRROID_PUSH_NOTIFICATION_TOKEN"

const saveToken = async (tokenObject: { os: string; token: string }) => {
  const { token, os } = tokenObject
  const storageKey = os === "android" ? ANDROID_PUSH_NOTIFICATION_TOKEN : IOS_PUSH_NOTIFICATION_TOKEN
  const previousToken = await AsyncStorage.getItem(storageKey)

  if (token !== previousToken) {
    const { authenticationToken, userAgent } = getCurrentEmissionState()
    const gravityURL = unsafe__getEnvironment().gravityURL
    const url = gravityURL + "/api/v1/device"
    const name = await getDeviceName()
    const body = JSON.stringify({
      name,
      token,
      app_id: "net.artsy.artsy",
      // "production" : ARAppStatus.isBetaOrDev ? @"false" : @"true"
    })
    const headers = {
      "Content-Type": "application/json",
      "X-ACCESS-TOKEN": authenticationToken,
      "User-Agent": userAgent,
    }
    const request = new Request(url, { method: "POST", body, headers })
    fetch(request)
      .then((res) => res.json())
      .then((response) => {
        if (response.status < 200 || response.status > 299 || response.error) {
          if (__DEV__) {
            console.warn(`New Push Token ${token} was not saved`, response?.error)
          }
          // TODO: Batch this request for retrial
          return
        }
        AsyncStorage.setItem(storageKey, token)
      })
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
        saveToken(token)
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
}

module.exports = {
  configure,
}
