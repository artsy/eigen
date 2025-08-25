import AsyncStorage from "@react-native-async-storage/async-storage"
import { captureMessage } from "@sentry/react-native"
import { getCurrentEmissionState, unsafe__getEnvironment } from "app/store/GlobalStore"
import { Platform } from "react-native"
import DeviceInfo from "react-native-device-info"

export const PUSH_NOTIFICATION_TOKEN = "PUSH_NOTIFICATION_TOKEN"
export const HAS_PENDING_NOTIFICATION = "HAS_PENDING_NOTIFICATION"

export const savePendingToken = async () => {
  const hasPendingToken = await AsyncStorage.getItem(HAS_PENDING_NOTIFICATION)
  const token = await AsyncStorage.getItem(PUSH_NOTIFICATION_TOKEN)
  if (token && hasPendingToken === "true") {
    const saved = await saveToken(token)
    if (saved) {
      await AsyncStorage.removeItem(HAS_PENDING_NOTIFICATION)
    }
  }
}

export const saveToken = (token: string) => {
  // eslint-disable-next-line no-async-promise-executor
  return new Promise<boolean>(async (resolve, reject) => {
    const previousToken = await AsyncStorage.getItem(PUSH_NOTIFICATION_TOKEN)
    if (token !== previousToken) {
      const { authenticationToken, userAgent } = getCurrentEmissionState()
      if (!authenticationToken) {
        // user is not logged in. The first time a user opens the app, expect token to be gotten before the global store is initialised
        // save the token and send to gravity when they log in
        await AsyncStorage.multiSet([
          [HAS_PENDING_NOTIFICATION, "true"],
          [PUSH_NOTIFICATION_TOKEN, token],
        ])
        reject("Push Notification: No access token")
      } else {
        const environment = unsafe__getEnvironment()
        const url = environment.gravityURL + "/api/v1/device"
        const name = __TEST__
          ? "my-device-name"
          : DeviceInfo.getDeviceId() || DeviceInfo.getDeviceNameSync()

        const production = environment.env === "production"
        const body = JSON.stringify({
          name,
          token,
          app_id: "net.artsy.artsy",
          platform: Platform.OS,
          production,
        })
        const headers = {
          "Content-Type": "application/json",
          "X-ACCESS-TOKEN": authenticationToken,
          "User-Agent": userAgent,
        }
        const request = new Request(url, { method: "POST", body, headers })
        let response
        try {
          const res = await fetch(request)
          response = await res.json()
        } catch (error) {
          if (__DEV__) {
            console.warn(`error`, error)
          } else {
            captureMessage(`Error saving push notification token: ${error}`, "error")
          }
        }

        if (response?.status < 200 || response?.status > 299 || response?.error) {
          if (__DEV__) {
            console.warn(`New Push Token ${token} was NOT saved`, response?.error)
          }
          reject("Push Notification: Failed to save new push notification token")
          return
        }
        if (__DEV__) {
          console.log(`New Push Token ${token} saved!`)
        }
        await AsyncStorage.setItem(PUSH_NOTIFICATION_TOKEN, token)
        resolve(true)
      }
    }
  })
}

module.exports = {
  saveToken,
  savePendingToken,
}
