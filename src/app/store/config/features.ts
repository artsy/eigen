import { useToast } from "app/Components/Toast/toastHook"
import { echoLaunchJson } from "app/utils/jsonFiles"
import { GlobalStore } from "../GlobalStore"

interface FeatureDescriptorCommonTypes {
  /** Provide a short description for the admin menu. */
  readonly description?: string

  /** Whether or not to show the feature flag in the admin menu. Consider also providing a description. */
  readonly showInAdminMenu?: boolean
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
   * Make sure to add the flag to echo before setting this value. Then run `./scripts/update-echo`.
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

// Helper function to get good typings and intellisense
function defineFeatures<T extends string>(featureMap: {
  readonly [featureName in T]: FeatureDescriptor
}) {
  return featureMap
}

export type FeatureName = keyof typeof features

export const features = defineFeatures({
  AROptionsPriceTransparency: {
    readyForRelease: true,
    echoFlagKey: "AROptionsPriceTransparency",
    description: "Price Transparency",
  },
  AROptionsLotConditionReport: {
    readyForRelease: true,
    echoFlagKey: "AROptionsLotConditionReport",
  },
  AREnableOrderHistoryOption: {
    readyForRelease: true,
    echoFlagKey: "AREnableOrderHistoryOption",
    description: "Enable Order History in settings",
  },
  AREnableSavedAddresses: {
    readyForRelease: false,
    description: "Enable Saved Addresses",
  },
  AREnableTrove: {
    readyForRelease: true,
    description: "Enable Trove in homepage",
    echoFlagKey: "AREnableTrove",
  },
  AREnableShowsRail: {
    readyForRelease: true,
    description: "Enable Shows in homepage",
    echoFlagKey: "AREnableShowsRail",
  },
  ARShowNetworkUnavailableModal: {
    readyForRelease: true,
    description: "Enable network unavailable modal",
    echoFlagKey: "ARShowNetworkUnavailableModal",
  },
  ARGoogleAuth: {
    readyForRelease: true,
    description: "Enable Google authentication",
    showInAdminMenu: true,
    echoFlagKey: "ARGoogleAuth",
  },
  AREnableExampleExperiments: {
    // we can remove this as soon as we have a real experiment on Unleash
    readyForRelease: false,
    description: "Show example Unleash experiments",
    showInAdminMenu: true,
  },
  AREnableQueriesPrefetching: {
    readyForRelease: true,
    description: "Enable query prefetching",
    showInAdminMenu: true,
    echoFlagKey: "AREnableQueriesPrefetching",
  },
  ARAllowLinkSocialAccountsOnSignUp: {
    readyForRelease: true,
    description: "Allow linking of social accounts on sign up",
    showInAdminMenu: true,
    echoFlagKey: "ARAllowLinkSocialAccountsOnSignUp",
  },
  AREnableCascadingEndTimerLotPage: {
    readyForRelease: true,
    description: "Enable cascading end times on the lot page",
    showInAdminMenu: true,
    echoFlagKey: "AREnableCascadingEndTimerLotPage",
  },
  AREnableCascadingEndTimerSalePageDetails: {
    readyForRelease: true,
    description: "Enable cascading end times on the sale page details",
    showInAdminMenu: true,
    echoFlagKey: "AREnableCascadingEndTimerSalePageDetails",
  },
  AREnableCascadingEndTimerSalePageGrid: {
    readyForRelease: true,
    description: "Enable cascading end times on the sale page lot grid",
    showInAdminMenu: true,
    echoFlagKey: "AREnableCascadingEndTimerSalePageGrid",
  },
  AREnableCascadingEndTimerHomeSalesRail: {
    readyForRelease: true,
    description: "Enable cascading end times on the Sales Rail on Home screen",
    showInAdminMenu: true,
    echoFlagKey: "AREnableCascadingEndTimerHomeSalesRail",
  },
  AREnableImageSearch: {
    readyForRelease: false,
    description: "Enable search with image",
    showInAdminMenu: true,
  },
  AREnableMyCollectionSearchBar: {
    readyForRelease: true,
    description: "Enable My Collection search bar",
    showInAdminMenu: true,
    echoFlagKey: "AREnableMyCollectionSearchBar",
  },
  AREnablePlaceholderLayoutAnimation: {
    readyForRelease: true,
    description: "Enable placeholder layout animation",
    echoFlagKey: "AREnablePlaceholderLayoutAnimation",
  },
  AREnableAvalaraPhase2: {
    readyForRelease: false,
    description: "Enable Avalara Phase 2",
    showInAdminMenu: true,
  },
  ARDarkModeSupport: {
    readyForRelease: false,
    description: "Support dark mode",
    showInAdminMenu: true,
  },
  ARShowRequestPriceEstimateBanner: {
    readyForRelease: true,
    description: "Show request price estimate banner",
    showInAdminMenu: true,
    echoFlagKey: "ARShowRequestPriceEstimateBanner",
  },
  ARShowMyCollectionDemandIndexHints: {
    readyForRelease: true,
    description: "Show demand index hints",
    showInAdminMenu: true,
    echoFlagKey: "ARShowMyCollectionDemandIndexHints",
  },
  AREnablePriceEstimateRange: {
    readyForRelease: false,
    description: "Enable My Collection Price Estimate Range",
    showInAdminMenu: false,
  },
  AREnableHomeScreenArtworkRecommendations: {
    readyForRelease: true,
    description: "Enable Home Screen Artwork Recommendations",
    showInAdminMenu: true,
    echoFlagKey: "AREnableHomeScreenArtworkRecommendations",
  },
  AREnableMapScreen: {
    readyForRelease: false,
    description: "Enable Crossplatform Map Screen",
    showInAdminMenu: true,
  },
  AREnableAuctionShareButton: {
    readyForRelease: true,
    description: "Show share button in auction screen",
    showInAdminMenu: true,
    echoFlagKey: "AREnableAuctionShareButton",
  },
  AREnableNewOpaqueImageView: {
    readyForRelease: true,
    description: "Enable New Opaque Image View",
    showInAdminMenu: true,
    echoFlagKey: "AREnableNewOpaqueImageView",
  },
  AREnableConversationalBuyNow: {
    readyForRelease: false,
    description: "Conversational Buy Now",
    showInAdminMenu: true,
  },
  AREnableCompleteProfileMessage: {
    readyForRelease: true,
    description: "Enable Collector Profile Complete Message",
    showInAdminMenu: true,
    echoFlagKey: "AREnableCompleteProfileMessage",
  },
  AREnableMyCollectionInsights: {
    readyForRelease: true,
    description: "Enable My Collection insights tab",
    showInAdminMenu: true,
    echoFlagKey: "AREnableMyCollectionInsights",
  },
  AREnableMyCollectionInsightsPhase1Part1: {
    readyForRelease: true,
    description: "Enable MyC insights Ph 1 Pt 1",
    showInAdminMenu: true,
    echoFlagKey: "AREnableMyCollectionInsightsPhase1Part1",
  },
  AREnableMyCollectionInsightsPhase1Part2: {
    readyForRelease: true,
    description: "Enable MyC insights Ph 1 Pt 2",
    showInAdminMenu: true,
    echoFlagKey: "AREnableMyCollectionInsightsPhase1Part2",
  },
  AREnableMyCollectionInsightsPhase1Part3: {
    readyForRelease: false,
    description: "Enable MyC insights Ph 1 Pt 3",
    showInAdminMenu: true,
  },
  AREnableNotFoundFailureView: {
    readyForRelease: true,
    description: "Enable Not Found Failure View",
    showInAdminMenu: true,
    echoFlagKey: "AREnableNotFoundFailureView",
  },
  AREnableArtworksFromNonArtsyArtists: {
    readyForRelease: false,
    description: "Enable My Collection artworks from non-Artsy artists",
    showInAdminMenu: true,
  },
  AREnableCreateArtworkAlert: {
    readyForRelease: true,
    description: "Enable Create Alert on Artwork pages",
    showInAdminMenu: true,
    echoFlagKey: "AREnableCreateArtworkAlert",
  },
})

export interface DevToggleDescriptor {
  /**
   * Provide a short description for the admin menu.
   */
  readonly description: string
  /**
   * Provide some action/thunk to run when the toggle value is changed.
   */
  readonly onChange?: (value: boolean, { toast }: { toast: ReturnType<typeof useToast> }) => void
}

// Helper function to get good typings and intellisense
const defineDevToggles = <T extends string>(devToggleMap: {
  readonly [devToggleName in T]: DevToggleDescriptor
}) => devToggleMap

export type DevToggleName = keyof typeof devToggles

export const devToggles = defineDevToggles({
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
  DTShowNavigationVisualiser: {
    description: "Navigation visualiser",
  },
  DTEasyMyCollectionArtworkCreation: {
    description: "MyCollection artworks easy add",
  },
  DTShowWebviewIndicator: {
    description: "Webview indicator",
  },
  DTShowInstagramShot: {
    description: "Instagram viewshot debug",
  },
  DTCaptureExceptionsInSentryOnDev: {
    description: "Capture exceptions in Sentry on DEV",
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
})

export const isDevToggle = (name: FeatureName | DevToggleName): name is DevToggleName => {
  return Object.keys(devToggles).includes(name)
}

type Assert<T, U extends T> = U
// If you mouse-over the name of the type below, you should be able to see the key that needs renaming!
export type _ThereIsAKeyThatIsCommonInFeaturesAndDevToggles_PleaseRename_MouseOverToSeeTheNaughtyKey =
  Assert<never, keyof (typeof features | typeof devToggles)>
