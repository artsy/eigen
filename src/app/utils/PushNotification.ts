import AsyncStorage from "@react-native-async-storage/async-storage"
import { captureMessage } from "@sentry/react-native"
import { getCurrentEmissionState, unsafe__getEnvironment } from "app/store/GlobalStore"
import { Platform } from "react-native"
import DeviceInfo from "react-native-device-info"

export const PUSH_NOTIFICATION_TOKEN = "PUSH_NOTIFICATION_TOKEN"

/**
 * Saves the push notification token to the server
 * @param token - The push notification token to save
 * @returns True if the token was saved successfully, false otherwise
 */
export const saveToken = async (token: string) => {
  const { authenticationToken, userAgent } = getCurrentEmissionState()

  const lastToken = await AsyncStorage.getItem(PUSH_NOTIFICATION_TOKEN)

  if (lastToken === token) {
    if (__DEV__) {
      console.log(`Push notification token ${token} already saved`)
    }
    return true
  }

  // Check for valid authentication token before proceeding
  if (!authenticationToken) {
    if (__DEV__) {
      console.warn(`Cannot save push token: No authentication token available`)
    } else {
      captureMessage(
        `Error saving push notification token: No authentication token available`,
        "error"
      )
    }
    return false
  }

  const environment = unsafe__getEnvironment()
  const url = environment.gravityURL + "/api/v1/device"
  const name = DeviceInfo.getDeviceId() || DeviceInfo.getDeviceNameSync()

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
    await AsyncStorage.setItem(PUSH_NOTIFICATION_TOKEN, token)

    response = await res.json()
  } catch (error) {
    if (__DEV__) {
      console.warn(`error`, error)
    } else {
      captureMessage(`Error saving push notification token: ${error}`, "error")
    }
    // Return false when fetch request fails
    return false
  }

  // Ensure response exists before checking status
  if (!response || response.status < 200 || response.status > 299 || response.error) {
    if (__DEV__) {
      console.warn(
        `New Push Token ${token} was NOT saved`,
        response?.error || "No response received"
      )
    }
    return false
  }

  if (__DEV__) {
    console.log(`New Push Token ${token} saved!`)
  }

  return true
}

module.exports = {
  saveToken,
}
