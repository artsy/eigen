import { useToast } from "lib/Components/Toast/toastHook"
import { echoLaunchJson } from "lib/utils/jsonFiles"
import { Platform } from "react-native"
import { GlobalStore } from "../GlobalStore"

export interface FeatureDescriptor {
  /**
   * Set readyForRelease to `true` when the feature is ready to be exposed outside of dev mode.
   * If an echo flag key is specified, the echo flag's value will be used after this is set to `true`.
   * If this is set to `false`, the feature will never be shown except if overridden in the admin menu.
   */
  readonly readyForRelease: boolean
  /**
   * Provide an echo feature flag key to allow this feature to be toggled globally via echo.
   * Make sure to add the flag to echo before setting this value. Then run ./scripts/update-echo
   */
  readonly echoFlagKey?: string
  /**
   * Provide a short description for the admin menu
   */
  readonly description?: string
  /**
   * Whether or not to show the feature flag in the admin menu. Consider also providing a description.
   */
  readonly showInAdminMenu?: boolean
}

// Helper function to get good typings and intellisense
function defineFeatures<T extends string>(featureMap: {
  readonly [featureName in T]: FeatureDescriptor
}) {
  return featureMap
}

export type FeatureName = keyof typeof features

export const features = defineFeatures({
  AROptionsArtistSeries: {
    readyForRelease: true,
    echoFlagKey: "AROptionsArtistSeries",
  },
  AROptionsNewFirstInquiry: {
    readyForRelease: true,
    echoFlagKey: "AROptionsNewFirstInquiry",
  },
  AROptionsInquiryCheckout: {
    readyForRelease: true,
    echoFlagKey: "AROptionsInquiryCheckout",
    description: "Enable inquiry checkout",
    showInAdminMenu: true,
  },
  AROptionsPriceTransparency: {
    readyForRelease: true,
    echoFlagKey: "AROptionsPriceTransparency",
    description: "Price Transparency",
    showInAdminMenu: true,
  },
  ARDisableReactNativeBidFlow: {
    readyForRelease: true,
    echoFlagKey: "ARDisableReactNativeBidFlow",
  },
  AREnableNewPartnerView: {
    readyForRelease: true,
    echoFlagKey: "AREnableNewPartnerView",
  },
  AROptionsUseReactNativeWebView: {
    readyForRelease: true,
    echoFlagKey: Platform.OS === "ios" ? "AREnableReactNativeWebView" : undefined,
    description: "Use react-native web views",
    showInAdminMenu: Platform.OS !== "android",
  },
  AROptionsLotConditionReport: {
    readyForRelease: true,
    echoFlagKey: "AROptionsLotConditionReport",
  },
  AROptionsNewSalePage: {
    readyForRelease: true,
    echoFlagKey: "AROptionsNewSalePage",
  },
  AREnableViewingRooms: {
    readyForRelease: true,
    echoFlagKey: "AREnableViewingRooms",
  },
  ARHomeAuctionResultsByFollowedArtists: {
    readyForRelease: true,
    echoFlagKey: "ARHomeAuctionResultsByFollowedArtists",
    description: "Enable home auction results",
    showInAdminMenu: true,
  },
  AREnableCustomSharesheet: {
    readyForRelease: true,
    echoFlagKey: "AREnableCustomSharesheet",
    description: "Enable custom share sheet",
    showInAdminMenu: true,
  },
  AREnableOrderHistoryOption: {
    readyForRelease: true,
    echoFlagKey: "AREnableOrderHistoryOption",
    description: "Enable Order History in settings",
    showInAdminMenu: true,
  },
  AREnableSavedAddresses: {
    readyForRelease: false,
    description: "Enable Saved Addresses",
    showInAdminMenu: true,
  },
  AREnableImprovedSearchPills: {
    readyForRelease: false,
    description: "Enable improved search pills",
    showInAdminMenu: true,
    echoFlagKey: "AREnableImprovedSearchPills",
  },
  AREnableTrove: {
    readyForRelease: true,
    description: "Enable Trove in homepage",
    showInAdminMenu: true,
    echoFlagKey: "AREnableTrove",
  },
  AREnableShowsRail: {
    readyForRelease: true,
    description: "Enable Shows in homepage",
    showInAdminMenu: true,
    echoFlagKey: "AREnableShowsRail",
  },
  ARShowNetworkUnavailableModal: {
    readyForRelease: true,
    description: "Enable network unavailable modal",
    showInAdminMenu: true,
    echoFlagKey: "ARShowNetworkUnavailableModal",
  },
  ARGoogleAuth: {
    readyForRelease: false,
    description: "Enable Google authentication",
    showInAdminMenu: true,
    echoFlagKey: "ARGoogleAuth",
  },
  AREnableImprovedAlertsFlow: {
    readyForRelease: true,
    description: "Enable Improved Alerts flow",
    showInAdminMenu: true,
    echoFlagKey: "AREnableImprovedAlertsFlow",
  },
  AREnableWebPImages: {
    readyForRelease: true,
    description: "Enable WebP Images",
    showInAdminMenu: true,
    echoFlagKey: "AREnableWebPImages",
  },
  AREnableSplitIOABTesting: {
    readyForRelease: true,
    description: "Enable Split.io A/B testing",
    showInAdminMenu: true,
    echoFlagKey: "AREnableSplitIOABTesting",
  },
  AREnableSortFilterForArtworksPill: {
    readyForRelease: true,
    description: "Enable sort filter for artworks pill",
    showInAdminMenu: true,
    echoFlagKey: "AREnableSortFilterForArtworksPill",
  },
  AREnableArtistRecommendations: {
    readyForRelease: false,
    description: "Enable new artist recommendations",
    showInAdminMenu: true,
  },
  AREnableQueriesPrefetching: {
    readyForRelease: true,
    description: "Enable query prefetching",
    showInAdminMenu: true,
    echoFlagKey: "AREnableQueriesPrefetching",
  },
  AREnableAccordionNavigationOnSubmitArtwork: {
    readyForRelease: false,
    description: "Enable New Artwork Submission Flow with Accordion",
    showInAdminMenu: true,
  },
  ARCaptureExceptionsInSentryOnDev: {
    readyForRelease: false,
    description: "Enable capturing exceptions in Sentry on DEV",
    showInAdminMenu: true,
  },
  AREnableImageSearch: {
    readyForRelease: false,
    description: "Enable search with image",
    showInAdminMenu: true,
  },
  AREnableCollectorProfile: {
    readyForRelease: false,
    description: "Enable collector profile",
    showInAdminMenu: true,
  },
  ARShowConsignmentsInMyCollection: {
    readyForRelease: false,
    description: "Show consignments in My Collection",
  },
  AREnablePlaceholderLayoutAnimation: {
    readyForRelease: true,
    description: "Enable placeholder layout animation",
  },
  AREnableNewMyCollectionArtwork: {
    readyForRelease: false,
    description: "Enable new my collection artwork page",
    showInAdminMenu: true,
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
    description: "Show quick access info",
  },
  DTDisableEchoRemoteFetch: {
    description: "Disable fetching remote echo",
    onChange: (value, { toast }) => {
      if (value) {
        GlobalStore.actions.config.echo.setEchoState(echoLaunchJson())
        toast.show("Loaded bundled echo config", "middle")
      } else {
        GlobalStore.actions.config.echo.fetchRemoteEcho()
        toast.show("Fetched remote echo config", "middle")
      }
    },
  },
  DTShowAnalyticsVisualiser: {
    description: "Show analytics visualiser",
  },
  DTEasyMyCollectionArtworkCreation: {
    description: "Easily add my collection artworks",
  },
  DTShowWebviewIndicator: {
    description: "Show webview indicator",
  },
  DTShowInstagramShot: {
    description: "Show Instagram viewshot",
  },
})

export const isDevToggle = (name: FeatureName | DevToggleName): name is DevToggleName => {
  return Object.keys(devToggles).includes(name)
}

type Assert<T, U extends T> = U
// If you mouse-over the name of the type below, you should be able to see the key that needs renaming!
export type _ThereIsAKeyThatIsCommonInFeaturesAndDevToggles_PleaseRename_MouseOverToSeeTheNaughtyKey =
  Assert<never, keyof (typeof features | typeof devToggles)>
