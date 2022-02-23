import { ArtsyNativeModule } from "app/NativeModules/ArtsyNativeModule"
import { LegacyNativeModules } from "app/NativeModules/LegacyNativeModules"
import { action, Action, computed, Computed, thunkOn, ThunkOn } from "easy-peasy"
import { Platform } from "react-native"
import { unsafe__getEnvironment } from "../GlobalStore"
import { GlobalStoreModel } from "../GlobalStoreModel"

type Environment = "staging" | "production"

interface EnvironmentOptionDescriptor {
  readonly description: string
  readonly presets: { readonly [k in Environment | "local"]: string }
}

// helper to get good typings and intellisense
function defineEnvironmentOptions<EnvOptionName extends string>(options: {
  readonly [k in EnvOptionName]: EnvironmentOptionDescriptor
}) {
  return options
}

export type EnvironmentKey = keyof typeof environment
export const environment = defineEnvironmentOptions({
  gravityURL: {
    description: "Gravity URL",
    presets: {
      local: "http://localhost:3000",
      staging: "https://stagingapi.artsy.net",
      production: "https://api.artsy.net",
    },
  },
  metaphysicsURL: {
    description: "Metaphysics URL",
    presets: {
      local: "http://localhost:3000/v2",
      staging: "https://metaphysics-staging.artsy.net/v2",
      production: "https://metaphysics-production.artsy.net/v2",
    },
  },
  predictionURL: {
    description: "Prediction URL",
    presets: {
      local: "http://localhost:3000/v2",
      staging: "https://live-staging.artsy.net",
      production: "https://live.artsy.net",
    },
  },
  webURL: {
    description: "Force URL",
    presets: {
      local: "http://localhost:5000",
      staging: "https://staging.artsy.net",
      production: "https://www.artsy.net",
    },
  },
  causalityURL: {
    description: "Causality WebSocket URL",
    presets: {
      local: "ws://localhost:8080",
      staging: "wss://causality-staging.artsy.net",
      production: "wss://causality.artsy.net",
    },
  },
})

export interface EnvironmentModel {
  env: Environment
  setEnv: Action<this, this["env"]>

  adminOverrides: { [k in EnvironmentKey]?: string }
  setAdminOverride: Action<EnvironmentModel, { key: EnvironmentKey; value: string | null }>
  clearAdminOverrides: Action<EnvironmentModel>

  strings: Computed<EnvironmentModel, { [k in EnvironmentKey]: string }>

  updateNativeState: ThunkOn<EnvironmentModel, {}, GlobalStoreModel>
}

export const getEnvironmentModel = (): EnvironmentModel => ({
  env: ArtsyNativeModule.isBetaOrDev ? "staging" : "production",
  adminOverrides: {},
  strings: computed(({ env, adminOverrides }) => {
    const result: { [k in EnvironmentKey]: string } = {} as any

    for (const [key, val] of Object.entries(environment)) {
      // use the admin override value if present, otherwise use the value for the current environment
      result[key as EnvironmentKey] = adminOverrides[key as EnvironmentKey] ?? val.presets[env]
    }

    return result
  }),
  setAdminOverride: action((state, { key, value }) => {
    if (value === null) {
      delete state.adminOverrides[key]
    } else {
      state.adminOverrides[key] = value
    }
  }),
  setEnv: action((state, env) => {
    state.env = env
  }),
  clearAdminOverrides: action((state) => {
    state.adminOverrides = {}
  }),
  updateNativeState: thunkOn(
    (actions) => [actions.clearAdminOverrides, actions.setAdminOverride, actions.setEnv],
    () => {
      if (Platform.OS === "ios") {
        LegacyNativeModules.ARNotificationsManager.reactStateUpdated(unsafe__getEnvironment())
      }
    }
  ),
})
