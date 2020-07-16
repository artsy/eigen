import { NativeState } from "lib/store/NativeModel"
import { NativeModulesStatic } from "react-native"
declare module "react-native" {
  interface NativeModulesStatic {
    ARTemporaryAPIModule: {
      markNotificationsRead(): void
      setApplicationIconBadgeNumber(n: number): void
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
      googleMapsAPIKey: string
      sentryDSN: string
      stripePublishableKey: string
      mapBoxAPIClientKey: string
      options: {
        AROptionsFilterCollectionsArtworks: boolean
        AROptionsLotConditionReport: boolean
        AROptionsEnableMyCollection: boolean
        AROptionsPriceTransparency: boolean
        AROptionsViewingRooms: boolean
        AROptionsHomeHero: boolean
        ipad_vir: boolean
        iphone_vir: boolean
        ARDisableReactNativeBidFlow: boolean
        AREnableBuyNowFlow: boolean
        AREnableMakeOfferFlow: boolean
        AREnableLocalDiscovery: boolean
        ARReactNativeArtworkEnableAlways: boolean
        ARReactNativeArtworkEnableNonCommercial: boolean
        ARReactNativeArtworkEnableNSOInquiry: boolean
        ARReactNativeArtworkEnableAuctions: boolean
        AREnableNewPartnerView: boolean
        AREnableNewSearch: boolean
      }
    }
  }
}
