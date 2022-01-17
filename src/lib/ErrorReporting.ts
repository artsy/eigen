import * as Sentry from "@sentry/react-native"
import { useEffect } from "react"
import Config from "react-native-config"
import { sentryReleaseName } from "../../app.json"
import { GlobalStore, useFeatureFlag } from "./store/GlobalStore"

export const setupSentry = (props: Partial<Sentry.ReactNativeOptions> = {}, captureExceptions = !__DEV__) => {
  if (!captureExceptions && Config.SENTRY_DSN) {
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

export function useSentryConfig() {
  const environment = GlobalStore.useAppState((store) => store.config.environment.env)
  const captureExceptionsInSentryOnDev = useFeatureFlag("ARCaptureExceptionsInSentryOnDev")

  useEffect(() => {
    setupSentry({ environment }, captureExceptionsInSentryOnDev)
  }, [environment, captureExceptionsInSentryOnDev])

  const userID = GlobalStore.useAppState((store) => store.auth.userID) ?? "none"
  useEffect(() => {
    Sentry.setUser({ id: userID })
  }, [userID])
}

// test commit 2
