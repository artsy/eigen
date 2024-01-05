import * as Sentry from "@sentry/react-native"
import { appJson } from "app/utils/jsonFiles"
import { Platform } from "react-native"
import Config from "react-native-config"
import DeviceInfo from "react-native-device-info"

// important! this must match the release version specified
// in fastfile in order for sourcemaps/sentry stacktraces to work
export const eigenSentryReleaseName = () => {
  const codePushReleaseName = appJson().codePushReleaseName
  if (codePushReleaseName && codePushReleaseName !== "none") {
    return codePushReleaseName
  } else {
    const prefix = Platform.OS === "ios" ? "ios" : "android"
    const buildNumber = DeviceInfo.getBuildNumber()
    const version = DeviceInfo.getVersion()
    return prefix + "-" + version + "-" + buildNumber
  }
}

const eigenSentryDist = () => {
  const codePushDist = appJson().codePushDist
  if (codePushDist && codePushDist !== "none") {
    return codePushDist
  } else {
    return DeviceInfo.getBuildNumber()
  }
}

interface SetupSentryProps extends Partial<Sentry.ReactNativeOptions> {
  captureExceptionsInSentryOnDev?: boolean
}
export function setupSentry(props: SetupSentryProps = {}) {
  const sentryDSN = Config.SENTRY_DSN
  const ossUser = Config.OSS === "true"

  // In DEV, enabling this will clober stack traces in errors and logs, obscuring
  // the source of the error. So we disable it in dev mode.
  if (__DEV__ && !props.captureExceptionsInSentryOnDev) {
    console.log("[dev] Sentry disabled in dev mode.")
    return
  }

  if (ossUser) {
    console.log("[oss] Sentry disabled in for oss user.")
    return
  }

  if (!sentryDSN) {
    console.error("Sentry DSN not set!!")
    return
  }

  Sentry.init({
    dsn: sentryDSN,
    release: eigenSentryReleaseName(),
    dist: eigenSentryDist(),
    enableAutoSessionTracking: true,
    autoSessionTracking: true,
    enableWatchdogTerminationTracking: false,
    attachStacktrace: true,
    // TODO: this number is meant for debugging purposes only, and should
    // be adjusted before release to something like 0.1 or 0.2 max
    tracesSampleRate: 1.0,
    integrations: [new Sentry.ReactNativeTracing()],
    // TODO: this is a temporary setting to enable performance tracking
    // we can use it to hide the performance tracking behind a ff in case
    // something goes wrong
    enableAutoPerformanceTracing: true,
    ...props,
  })
}
