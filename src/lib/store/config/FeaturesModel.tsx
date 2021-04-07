import { Action, action, Computed, computed, ThunkOn, thunkOn } from "easy-peasy"
import { isFunction } from "lodash"
import { GlobalStoreModel } from "../GlobalStoreModel"
import { DevToggleName, devToggles, FeatureName, features } from "./features"

export type FeatureMap = { [k in FeatureName]: boolean }
export type DevToggleMap = { [k in DevToggleName]: boolean }

export interface FeaturesModel {
  adminOverrides: { [k in FeatureName | DevToggleName]?: boolean }
  setAdminOverride: Action<FeaturesModel, { key: FeatureName | DevToggleName; value: boolean | null }>

  // user features
  flags: Computed<FeaturesModel, FeatureMap, GlobalStoreModel>

  // only for devs
  devToggles: Computed<FeaturesModel, DevToggleMap, GlobalStoreModel>
}

export const getFeaturesModel = (): FeaturesModel => ({
  adminOverrides: {},
  setAdminOverride: action((state, { key, value }) => {
    if (value === null) {
      delete state.adminOverrides[key]
    } else {
      state.adminOverrides[key] = value
    }
  }),

  flags: computed([(state) => state, (_, store) => store, (_, store) => store.config.echo], (state, store, echo) => {
    const result = {} as any
    for (const [key, feature] of Object.entries(features)) {
      const readyForRelease: boolean = (() => {
        if (isFunction(feature.readyForRelease)) {
          return feature.readyForRelease((store as unknown) as GlobalStoreModel)
        }
        return feature.readyForRelease
      })()

      if (state.adminOverrides[key as FeatureName] != null) {
        // If there's an admin override, it takes precedence
        result[key] = state.adminOverrides[key as FeatureName]
      } else if (readyForRelease) {
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

  devToggles: computed((state) => {
    const result = {} as any
    for (const [key] of Object.entries(devToggles)) {
      result[key] = state.adminOverrides[key as DevToggleName] ?? false
    }
    return result
  }),
})
