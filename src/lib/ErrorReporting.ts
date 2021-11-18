import * as Sentry from "@sentry/react-native"
import { useEffect } from "react"
import Config from "react-native-config"
import { sentryReleaseName } from "../../app.json"
import { GlobalStore } from "./store/GlobalStore"

function setupSentry(props: Partial<Sentry.ReactNativeOptions> = {}) {
  if (!__DEV__ && Config.SENTRY_DSN) {
    Sentry.init({
      dsn: Config.SENTRY_DSN,
      release: sentryReleaseName,
      enableAutoSessionTracking: true,
      autoSessionTracking: true,
      // Sentry will be re-initialised with a proper environment as soon as the main app component mounts
      environment: "bootstrap",
      enableOutOfMemoryTracking: false,
      ...props,
    })
  }
}

setupSentry()

export function useSentryConfig() {
  const environment = GlobalStore.useAppState((store) => store.config.environment.env)
  useEffect(() => {
    setupSentry({ environment })
  }, [environment])

  const userID = GlobalStore.useAppState((store) => store.auth.userID) ?? "none"
  useEffect(() => {
    Sentry.setUser({ id: userID })
  }, [userID])
}
