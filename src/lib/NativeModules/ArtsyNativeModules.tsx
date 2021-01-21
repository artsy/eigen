import { NativeModules as AllNativeModules, Platform } from "react-native"

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
      CurrentLocale: "en_US",
      LocalTimeZone: "",
    },

    ARNotificationsManager: {
      nativeState: {
        userAgent: "Jest Unit Tests",
        env: "test",
        authenticationToken: "authenticationToken",
        onboardingState: "complete",
        gravityURL: "gravityURL",
        launchCount: 1,
        metaphysicsURL: "metaphysicsURL",
        deviceId: "testDevice",
        predictionURL: "predictionURL",
        webURL: "webURL",
        sentryDSN: "sentryDSN",
        stripePublishableKey: "stripePublishableKey",
        userID: "userID",
        options: {
          AROptionsBidManagement: false,
          AROptionsEnableMyCollection: false,
          AROptionsLotConditionReport: false,
          AROptionsPriceTransparency: false,
          AROptionsViewingRooms: false,
          AROptionsNewSalePage: false,
          AREnableViewingRooms: false,
          AROptionsArtistSeries: false,
          ipad_vir: false,
          iphone_vir: false,
          ARDisableReactNativeBidFlow: false,
          AREnableNewPartnerView: false,
          AROptionsNewFirstInquiry: false,
          AROptionsUseReactNativeWebView: false,
          AROptionsNewFairPage: false,
          AROptionsNewInsightsPage: false,
          AROptionsInquiryCheckout: false,
        },
        legacyFairSlugs: ["some-fairs-slug", "some-other-fair-slug"],
        legacyFairProfileSlugs: [],
      },
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
