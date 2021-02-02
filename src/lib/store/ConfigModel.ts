import { action, Action, computed, Computed, thunk, Thunk, thunkOn, ThunkOn } from "easy-peasy"
import moment from "moment"
import Config from "react-native-config"
import echoLaunchJSON from "../../../Artsy/App/EchoNew.json"
import { GlobalStoreModel } from "./GlobalStoreModel"

interface FeatureDescriptor {
  /**
   * Set readyForRelease to `true` when the feature is ready to be exposed outside of dev mode.
   * Echo flags and gravity lab features still take precedence after this is set to `true`.
   * If this is set to `false`, the feature will never be shown except if overridden in the admin menu.
   */
  readonly readyForRelease: boolean
  /**
   * Provide an echo feature flag key to allow this feature to be toggled globally via echo.
   */
  readonly echoFlagKey?: string
  /**
   * Provide a description to show the feature flag in the admin menu
   */
  readonly description?: string
}

// Helper function to get good typings and intellisense
function defineFeatures<T extends string>(featureMap: { readonly [featureName in T]: FeatureDescriptor }) {
  return featureMap
}
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
  AROptionsNewInsightsPage: {
    readyForRelease: false,
    echoFlagKey: "AROptionsNewInsightsPage",
  },
  AROptionsInquiryCheckout: {
    readyForRelease: false,
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
    readyForRelease: false,
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
    echoFlagKey: "AREnableViewingRooms"
  }
})

export type FeatureName = keyof typeof features

type EchoJSON = typeof echoLaunchJSON

export interface ConfigModel {
  adminFeatureFlagOverrides: { [k in FeatureName]: boolean | null }
  echoState: EchoJSON
  sessionState: {
    webURL: string
    gravityBaseURL: string
    metaphysicsBaseURL: string
    predictionBaseURL: string
    gravitySecret: string
    gravityKey: string
  }
  didRehydrate: ThunkOn<ConfigModel, {}, GlobalStoreModel>
  setEchoState: Action<ConfigModel, EchoJSON>
  fetchRemoteEcho: Thunk<ConfigModel>
  features: Computed<ConfigModel, { [k in FeatureName]: boolean }>
  setAdminOverride: Action<ConfigModel, { key: FeatureName; value: boolean | null }>
}
export const ConfigModel: ConfigModel = {
  adminFeatureFlagOverrides: {} as any,
  features: computed((state) => {
    const result = {} as any
    for (const [key, feature] of Object.entries(features)) {
      if (state.adminFeatureFlagOverrides[key as FeatureName] != null) {
        // If there's an admin override, it takes precedence
        result[key] = state.adminFeatureFlagOverrides[key as FeatureName]
      } else if (feature.readyForRelease) {
        // If the feature is ready for release, the echo flag takes precedence
        result[key] = state.echoState.features.find((f) => f.name === feature.echoFlagKey)?.value ?? true
      } else {
        // If the feature is not ready for release, uh, don't show it
        result[key] = false
      }
    }
    return result
  }),
  echoState: echoLaunchJSON,
  sessionState: {
    webURL: "https://staging.artsy.net",
    gravityBaseURL: "https://stagingapi.artsy.net",
    metaphysicsBaseURL: "https://metaphysics-staging.artsy.net/v2",
    predictionBaseURL: "https://live-staging.artsy.net",
    gravityKey: Config.ARTSY_API_CLIENT_KEY,
    gravitySecret: Config.ARTSY_API_CLIENT_SECRET,
  },
  setEchoState: action((state, echoJSON) => {
    state.echoState = echoJSON
  }),
  fetchRemoteEcho: thunk(async (actions) => {
    const result = await fetch("https://echo.artsy.net/Echo.json")
    if (result.ok) {
      const json = await result.json()
      actions.setEchoState(json)
    }
  }),
  didRehydrate: thunkOn(
    (_, storeActions) => storeActions.rehydrate,
    (actions, __, store) => {
      const persistedEchoTimestamp = moment(store.getState().echoState.updated_at)
      const launchEchoTimestamp = moment(echoLaunchJSON.updated_at)
      if (launchEchoTimestamp.isAfter(persistedEchoTimestamp)) {
        actions.setEchoState(echoLaunchJSON)
      }
      actions.fetchRemoteEcho()
    }
  ),
  setAdminOverride: action((state, { key, value }) => {
    state.adminFeatureFlagOverrides[key] = value
  }),
}
