import { useToast } from "app/Components/Toast/toastHook"
import { GlobalStore, unsafe__getEnvironment } from "app/store/GlobalStore"
import { setupSentry } from "app/system/errorReporting/setupSentry"
import { echoLaunchJson } from "app/utils/jsonFiles"
import Config from "react-native-config"

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
    readyForRelease: false,
    description: "Support dark mode",
  },
  AREnableEditorialNews: {
    readyForRelease: true,
    description: "Enable news app in the home screen",
    echoFlagKey: "AREnableEditorialNews",
    showInDevMenu: true,
  },
  // TODO: need to refresh it before releasing to avoid leaking the feature in not ready releases, marked as ready since 15 months ago
  AREnableArtworksConnectionForAuction: {
    readyForRelease: true,
    description: "Use artworksConnection for Auction screen",
    echoFlagKey: "AREnableArtworksConnectionForAuction",
  },
  ARImpressionsTrackingHomeRailViews: {
    description: "Enable tracking rail views on home screen",
    readyForRelease: true,
    echoFlagKey: "ARImpressionsTrackingHomeRailViews",
  },
  ARImpressionsTrackingHomeItemViews: {
    description: "Enable Tracking Items views on Home Screen",
    readyForRelease: true,
    echoFlagKey: "ARImpressionsTrackingHomeItemViews",
  },
  AREnableNewAuctionsRailCard: {
    description: "Enable New Auctions Home Rail Card",
    readyForRelease: true,
    echoFlagKey: "AREnableNewAuctionsRailCard",
  },
  // TODO: need to refresh it, not released yet but marked as ready since 3 months
  AREnableLongPressOnArtworkCards: {
    description: "Enable Context Menu on artwork cards",
    readyForRelease: true,
    showInDevMenu: true,
    echoFlagKey: "AREnableLongPressOnArtworkCards",
  },
  AREnableShowsForYouLocation: {
    description: "Enable Shows For You Location",
    readyForRelease: true,
    echoFlagKey: "AREnableShowsForYouLocation",
  },
  AREnableGalleriesForYou: {
    description: "Enable Galleries For You",
    readyForRelease: true,
    echoFlagKey: "AREnableGalleriesForYou",
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
  AREnableLatestActivityRail: {
    description: "Enable Latest Activity Rail",
    readyForRelease: true,
    echoFlagKey: "AREnableLatestActivityRail",
  },
  AREnableAlertsFilters: {
    description: "Enable filters in alerts screen",
    readyForRelease: true,
    echoFlagKey: "AREnableAlertsFilters",
  },
  AREnableAlertsFiltersSizeFiltering: {
    description: "Enable size filtering in alerts filters screen",
    readyForRelease: true,
    showInDevMenu: true,
    echoFlagKey: "AREnableAlertsFiltersSizeFiltering",
  },
  AREnableAlertDetailsInput: {
    description: "Enable 'details' text input for alerts",
    readyForRelease: true,
    echoFlagKey: "AREnableAlertDetailsInput",
  },
  AREnableArtistSeriesFilter: {
    description: "Enable artist series filter on Artist screen",
    readyForRelease: true,
    echoFlagKey: "AREnableArtistSeriesFilter",
  },
  AREnableAlertsSuggestedFilters: {
    description: "Enable alerts suggested filters",
    readyForRelease: true,
    echoFlagKey: "AREnableAlertsSuggestedFilters",
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
  AREnableArtistSeriesSuggestions: {
    description: "Enable artist series suggestions",
    readyForRelease: true,
    echoFlagKey: "AREnableArtistSeriesSuggestions",
  },
  AREnableProgressiveOnboardingAlerts: {
    description: "Enable progressive onboarding alerts",
    readyForRelease: false,
    showInDevMenu: true,
    echoFlagKey: "AREnableProgressiveOnboardingAlerts",
  },
  AREnableAlertsFiltersArtistSeriesFiltering: {
    description: 'Enable artist series selection on "More Filters" screen',
    readyForRelease: true,
    echoFlagKey: "AREnableAlertsFiltersArtistSeriesFiltering",
  },
  AREnableArtworksFeedView: {
    description: "Enable artworks feed view",
    readyForRelease: true,
    showInDevMenu: true,
    echoFlagKey: "AREnableArtworksFeedView",
  },
  AREnableArtworkListOfferability: {
    description: "Enable Parnter Offer v1.5, edit sharing artwork list with partners for offers",
    readyForRelease: true,
    showInDevMenu: true,
    echoFlagKey: "AREnableArtworkListOfferability",
  },
  ARUsePaletteImage: {
    description: "Use Palette Image Component",
    readyForRelease: true,
    showInDevMenu: true,
    echoFlagKey: "ARUsePaletteImageComponent",
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
  AREnableNewTermsAndConditions: {
    description: "Enable new terms and conditions",
    readyForRelease: true,
    showInDevMenu: true,
    echoFlagKey: "AREnableNewTermsAndConditions",
  },
  AREnableLongPressOnNewForYouRail: {
    description: "Enable Context Menu on artwork cards on new for you rail",
    readyForRelease: true,
    showInDevMenu: true,
    echoFlagKey: "AREnableLongPressOnNewForYouRail",
  },
  AREnablePartnerOfferOnArtworkScreen: {
    description: "Enable partner offer on artwork screen",
    readyForRelease: true,
    showInDevMenu: true,
    echoFlagKey: "AREnablePartnerOfferOnArtworkScreen",
  },
  AREnableMyCollectionInterestedInSellingTooltip: {
    description: "Enable My Collection 'Interested in Selling?' tooltip",
    readyForRelease: true,
    showInDevMenu: true,
    echoFlagKey: "AREnableMyCollectionInterestedInSellingTooltip",
  },
  ARSWAMakeAllDimensionsOptional: {
    description: "Make all dimensions optional in SWA submit flow",
    readyForRelease: true,
    showInDevMenu: true,
    echoFlagKey: "ARSWAMakeAllDimensionsOptional",
  },
  AREnableSubmitArtworkTier2Information: {
    description: "Enable submit artwork tier 2 information",
    readyForRelease: true,
    showInDevMenu: true,
    echoFlagKey: "AREnableSubmitArtworkTier2Information",
  },
  AREnableCollectionsWithoutHeaderImage: {
    description: "Remove the header image from collections",
    readyForRelease: true,
    showInDevMenu: true,
    echoFlagKey: "AREnableCollectionsWithoutHeaderImage",
  },
  AREnableArtworkRailRedesignImageAspectRatio: {
    description: "Enable new aspect ratio for artwork rail images",
    readyForRelease: true,
    showInDevMenu: true,
    echoFlagKey: "AREnableArtworkRailRedesignImageAspectRatio",
  },
  ARUseMetaphysicsCDN: {
    description: "Use Metaphysics CDN (requires app restart)",
    readyForRelease: true,
    showInDevMenu: true,
    echoFlagKey: "ARUseMetaphysicsCDN",
  },
  AREnableCacheableDirective: {
    description: "Enable @cacheable Directive",
    readyForRelease: true,
    showInDevMenu: true,
    echoFlagKey: "AREnableCacheableDirective",
  },
  AREnableSignupLoginFusion: {
    description: "Enable the fused signup and login flow",
    readyForRelease: true,
    showInDevMenu: true,
    echoFlagKey: "AREnableSignupLoginFusion",
  },
  AREnableMarketingCollectionsCategories: {
    description: "Enable marketing collections categories elements in the home view",
    readyForRelease: true,
    showInDevMenu: true,
    echoFlagKey: "AREnableMarketingCollectionsCategories",
  },
  ARPreferLegacyHomeScreen: {
    description: "Prefer legacy home screen",
    readyForRelease: false,
    showInDevMenu: true,
  },
  AREnableDynamicHomeView: {
    description: "Enable new home screen",
    readyForRelease: true,
    showInDevMenu: true,
    echoFlagKey: "AREnableDynamicHomeView",
  },
  AREnableHomeViewTasksSection: {
    description: "Enable the Home view tasks section",
    readyForRelease: true,
    showInDevMenu: true,
    echoFlagKey: "AREnableHomeViewTasksSection",
  },
  AREnableNewNavigation: {
    description: "Enable new navigation infra (Requires App Restart!)",
    readyForRelease: false,
    showInDevMenu: true,
  },
  AREnableNewSaveAndFollowOnArtworkCard: {
    description: "Redesign Save CTA and Add Follow CTA on Artwork Grid/Rail",
    readyForRelease: false,
    showInDevMenu: true,
    /* echoFlagKey: "AREnableNewSaveAndFollowOnArtworkCard" */
  },
  AREnablePaymentFailureBanner: {
    description: "Enable payment failure banner",
    readyForRelease: true,
    showInDevMenu: true,
    echoFlagKey: "AREnablePaymentFailureBanner",
  },
  AREnableNewSearchModal: {
    description: "Enable new search modal",
    readyForRelease: false,
    showInDevMenu: true,
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
  DTShowNavigationVisualiser: {
    description: "Navigation visualiser",
  },
  DTEasyMyCollectionArtworkCreation: {
    description: "MyCollection artworks easy add",
  },
  DTMyCollectionDeleteAllArtworks: {
    description: "MyCollection delete all artworks",
  },
  DTShowWebviewIndicator: {
    description: "Webview indicator",
  },
  DTShowInstagramShot: {
    description: "Instagram viewshot debug",
  },
  DTDebugSentry: {
    description: "Enable sentry debug mode and send exceptions to sentry",
    onChange: (value, { toast }) => {
      if (!Config.SENTRY_DSN) {
        toast.show(
          `No Sentry DSN available ${__DEV__ ? "Set it in .env.shared and re-build the app." : ""}`,
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
  DTEnableNewImageLabel: {
    description: "Show a label on new OpaqueImageView",
  },
  DTDisableNavigationStateRehydration: {
    description:
      "Disable navigation state rehydration. This change only affects DEV builds. In release builds, navigation state is never rehydrated.",
  },
}

export const isDevToggle = (name: FeatureName | DevToggleName): name is DevToggleName => {
  return Object.keys(devToggles).includes(name as string)
}
