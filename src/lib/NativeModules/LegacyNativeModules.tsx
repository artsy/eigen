import type { ViewDescriptor } from "lib/navigation/navigate"
import type { PushAuthorizationStatus } from "lib/Scenes/MyProfile/MyProfilePushNotifications"
import type { NativeState } from "lib/store/NativeModel"
import { NativeModules as AllNativeModules, Platform } from "react-native"
import type { Image as RNCImage } from "react-native-image-crop-picker"
import { getLocales, getTimeZone } from "react-native-localize"
import { ARScreenPresenterModule } from "./ARScreenPresenterModule"

const noop: any = (name: string) => () => console.warn(`method ${name} doesn't exist on android yet`)

/**
 * This file is a gateway to our iOS-specific native modules that either
 *
 * - have not yet been ported to android
 * - will never be ported to android
 * - will be deleted at some point
 *
 * When a thing is made available on android, it should be removed from this file and added to ArtsyNativeModule.
 */

interface LegacyNativeModules {
  ARTemporaryAPIModule: {
    appVersion: string
    buildVersion: string
    requestNotificationPermissions(): void
    fetchNotificationPermissions(callback: (error: any, result: PushAuthorizationStatus) => void): void
    markNotificationsRead(callback: (error?: Error) => any): void
    setApplicationIconBadgeNumber(n: number): void
    validateAuthCredentialsAreCorrect(): void
  }
  ARNotificationsManager: {
    nativeState: NativeState
    postNotificationName(type: string, data: object): void
    didFinishBootstrapping(): void
  }
  ARPHPhotoPickerModule: {
    requestPhotos(): Promise<RNCImage[]>
  }
  ARCocoaConstantsModule: {
    AREnabled: boolean
    CurrentLocale: string
    UIApplicationOpenSettingsURLString: string
    LocalTimeZone: string
  }
  ARScreenPresenterModule: {
    pushView(currentTabStackID: string, descriptor: ViewDescriptor): void
    presentModal(descriptor: ViewDescriptor): void
    dismissModal(): void
    goBack(currentTabStackID: string): void
    popStack(stackID: string): void
    popToRootOrScrollToTop(stackID: string): void
    popToRootAndScrollToTop(stackID: string): Promise<void>
    presentMediaPreviewController(reactTag: number, route: string, mimeType: string, cacheKey: string): void
    presentEmailComposerWithBody(body: string, subject: string, toAddress: string): void
    presentEmailComposerWithSubject(subject: string, toAddress: string): void
    presentAugmentedRealityVIR(
      imgUrl: string,
      widthInches: number,
      heightInches: number,
      artworkSlug: string,
      artworkId: string
    ): void
    updateShouldHideBackButton(shouldHideBackButton: boolean, currentTabStackID: string): void
  }
  ARTakeCameraPhotoModule: {
    errorCodes: {
      cameraNotAvailable: string
      imageMediaNotAvailable: string
      cameraAccessDenied: string
      saveFailed: string
    }
    triggerCameraModal(reactTag: number | null): Promise<void>
  }
}

export const LegacyNativeModules: LegacyNativeModules = Platform.select({
  ios: AllNativeModules as any,
  default: {
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
      setApplicationIconBadgeNumber: () => {
        console.log("TODO: make app icon badge work on android")
      },
      appVersion: "appVersion",
      buildVersion: "buildVersion",
    },
    ARPHPhotoPickerModule: {
      requestPhotos: noop("requestPhotos"),
    },
    ARScreenPresenterModule,
  },
})
