import * as Sentry from "@sentry/react-native"
import { Platform } from "react-native"
import Config from "react-native-config"
import DeviceInfo from "react-native-device-info"

// important! this must match the release version specified
// in fastfile in order for sourcemaps/sentry stacktraces to work
export const eigenSentryReleaseName = () => {
  const prefix = Platform.OS === "ios" ? "ios" : "android"
  const buildNumber = DeviceInfo.getBuildNumber()
  const version = DeviceInfo.getVersion()
  return prefix + "-" + version + "-" + buildNumber
}

export function setupSentry(props: Partial<Sentry.ReactNativeOptions> = {}) {
  // In DEV, enabling this will clober stack traces in errors and logs, obscuring
  // the source of the error. So we disable it in dev mode.
  if (__DEV__) {
    console.log("[dev] Sentry disabled in dev mode.")
    return
  }
  if (!Config.SENTRY_DSN) {
    console.error("Sentry DSN not set!!")
    return
  }

  Sentry.init({
    dsn: Config.SENTRY_DSN,
    release: eigenSentryReleaseName(),
    dist: DeviceInfo.getBuildNumber(),
    enableAutoSessionTracking: true,
    autoSessionTracking: true,
    enableOutOfMemoryTracking: false,
    ...props,
  })
}
