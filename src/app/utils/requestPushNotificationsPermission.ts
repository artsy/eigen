import { LegacyNativeModules } from "app/NativeModules/LegacyNativeModules"
import { GlobalStore, unsafe_getPushPromptSettings } from "app/store/GlobalStore"
import {
  PushAuthorizationStatus,
  getNotificationPermissionsStatus,
} from "app/utils/PushNotification"
import { Alert, Linking, Platform } from "react-native"
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

const showPrepromptAlert = async () => {
  // TODO: Analytics for user disinterest and interest
  Alert.alert(
    "Artsy Would Like to Send You Notifications",
    "Turn on notifications to get important updates about artists you follow.",
    [
      { text: "Dismiss", style: "cancel" },
      { text: "OK", onPress: () => requestSystemPermissions() },
    ]
  )
  await GlobalStore.actions.artsyPrefs.pushPromptLogic.setPushNotificationDialogueLastSeenTimestamp(
    Date.now()
  )
}

const requestSystemPermissions = async () => {
  GlobalStore.actions.artsyPrefs.pushPromptLogic.setPushNotificationSystemDialogueSeen(true)
  if (Platform.OS === "ios") {
    LegacyNativeModules.ARTemporaryAPIModule.requestDirectNotificationPermissions()
  } else {
    const permissions: Array<"alert" | "badge" | "sound"> = ["alert", "badge", "sound"]
    await PushNotification.requestPermissions(permissions)
  }
}

const ONE_WEEK_MS = 1000 * 60 * 60 * 24 * 7 // One week in milliseconds
const shouldDisplayPrepromptAlert = () => {
  const { pushNotificationDialogueLastSeenTimestamp } = unsafe_getPushPromptSettings()!

  if (pushNotificationDialogueLastSeenTimestamp) {
    // we don't want to ask too often
    // currently, we make sure at least a week has passed by since you last saw the dialogue
    const pushNotificationDialogueLastSeenDate = new Date(pushNotificationDialogueLastSeenTimestamp)
    const currentDate = new Date()
    const timePassed = currentDate.getTime() - pushNotificationDialogueLastSeenDate.getTime()
    return timePassed >= ONE_WEEK_MS
  } else {
    // if you've never seen one before, we'll show you ;)
    return true
  }
}

export const requestPushNotificationsPermission = async () => {
  // TODO: how to handle unwrapping this?
  const {
    pushPermissionsRequestedThisSession,
    pushNotificationSettingsPromptSeen,
    pushNotificationSystemDialogueSeen,
  } = unsafe_getPushPromptSettings()!
  const { setPushPermissionsRequestedThisSession, setPushNotificationSettingsPromptSeen } =
    GlobalStore.actions.artsyPrefs.pushPromptLogic

  if (pushPermissionsRequestedThisSession) {
    return
  }

  const permissionStatus = await getNotificationPermissionsStatus()
  if (permissionStatus === PushAuthorizationStatus.Authorized) {
    // TODO: refresh the push token
    // We may not need to do anything here, push library should
    // get the onRegister callback any time the app opens
    // TEST THIS
    return
  } else if (permissionStatus === PushAuthorizationStatus.Denied) {
    if (!pushNotificationSettingsPromptSeen) {
      showSettingsAlert()
      setPushNotificationSettingsPromptSeen(true)
    }
    return
  }

  setTimeout(() => {
    if (!pushNotificationSystemDialogueSeen && shouldDisplayPrepromptAlert()) {
      showPrepromptAlert()
      setPushPermissionsRequestedThisSession(true)
    }
    return
  }, 3000)
}
