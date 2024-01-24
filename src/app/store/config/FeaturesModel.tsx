import { GlobalStoreModel } from "app/store/GlobalStoreModel"
import { Action, action, Computed, computed } from "easy-peasy"
import {
  DevToggleName,
  devToggles,
  FeatureName,
  FeatureReadyForRelease,
  features,
} from "./features"

export type FeatureMap = { [k in FeatureName]: boolean }
export type DevToggleMap = { [k in DevToggleName]: boolean }

export interface FeaturesModel {
  localOverrides: { [k in FeatureName | DevToggleName]?: boolean }
  setLocalOverride: Action<
    FeaturesModel,
    { key: FeatureName | DevToggleName; value: boolean | null }
  >
  clearLocalOverrides: Action<FeaturesModel>

  // user features
  flags: Computed<FeaturesModel, FeatureMap, GlobalStoreModel>

  // only for devs
  devToggles: Computed<FeaturesModel, DevToggleMap, GlobalStoreModel>
}

export const getFeaturesModel = (): FeaturesModel => ({
  localOverrides: {},
  setLocalOverride: action((state, { key, value }) => {
    if (value === null) {
      delete state.localOverrides[key]
    } else {
      state.localOverrides[key] = value
    }
  }),
  clearLocalOverrides: action((state) => {
    state.localOverrides = {}
  }),

  flags: computed([(state) => state, (_, store) => store.artsyPrefs.echo], (state, echo) => {
    const result = {} as any
    for (const [key, feature] of Object.entries(features)) {
      if (state.localOverrides[key as FeatureName] != null) {
        // If there's a local override, it takes precedence
        result[key] = state.localOverrides[key as FeatureName]
      } else if (feature.readyForRelease) {
        // If the feature is ready for release, the echo flag takes precedence
        const echoFlag = echo.state.features.find(
          (f) => f.name === (feature as FeatureReadyForRelease).echoFlagKey
        )

        if ((feature as FeatureReadyForRelease).echoFlagKey && !echoFlag && __DEV__) {
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

  devToggles: computed((state) => {
    const result = {} as any
    for (const [key] of Object.entries(devToggles)) {
      result[key] = state.localOverrides[key as DevToggleName] ?? false
    }
    return result
  }),
})
