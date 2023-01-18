import * as Sentry from "@sentry/react-native"
import { SystemDeviceInfo } from "app/system/SystemDeviceInfo"
import { Platform } from "react-native"
import Config from "react-native-config"

// important! this must match the release version specified
// in fastfile in order for sourcemaps/sentry stacktraces to work
export const eigenSentryReleaseName = () => {
  const prefix = Platform.OS === "ios" ? "ios" : "android"
  const buildNumber = SystemDeviceInfo.getBuildNumber()
  const version = SystemDeviceInfo.getVersion()
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
    dist: SystemDeviceInfo.getBuildNumber(),
    enableAutoSessionTracking: true,
    autoSessionTracking: true,
    enableOutOfMemoryTracking: false,
    ...props,
  })
}
