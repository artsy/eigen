import { NativeModules as AllNativeModules, Platform } from "react-native"
import { getLocales, getTimeZone } from "react-native-localize"

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
    },
    ARPHPhotoPickerModule: {
      requestPhotos: noop("requestPhotos"),
    },
    ARScreenPresenterModule: {
      presentMediaPreviewController: noop("presentMediaPreviewController"),
      dismissModal: noop("dismissModal"),
      pushView: noop("pushView"),
      goBack: noop("goBack"),
      updateShouldHideBackButton: noop("updateShouldHideBackButton"),
      presentAugmentedRealityVIR: noop("presentAugmentedRealityVIR"),
      presentEmailComposer: noop("presentEmailComposer"),
      popStack: noop("popStack"),
      popToRootAndScrollToTop: noop("popToRootAndScrollToTop"),
      popToRootOrScrollToTop: noop("popToRootOrScrollToTop"),
      presentModal: noop("presentModal"),
    },
  },
})
