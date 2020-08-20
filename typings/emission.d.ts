import { PushAuthorizationStatus } from "lib/Scenes/MyProfile/MyProfilePushNotifications"
import { NativeState } from "lib/store/NativeModel"
import { NativeModulesStatic } from "react-native"
declare module "react-native" {
  interface EmissionOptions {
    AROptionsBidManagement: boolean
    AROptionsEnableMyCollection: boolean
    AROptionsLotConditionReport: boolean
    AROptionsPriceTransparency: boolean
    AROptionsViewingRooms: boolean
    AREnableViewingRooms: boolean
    ipad_vir: boolean
    iphone_vir: boolean
    ARDisableReactNativeBidFlow: boolean
    AREnableNewPartnerView: boolean
    AROptionsArtistSeries: boolean
  }

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
    }
    ARNotificationsManager: {
      nativeState: NativeState
      postNotificationName(type: string, data: object): void
    }
    Emission: {
      userID: string
      authenticationToken: string
      launchCount: number

      gravityURL: string
      metaphysicsURL: string
      predictionURL: string
      userAgent: string

      env: "production" | "staging" | "test"
      deviceId: string

      // Empty is falsy in JS, so these are fine too.
      sentryDSN: string
      stripePublishableKey: string
      options: EmissionOptions
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
    ARTSY_ECHO_PRODUCTION_TOKEN: string
    SEGMENT_PRODUCTION_DSN: string
    SEGMENT_STAGING_DSN: string
    GOOGLE_MAPS_API_KEY: string
    MAPBOX_API_CLIENT_KEY: string
    SAILTHRU_KEY: string
  }
}
