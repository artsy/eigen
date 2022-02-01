import * as Sentry from "@sentry/react-native"
import { useEffect } from "react"
import { Platform } from "react-native"
import Config from "react-native-config"
import { getBuildNumber, getVersion } from "react-native-device-info"
import { GlobalStore, useFeatureFlag } from "./store/GlobalStore"

// important! this much match the release version specified
// in fastfile in order for sourcemaps/sentry stack traces to work
export const eigenSentryReleaseName = () => {
  const prefix = Platform.OS === "ios" ? "ios" : "android"
  const buildNumber = getBuildNumber()
  const version = getVersion()
  return prefix + "-" + version + "-" + buildNumber
}

export const setupSentry = (
  props: Partial<Sentry.ReactNativeOptions> = {},
  captureExceptions: boolean
) => {
  if (captureExceptions && Config.SENTRY_DSN) {
    Sentry.init({
      dsn: Config.SENTRY_DSN,
      release: eigenSentryReleaseName(),
      dist: getBuildNumber(),
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
  const captureExceptions = !__DEV__ ? true : captureExceptionsInSentryOnDev

  useEffect(() => {
    setupSentry({ environment }, captureExceptions)
  }, [environment, captureExceptionsInSentryOnDev])

  const userID = GlobalStore.useAppState((store) => store.auth.userID) ?? "none"
  useEffect(() => {
    Sentry.setUser({ id: userID })
  }, [userID])
}
