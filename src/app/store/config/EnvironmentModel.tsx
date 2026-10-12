import { ArtsyNativeModule } from "app/NativeModules/ArtsyNativeModule"
import { LegacyNativeModules } from "app/NativeModules/LegacyNativeModules"
import { unsafe__getEnvironment } from "app/store/GlobalStore"
import { GlobalStoreModel } from "app/store/GlobalStoreModel"
import { action, Action, computed, Computed, thunkOn, ThunkOn } from "easy-peasy"
import { Platform } from "react-native"

type Environment = "staging" | "production"

interface EnvironmentOptionDescriptor {
  readonly description: string
  readonly presets: { readonly [k in Environment | "local"]: string } & {
    readonly reviewApp?: string
  }
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
  metaphysicsCDNURL: {
    description: "Metaphysics CDN URL",
    presets: {
      // for android, replace with http://[your-ip]:5001/v2
      // Usually you can get your IP with `ipconfig getifaddr en0`
      local: "http://localhost:5001/v2",
      staging: "https://metaphysics-cdn-staging.artsy.net/v2",
      production: "https://metaphysics-cdn.artsy.net/v2",
    },
  },
  metaphysicsURL: {
    description: "Metaphysics URL",
    presets: {
      local: "http://localhost:5001/v2",
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
      local: "http://localhost:4000",
      staging: "https://staging.artsy.net",
      production: "https://www.artsy.net",
      reviewApp: "https://express-checkout-mobile.artsy.net",
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

  localOverrides: { [k in EnvironmentKey]?: string }
  setLocalOverride: Action<EnvironmentModel, { key: EnvironmentKey; value: string | null }>
  clearLocalOverrides: Action<EnvironmentModel>

  strings: Computed<EnvironmentModel, { [k in EnvironmentKey]: string }>

  updateNativeState: ThunkOn<EnvironmentModel, {}, GlobalStoreModel>
}

export const getEnvironmentModel = (): EnvironmentModel => ({
  env: ArtsyNativeModule.isBetaOrDev ? "staging" : "production",
  localOverrides: {},
  strings: computed(({ env, localOverrides }) => {
    const result: { [k in EnvironmentKey]: string } = {} as any

    for (const [key, val] of Object.entries(environment)) {
      // use the local override value if present, otherwise use the value for the current environment
      result[key as EnvironmentKey] = localOverrides[key as EnvironmentKey] ?? val.presets[env]
    }

    return result
  }),
  setLocalOverride: action((state, { key, value }) => {
    if (value === null) {
      delete state.localOverrides[key]
    } else {
      state.localOverrides[key] = value
    }
  }),
  setEnv: action((state, env) => {
    state.env = env
  }),
  clearLocalOverrides: action((state) => {
    state.localOverrides = {}
  }),
  updateNativeState: thunkOn(
    (actions) => [actions.clearLocalOverrides, actions.setLocalOverride, actions.setEnv],
    () => {
      if (Platform.OS === "ios") {
        LegacyNativeModules.ARNotificationsManager.reactStateUpdated(unsafe__getEnvironment())
      }
    }
  ),
})
