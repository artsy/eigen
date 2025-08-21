import notifee from "@notifee/react-native"
import { LegacyNativeModules } from "app/NativeModules/LegacyNativeModules"

export const mockFetchNotificationPermissions = (isAndroid: boolean) => {
  const module = isAndroid
    ? (notifee.getNotificationSettings as jest.Mock<any>)
    : (LegacyNativeModules.ARTemporaryAPIModule.fetchNotificationPermissions as jest.Mock<any>)
  return module
}
