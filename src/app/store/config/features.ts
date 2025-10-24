import { useToast } from "app/Components/Toast/toastHook"
import { GlobalStore, unsafe__getEnvironment } from "app/store/GlobalStore"
import { setupSentry } from "app/system/errorReporting/setupSentry"
import { echoLaunchJson } from "app/utils/jsonFiles"
import Keys from "react-native-keys"

interface FeatureDescriptorCommonTypes {
  /** Provide a short description for the Dev Menu. */
  readonly description?: string

  /** Whether or not to show the feature flag in the Dev Menu. Consider also providing a description. */
  readonly showInDevMenu?: boolean
}

export interface FeatureDescriptorReadyForRelease {
  /**
   * Set readyForRelease to `true` when the feature is ready to be exposed outside of dev mode.
   * If an echo flag key is specified, the echo flag's value will be used after this
   * is set to `true`.
   */
  readonly readyForRelease: true
  /**
   * Provide an echo feature flag key to allow this feature to be toggled globally via echo.
   * Make sure to add the flag to echo before setting this value. Then run `./scripts/setup/update-echo`.
   */
  readonly echoFlagKey: string
}

interface FeatureDescriptorNotReadyForRelease {
  /**
   * Set readyForRelease to `false` when the feature is still in progress.
   */
  readonly readyForRelease: false

  readonly echoFlagKey?: string
}

export type FeatureDescriptor = (
  | FeatureDescriptorReadyForRelease
  | FeatureDescriptorNotReadyForRelease
) &
  FeatureDescriptorCommonTypes

export type FeatureName = keyof typeof features

export const features = {
  ARDarkModeSupport: {
    readyForRelease: true,
    showInDevMenu: true,
    description: "Support dark mode",
    echoFlagKey: "ARDarkModeSupport",
  },
  // TODO: need to refresh it before releasing to avoid leaking the feature in not ready releases, marked as ready since 15 months ago
  AREnableArtworksConnectionForAuction: {
    readyForRelease: true,
    description: "Use artworksConnection for Auction screen",
    echoFlagKey: "AREnableArtworksConnectionForAuction",
  },
  ARImpressionsTrackingHomeItemViews: {
    description: "Enable Tracking Items views on Home Screen",
    readyForRelease: true,
    showInDevMenu: true,
    echoFlagKey: "ARImpressionsTrackingHomeItemViews",
  },
  AREnableNewAuctionsRailCard: {
    description: "Enable New Auctions Home Rail Card",
    readyForRelease: true,
    echoFlagKey: "AREnableNewAuctionsRailCard",
  },
  AREnableAdditionalSiftAndroidTracking: {
    description: "Send additional events to Sift on Android",
    readyForRelease: true,
    echoFlagKey: "AREnableAdditionalSiftAndroidTracking",
  },
  AREnableAuctionHeaderAlertCTA: {
    description: "Enable Auction Header Alert CTA",
    readyForRelease: true,
    echoFlagKey: "AREnableAuctionHeaderAlertCTA",
  },
  ARShowCreateAlertInArtistArtworksListFooter: {
    description: "Show create alert in artist artworks list footer",
    readyForRelease: true,
    echoFlagKey: "ARShowCreateAlertInArtistArtworksListFooter",
  },
  AREnabledDiscoverDailyNegativeSignals: {
    description: "Enable negative signals in Discover Daily",
    readyForRelease: true,
    showInDevMenu: true,
    echoFlagKey: "AREnabledDiscoverDailyNegativeSignals",
  },
  AREnablePartnerOffersNotificationSwitch: {
    description: "Enable partner offers notification switch",
    readyForRelease: true,
    echoFlagKey: "AREnablePartnerOffersNotificationSwitch",
  },
  AREnablePartnerOffer: {
    description: "Enable partner offer content in the app",
    readyForRelease: true,
    echoFlagKey: "AREnablePartnerOffer",
  },
  AREnableExpiredPartnerOffers: {
    description: "Enable expired partner offers handling",
    readyForRelease: true,
    showInDevMenu: true,
    echoFlagKey: "AREnableExpiredPartnerOffers",
  },
  AREnableProgressiveOnboardingAlerts: {
    description: "Enable progressive onboarding alerts",
    readyForRelease: true,
    showInDevMenu: true,
    echoFlagKey: "AREnableProgressiveOnboardingAlerts",
  },
  AREnableArtworkListOfferability: {
    description: "Enable Parnter Offer v1.5, edit sharing artwork list with partners for offers",
    readyForRelease: true,
    showInDevMenu: true,
    echoFlagKey: "AREnableArtworkListOfferability",
  },
  ARShowBlurhashImagePlaceholder: {
    description: "Show blurhash image placeholder (works only when using Palette Image Component)",
    readyForRelease: true,
    showInDevMenu: true,
    echoFlagKey: "ARShowBlurhashImagePlaceholder",
  },
  AREnableAlertBottomSheet: {
    description: "Enable tapping on alerts to show bottom sheet",
    readyForRelease: true,
    showInDevMenu: true,
    echoFlagKey: "AREnableAlertBottomSheet",
  },
  AREnableCollectionsWithoutHeaderImage: {
    description: "Remove the header image from collections",
    readyForRelease: true,
    showInDevMenu: true,
    echoFlagKey: "AREnableCollectionsWithoutHeaderImage",
  },
  AREnableSignupLoginFusion: {
    description: "Enable the fused signup and login flow",
    readyForRelease: true,
    showInDevMenu: true,
    echoFlagKey: "AREnableSignupLoginFusion",
  },
  AREnablePaymentFailureBanner: {
    description: "Enable payment failure banner",
    readyForRelease: true,
    showInDevMenu: true,
    echoFlagKey: "AREnablePaymentFailureBanner",
  },
  AREnableViewPortPrefetching: {
    description: "Enable viewport prefetching",
    readyForRelease: true,
    showInDevMenu: true,
    echoFlagKey: "AREnableViewPortPrefetching",
  },
  AREnableArtworkCardContextMenuIOS: {
    description: "Enable long press menu on artwork cards for iOS",
    readyForRelease: true,
    showInDevMenu: true,
    echoFlagKey: "AREnableArtworkCardContextMenuIOS",
  },
  AREnableHidingDislikedArtworks: {
    description: "Enable hiding disliked artworks",
    readyForRelease: true,
    showInDevMenu: true,
    echoFlagKey: "AREnableHidingDislikedArtworks",
  },
  AREnableArtworkCardContextMenuAndroid: {
    description: "Enable long press menu on artwork cards for Android",
    readyForRelease: true,
    showInDevMenu: true,
    echoFlagKey: "AREnableArtworkCardContextMenuAndroid",
  },
  AREnableLongPressContextMenuOnboarding: {
    description: "Enable long press context menu onboarding",
    readyForRelease: true,
    showInDevMenu: true,
    echoFlagKey: "AREnableLongPressContextMenuOnboarding",
  },
  AREnableHomeViewQuickLinks: {
    description: "Enable Home View Quick Links",
    readyForRelease: true,
    showInDevMenu: true,
    echoFlagKey: "AREnableHomeViewQuickLinks",
  },
  AREnableQuickLinksAnimation2: {
    readyForRelease: true,
    showInDevMenu: true,
    description: "Enable quick links animation",
    echoFlagKey: "AREnableQuickLinksAnimation2",
  },
  AREnableProgressiveOnboardingPriceRangeHome: {
    readyForRelease: true,
    showInDevMenu: true,
    description: "Enable progressive onboarding price range home",
    echoFlagKey: "AREnableProgressiveOnboardingPriceRangeHome",
  },
  ARShowOnboardingPriceRangeScreen: {
    readyForRelease: true,
    showInDevMenu: true,
    description: "Show onboarding price range screen",
    echoFlagKey: "ARShowOnboardingPriceRangeScreen",
  },
  AREnablePriceRangeToast: {
    readyForRelease: true,
    showInDevMenu: true,
    description: "Enable price range toast prompting users to update a price range",
    echoFlagKey: "AREnablePriceRangeToast",
  },
  AREnableArtworkSaveIconAnimation: {
    description: "Enable artwork save icon animation",
    readyForRelease: true,
    showInDevMenu: true,
    echoFlagKey: "AREnableArtworkSaveIconAnimation",
  },
  AREnableNewHomeViewCardRailType: {
    readyForRelease: false,
    showInDevMenu: true,
    description: "Enable new rail type on home",
    echoFlagKey: "AREnableNewHomeViewCardRailType",
  },
  AREnableRedirectForVideoFeatureType: {
    readyForRelease: true,
    showInDevMenu: true,
    description: "If enabled redirect features with video to webviews",
    echoFlagKey: "AREnableRedirectForVideoFeatureType",
  },
  AREnableAuctionsHubOnHomeView: {
    description: "Enable Auctions Hub on Home View",
    readyForRelease: false,
    showInDevMenu: true,
    echoFlagKey: "AREnableAuctionsHubOnHomeView",
  },
} satisfies { [key: string]: FeatureDescriptor }

export interface DevToggleDescriptor {
  /**
   * Provide a short description for the Dev Menu.
   */
  readonly description: string
  /**
   * Provide some action/thunk to run when the toggle value is changed.
   */
  readonly onChange?: (value: boolean, { toast }: { toast: ReturnType<typeof useToast> }) => void
}

export type DevToggleName = keyof typeof devToggles

export const devToggles: { [key: string]: DevToggleDescriptor } = {
  DTShowPrefetchingIndicator: {
    description: "Show prefetching indicator",
  },
  DTShowPlayground: {
    description: "Show Playground",
  },
  DTShowQuickAccessInfo: {
    description: "Quick Access Info",
  },
  DTDisableEchoRemoteFetch: {
    description: "Disable fetching remote echo",
    onChange: (value, { toast }) => {
      if (value) {
        GlobalStore.actions.artsyPrefs.echo.setEchoState(echoLaunchJson())
        toast.show("Loaded bundled echo config", "middle")
      } else {
        GlobalStore.actions.artsyPrefs.echo.fetchRemoteEcho()
        toast.show("Fetched remote echo config", "middle")
      }
    },
  },
  DTShowAnalyticsVisualiser: {
    description: "Analytics visualiser",
  },
  DTLocationDetectionVisialiser: {
    description: "Location detection visualiser",
  },
  DTCacheHitsVisialiser: {
    description: "Cache hits visualiser",
  },
  DTShowNavigationVisualiser: {
    description: "Navigation visualiser",
  },
  DTEasyMyCollectionArtworkCreation: {
    description: "MyCollection artworks easy add",
  },
  DTShowArtworkInternalIDOnRails: {
    description: "Show artwork internal ID on artwork rails",
  },
  DTMyCollectionDeleteAllArtworks: {
    description: "MyCollection delete all artworks",
  },
  DTShowWebviewIndicator: {
    description: "Webview indicator",
  },
  DTHideAllOnboardingPopovers: {
    description: "Hide all onboarding popovers",
  },
  DTShowInstagramShot: {
    description: "Instagram viewshot debug",
  },
  DTDebugSentry: {
    description: "Enable sentry debug mode and send exceptions to sentry",
    onChange: (value, { toast }) => {
      if (!Keys.secureFor("SENTRY_DSN")) {
        toast.show(
          `No Sentry DSN available ${
            __DEV__ ? "Set it in keys.shared.json and re-build the app." : ""
          }`,
          "middle"
        )
        return
      }

      const environment = unsafe__getEnvironment()
      setupSentry({
        environment: environment.env,
        debug: value,
      })

      if (value) {
        toast.show("Sentry debugging enabled", "middle")
      } else {
        toast.show("Sentry debugging disabled", "middle")
      }
    },
  },
  DTFPSCounter: {
    description: "FPS counter",
  },
  DTUseProductionUnleash: {
    description: "Use Production Unleash",
  },
  DTShowErrorInLoadFailureView: {
    description: "Show error in load failure view",
  },
  DTDisableNavigationStateRehydration: {
    description:
      "Disable navigation state rehydration. This change only affects DEV builds. In release builds, navigation state is never rehydrated.",
  },
}

export const isDevToggle = (name: FeatureName | DevToggleName): name is DevToggleName => {
  return Object.keys(devToggles).includes(name as string)
}
