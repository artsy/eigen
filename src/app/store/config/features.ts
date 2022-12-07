import { useToast } from "app/Components/Toast/toastHook"
import { echoLaunchJson } from "app/utils/jsonFiles"
import { GlobalStore } from "../GlobalStore"

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
    echoFlagKey: "ARGoogleAuth",
  },
  AREnableExampleExperiments: {
    // we can remove this as soon as we have a real experiment on Unleash
    readyForRelease: false,
    description: "Show example Unleash experiments",
  },
  AREnableQueriesPrefetching: {
    readyForRelease: true,
    description: "Enable query prefetching",
    echoFlagKey: "AREnableQueriesPrefetching",
  },
  ARAllowLinkSocialAccountsOnSignUp: {
    readyForRelease: true,
    description: "Allow linking of social accounts on sign up",
    echoFlagKey: "ARAllowLinkSocialAccountsOnSignUp",
  },
  AREnableImageSearch: {
    readyForRelease: false,
    description: "Enable search with image",
    showInDevMenu: true,
  },
  AREnableMyCollectionSearchBar: {
    readyForRelease: true,
    description: "Enable My Collection search bar",
    echoFlagKey: "AREnableMyCollectionSearchBar",
  },
  AREnablePlaceholderLayoutAnimation: {
    readyForRelease: true,
    description: "Enable placeholder layout animation",
    echoFlagKey: "AREnablePlaceholderLayoutAnimation",
  },
  ARDarkModeSupport: {
    readyForRelease: false,
    description: "Support dark mode",
  },
  ARShowRequestPriceEstimateBanner: {
    readyForRelease: true,
    description: "Show request price estimate banner",
    echoFlagKey: "ARShowRequestPriceEstimateBanner",
  },
  ARShowMyCollectionDemandIndexHints: {
    readyForRelease: true,
    description: "Show demand index hints",
    echoFlagKey: "ARShowMyCollectionDemandIndexHints",
  },
  AREnablePriceEstimateRange: {
    readyForRelease: false,
    description: "Enable My Collection Price Estimate Range",
    showInDevMenu: false,
  },
  AREnableHomeScreenArtworkRecommendations: {
    readyForRelease: true,
    description: "Enable Home Screen Artwork Recommendations",
    echoFlagKey: "AREnableHomeScreenArtworkRecommendations",
  },
  AREnableMapScreen: {
    readyForRelease: false,
    description: "Enable Crossplatform Map Screen",
    showInDevMenu: true,
  },
  AREnableAuctionShareButton: {
    readyForRelease: true,
    description: "Show share button in auction screen",
    echoFlagKey: "AREnableAuctionShareButton",
  },
  AREnableNewOpaqueImageComponent: {
    readyForRelease: true,
    description: "Enable New Image Component",
    showInDevMenu: true,
    echoFlagKey: "AREnableNewOpaqueImageComponent",
  },
  AREnableConversationalBuyNow: {
    readyForRelease: true,
    description: "Conversational Buy Now",
    echoFlagKey: "AREnableConversationalBuyNow",
  },
  AREnableMyCollectionInsights: {
    readyForRelease: true,
    description: "Enable My Collection insights tab",
    echoFlagKey: "AREnableMyCollectionInsights",
  },
  AREnableArtworksFromNonArtsyArtists: {
    readyForRelease: false,
    description: "Enable My Collection artworks from non-Artsy artists",
    showInDevMenu: true,
    echoFlagKey: "AREnableArtworksFromNonArtsyArtists",
  },
  AREnableArtworksConnectionForAuction: {
    readyForRelease: true,
    description: "Use artworksConnection for Auction screen",
    echoFlagKey: "AREnableArtworksConnectionForAuction",
  },
  AREnableActivity: {
    readyForRelease: true,
    description: "Enable Activity",
    showInDevMenu: true,
    echoFlagKey: "AREnableActivity",
  },
  AREnableMyCollectionHFOnboarding: {
    readyForRelease: true,
    description: "Enable My Collection home feed onboarding",
    showInDevMenu: true,
    echoFlagKey: "AREnableMyCollectionHFOnboarding",
  },
  AREnableCollectionsInOnboarding: {
    readyForRelease: true,
    description: "Replace genes with collections in onboarding",
    echoFlagKey: "AREnableCollectionsInOnboarding",
  },
  AREnableNewRequestPriceEstimateLogic: {
    description: "Enable new request price estimate logic",
    showInDevMenu: true,
    readyForRelease: true,
    echoFlagKey: "AREnableNewRequestPriceEstimateLogic",
  },
  ARReorderSWAArtworkSubmissionFlow: {
    description: "Reorder SWA Artwork submission flow",
    showInDevMenu: true,
    readyForRelease: true,
    echoFlagKey: "ARReorderSWAArtworkSubmissionFlow",
  },
  ARArtworkRedesingPhase2: {
    description: "Enable redesigned artwork page (phase 2)",
    showInDevMenu: true,
    readyForRelease: true,
    echoFlagKey: "ARArtworkRedesingPhase2",
  },
  AREnablePanOnStaticHeader: {
    description: "Enable Scroll/Pan on StaticHeader",
    showInDevMenu: true,
    readyForRelease: false,
  },
  AREnableSearchDiscoveryContentIOS: {
    description: "Display discovery content on Search tab on iOS",
    showInDevMenu: true,
    readyForRelease: true,
    echoFlagKey: "AREnableSearchDiscoveryContentIOS",
  },
  AREnableSearchDiscoveryContentAndroid: {
    description: "Display discovery content on Search tab on Android",
    showInDevMenu: true,
    readyForRelease: true,
    echoFlagKey: "AREnableSearchDiscoveryContentAndroid",
  },
  AREnforceLargeNewWorksRail: {
    description: "Enforce large new works rail",
    showInDevMenu: true,
    readyForRelease: false,
  },
  AREnableArtworkGridSaveIcon: {
    description: "Enable artwork grid save icon",
    showInDevMenu: true,
    readyForRelease: true,
    echoFlagKey: "AREnableArtworkGridSaveIcon",
  },
  AREnableAndroidImagesGallery: {
    description: "Enable images gallery on Android",
    showInDevMenu: true,
    readyForRelease: false,
  },
})

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
  DTMyCollectionDeleteAllArtworks: {
    description: "MyCollection delete all artworks",
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
  DTEnableNewImageLabel: {
    description: "Show a label on new OpaqueImageView",
  },
})

export const isDevToggle = (name: FeatureName | DevToggleName): name is DevToggleName => {
  return Object.keys(devToggles).includes(name)
}

type Assert<T, U extends T> = U
// If you mouse-over the name of the type below, you should be able to see the key that needs renaming!
export type _ThereIsAKeyThatIsCommonInFeaturesAndDevToggles_PleaseRename_MouseOverToSeeTheNaughtyKey =
  Assert<never, keyof (typeof features | typeof devToggles)>
