import AsyncStorage from "@react-native-async-storage/async-storage"
import FlagProvider, { IConfig } from "@unleash/proxy-client-react"
import { useUnleashEnvironment } from "app/system/flags/hooks/useUnleashEnvironment"
import { useUnleashInitializer } from "app/system/flags/hooks/useUnleashInitializer"
import { useUnleashListener } from "app/system/flags/hooks/useUnleashListener"
import { getAppVersion } from "app/utils/appVersion"
import { Platform } from "react-native"
import Keys from "react-native-keys"

export const WrappedFlagProvider: React.FC = ({ children }) => {
  const { unleashEnv: env } = useUnleashEnvironment()

  const storageName = (name: string) => `unleash-values:${name}`

  const config: IConfig = {
    context: {
      properties: {
        appVersion: getAppVersion(),
        appPlatformOS: Platform.OS,
      },
    },
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

const UnleashInitializer: React.FC = ({ children }) => {
  useUnleashListener()
  useUnleashInitializer()

  return <>{children}</>
}
