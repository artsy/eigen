import notifee, { AuthorizationStatus } from "@notifee/react-native"

export enum PushAuthorizationStatus {
  NotDetermined = "notDetermined",
  Authorized = "authorized",
  Denied = "denied",
}

export const getNotificationPermissionsStatus = async (): Promise<PushAuthorizationStatus> => {
  try {
    const settings = await notifee.getNotificationSettings()

    switch (settings.authorizationStatus) {
      case AuthorizationStatus.DENIED:
        return PushAuthorizationStatus.Denied
      case AuthorizationStatus.AUTHORIZED:
        return PushAuthorizationStatus.Authorized
      default:
        return PushAuthorizationStatus.NotDetermined
    }
  } catch (error) {
    if (__DEV__) {
      console.warn("Error getting notification permission status:", error)
    }
    return PushAuthorizationStatus.NotDetermined
  }
}
