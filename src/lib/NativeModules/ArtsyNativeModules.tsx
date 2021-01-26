import { NativeModules as AllNativeModules, Platform } from "react-native"
import { getLocales, getTimeZone } from "react-native-localize"
import { ARScreenPresenterModule } from "./ARScreenPresenterModule"

const noop: any = (name: string) => () => console.warn(`method ${name} doesn't exist on android yet`)

export const ArtsyNativeModules = Platform.select({
  ios: AllNativeModules,
  default: {
    ...AllNativeModules,
    ARTakeCameraPhotoModule: {
      errorCodes: {
        cameraNotAvailable: "cameraNotAvailable",
        imageMediaNotAvailable: "imageMediaNotAvailable",
        cameraAccessDenied: "cameraAccessDenied",
        saveFailed: "saveFailed",
      },
    },

    ARCocoaConstantsModule: {
      UIApplicationOpenSettingsURLString: "UIApplicationOpenSettingsURLString",
      AREnabled: true,
      CurrentLocale: getLocales()[0].languageTag,
      LocalTimeZone: getTimeZone(),
    },

    ARNotificationsManager: {
      nativeState: null as any,
      postNotificationName: noop("postNotificationName"),
      didFinishBootstrapping: () => null,
    },

    ARTemporaryAPIModule: {
      validateAuthCredentialsAreCorrect: noop("validateAuthCredentialsAreCorrect"),
      requestNotificationPermissions: noop("requestNotificationPermissions"),
      fetchNotificationPermissions: noop("fetchNotificationPermissions"),
      markNotificationsRead: noop("markNotificationsRead"),
      setApplicationIconBadgeNumber: noop("setApplicationIconBadgeNumber"),
      appVersion: "appVersion",
      buildVersion: "buildVersion",
    },
    ARPHPhotoPickerModule: {
      requestPhotos: noop("requestPhotos"),
    },
    ARScreenPresenterModule,
  },
})
