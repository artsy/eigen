import AsyncStorage from "@react-native-async-storage/async-storage"
import { NativeState } from "app/store/NativeModel"
import { PushAuthorizationStatus } from "app/system/notifications/getNotificationsPermissions"
import { NativeModules as AllNativeModules, Platform } from "react-native"
import { getLocales, getTimeZone } from "react-native-localize"
import type { Image as RNCImage } from "react-native-image-crop-picker"

const noop: any = (name: string) => () =>
  console.warn(`method ${name} doesn't exist on android yet`)

type PushPayload = Record<string, unknown> & {
  _receivedAt?: string
  _source?: string
}

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
    getRecentPushPayloads(): Promise<PushPayload[]>
  }
  ARNotificationsManager: {
    getConstants(): NativeState
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
  ARTDeeplinkTimeoutModule: {
    invalidateDeeplinkTimeout(): void
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

  ARTDeeplinkTimeoutModule: {
    invalidateDeeplinkTimeout: noop("invalidateTimeout"),
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
    getPushToken: () => AsyncStorage.getItem("PUSH_NOTIFICATION_TOKEN"),
    getRecentPushPayloads: () => noop("getRecentPushPayloads"),
  },

  ARNotificationsManager: {
    postNotificationName: noop("postNotificationName"),
    didFinishBootstrapping: () => null,
    reactStateUpdated: () => null,
    getConstants: () => null as any,
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
}

const LegacyNativeModulesIOS: LegacyNativeModules = {
  ARTDeeplinkTimeoutModule: AllNativeModules.ARTDeeplinkTimeoutModule,
  ARTNativeScreenPresenterModule: AllNativeModules.ARTNativeScreenPresenterModule,
  ARCocoaConstantsModule: AllNativeModules.ARCocoaConstantsModule,
  ArtsyNativeModule: AllNativeModules.ArtsyNativeModule,
  ARNotificationsManager: AllNativeModules.ARNotificationsManager,
  ARTemporaryAPIModule: AllNativeModules.ARTemporaryAPIModule,
  ARPHPhotoPickerModule: AllNativeModules.ARPHPhotoPickerModule,
}

const nativeModules = () => {
  if (Platform.OS === "android") {
    return LegacyNativeModulesAndroid
  } else {
    return LegacyNativeModulesIOS
  }
}

export const LegacyNativeModules: LegacyNativeModules = nativeModules()
