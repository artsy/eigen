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
  const lastSeenDate = new Date(Date.now())
  await GlobalStore.actions.artsyPrefs.pushPromptLogic.setPushNotificationDialogueLastSeenDate(
    lastSeenDate
  )
}

const requestSystemPermissions = () => {
  GlobalStore.actions.artsyPrefs.pushPromptLogic.setPushNotificationSystemDialogueSeen(true)
  // TODO: double check these permissions
  const permissions: Array<"alert" | "badge" | "sound"> = ["alert", "badge", "sound"]
  PushNotification.requestPermissions(permissions)
}

const ONE_WEEK_MS = 1000 * 60 * 60 * 24 * 7 // One week in milliseconds
const shouldDisplayPrepromptAlert = () => {
  const { pushNotificationDialogueLastSeenDate } = unsafe_getPushPromptSettings()!

  if (pushNotificationDialogueLastSeenDate) {
    // we don't want to ask too often
    // currently, we make sure at least a week has passed by since you last saw the dialogue
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
