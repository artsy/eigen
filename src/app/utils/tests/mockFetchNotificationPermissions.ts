import { LegacyNativeModules } from "app/NativeModules/LegacyNativeModules"
import PushNotification from "react-native-push-notification"

export const mockFetchNotificationPermissions = (isAndroid: boolean) => {
  const module = isAndroid
    ? (PushNotification.checkPermissions as jest.Mock<any>)
    : (LegacyNativeModules.ARTemporaryAPIModule.fetchNotificationPermissions as jest.Mock<any>)
  return module
}
