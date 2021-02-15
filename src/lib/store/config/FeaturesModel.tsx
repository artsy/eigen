import { Action, action, Computed, computed } from "easy-peasy"
import { GlobalStoreModel } from "../GlobalStoreModel"
import { FeatureName, features } from "./features"

export type FeatureMap = { [k in FeatureName]: boolean }

export interface FeaturesModel {
  adminFeatureFlagOverrides: { [k in FeatureName]?: boolean }
  setAdminOverride: Action<FeaturesModel, { key: FeatureName; value: boolean | null }>
  flags: Computed<FeaturesModel, FeatureMap, GlobalStoreModel>
}

export const FeaturesModel: FeaturesModel = {
  adminFeatureFlagOverrides: {},
  setAdminOverride: action((state, { key, value }) => {
    if (value === null) {
      delete state.adminFeatureFlagOverrides[key]
    } else {
      state.adminFeatureFlagOverrides[key] = value
    }
  }),
  flags: computed([(state) => state, (_, store) => store.config.echo], (state, echo) => {
    const result = {} as any
    for (const [key, feature] of Object.entries(features)) {
      if (state.adminFeatureFlagOverrides[key as FeatureName] != null) {
        // If there's an admin override, it takes precedence
        result[key] = state.adminFeatureFlagOverrides[key as FeatureName]
      } else if (feature.readyForRelease) {
        // If the feature is ready for release, the echo flag takes precedence
        const echoFlag = echo.json.features.find((f) => f.name === feature.echoFlagKey)

        if (feature.echoFlagKey && !echoFlag && __DEV__) {
          console.error("No echo flag found for feature", key)
        }
        result[key] = echoFlag?.value ?? true
      } else {
        // If the feature is not ready for release, uh, don't show it
        result[key] = false
      }
    }
    return result
  }),
}
