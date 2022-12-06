import AsyncStorage from "@react-native-async-storage/async-storage"
import moment from "moment"
import { Alert, AlertButton, Linking, Platform } from "react-native"
import Braze from "react-native-appboy-sdk"

// Push prompt logic
export const HAS_SEEN_PUSH_SETTINGS_PROMPT = "HAS_SEEN_PUSH_SETTINGS_PROMPT"
export const HAS_SEEN_PUSH_SYSTEM_PROMPT = "HAS_SEEN_PUSH_SYSTEM_PROMPT"
export const LAST_SEEN_LOCAL_PROMPT = "LAST_SEEN_LOCAL_PROMPT"

export const showSettingsEnableNotificationsAlert = () => {
  AsyncStorage.setItem(HAS_SEEN_PUSH_SETTINGS_PROMPT, "true")

  const deviceText = Platform.select({
    ios: "iOS",
    android: "Android",
    default: "device",
  })
  const instruction = Platform.select({
    ios: `Tap 'Artsy' and enable "Allow Notifications" for Artsy.`,
    default: "",
  })

  const buttons: AlertButton[] = [
    {
      text: "Settings",
      onPress: () => {
        if (Platform.OS === "android") {
          Linking.openSettings()
        } else {
          Linking.openURL("App-prefs:NOTIFICATIONS_ID")
        }
      },
    },
    {
      text: "Cancel",
      style: "cancel",
    },
  ]

  Alert.alert(
    "Artsy would like to send you notifications",
    `To receive notifications for your alerts, you will need to enable them in your ${deviceText} Settings. ${instruction}`,
    Platform.OS === "ios" ? buttons : buttons.reverse()
  )
}

export const requestPushPermissionWithSoftAsk = async () => {
  const lastSeenLocalPrompt = moment()
  AsyncStorage.setItem(LAST_SEEN_LOCAL_PROMPT, JSON.stringify(lastSeenLocalPrompt))

  Alert.alert(
    "Artsy Would Like to Send You Notifications",
    "Turn on notifications to get important updates about artists you follow.",
    [
      {
        text: "Don't Allow",
        onPress: () => {
          return // do nothing
        },
        style: "cancel",
      },
      {
        text: "OK",
        onPress: () => {
          requestDirectNotificationPermissions()
        },
      },
    ]
  )
}

export const requestDirectNotificationPermissions = () => {
  AsyncStorage.setItem(HAS_SEEN_PUSH_SYSTEM_PROMPT, "true")
  const permissionOptions = {
    alert: true,
    sound: true,
    badge: true,
    provisional: false,
  }
  Braze.requestPushPermission(permissionOptions)
}

export const shouldShowLocalPromptAgain = async () => {
  const lastSeenDateRaw = await AsyncStorage.getItem(LAST_SEEN_LOCAL_PROMPT)
  if (lastSeenDateRaw) {
    const lastSeenDate = JSON.parse(lastSeenDateRaw)
    const aWeekAgo = moment().subtract(7, "days")
    const seenMoreThanAWeekAgo = moment(lastSeenDate).isBefore(aWeekAgo)
    return seenMoreThanAWeekAgo
  } else {
    // haven't seen before
    return true
  }
}

export const hasSeenSettingsPrompt = async () => {
  return boolFromStorage(HAS_SEEN_PUSH_SETTINGS_PROMPT)
}

export const hasSeenSystemPrompt = async () => {
  return boolFromStorage(HAS_SEEN_PUSH_SYSTEM_PROMPT)
}

export const boolFromStorage = async (key: string) => {
  const rawItem = await AsyncStorage.getItem(key)
  if (rawItem === "true") {
    return true
  } else {
    return false
  }
}
