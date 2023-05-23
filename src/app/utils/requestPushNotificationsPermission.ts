import { LegacyNativeModules } from "app/NativeModules/LegacyNativeModules"
import { unsafe_getPushPromptSettings } from "app/store/GlobalStore"

export const requestPushNotificationsPermission = async () => {
  // TODO: how to handle unwrapping this?
  const { pushPermissionsRequestedThisSession } = unsafe_getPushPromptSettings()!

  if (pushPermissionsRequestedThisSession) {
    return
  }

  setTimeout(() => {
    // Logic for making request goes here
    LegacyNativeModules.ARTemporaryAPIModule.requestDirectNotificationPermissions()
  }, 3000)
}
