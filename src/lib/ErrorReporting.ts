import * as Sentry from "@sentry/react-native"
import { useEffect } from "react"
import { Platform } from "react-native"
import Config from "react-native-config"
import { sentryReleaseName } from "../../app.json"
import { GlobalStore, useFeatureFlag } from "./store/GlobalStore"

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

  const showNewOnboarding = useFeatureFlag("AREnableNewOnboardingFlow")

  const userID =
    GlobalStore.useAppState((store) =>
      Platform.OS === "android" || showNewOnboarding ? store.auth.userID : store.native.sessionState.userID
    ) ?? "none"
  useEffect(() => {
    Sentry.setUser({
      id: userID,
    })
  }, [userID])
}
