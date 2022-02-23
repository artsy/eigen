import { useToast } from "app/Components/Toast/toastHook"
import { echoLaunchJson } from "app/utils/jsonFiles"
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
  AROptionsNewFirstInquiry: {
    readyForRelease: true,
    echoFlagKey: "AROptionsNewFirstInquiry",
  },
  AROptionsInquiryCheckout: {
    readyForRelease: true,
    echoFlagKey: "AROptionsInquiryCheckout",
    description: "Enable inquiry checkout",
  },
  AROptionsPriceTransparency: {
    readyForRelease: true,
    echoFlagKey: "AROptionsPriceTransparency",
    description: "Price Transparency",
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
  },
  AREnableCustomSharesheet: {
    readyForRelease: true,
    echoFlagKey: "AREnableCustomSharesheet",
    description: "Enable custom share sheet",
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
  AREnableImprovedSearchPills: {
    readyForRelease: false,
    description: "Enable improved search pills",
    echoFlagKey: "AREnableImprovedSearchPills",
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
    readyForRelease: false,
    description: "Enable Google authentication",
    showInAdminMenu: true,
    echoFlagKey: "ARGoogleAuth",
  },
  AREnableImprovedAlertsFlow: {
    readyForRelease: true,
    description: "Enable Improved Alerts flow",
    echoFlagKey: "AREnableImprovedAlertsFlow",
  },
  AREnableWebPImages: {
    readyForRelease: true,
    description: "Enable WebP Images",
    echoFlagKey: "AREnableWebPImages",
  },
  AREnableSplitIOABTesting: {
    readyForRelease: true,
    description: "Enable Split.io A/B testing",
    showInAdminMenu: true,
    echoFlagKey: "AREnableSplitIOABTesting",
  },
  AREnableArtistRecommendations: {
    readyForRelease: false,
    description: "Enable new artist recommendations",
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
  ARShowLinkedAccounts: {
    readyForRelease: false,
    description: "Show linked social accounts",
    showInAdminMenu: true,
  },
  ARAllowLinkSocialAccountsOnSignUp: {
    readyForRelease: false,
    description: "Allow linking of social accounts on sign up",
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
  AREnableMyCollectionSearchBar: {
    readyForRelease: false,
    description: "Enable My Collection search bar",
    showInAdminMenu: true,
  },
  ARShowConsignmentsInMyCollection: {
    readyForRelease: false,
    description: "Show consignments in My Collection",
    showInAdminMenu: true,
  },
  AREnablePlaceholderLayoutAnimation: {
    readyForRelease: true,
    description: "Enable placeholder layout animation",
  },
  AREnableNewMyCollectionArtwork: {
    readyForRelease: false,
    description: "Enable new my collection artwork page",
    showInAdminMenu: true,
    echoFlagKey: "AREnablePlaceholderLayoutAnimation",
  },
  AREnableShowOnlySubmittedMyCollectionArtworkFilter: {
    readyForRelease: false,
    description: "Enable Show Only Submitted MyCollection Artwork Filter",
    showInAdminMenu: true,
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
        GlobalStore.actions.artsyPrefs.echo.setEchoState(echoLaunchJson())
        toast.show("Loaded bundled echo config", "middle")
      } else {
        GlobalStore.actions.artsyPrefs.echo.fetchRemoteEcho()
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
  DTCaptureExceptionsInSentryOnDev: {
    description: "Enable capturing exceptions in Sentry on DEV",
  },
})

export const isDevToggle = (name: FeatureName | DevToggleName): name is DevToggleName => {
  return Object.keys(devToggles).includes(name)
}

type Assert<T, U extends T> = U
// If you mouse-over the name of the type below, you should be able to see the key that needs renaming!
export type _ThereIsAKeyThatIsCommonInFeaturesAndDevToggles_PleaseRename_MouseOverToSeeTheNaughtyKey =
  Assert<never, keyof (typeof features | typeof devToggles)>
