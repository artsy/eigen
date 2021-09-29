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
function defineFeatures<T extends string>(featureMap: { readonly [featureName in T]: FeatureDescriptor }) {
  return featureMap
}

export type FeatureName = keyof typeof features

export const features = defineFeatures({
  AROptionsBidManagement: {
    readyForRelease: true,
    echoFlagKey: "AROptionsBidManagement",
  },
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
  AREnableSavedSearch: {
    readyForRelease: true,
    echoFlagKey: "AREnableSavedSearch",
    description: "Enable Saved Search: iOS",
  },
  AREnableNewNewWorksForYou: {
    readyForRelease: false,
    description: "Enable new 'New Works For You' rail",
    showInAdminMenu: true,
  },
  AREnableSavedSearchAndroid: {
    readyForRelease: true,
    echoFlagKey: "AREnableSavedSearchAndroid",
    description: "Enable Saved Search: Android",
    showInAdminMenu: true,
  },
  AREnableSavedSearchV2: {
    readyForRelease: true,
    echoFlagKey: "AREnableSavedSearchV2",
    description: "Enable Saved Search V2",
    showInAdminMenu: true,
  },
  AREnableNewOnboardingFlow: {
    readyForRelease: false,
    description: "Enable new onboarding flow",
    showInAdminMenu: true,
  },
  AREnableSavedAddresses: {
    readyForRelease: false,
    description: "Enable Saved Addresses",
    showInAdminMenu: true,
  },
  AREnableAuctionResultsKeywordFilter: {
    readyForRelease: true,
    description: "Enable auction results keyword filter",
    showInAdminMenu: true,
    echoFlagKey: "AREnableAuctionResultsKeywordFilter",
  },
  AREnableImprovedSearch: {
    readyForRelease: false,
    description: "Enable improved search experience",
    showInAdminMenu: true,
  },
  ARPhoneValidation: {
    readyForRelease: false,
    description: "Enable phone number validation",
    showInAdminMenu: true,
  },
  AREnableTrove: {
    readyForRelease: false,
    description: "Enable Trove in homepage",
    showInAdminMenu: true,
  },
  AREnableMyCollectionAndroid: {
    readyForRelease: false,
    description: "Enable My Collection (Android)",
    showInAdminMenu: true,
  },
  AREnableMyCollectionIOS: {
    readyForRelease: true,
    description: "Enable My Collection (iOS)",
    showInAdminMenu: true,
    echoFlagKey: "AREnableMyCollectionIOS",
  },
  ARShowNetworkUnavailableModal: {
    readyForRelease: true,
    description: "Enable network unavailable modal",
    showInAdminMenu: true,
    echoFlagKey: "ARShowNetworkUnavailableModal",
  },
  ARGoogleAuth: {
    readyForRelease: true,
    description: "Enable Google authentication",
    showInAdminMenu: true,
    echoFlagKey: "ARGoogleAuth",
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
const defineDevToggles = <T extends string>(devToggleMap: { readonly [devToggleName in T]: DevToggleDescriptor }) =>
  devToggleMap

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
})

export const isDevToggle = (name: FeatureName | DevToggleName): name is DevToggleName => {
  return Object.keys(devToggles).includes(name)
}

type Assert<T, U extends T> = U
// If you mouse-over the name of the type below, you should be able to see the key that needs renaming!
export type _ThereIsAKeyThatIsCommonInFeaturesAndDevToggles_PleaseRename_MouseOverToSeeTheNaughtyKey = Assert<
  never,
  keyof (typeof features | typeof devToggles)
>
