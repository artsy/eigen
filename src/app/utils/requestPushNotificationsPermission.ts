import { GlobalStore, unsafe_getPushPromptSettings } from "app/store/GlobalStore"
import PushNotification from "react-native-push-notification"

export const requestPushNotificationsPermission = async () => {
  // TODO: how to handle unwrapping this?
  const { pushPermissionsRequestedThisSession } = unsafe_getPushPromptSettings()!
  const { setPushPermissionsRequestedThisSession } = GlobalStore.actions.artsyPrefs.pushPromptLogic

  if (pushPermissionsRequestedThisSession) {
    return
  }

  setTimeout(() => {
    // Logic for making request goes here
    PushNotification.requestPermissions()
    setPushPermissionsRequestedThisSession(true)
  }, 3000)
}
