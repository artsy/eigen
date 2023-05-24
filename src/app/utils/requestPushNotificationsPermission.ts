import { GlobalStore, unsafe_getPushPromptSettings } from "app/store/GlobalStore"
import {
  PushAuthorizationStatus,
  getNotificationPermissionsStatus,
} from "app/utils/PushNotification"
import { Alert, Linking } from "react-native"
import PushNotification from "react-native-push-notification"

const showSettingsAlert = () => {
  Alert.alert(
    "Artsy Would Like to Send You Notifications",
    "Turn on notifications to get important updates about artists you follow.",
    [
      { text: "Dismiss", style: "cancel" },
      { text: "Settings", onPress: () => Linking.openSettings() },
    ]
  )
}

export const requestPushNotificationsPermission = async () => {
  // TODO: how to handle unwrapping this?
  const { pushPermissionsRequestedThisSession, pushNotificationSettingsPromptSeen } =
    unsafe_getPushPromptSettings()!
  const { setPushPermissionsRequestedThisSession, setPushNotificationSettingsPromptSeen } =
    GlobalStore.actions.artsyPrefs.pushPromptLogic

  if (pushPermissionsRequestedThisSession) {
    return
  }

  const permissionStatus = await getNotificationPermissionsStatus()
  if (permissionStatus === PushAuthorizationStatus.Authorized) {
    // TODO: refresh the push token
    return
  } else if (permissionStatus === PushAuthorizationStatus.Denied) {
    if (!pushNotificationSettingsPromptSeen) {
      showSettingsAlert()
      setPushNotificationSettingsPromptSeen(true)
    }
    return
  }

  setTimeout(() => {
    // TODO: double check these permissions
    const permissions: Array<"alert" | "badge" | "sound"> = ["alert", "badge", "sound"]
    PushNotification.requestPermissions(permissions)
    setPushPermissionsRequestedThisSession(true)
    return
  }, 3000)
}
