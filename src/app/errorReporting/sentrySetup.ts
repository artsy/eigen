import * as Sentry from "@sentry/react-native"
import { Platform } from "react-native"
import Config from "react-native-config"
import { getBuildNumber, getVersion } from "react-native-device-info"

// important! this must match the release version specified
// in fastfile in order for sourcemaps/sentry stacktraces to work
export const eigenSentryReleaseName = () => {
  const prefix = Platform.OS === "ios" ? "ios" : "android"
  const buildNumber = getBuildNumber()
  const version = getVersion()
  return prefix + "-" + version + "-" + buildNumber
}

export function setupSentry(props: Partial<Sentry.ReactNativeOptions> = {}) {
  if (!Config.SENTRY_DSN) {
    console.error("Sentry DSN not set!!")
    return
  }

  Sentry.init({
    dsn: Config.SENTRY_DSN,
    release: eigenSentryReleaseName(),
    dist: getBuildNumber(),
    enableAutoSessionTracking: true,
    autoSessionTracking: true,
    enableOutOfMemoryTracking: false,
    ...props,
  })
}
