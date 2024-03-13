import AsyncStorage from "@react-native-async-storage/async-storage"
import { EXPERIMENT_NAME, experiments } from "app/utils/experiments/experiments"
import { nullToUndef } from "app/utils/nullAndUndef"
import { Config } from "react-native-config"
import { UnleashClient } from "unleash-proxy-client"

// We want to return a phony unleash client for oss builds
// Some typescript magic so we only have to specify public fields
type PublicFields<T> = {
  [K in keyof T]: T[K] extends { [P in keyof T[K]]: T[K][P] } ? K : never
}[keyof T]

type PublicType<T> = Pick<T, PublicFields<T>>

export type PublicUnleashClient = PublicType<UnleashClient>

/**
 * This will return an unleash client
 * If `env` is undefined, it will use whatever environment we are currently using,
 * production by default.
 * If a specific env is asked, then it will either use the current one if it's right,
 * or create a new one in the requested env.
 */
export function getUnleashClient(props?: {
  env?: "production" | "staging"
  userId?: string | null
}): PublicUnleashClient {
  if (Config.OSS === "true") {
    return fakeUnleashClient
  }

  if (!unleashClient || (props?.env !== undefined && props.env !== envBeingUsed)) {
    if (props?.env !== undefined) {
      envBeingUsed = props?.env
    }
    unleashClient = createUnleashClient(nullToUndef(props?.userId))
    unleashClient.start()
  }
  return unleashClient
}

let unleashClient: UnleashClient | null = null

const storageName = (name: string) => `unleash-values:${name}`

const createUnleashClient = (userId: string | undefined) => {
  console.debug("Unleash creating client", envBeingUsed)

  return new UnleashClient({
    url:
      envBeingUsed === "production"
        ? Config.UNLEASH_PROXY_URL_PRODUCTION
        : Config.UNLEASH_PROXY_URL_STAGING,
    clientKey:
      envBeingUsed === "production"
        ? Config.UNLEASH_PROXY_CLIENT_KEY_PRODUCTION
        : Config.UNLEASH_PROXY_CLIENT_KEY_STAGING,
    appName: "eigen",
    context: {
      userId,
    },
    refreshInterval: 0, // don't refresh. we will manually refresh on appStart and goingForeground.
    storageProvider: {
      save: async (name, data) => AsyncStorage.setItem(storageName(name), JSON.stringify(data)),
      get: async (name) => {
        const data = await AsyncStorage.getItem(storageName(name))
        return data ? JSON.parse(data) : undefined
      },
    },
    bootstrapOverride: false,
    bootstrap: (Object.keys(experiments) as EXPERIMENT_NAME[]).map((key) => {
      const experiment = experiments[key]

      if (experiment.fallbackEnabled) {
        return {
          name: key,
          enabled: true,
          variant: {
            enabled: true,
            name: experiment.fallbackVariant ?? "disabled",
            payload:
              experiment.fallbackPayload === undefined
                ? undefined
                : { type: "string", value: String(experiment.fallbackPayload) },
          },
          impressionData: true,
        }
      }
      return {
        name: key,
        enabled: false,
        variant: {
          enabled: experiment.fallbackEnabled,
          name: "disabled",
          payload: undefined,
        },
        impressionData: true,
      }
    }),
  })
}

let envBeingUsed: "production" | "staging" = "production"

// Phony unleash client for oss contributors
const fakeUnleashClient: PublicUnleashClient = {
  isEnabled: () => false,
  getVariant: () => ({ name: "disabled", enabled: false }),
  getAllToggles() {
    return []
  },
  updateContext: () => Promise.resolve(),
  getContext: () => ({ appName: "eigen" }),
  start: () => Promise.resolve(),
  stop: () => Promise.resolve(),
  on: (_event: string, _callback: Function, _ctx?: any) => {
    console.log("[oss] unleash not available, returning fake client")
    return {} as UnleashClient
  },
  once: (_event: string, _callback: Function, _ctx?: any) => {
    console.log("[oss] unleash not available, returning fake client")
    return {} as UnleashClient
  },
  emit: (_event: string, _callback: Function, _ctx?: any) => {
    console.log("[oss] unleash not available, returning fake client")
    return {} as UnleashClient
  },
  off: (_event: string, _callback?: Function) => {
    console.log("[oss] unleash not available, returning fake client")
    return {} as UnleashClient
  },
  setContextField: (_field: string, _value: string) => Promise.resolve(),
}
