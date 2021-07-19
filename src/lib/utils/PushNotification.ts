import AsyncStorage from "@react-native-community/async-storage"
import { getCurrentEmissionState, unsafe__getEnvironment } from "lib/store/GlobalStore"
import { Platform } from "react-native"
import { getDeviceId } from "react-native-device-info"
import PushNotification from "react-native-push-notification"
import { ASYNC_STORAGE_PUSH_NOTIFICATIONS_KEY } from "./AdminMenu"

export const IOS_PUSH_NOTIFICATION_TOKEN = "IOS_PUSH_NOTIFICATION_TOKEN"
export const ANDROID_PUSH_NOTIFICATION_TOKEN = "ANDRROID_PUSH_NOTIFICATION_TOKEN"
export const PENDING_IOS_PUSH_NOTIFICATION_TOKEN = "PENDING_IOS_PUSH_NOTIFICATION_TOKEN"
export const PENDING_ANDROID_PUSH_NOTIFICATION_TOKEN = "PENDING_ANDRROID_PUSH_NOTIFICATION_TOKEN"

export const savePendingToken = async () => {
  const pendingStorageKey =
    Platform.OS === "android" ? PENDING_ANDROID_PUSH_NOTIFICATION_TOKEN : PENDING_IOS_PUSH_NOTIFICATION_TOKEN
  const token = await AsyncStorage.getItem(pendingStorageKey)
  if (token) {
    saveToken({ os: Platform.OS, token }).then((res) => {
      if (res) {
        AsyncStorage.removeItem(pendingStorageKey)
      }
    })
  }
}

export const saveToken = (tokenObject: { os: string; token: string }) => {
  return new Promise<boolean>(async (resolve, reject) => {
    const { token, os } = tokenObject
    const storageKey = os === "android" ? ANDROID_PUSH_NOTIFICATION_TOKEN : IOS_PUSH_NOTIFICATION_TOKEN
    const pendingStorageKey =
      os === "android" ? PENDING_ANDROID_PUSH_NOTIFICATION_TOKEN : PENDING_IOS_PUSH_NOTIFICATION_TOKEN

    const previousToken = await AsyncStorage.getItem(storageKey)
    if (token !== previousToken) {
      const { authenticationToken, userAgent } = getCurrentEmissionState()
      if (!authenticationToken) {
        // user is not logged in. The first time a user opens the app, expect token to be gotten before the global store is initialised
        // save the token and send to gravity when they log in
        await AsyncStorage.setItem(pendingStorageKey, token)
        reject("Push Notification: No access token")
      } else {
        const gravityURL = unsafe__getEnvironment().gravityURL
        const url = gravityURL + "/api/v1/device"
        const name = __TEST__ ? "my-device-name" : getDeviceId()
        const body = JSON.stringify({
          name,
          token,
          app_id: "net.artsy.artsy",
          platform: os,
          production: !__DEV__, // TODO: Fix this asap when we can determine beta on android. production should be false for beta builds
        })
        const headers = {
          "Content-Type": "application/json",
          "X-ACCESS-TOKEN": authenticationToken,
          "User-Agent": userAgent,
        }
        const request = new Request(url, { method: "POST", body, headers })
        const res = await fetch(request)
        const response = await res.json()
        if (response.status < 200 || response.status > 299 || response.error) {
          if (__DEV__) {
            console.warn(`New Push Token ${token} was NOT saved`, response?.error)
          }
          reject("Push Notification: Failed to save new push notification token")
          return
        }
        if (__DEV__) {
          console.log(`New Push Token ${token} saved!`)
        }
        await AsyncStorage.setItem(storageKey, token)
        // clear whatever pending token that may have been saved
        await AsyncStorage.removeItem(pendingStorageKey)
        resolve(true)
      }
    }
  })
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
  saveToken,
  savePendingToken,
}
