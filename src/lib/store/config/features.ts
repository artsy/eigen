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
  AROptionsNewArtistInsightsPage: {
    readyForRelease: true,
    echoFlagKey: "AROptionsNewArtistInsightsPage",
  },
  AROptionsInquiryCheckout: {
    readyForRelease: false,
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
  AREnableCustomSharesheet: {
    readyForRelease: true,
    echoFlagKey: "AREnableCustomSharesheet",
    description: "Enable custom share sheet",
    showInAdminMenu: true,
  },
  ARUseImprovedArtworkFilters: {
    readyForRelease: false,
    description: "Use improved artwork filters",
    showInAdminMenu: true,
  },
  ARUseNewOnboarding: {
    readyForRelease: false,
    description: "Use new onboarding",
    showInAdminMenu: true,
  },
})

export interface DevToggleDescriptor {
  /**
   * Provide a short description for the admin menu.
   */
  readonly description: string
  /**
   * Provide some action/thunk to run when the toggle is turned on.
   */
  readonly onTrue?: ({ toast }: { toast: ReturnType<typeof useToast> }) => void
  /**
   * Provide some action/thunk to run when the toggle is turned on.
   */
  readonly onFalse?: ({ toast }: { toast: ReturnType<typeof useToast> }) => void
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
    onTrue: ({ toast }) => {
      GlobalStore.actions.config.echo.setEchoState(echoLaunchJson())
      toast.show("Loaded bundled echo config", "middle")
    },
    onFalse: ({ toast }) => {
      GlobalStore.actions.config.echo.fetchRemoteEcho()
      toast.show("Fetched remote echo config", "middle")
    },
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
