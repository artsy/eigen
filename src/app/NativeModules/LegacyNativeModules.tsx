import { BottomTabType } from "app/Scenes/BottomTabs/BottomTabType"
import { PushAuthorizationStatus } from "app/utils/PushNotification"
import { NativeModules as AllNativeModules, Platform } from "react-native"
import { getLocales, getTimeZone } from "react-native-localize"
import { ARScreenPresenterModule } from "./ARScreenPresenterModule"
import type { NativeState } from "app/store/NativeModel"
import type { ViewDescriptor } from "app/system/navigation/navigate"
import type { Image as RNCImage } from "react-native-image-crop-picker"

const noop: any = (name: string) => () =>
  console.warn(`method ${name} doesn't exist on android yet`)

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
    fetchNotificationPermissions(
      callback: (error: any, result: PushAuthorizationStatus) => void
    ): void
    markNotificationsRead(callback: (error?: Error) => any): void
    setApplicationIconBadgeNumber(n: number): void
    getUserEmail(): string
  }
  ArtsyNativeModule: {
    updateAuthState(userAccessToken: string, userAccessTokenExpiresIn: string, user: any): void
    clearUserData(): Promise<void>
    getPushToken(): Promise<string | null>
  }
  ARNotificationsManager: {
    nativeState: NativeState
    postNotificationName(type: string, data: object): void
    didFinishBootstrapping(): void
    reactStateUpdated(state: {
      gravityURL: string
      metaphysicsURL: string
      predictionURL: string
      webURL: string
      causalityURL: string
      env: string
      userIsDev: boolean
    }): void
  }
  ARPHPhotoPickerModule: {
    requestPhotos(allowMultiple: boolean): Promise<RNCImage[]>
  }
  ARCocoaConstantsModule: {
    AREnabled: boolean
    CurrentLocale: string
    UIApplicationOpenSettingsURLString: string
    LocalTimeZone: string
  }
  ARTNativeScreenPresenterModule: {
    presentAugmentedRealityVIR(
      imgUrl: string,
      widthInches: number,
      heightInches: number,
      artworkSlug: string,
      artworkId: string
    ): void
    presentEmailComposerWithBody(body: string, subject: string, toAddress: string): void
    presentEmailComposerWithSubject(subject: string, toAddress: string): void
    presentMediaPreviewController(
      reactTag: number,
      route: string,
      mimeType: string,
      cacheKey: string
    ): void
  }
  ARScreenPresenterModule: {
    switchTab(tab: BottomTabType): void
    pushView(currentTabStackID: string, descriptor: ViewDescriptor): void
    presentModal(descriptor: ViewDescriptor): void
    dismissModal(): void
    goBack(currentTabStackID: string): void
    popStack(stackID: string): void
    popToRootOrScrollToTop(stackID: string): void
    popToRootAndScrollToTop(stackID: string): Promise<void>
    updateShouldHideBackButton(shouldHideBackButton: boolean, currentTabStackID: string): void
  }
  AREventsModule: {
    requestAppStoreRating(): void
  }
}

const LegacyNativeModulesAndroid = {
  ARTNativeScreenPresenterModule: {
    presentAugmentedRealityVIR: () => {
      noop("view in room not yet supported on android")
    },
    presentEmailComposerWithBody: () => {
      noop("presentEmailComposer not yet supported on android")
    },
    presentEmailComposerWithSubject: () => {
      noop("presentEmailComposer not yet supported on android")
    },
    presentMediaPreviewController: () => {
      noop("presentMediaPreviewController not yet supported on android")
    },
  },

  ARCocoaConstantsModule: {
    UIApplicationOpenSettingsURLString: "UIApplicationOpenSettingsURLString",
    AREnabled: false,
    CurrentLocale: getLocales()[0].languageTag,
    LocalTimeZone: getTimeZone(),
  },

  ArtsyNativeModule: {
    updateAuthState: noop("updateAuthState"),
    clearUserData: () => Promise.resolve(),
    getPushToken: () => Promise.resolve(null),
  },

  ARNotificationsManager: {
    nativeState: null as any,
    postNotificationName: noop("postNotificationName"),
    didFinishBootstrapping: () => null,
    reactStateUpdated: () => null,
  },

  ARTemporaryAPIModule: {
    fetchNotificationPermissions: noop("fetchNotificationPermissions"),
    markNotificationsRead: noop("markNotificationsRead"),
    setApplicationIconBadgeNumber: () => {
      console.log("TODO: make app icon badge work on android")
    },
    getUserEmail: () => "",
  },
  ARPHPhotoPickerModule: {
    requestPhotos: noop("requestPhotos"),
  },
  ARScreenPresenterModule,
  AREventsModule: {
    requestAppStoreRating: noop("requestAppStoreRating"),
  },
}

const LegacyNativeModulesIOS: LegacyNativeModules = {
  ARScreenPresenterModule,
  ARTNativeScreenPresenterModule: AllNativeModules.ARTNativeScreenPresenterModule,
  ARCocoaConstantsModule: AllNativeModules.ARCocoaConstantsModule,
  ArtsyNativeModule: AllNativeModules.ArtsyNativeModule,
  ARNotificationsManager: AllNativeModules.ARNotificationsManager,
  ARTemporaryAPIModule: AllNativeModules.ARTemporaryAPIModule,
  ARPHPhotoPickerModule: AllNativeModules.ARPHPhotoPickerModule,
  AREventsModule: AllNativeModules.AREventsModule,
}

const nativeModules = () => {
  if (Platform.OS === "android") {
    return LegacyNativeModulesAndroid
  } else {
    return LegacyNativeModulesIOS
  }
}

export const LegacyNativeModules: LegacyNativeModules = nativeModules()
