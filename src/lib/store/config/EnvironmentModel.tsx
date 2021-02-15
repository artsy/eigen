import { action, Action, computed, Computed } from "easy-peasy"

type Environment = "staging" | "production"

interface EnvironmentOptionDescriptor {
  readonly description: string
  readonly presets: { readonly [k in Environment | "local"]: string }
}

// helper to get good typings and intellisense
function defineEnvironmentOptions<EnvOptionName extends string>(
  options: { readonly [k in EnvOptionName]: EnvironmentOptionDescriptor }
) {
  return options
}

export type EnvironmentKey = keyof typeof environment
export const environment = defineEnvironmentOptions({
  gravityURL: {
    description: "Gravity URL",
    presets: {
      local: "https://localhost:3000",
      staging: "https://stagingapi.artsy.net",
      production: "https://api.artsy.net",
    },
  },
  metaphysicsURL: {
    description: "Metaphysics URL",
    presets: {
      local: "https://localhost:3000/v2",
      staging: "https://metaphysics-staging.artsy.net/v2",
      production: "https://metaphysics.artsy.net/v2",
    },
  },
  predictionURL: {
    description: "Prediction URL",
    presets: {
      local: "https://localhost:3000/v2",
      staging: "https://live-staging.artsy.net",
      production: "https://live.artsy.net",
    },
  },
  webURL: {
    description: "Force URL",
    presets: {
      local: "https://localhost:5000",
      staging: "https://staging.artsy.net",
      production: "https://artsy.net",
    },
  },
})

export interface EnvironmentModel {
  env: Environment
  adminOverrides: { [k in EnvironmentKey]?: string }
  strings: Computed<EnvironmentModel, { [k in EnvironmentKey]: string }>
  setAdminOverride: Action<EnvironmentModel, { key: EnvironmentKey; value: string | null }>
  setEnv: Action<EnvironmentModel, Environment>
}

export const EnvironmentModel: EnvironmentModel = {
  env: __DEV__ ? "staging" : "production",
  adminOverrides: {},
  strings: computed(({ env, adminOverrides }) => {
    const result: { [k in EnvironmentKey]: string } = {} as any

    for (const [key, val] of Object.entries(environment)) {
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
}
