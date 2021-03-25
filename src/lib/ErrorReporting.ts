import * as Sentry from "@sentry/react-native"
import { useEffect } from "react"
import { Platform } from "react-native"
import Config from "react-native-config"
import { sentryReleaseName } from "../../app.json"
import { GlobalStore } from "./store/GlobalStore"

function setupSentry(props: Partial<Sentry.ReactNativeOptions> = {}) {
  if (Config.SENTRY_DSN) {
    Sentry.init({
      dsn: Config.SENTRY_DSN,
      release: sentryReleaseName,
      enableAutoSessionTracking: true,
      autoSessionTracking: true,
      // Sentry will be re-initialised with a proper environment as soon as the main app component mounts
      environment: "bootstrap",
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

  const userID =
    GlobalStore.useAppState((store) =>
      Platform.OS === "ios" ? store.native.sessionState.userID : store.auth.userID
    ) ?? "none"
  useEffect(() => {
    Sentry.setUser({
      id: userID,
    })
  }, [userID])
}
