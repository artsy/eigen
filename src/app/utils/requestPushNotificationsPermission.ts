import { LegacyNativeModules } from "app/NativeModules/LegacyNativeModules"
import {
  PushAuthorizationStatus,
  getNotificationPermissionsStatus,
} from "app/utils/PushNotification"
import { Alert, Linking, Platform } from "react-native"

export const requestPushNotificationsPermission = async () => {
  setTimeout(() => {
    // Logic for making request goes here
    LegacyNativeModules.ARTemporaryAPIModule.requestDirectNotificationPermissions()
  }, 3000)
}
