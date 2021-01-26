import type { ViewDescriptor } from "lib/navigation/navigate"
import { PushAuthorizationStatus } from "lib/Scenes/MyProfile/MyProfilePushNotifications"
import type { NativeState } from "lib/store/NativeModel"
import { NativeModulesStatic } from "react-native"
import { Image as RNCImage } from "react-native-image-crop-picker"
declare module "react-native" {
  interface NativeModulesStatic {
    ARTemporaryAPIModule: {
      appVersion: string
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
    Emission: never
    ARScreenPresenterModule: {
      pushView(currentTabStackID: string, descriptor: ViewDescriptor): void
      presentModal(descriptor: ViewDescriptor): void
      dismissModal(): void
      goBack(currentTabStackID: string): void
      popStack(stackID: string): void
      popToRootOrScrollToTop(stackID: string): void
      popToRootAndScrollToTop(stackID: string): Promise<void>
      presentMediaPreviewController(reactTag: number, route: string, mimeType: string, cacheKey: string): void
      presentEmailComposer(to: string, subject: string, body?: string): void
      presentAugmentedRealityVIR(
        imgUrl: string,
        widthInches: number,
        heightInches: number,
        artworkSlug: string,
        artworkId: string
      ): void
      updateShouldHideBackButton(shouldHideBackButton: boolean, currentTabStackID: string): void
    }
  }
}

declare module "react-native-config" {
  interface NativeConfig {
    ARTSY_API_CLIENT_SECRET: string
    ARTSY_API_CLIENT_KEY: string
    ARTSY_FACEBOOK_APP_ID: string
    SEGMENT_PRODUCTION_WRITE_KEY: string
    SEGMENT_STAGING_WRITE_KEY: string
    SENTRY_PRODUCTION_DSN: string
    SENTRY_STAGING_DSN: string
    GOOGLE_MAPS_API_KEY: string
    MAPBOX_API_CLIENT_KEY: string
    SAILTHRU_KEY: string
  }
}
