import AsyncStorage from "@react-native-async-storage/async-storage"
import FlagProvider from "@unleash/proxy-client-react"
import { UnleashInitializer } from "app/utils/UnleashInitializer"
import { useUnleashEnvironment } from "app/utils/experiments/hooks"
import Keys from "react-native-keys"

export const InitializedFlagProvider: React.FC = ({ children }) => {
  const { unleashEnv: env } = useUnleashEnvironment()

  const storageName = (name: string) => `unleash-values:${name}`

  const config = {
    url:
      env === "production"
        ? Keys.secureFor("UNLEASH_PROXY_URL_PRODUCTION")
        : Keys.secureFor("UNLEASH_PROXY_URL_STAGING"),
    clientKey:
      env === "production"
        ? Keys.secureFor("UNLEASH_PROXY_CLIENT_KEY_PRODUCTION")
        : Keys.secureFor("UNLEASH_PROXY_CLIENT_KEY_STAGING"),
    appName: "eigen",
    storageProvider: {
      save: async (name: string, data: any) =>
        AsyncStorage.setItem(storageName(name), JSON.stringify(data)),
      get: async (name: string) => {
        const data = await AsyncStorage.getItem(storageName(name))
        return data ? JSON.parse(data) : undefined
      },
    },
  }

  return (
    <FlagProvider config={config} startClient={false}>
      <UnleashInitializer children={children} />
    </FlagProvider>
  )
}
