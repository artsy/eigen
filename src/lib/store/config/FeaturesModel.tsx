import { Action, action, Computed, computed } from "easy-peasy"
import { GlobalStoreModel } from "../GlobalStoreModel"
import { FeatureName, features, ToolName, tools } from "./features"

export type FeatureMap = { [k in FeatureName]: boolean }
export type ToolMap = { [k in ToolName]: boolean }

export interface FeaturesModel {
  adminOverrides: { [k in FeatureName | ToolName]?: boolean }
  setAdminOverride: Action<FeaturesModel, { key: FeatureName | ToolName; value: boolean | null }>
  flags: Computed<FeaturesModel, FeatureMap, GlobalStoreModel> // user features
  tools: Computed<FeaturesModel, ToolMap, GlobalStoreModel> // admin tools
}

export const FeaturesModel: FeaturesModel = {
  adminOverrides: {},
  setAdminOverride: action((state, { key, value }) => {
    if (value === null) {
      delete state.adminOverrides[key]
    } else {
      state.adminOverrides[key] = value
    }
  }),
  flags: computed([(state) => state, (_, store) => store.config.echo], (state, echo) => {
    const result = {} as any
    for (const [key, feature] of Object.entries(features)) {
      if (state.adminOverrides[key as FeatureName] != null) {
        // If there's an admin override, it takes precedence
        result[key] = state.adminOverrides[key as FeatureName]
      } else if (feature.readyForRelease) {
        // If the feature is ready for release, the echo flag takes precedence
        const echoFlag = echo.state.features.find((f) => f.name === feature.echoFlagKey)

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
  tools: computed((state) => {
    const result = {} as any
    for (const [key] of Object.entries(tools)) {
      if (state.adminOverrides[key as ToolName] != null) {
        // If there's an admin override, it takes precedence
        result[key] = state.adminOverrides[key as ToolName]
      } else {
        result[key] = false
      }
    }
    return result
  }),
}
