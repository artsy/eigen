import { PushAuthorizationStatus } from "lib/Scenes/MyProfile/MyProfilePushNotifications"
import { NativeState } from "lib/store/NativeModel"
import { NativeModulesStatic } from "react-native"
declare module "react-native" {
  interface NativeModulesStatic {
    ARTemporaryAPIModule: {
      requestNotificationPermissions(): void
      fetchNotificationPermissions(callback: (error: any, result: PushAuthorizationStatus) => void): void
      markNotificationsRead(): void
      setApplicationIconBadgeNumber(n: number): void
      presentAugmentedRealityVIR(
        imgUrl: string,
        widthInches: number,
        heightInches: number,
        artworkSlug: string,
        artworkId: string
      ): void
      validateAuthCredentialsAreCorrect(): void
      resolveRelativeURL(path: string): Promise<string>
    }
    ARNotificationsManager: {
      nativeState: NativeState
      postNotificationName(type: string, data: object): void
    }
    ARCocoaConstantsModule: {
      AREnabled: boolean
      CurrentLocale: string
      UIApplicationOpenSettingsURLString: string
      LocalTimeZone: string
    }
    Emission: never
  }
}

declare module "react-native-config" {
  interface NativeConfig {
    ARTSY_API_CLIENT_SECRET: string
    ARTSY_API_CLIENT_KEY: string
    ARTSY_FACEBOOK_APP_ID: string
    SEGMENT_PRODUCTION_WRITE_KEY: string
    SEGMENT_STAGING_WRITE_KEY: string
    ARTSY_ECHO_PRODUCTION_TOKEN: string
    SEGMENT_PRODUCTION_DSN: string
    SEGMENT_STAGING_DSN: string
    GOOGLE_MAPS_API_KEY: string
    MAPBOX_API_CLIENT_KEY: string
    SAILTHRU_KEY: string
  }
}
