import Sentry from "@sentry/react-native"
import { Platform } from "react-native"
import Config from "react-native-config"
import { getBuildNumber, getVersion } from "react-native-device-info"

// important! this must match the release version specified
// in fastfile in order for sourcemaps/sentry stack traces to work
export const eigenSentryReleaseName = () => {
  const prefix = Platform.OS === "ios" ? "ios" : "android"
  const buildNumber = getBuildNumber()
  const version = getVersion()
  return prefix + "-" + version + "-" + buildNumber
}

export function setupSentry(
  props: Partial<Sentry.ReactNativeOptions> = {},
  captureExceptions: boolean
) {
  console.log("!!sentry setting up!")
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
